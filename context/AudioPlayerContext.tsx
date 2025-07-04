import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Audio } from 'expo-av';

export type Track = {
    id: string;
    title: string;
    artist: string;
    preview: string;
    image?: string; // optional but preferred
};


type AudioContextType = {
    play: (track: Track) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    currentTrack: Track | null;
    isPlaying: boolean;
};

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
    return context;
};

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);

    const play = async (track: Track) => {
        try {
            // Clean up existing sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current.setOnPlaybackStatusUpdate(null);
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: track.preview },
                { shouldPlay: true }
            );

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return;

                if (status.didJustFinish) {
                    setIsPlaying(false);
                    setIsFinished(true);
                }
            });

            soundRef.current = sound;
            setCurrentTrack(track);
            setIsPlaying(true);
            setIsFinished(false);
        } catch (err) {
            console.warn("Error playing audio:", err);
        }
    };

    const pause = async () => {
        if (soundRef.current) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resume = async () => {
        if (soundRef.current) {
            const status = await soundRef.current.getStatusAsync();
            if (status.isLoaded && status.positionMillis >= (status.durationMillis ?? 0)) {
                // If track is finished, play from start
                await soundRef.current.setPositionAsync(0);
            }
            await soundRef.current.playAsync();
            setIsPlaying(true);
            setIsFinished(false);
        }
    };

    const stop = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current.setOnPlaybackStatusUpdate(null);
            soundRef.current = null;
            setIsPlaying(false);
            setCurrentTrack(null);
            setIsFinished(false);
        }
    };

    return (
        <AudioPlayerContext.Provider
            value={{ play, pause, resume, stop, currentTrack, isPlaying }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
}
