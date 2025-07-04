// lib/deezerApi.ts
export async function getDeezerPreview(title: string, artist: string) {
  try {
    const query = `artist:"${artist}" track:"${title}"`;
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (json?.data?.length) {
      const match = json.data[0];
      return {
        preview: match.preview,
        title: match.title,
        artist: match.artist.name,
        id: match.id,
      };
    }
  } catch (error) {
    console.warn('Deezer fetch failed', error);
  }
  return null;
}
