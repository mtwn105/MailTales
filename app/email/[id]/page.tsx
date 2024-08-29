"use client";

import { useState, useEffect } from "react";
import { sanitizeHTML } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useChat } from 'ai/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function EmailDisplay({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState<any>(null);
  const [aiResponse, setAIResponse] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiResponseLoading, setAIResponseLoading] = useState<boolean>(false);
  const [sentimentLoading, setSentimentLoading] = useState<boolean>(false);

  useEffect(() => {

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
          console.error("Error fetching AI response:", "Response body is not readable");
        }

        let accumulatedResponse = "";
        while (true) {
          const { done, value } = await reader?.read() || { done: true };
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          accumulatedResponse += chunk;
          setAIResponse(accumulatedResponse);
        }
        getSentiment(accumulatedResponse);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setAIResponseLoading(false);
      }
    }

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
          <div className="flex flex-row justify-between w-full">
            <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
            <div className="text-sm text-default-500 mt-2">
          {sentiment ?  (
                <div

              className={`px-2 py-2 rounded-md font-semibold inline-block ${
                sentiment >= 0 && sentiment <= 33
                  ? 'bg-red-100 text-red-800'
                  : sentiment >= 34 && sentiment <= 66
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              Sentiment: {sentiment >= 0 && sentiment <= 33
                ? 'Negative'
                : sentiment >= 34 && sentiment <= 66
                ? 'Neutral'
                : 'Positive'}
              {/* <span className="ml-1 text-xs">
                ({sentiment}%)
              </span> */}
            </div>
          ): null}
        </div>
        </div>
        <p className="text-sm text-default-500">From: {email.from}</p>
        <p className="text-sm text-default-500">To: {email.to}</p>
        <p className="text-sm text-default-500">
          Date: {new Date(email.date).toLocaleString()}
        </p>

      </CardHeader>

      <CardContent>
        <Tabs defaultValue="ai">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">AI Summary</TabsTrigger>
            <TabsTrigger value="original">Original Email</TabsTrigger>
          </TabsList>
          <TabsContent key="ai" title="AI Summary" value={"ai"}>
            <div className="flex flex-col gap-2 my-2">
              {aiResponseLoading ? <div className="flex justify-center items-center mt-4"><LoadingSpinner message="Generating AI Summary..." /></div> : (
                <div className="flex flex-col gap-2 mt-4">
                  {aiResponse?.split("\n")
                    .map((line: string, index: number) => <p key={index}>{line}</p>)}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent key="original" title="Original Email" value={"original"}>
            <div className="flex flex-col gap-2 mt-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(email.body) }} />
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </div>
  );
}
