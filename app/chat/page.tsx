"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCcwIcon, SendHorizonalIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import Typing from "@/components/ui/typing";

export default function EmailList() {
  const [query, setQuery] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/email/ai/query",
      body: { query },
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [loading, setLoading] = useState<boolean>(true);
  const [emailAiStatus, setEmailAiStatus] = useState<string>("");

  useEffect(() => {
    getEmailAiStatus();
  }, []);

  const getEmailAiStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/email/ai/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      setEmailAiStatus(data?.status);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmailEmbeddings = async () => {
    try {
      const response = await fetch(`/api/email/ai/refresh`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      setEmailAiStatus("in_progress");
    }
  };

  return (
    <main>
      <p className="text-2xl sm:text-4xl font-bold">Chat with Emails</p>
      <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-500 mt-4">
          Chat with your last 30 emails.
        </p>
        <Button onClick={refreshEmailEmbeddings}>
          <RefreshCcwIcon className="w-4 h-4 mr-2" />
          Refresh Email Data
        </Button>
      </div>
      <div className="w-full mx-auto mt-4">
        {emailAiStatus != "completed" && !loading ? (
          <Alert className="border-yellow-500 bg-yellow-100">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              AI is processing your emails. Please wait.
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
      <div className="w-full mx-auto ">
        <Card className="w-full  mx-auto my-8">
          <CardContent className="h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mt-2 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 "
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mt-2">
                <div className={`inline-block p-2 rounded-lg bg-gray-100`}>
                  <Typing />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter>
            <div className="flex w-full">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!isLoading && input?.length > 0) {
                      handleSubmit();
                    }
                  }
                }}
                placeholder="Ask about your emails..."
                className="flex-grow mr-4"
              />
              <Button
                disabled={emailAiStatus != "completed" || isLoading}
                onClick={handleSubmit}
                className="ml-4rounded-l-none"
              >
                Send <SendHorizonalIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        {/* <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                <div>
                  <div className="font-bold">{m.role}</div>
                  <p>
                    {m.content.length > 0 ? (
                      m.content
                    ) : (
                      <span className="italic font-light">
                        {"calling tool: " + m?.toolInvocations?.[0].toolName}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
              value={query}
              placeholder="Say something..."
              onChange={(e) => setQuery(e.target.value)}
            />

          </form>
        </div> */}
      </div>
    </main>
  );
}
