"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, Loader2 } from "lucide-react";

interface AudioPlayerProps {
  story: string;
  voice: string;
  isLoaded: boolean;
  id: string;
}

export default function AudioPlayer({
  story,
  voice,
  isLoaded,
  id,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   const url = URL.createObjectURL(audioBlob);
  //   setAudioUrl(url);

  //   return () => {
  //     URL.revokeObjectURL(url);
  //   };
  // }, [audioBlob]);

  useEffect(() => {
    console.log("Audio URL Updated:", audioUrl);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    const draw = () => {
      if (!canvasCtx) return;

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, canvas!.width, canvas!.height);

      const barWidth = (canvas!.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 139, 250)`;
        canvasCtx.fillRect(x, canvas!.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    audio.addEventListener("play", () => {
      audioContext.resume();
      draw();
    });

    audio.addEventListener("pause", () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    });

    audio.play();
    setIsPlaying(true);

    return () => {
      audio.pause();
      audio.src = "";
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  const playStory = async ({
    story,
    voice,
  }: {
    story: string;
    voice: string;
  }) => {
    try {
      setIsLoading(true);
      console.log("Playing story");
      const response = await fetch(`/api/email/${id}/ai/story/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: story, voice: voice }),
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Error playing story:", response.statusText);
        return;
      }

      const data = await response.blob();
      const url = URL.createObjectURL(data);
      setAudioUrl(url);
      console.log("Audio URL:", url);
    } catch (error) {
      console.error("Error playing story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      console.log("Playing story");
      await playStory({ story, voice });
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-row gap-4 items-center p-4 ">
      <Button
        disabled={!isLoaded || !story || !voice || isLoading}
        onClick={togglePlayPause}
        className="w-12 h-12 rounded-full flex items-center justify-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </Button>
      <canvas
        ref={canvasRef}
        width="300"
        height="50"
        className="w-full max-w-md bg-secondary rounded-md"
      />
    </div>
  );
}
