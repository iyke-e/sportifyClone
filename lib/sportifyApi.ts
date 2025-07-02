import AsyncStorage from '@react-native-async-storage/async-storage';

// Shared type for components that render media cards
export type ListItemProps = {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  type: 'track' | 'playlist' | 'album' | 'artist';
};

export async function fetchRecentlyPlayed(): Promise<ListItemProps[]> {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

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
          type: 'track' as const, 
        });
      }
    }

    return uniqueTracks;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return [];
  }
}


export async function fetchMadeForYou(): Promise<ListItemProps[]> {
  const madeForYouPlaylists = [
    "Discover Weekly",
    "Release Radar",
    "On Repeat",
    "Repeat Rewind",
    "Daily Mix 1",
    "Daily Mix 2",
    "Daily Mix 3",
  ];

  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const results = await Promise.all(
      madeForYouPlaylists.map(async (playlistName) => {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(playlistName)}&type=playlist&limit=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        const playlist = data.playlists?.items?.[0];
        if (!playlist) return null;

        return {
          id: playlist.id,
          title: playlist.name,
          url: playlist.images?.[0]?.url || '',
          subtitle: 'Made For You',
          type: 'playlist',
        };
      })
    );

    return results.filter(Boolean) as ListItemProps[];
  } catch (error) {
    console.error('Error fetching made for you section:', error);
    return [];
  }
}

export async function fetchUserPlaylists(): Promise<ListItemProps[]> {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.name,
      url: item.images?.[0]?.url ?? 'https://via.placeholder.com/150',
      subtitle: item.owner?.display_name || 'Playlist',
      type: 'playlist',
    }));
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
}

export async function fetchTopMixes(): Promise<ListItemProps[]> {
  const mixTitles = [
    "Your Mix 1",
    "Your Mix 2",
    "Your Mix 3",
    "Your Mix 4",
    "Your Mix 5",
    "Your Mix 6",
  ];

  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const results = await Promise.all(
      mixTitles.map(async (title) => {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=playlist&limit=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        const playlist = data.playlists?.items?.[0];
        if (!playlist) return null;

        return {
          id: playlist.id,
          title: playlist.name,
          url: playlist.images?.[0]?.url || '',
          subtitle: 'Top Mix',
          type: 'playlist',
        };
      })
    );

    return results.filter(Boolean) as ListItemProps[];
  } catch (error) {
    console.error('Error fetching top mixes:', error);
    return [];
  }
}

export async function fetchTrendingNow(): Promise<ListItemProps[]> {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data.playlists || !Array.isArray(data.playlists.items)) {
      throw new Error('Unexpected response format: playlists not found');
    }

    return data.playlists.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      url: item.images?.[0]?.url || '',
      subtitle: 'Featured',
      type: 'playlist',
    }));
  } catch (error) {
    console.error('Error fetching trending now:', error);
    return [];
  }
}

export async function fetchUserAlbums(): Promise<ListItemProps[]> {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch('https://api.spotify.com/v1/me/albums?limit=20', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=20', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.statusText}`);
    }

    const data = await res.json();
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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch('https://api.spotify.com/v1/browse/categories?limit=30', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

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
  const token = await AsyncStorage.getItem('spotify_access_token');
  if (!token) throw new Error('No access token available');

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=10`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Spotify search failed');
  }

  const data = await res.json();

  const combined: SpotifyResult[] = [
    ...(data.tracks?.items || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      type: 'track',
      albumImageUrl: i.album?.images?.[0]?.url ?? '',
      subText: i.artists?.[0]?.name ?? '',
    })),
    ...(data.artists?.items || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      type: 'artist',
      albumImageUrl: i.images?.[0]?.url ?? '',
    })),
    ...(data.albums?.items || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      type: 'album',
      albumImageUrl: i.images?.[0]?.url ?? '',
      subText: i.artists?.[0]?.name ?? '',
    })),
    ...(data.playlists?.items || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      type: 'playlist',
      albumImageUrl: i.images?.[0]?.url ?? '',
      subText: i.owner?.display_name ?? '',
    })),
  ];

  return combined;
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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Spotify API error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

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
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return null;
  }
}

export async function fetchArtistTopTracks(artistId: string, market = 'NG') {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    return [];
  }
}

export async function fetchArtistAlbums(artistId: string) {
  try {
    const token = await AsyncStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No token found in storage');

    const res = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.statusText}`);
    }

    const data = await res.json();
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
  const token = await AsyncStorage.getItem('spotify_access_token');
  if (!token) throw new Error('No access token available');

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=playlist&market=NG&limit=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`[Spotify API Error] ${errorText}`);
  }

  const data = await res.json();
  const items = data.playlists?.items || [];

  return items
    .filter((item: any) => item?.id && item?.name && item.images?.[0]?.url)
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.images[0].url,
    }));
}

export async function getCurrentUserProfile() {
  const token = await AsyncStorage.getItem('spotify_access_token');
  if (!token) throw new Error('No access token available');

  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[User Profile Error] ${error}`);
  }

  const userData = await res.json();
  return userData; 
}


export async function createPlaylistForUser(name: string) {
  const token = await AsyncStorage.getItem('spotify_access_token');
  if (!token) throw new Error('No access token available');

  const user = await getCurrentUserProfile();

  const res = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      public: false,
      description: 'Created from mobile app',
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return await res.json();
}

