"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  reset: () => void;
};

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  className?: string;
};

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(function TurnstileWidget(
  { onTokenChange, className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }

      onTokenChangeRef.current("");
    },
  }));

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    const verifiedSiteKey = siteKey;
    let cancelled = false;

    function renderWidget() {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: verifiedSiteKey,
        callback(token) {
          onTokenChangeRef.current(token);
        },
        "expired-callback"() {
          onTokenChangeRef.current("");
        },
        "error-callback"() {
          onTokenChangeRef.current("");
        },
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      const script = existingScript ?? document.createElement("script");

      if (!existingScript) {
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      script.addEventListener("load", renderWidget);

      return () => {
        cancelled = true;
        script.removeEventListener("load", renderWidget);

        if (widgetIdRef.current && window.turnstile?.remove) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }

    return () => {
      cancelled = true;

      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  if (!siteKey) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm font-semibold leading-7 text-amber-700">
        人机验证配置缺失，请联系管理员。
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="mb-3 text-sm font-bold text-slate-700">人机验证</p>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
});
