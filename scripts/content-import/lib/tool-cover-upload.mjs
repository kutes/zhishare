// Uploads a generated cover pair to the tool-covers bucket. Returns the public cover URL.

const BUCKET = "tool-covers";

export async function uploadToolCoverPair(client, slug, { coverSvg, iconSvg }) {
  const coverPath = `covers/${slug}.svg`;
  const iconPath = `icons/${slug}.svg`;
  const options = { contentType: "image/svg+xml", upsert: true };

  const coverResult = await client.storage.from(BUCKET).upload(coverPath, coverSvg, options);
  if (coverResult.error) {
    return { ok: false, error: `COVER_UPLOAD_FAILED:${slug}:${coverResult.error.message}` };
  }

  const iconResult = await client.storage.from(BUCKET).upload(iconPath, iconSvg, options);
  if (iconResult.error) {
    return { ok: false, error: `ICON_UPLOAD_FAILED:${slug}:${iconResult.error.message}` };
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(coverPath);
  const coverUrl = data?.publicUrl ?? "";
  if (!coverUrl) {
    return { ok: false, error: `PUBLIC_URL_EMPTY:${slug}` };
  }
  return { ok: true, coverUrl };
}
