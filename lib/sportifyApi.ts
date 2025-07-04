import { fetchWithAuth } from "./fetchWithAuth";


export type ListItemProps = {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  type: 'track' | 'playlist' | 'album' | 'artist';
};


export async function fetchRecentlyPlayed(): Promise<ListItemProps[]> {
  try {
    const response = await fetchWithAuth(
      'https://api.spotify.com/v1/me/player/recently-played?limit=10'
    );
    const data = await response.json();

    const seen = new Set<string>();
    const uniqueTracks: ListItemProps[] = [];

    for (const item of data.items || []) {
      const track = item.track;
      if (!seen.has(track.id)) {
        seen.add(track.id);
        uniqueTracks.push({
          id: track.id,
          title: track.name,
          url: track.album.images?.[0]?.url || '',
          subtitle: track.artists?.map((a: any) => a.name).join(', '),
          type: 'track',
        });
      }
    }

    return uniqueTracks;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return [];
  }
}



export async function fetchUserPlaylists(): Promise<ListItemProps[]> {
  try {
    const response = await fetchWithAuth('https://api.spotify.com/v1/me/playlists?limit=10');
    const data = await response.json();

    const seen = new Set();
    const unique: ListItemProps[] = [];

    for (const item of data.items || []) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push({
          id: item.id,
          title: item.name,
          url: item.images?.[0]?.url ?? 'https://via.placeholder.com/150',
          subtitle: item.owner?.display_name || 'Playlist',
          type: 'playlist',
        });
      }
    }

    return unique;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
}


export async function fetchUserAlbums(): Promise<ListItemProps[]> {
  try {
    const response = await fetchWithAuth('https://api.spotify.com/v1/me/albums?limit=20');
    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      id: item.album.id,
      title: item.album.name,
      url: item.album.images?.[0]?.url || '',
      subtitle: item.album.artists?.[0]?.name || 'Unknown Artist',
      type: 'album',
    }));
  } catch (err) {
    console.error('Failed to fetch user albums:', err);
    return [];
  }
}


export async function fetchFollowedArtists(): Promise<ListItemProps[]> {
  try {
    const response = await fetchWithAuth(
      'https://api.spotify.com/v1/me/following?type=artist&limit=20'
    );
    const data = await response.json();

    return (data.artists?.items || []).map((item: any) => ({
      id: item.id,
      title: item.name,
      url: item.images?.[0]?.url || '',
      subtitle: 'Artist',
      type: 'artist',
    }));
  } catch (err) {
    console.error('Failed to fetch followed artists:', err);
    return [];
  }
}


export async function fetchTrackById(trackId: string): Promise<any | null> {
  try {
    const response = await fetchWithAuth(`https://api.spotify.com/v1/tracks/${trackId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching track:', error);
    return null;
  }
}



export type Category = {
  id: string;
  name: string;
  iconUrl: string;
};


export async function fetchSpotifyCategories(): Promise<Category[]> {
  try {
    const response = await fetchWithAuth('https://api.spotify.com/v1/browse/categories?limit=30');
    const data = await response.json();

    return (data.categories?.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      iconUrl: item.icons?.[0]?.url || '',
    }));
  } catch (err) {
    console.error('Error fetching Spotify categories:', err);
    return [];
  }
}



export type SpotifyResult = {
  id: string;
  name: string;
  type: 'track' | 'artist' | 'album' | 'playlist';
  albumImageUrl?: string;
  subText?: string;
};


export async function searchSpotify(query: string): Promise<SpotifyResult[]> {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=10`;

  try {
    const res = await fetchWithAuth(url);
    const data = await res.json();

    const combined: SpotifyResult[] = [
      ...(data.tracks?.items || [])
        .filter((i: any) => i && i.id && i.name)
        .map((i: any) => ({
          id: i.id,
          name: i.name,
          type: 'track',
          albumImageUrl: i.album?.images?.[0]?.url ?? '',
          subText: i.artists?.[0]?.name ?? '',
        })),

      ...(data.artists?.items || [])
        .filter((i: any) => i && i.id && i.name)
        .map((i: any) => ({
          id: i.id,
          name: i.name,
          type: 'artist',
          albumImageUrl: i.images?.[0]?.url ?? '',
        })),

      ...(data.albums?.items || [])
        .filter((i: any) => i && i.id && i.name)
        .map((i: any) => ({
          id: i.id,
          name: i.name,
          type: 'album',
          albumImageUrl: i.images?.[0]?.url ?? '',
          subText: i.artists?.[0]?.name ?? '',
        })),

      ...(data.playlists?.items || [])
        .filter((i: any) => i && i.id && i.name)
        .map((i: any) => ({
          id: i.id,
          name: i.name,
          type: 'playlist',
          albumImageUrl: i.images?.[0]?.url ?? '',
          subText: i.owner?.display_name ?? '',
        })),
    ];

    return combined;
  } catch (error: any) {
    console.error('Spotify search failed:', error.message || error);
    return [];
  }
}



export type PlaylistTrack = {
  id: string;
  name: string;
  artist: string;
  image: string;
};

export type PlaylistDetail = {
  id: string;
  title: string;
  image: string;
  tracks: PlaylistTrack[];
};


export async function fetchPlaylistById(playlistId: string): Promise<PlaylistDetail> {
  try {
    const response = await fetchWithAuth(`https://api.spotify.com/v1/playlists/${playlistId}`);
    const data = await response.json();

    return {
      id: data.id,
      title: data.name,
      image: data.images?.[0]?.url || '',
      tracks: (data.tracks.items || []).map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists?.[0]?.name ?? 'Unknown Artist',
        image: item.track.album?.images?.[0]?.url || '',
      })),
    };
  } catch (err) {
    console.error('Error fetching playlist by ID:', err);
    throw err;
  }
}



