"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";

interface AudioPlayerProps {
  audioBlob: Blob;
}

export default function AudioPlayer({ audioBlob }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);

  useEffect(() => {
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

    return () => {
      audio.pause();
      audio.src = "";
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-row gap-4 items-center p-4 ">
      <Button
        onClick={togglePlayPause}
        className="w-12 h-12 rounded-full flex items-center justify-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
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
