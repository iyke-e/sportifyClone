import { getDeezerPreview } from "../deezerApi";
import { ListItemProps } from "../sportifyApi";
import { Track } from "@/context/AudioPlayerContext";

export const handleTrackPress = async ({
  item,
  play,
}: {
  item: ListItemProps;
  play: (track: Track) => void;
}) => {
  const previewTrack = await getDeezerPreview(item.title, item.subtitle || '');
  if (previewTrack?.preview) {
    play({
      id: item.id,
      title: item.title,
      artist: item.subtitle || '',
      preview: previewTrack.preview,
      image: item.url, // ✅ add image from Spotify
    });
  } else {
    alert('Preview not available for this track.');
  }
};