export async function fetchAlbumById(albumId: string) {
  try {
    const response = await fetchWithAuth(`https://api.spotify.com/v1/albums/${albumId}`);
    const data = await response.json();

    return {
      id: data.id,
      title: data.name,
      image: data.images?.[0]?.url ?? '',
      artist: data.artists?.[0]?.name ?? 'Unknown Artist',
      tracks: data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists?.[0]?.name ?? '',
        duration_ms: track.duration_ms,
      })),
    };
  } catch (err) {
    console.error('Failed to fetch album:', err);
    return null;
  }
}


export async function fetchArtistDetails(artistId: string) {
  try {
    const response = await fetchWithAuth(`https://api.spotify.com/v1/artists/${artistId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return null;
  }
}




export async function fetchArtistTopTracks(artistId: string, market = 'NG') {
  try {
    const response = await fetchWithAuth(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`
    );
    const data = await response.json();

    return data.tracks || [];
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    return [];
  }
}


export async function fetchArtistAlbums(artistId: string) {
  try {
    const response = await fetchWithAuth(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&limit=20`
    );
    const data = await response.json();

    return data.items || [];
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    return [];
  }
}




export type Playlist = {
    id: string;
    name: string;
    image: string;
};



export async function fetchPlaylistsBySearchTerm(searchTerm: string): Promise<Playlist[]> {
  try {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=playlist&market=NG&limit=10`;
    const response = await fetchWithAuth(url);
    const data = await response.json();

    const items = data.playlists?.items || [];

    return items
      .filter((item: any) => item?.id && item?.name && item.images?.[0]?.url)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.images[0].url,
      }));
  } catch (err) {
    console.error('Error fetching playlists by search term:', err);
    return [];
  }
}


export async function getCurrentUserProfile() {
  try {
    const response = await fetchWithAuth('https://api.spotify.com/v1/me');
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error('[User Profile Error]', err);
    throw err;
  }
}



export async function createPlaylistForUser(baseName: string): Promise<{ id: string }> {
  try {
    // Step 1: Get user profile
    const profileResponse = await fetchWithAuth('https://api.spotify.com/v1/me');
    const userData = await profileResponse.json();
    const userId = userData.id;

    // Step 2: Fetch user's existing playlists
    const playlistsResponse = await fetchWithAuth('https://api.spotify.com/v1/me/playlists?limit=50');
    const playlistsData = await playlistsResponse.json();
    const existingNames = (playlistsData.items || []).map((pl: any) => pl.name.toLowerCase());

    // Step 3: Generate a unique name
    let name = baseName;
    let counter = 2;
    while (existingNames.includes(name.toLowerCase())) {
      name = `${baseName} (${counter})`;
      counter++;
    }

    // Step 4: Create the playlist
    const createResponse = await fetchWithAuth(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          public: false,
        }),
      }
    );
    const newPlaylist = await createResponse.json();

    return { id: newPlaylist.id };
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}





export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
  try {
    const trackUri = `spotify:track:${trackId}`;
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [trackUri] }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      const message = result.error?.message || 'Unknown error';
      console.error('[addTrackToPlaylist] Error:', message);
      throw new Error(`Failed to add track: ${message}`);
    }

    console.log(`[addTrackToPlaylist] Track ${trackId} added to playlist ${playlistId}`);
  } catch (error) {
    console.error('[addTrackToPlaylist] Exception:', error);
    throw error;
  }
}



export async function removeTrackFromPlaylist(playlistId: string, trackUri: string): Promise<void> {
  try {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    const response = await fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: [{ uri: `spotify:track:${trackUri}` }],
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      const message = result.error?.message || 'Unknown error';
      console.error('[removeTrackFromPlaylist] Error:', message);
      throw new Error(`Failed to remove track: ${message}`);
    }

    console.log(`[removeTrackFromPlaylist] Removed track ${trackUri} from playlist ${playlistId}`);
  } catch (error) {
    console.error('[removeTrackFromPlaylist] Exception:', error);
    throw error;
  }
}

export async function deleteUserPlaylist(playlistId: string): Promise<void> {
  try {
    await fetchWithAuth(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: 'DELETE',
    });
    console.log(`Playlist ${playlistId} successfully deleted (unfollowed).`);
  } catch (error) {
    console.error(`Error deleting (unfollowing) playlist ${playlistId}:`, error);
    throw error;
  }
}
