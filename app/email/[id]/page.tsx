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
import AudioPlayer from "@/components/ui/audio-player";

export default function EmailDisplay({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState<any>(null);
  const [aiResponse, setAIResponse] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [story, setStory] = useState<any>(null);
  const [storyType, setStoryType] = useState<any>("mystery");
  const [voice, setVoice] = useState<any>("Xb7hH8MSUJpSbSDYk0k2");
  const [audio, setAudio] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [aiResponseLoading, setAIResponseLoading] = useState<boolean>(false);
  const [sentimentLoading, setSentimentLoading] = useState<boolean>(false);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
  const [storyLoading, setStoryLoading] = useState<boolean>(false);
  const [storyPlaying, setStoryPlaying] = useState<boolean>(false);

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
      setStoryPlaying(false);
      setAudio(null);
      const response = await fetch(`/api/email/${params.id}/ai/story`, {
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
      playStory({ story: data.story, voice: voice });
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setStoryLoading(false);
    }
  };

  const playStory = async ({
    story,
    voice,
  }: {
    story: string;
    voice: string;
  }) => {
    try {
      setStoryPlaying(true);
      const response = await fetch(`/api/email/${params.id}/ai/story/play`, {
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
      setAudio(data);
    } catch (error) {
      console.error("Error playing story:", error);
    } finally {
      setStoryPlaying(false);
    }
  };

  useEffect(() => {
    const getCategory = async (aiResponse: string) => {
      try {
        setCategoryLoading(true);
        const response = await fetch(`/api/email/${params.id}/ai/categorize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ body: aiResponse }),
        });

        if (!response.ok) {
          console.error("Error fetching category:", response.statusText);
        }

        const data = await response.json();
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    const getSentiment = async (aiResponse: string) => {
      try {
        setSentimentLoading(true);
        const response = await fetch(`/api/email/${params.id}/ai/sentiment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ body: aiResponse }),
        });

        if (!response.ok) {
          console.error("Error fetching sentiment:", response.statusText);
        }

        const data = await response.json();
        setSentiment(data.sentiment);
      } catch (error) {
        console.error("Error fetching sentiment:", error);
      } finally {
        setSentimentLoading(false);
      }
    };

    const getAIResponse = async () => {
      try {
        setAIResponseLoading(true);
        const response = await fetch(`/api/email/${params.id}/ai/text`, {
          method: "GET",
          headers: {
            "Content-Type": "text/plain",
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Error fetching AI response:", response.statusText);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          console.error(
            "Error fetching AI response:",
            "Response body is not readable"
          );
        }

        let accumulatedResponse = "";
        while (true) {
          const { done, value } = (await reader?.read()) || { done: true };
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          accumulatedResponse += chunk;
          setAIResponse(accumulatedResponse);
        }
        getSentiment(accumulatedResponse);
        getCategory(accumulatedResponse);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setAIResponseLoading(false);
      }
    };

    const getEmail = async () => {
      try {
        const res = await fetch(`/api/email/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        setEmail(data);
        getAIResponse();
      } catch (error) {
        console.error("Error fetching email:", error);
      } finally {
        setLoading(false);
      }
    };

    getEmail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner message="Loading email..." />
      </div>
    );
  }

  if (!email) {
    return <div>Email not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <Link
          className="flex items-center text-sm text-default-500"
          href="/dashboard"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
      <Card className="w-full mx-auto mt-2">
        <CardHeader className="flex flex-col items-start">
          <div className="flex flex-col sm:flex-row justify-between w-full">
            <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <div className="text-sm text-default-500">
                {/* 'Work', 'Personal', 'Social', 'Marketing', 'Transactional', 'Event Invitation', 'Welcome Email', 'Survey', 'Notification', 'Customer Support', 'Other'  */}
                {category ? (
                  <div className="px-2 py-2 rounded-md font-semibold inline-block bg-blue-100 text-blue-800">
                    {category === "Work" && (
                      <BriefcaseIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Personal" && (
                      <UserIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Social" && (
                      <UsersIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Marketing" && (
                      <MegaphoneIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Transactional" && (
                      <CreditCardIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Event Invitation" && (
                      <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Welcome Email" && (
                      <HandshakeIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Survey" && (
                      <ClipboardIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Notification" && (
                      <BellIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Customer Support" && (
                      <CircleHelpIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Other" && (
                      <TagIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category}
                  </div>
                ) : null}
              </div>
              <div className="text-sm text-default-500">
                {sentiment ? (
                  <div
                    className={`px-2 py-2 rounded-md font-semibold inline-block ${
                      sentiment >= 0 && sentiment <= 33
                        ? "bg-red-100 text-red-800"
                        : sentiment >= 34 && sentiment <= 66
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {sentiment >= 0 && sentiment <= 33 ? (
                      <>
                        <FrownIcon className="inline-block w-4 h-4 mr-1" />
                        Negative
                      </>
                    ) : sentiment >= 34 && sentiment <= 66 ? (
                      <>
                        <MehIcon className="inline-block w-4 h-4 mr-1" />
                        Neutral
                      </>
                    ) : (
                      <>
                        <SmileIcon className="inline-block w-4 h-4 mr-1" />
                        Positive
                      </>
                    )}
                    {/* <span className="ml-1 text-xs">
                ({sentiment}%)
              </span> */}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-default-500">From: {email.from}</p>
            <p className="text-sm text-default-500">To: {email.to}</p>
            <p className="text-sm text-default-500">
              Date: {new Date(email.date).toLocaleString()}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ai">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">
                <BrainCircuitIcon className="w-4 h-4 mr-1" /> AI Summary
              </TabsTrigger>
              <TabsTrigger value="story">
                <BookHeadphonesIcon className="w-4 h-4 mr-1" /> AI Story
              </TabsTrigger>
              <TabsTrigger value="original">
                <MailIcon className="w-4 h-4 mr-1" /> Original Email
              </TabsTrigger>
            </TabsList>
            <TabsContent key="ai" title="AI Summary" value={"ai"}>
              <div className="flex flex-col gap-2 my-2">
                {aiResponseLoading ? (
                  <div className="flex justify-center items-center mt-4">
                    <LoadingSpinner message="Generating AI Summary..." />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    {aiResponse
                      ?.split("\n")
                      .map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent key="story" title="AI Story" value={"story"}>
              <div className="flex flex-col gap-2 my-2">
                <div className="mb-4">
                  <p className="text-default-500 my-2 font-semibold text-lg">
                    Turn this email into a captivating story
                  </p>
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
                        <WandSparklesIcon className="w-4 h-4 mr-1" /> Generate
                        Story
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
              {audio && (
                <div className="flex flex-col gap-2 mt-4">
                  <AudioPlayer audioBlob={audio} />
                </div>
              )}
            </TabsContent>
            <TabsContent
              key="original"
              title="Original Email"
              value={"original"}
            >
              <div
                className="flex flex-col gap-2 mt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(email.body) }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
