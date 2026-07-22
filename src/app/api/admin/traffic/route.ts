import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Real traffic figures from Cloudflare's zone analytics (edge-measured — no
// client beacon, so China visitors are counted and no ad-blocker/GFW gap).
// Requires two env vars, set only in the deployment (never committed):
//   CLOUDFLARE_API_TOKEN  — a read-only token with Zone Analytics: Read
//   CLOUDFLARE_ZONE_ID    — the zone id from the domain's Overview page
// Without them the route reports { connected: false } so the admin UI shows a
// setup prompt instead of any fabricated number. Protected by the caller's
// Supabase session (admin login) to avoid exposing traffic data / burning the
// Cloudflare API quota from an open endpoint.

const CF_GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const WINDOW_DAYS = 7;

type CloudflareDayGroup = {
  dimensions?: { date?: string };
  sum?: { requests?: number; pageViews?: number };
  uniq?: { uniques?: number };
};

export async function GET(request: NextRequest) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  // Gate on the admin session before doing anything else.
  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  if (!token || !zoneId) {
    return NextResponse.json({ connected: false });
  }

  const until = new Date();
  const since = new Date(until);
  since.setDate(until.getDate() - (WINDOW_DAYS - 1));
  const sinceStr = since.toISOString().slice(0, 10);
  const untilStr = until.toISOString().slice(0, 10);

  const query = `
    query ($zoneTag: String!, $since: String!, $until: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            limit: 31
            filter: { date_geq: $since, date_leq: $until }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { requests pageViews }
            uniq { uniques }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(CF_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { zoneTag: zoneId, since: sinceStr, until: untilStr } }),
      cache: "no-store",
    });

    const payload = (await response.json()) as {
      data?: { viewer?: { zones?: Array<{ httpRequests1dGroups?: CloudflareDayGroup[] }> } };
      errors?: Array<{ message?: string }>;
    };

    if (!response.ok || payload.errors?.length) {
      console.error("[traffic] cloudflare graphql error", payload.errors ?? response.status);
      return NextResponse.json({ connected: true, error: "cloudflare_query_failed" }, { status: 502 });
    }

    const groups = payload.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
    const days = groups.map((group) => ({
      date: group.dimensions?.date ?? "",
      pageViews: group.sum?.pageViews ?? 0,
      requests: group.sum?.requests ?? 0,
      uniques: group.uniq?.uniques ?? 0,
    }));

    const totals = days.reduce(
      (acc, day) => ({
        pageViews: acc.pageViews + day.pageViews,
        requests: acc.requests + day.requests,
        uniques: acc.uniques + day.uniques,
      }),
      { pageViews: 0, requests: 0, uniques: 0 },
    );

    return NextResponse.json({ connected: true, windowDays: WINDOW_DAYS, totals, days });
  } catch (error) {
    console.error("[traffic] fetch error", error);
    return NextResponse.json({ connected: true, error: "fetch_failed" }, { status: 502 });
  }
}

async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const header = request.headers.get("authorization") ?? "";
  const accessToken = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  if (!accessToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
