"use client";

import { useState, useEffect } from "react";
import { sanitizeHTML } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useChat } from "ai/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BellIcon,
  BookHeadphonesIcon,
  BrainCircuit,
  BrainCircuitIcon,
  BriefcaseIcon,
  CalendarIcon,
  CircleHelpIcon,
  ClipboardIcon,
  CreditCardIcon,
  FrownIcon,
  HandshakeIcon,
  MailIcon,
  MegaphoneIcon,
  MehIcon,
  SmileIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  WandSparklesIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AudioPlayer from "@/components/audio-player";

export default function EmailAISummary({
  id,
  aiResponse,
}: {
  id: string;
  aiResponse: string;
}) {
  const [story, setStory] = useState<any>(null);
  const [storyType, setStoryType] = useState<any>("mystery");
  const [voice, setVoice] = useState<any>("Xb7hH8MSUJpSbSDYk0k2");
  const [storyLoading, setStoryLoading] = useState<boolean>(false);

  const voices = [
    {
      value: "Xb7hH8MSUJpSbSDYk0k2",
      label: "Alice (British, confident)",
    },
    {
      value: "pqHfZKP75CvOlQylNhV4",
      label: "Bill (American, trustworthy)",
    },
    {
      value: "nPczCjzI2devNBz1zQrb",
      label: "Brian (American, deep)",
    },
    {
      value: "N2lVS1w4EtoT3dr4eOWO",
      label: "Callum (Transatlantic, intense)",
    },
    {
      value: "IKne3meq5aSn9XLyUdCD",
      label: "Charlie (Australian, natural)",
    },
    {
      value: "XB0fDUnXU5powFXDhCwa",
      label: "Charlotte (Swedish, seductive)",
    },
    {
      value: "iP95p4xoKVk53GoZ742B",
      label: "Chris (American, casual)",
    },
    {
      value: "onwK4e9ZLuTAKqWW03F9",
      label: "Daniel (British, authoritative)",
    },
    {
      value: "cjVigY5qzO86Huf0OWal",
      label: "Eric (American, friendly)",
    },
    {
      value: "JBFqnCBsd6RMkjVDRZzb",
      label: "George (British, warm)",
    },
    {
      value: "cgSgspJ2msm6clMCkdW9",
      label: "Jessica (American, expressive)",
    },
    {
      value: "FGY2WhTYpPnrIDTdsKH5",
      label: "Laura (American, upbeat)",
    },
    {
      value: "TX3LPaxmHKxFdv7VOQHJ",
      label: "Liam (American, articulate)",
    },
    {
      value: "pFZP5JQG7iQjIQuC4Bku",
      label: "Lily (British, warm)",
    },
    {
      value: "XrExE9yKIg1WjnnlVkGX",
      label: "Matilda (American, friendly)",
    },
    {
      value: "EXAVITQu4vr4xnSDxMaL",
      label: "Sarah (American, soft)",
    },
    {
      value: "bIHbv24MWmeRgasZH58o",
      label: "Will (American, friendly)",
    },
  ];

  const storyTypes = [
    { value: "mystery", label: "Mystery" },
    { value: "adventure", label: "Adventure" },
    { value: "comedy", label: "Comedy" },
    { value: "romance", label: "Romance" },
    { value: "scifi", label: "Sci-Fi" },
    { value: "fantasy", label: "Fantasy" },
    { value: "drama", label: "Drama" },
    { value: "thriller", label: "Thriller" },
    { value: "horror", label: "Horror" },
  ];

  const surpriseMe = (aiResponse: string) => {
    const randomStoryType =
      storyTypes[Math.floor(Math.random() * storyTypes.length)];
    const randomVoice = voices[Math.floor(Math.random() * voices.length)];
    setStoryType(randomStoryType.value);
    setVoice(randomVoice.value);
    generateStory({
      body: aiResponse,
      storyType: randomStoryType.value,
      voice: randomVoice.value,
    });
  };

  const generateStory = async ({
    body,
    storyType,
    voice,
  }: {
    body: string;
    storyType: string;
    voice: string;
  }) => {
    try {
      setStoryLoading(true);
      // setStoryPlaying(false);
      // setAudio(null);
      const response = await fetch(`/api/email/${id}/ai/story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          body: body,
          storyType: storyType,
          voice: voice,
        }),
      });

      if (!response.ok) {
        console.error("Error generating story:", response.statusText);
        return;
      }

      const data = await response.json();
      setStory(data.story);
      // playStory({ story: data.story, voice: voice });
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 my-2">
        <div className="mb-4">
          <p className="text-default-500 my-2 font-semibold text-lg">
            Turn this email into a captivating story
          </p>
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <p className="text-default-500 my-2 text-sm font-semibold">
                  Story Type
                </p>
                <Select
                  value={storyType}
                  defaultValue="mystery"
                  onValueChange={(value) => setStoryType(value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Choose a story type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <p className="text-default-500 my-2 text-sm font-semibold">
                  Voice
                </p>
                <Select
                  value={voice}
                  defaultValue="Xb7hH8MSUJpSbSDYk0k2"
                  onValueChange={(value) => setVoice(value)}
                >
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Choose a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
              <Button
                disabled={storyLoading}
                className="w-full sm:w-auto"
                onClick={() =>
                  generateStory({
                    body: aiResponse,
                    storyType: storyType,
                    voice: voice,
                  })
                }
              >
                <WandSparklesIcon className="w-4 h-4 mr-1" /> Generate Story
              </Button>
              <Button
                disabled={storyLoading}
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() => surpriseMe(aiResponse)}
              >
                <SparklesIcon className="w-4 h-4 mr-1" /> Surprise me
              </Button>
            </div>
          </div>
          {storyLoading ? (
            <div className="flex justify-center items-center mt-4">
              <LoadingSpinner message="Generating AI Story..." />
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-sm sm:text-base">{story}</p>
            </div>
          )}
        </div>
      </div>
      {/* {audio && ( */}
      <div className="flex flex-col gap-2 mt-4">
        <AudioPlayer
          isLoaded={!storyLoading}
          story={story}
          voice={voice}
          id={id}
        />
      </div>
    </div>
  );
}
