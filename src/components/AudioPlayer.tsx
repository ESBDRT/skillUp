import { useState, useRef, useEffect } from 'react';
import { Headphones, Pause, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AudioPlayerProps {
  text: string;
}

const AudioPlayer = ({ text }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    // If audio is already loaded and playing, pause it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is loaded but paused, resume it
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Load and play new audio
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la génération audio');
      }

      const audioBlob = await response.blob();
      
      // Revoke previous URL if exists
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      audioRef.current = new Audio(audioUrl);
      audioRef.current.muted = isMuted;
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioRef.current.onerror = () => {
        toast.error("Erreur lors de la lecture audio");
        setIsPlaying(false);
      };

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération audio");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  if (!text || text.trim().length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-50">
      {/* Mute button - only show when audio is loaded */}
      {audioRef.current && (
        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border hover:bg-muted"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </Button>
      )}

      {/* Play/Pause button */}
      <Button
        onClick={handlePlay}
        disabled={isLoading}
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Headphones className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default AudioPlayer;
