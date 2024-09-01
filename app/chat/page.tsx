"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Loader2, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState, useEffect } from "react";

export default function EmailList() {
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
  return (
    <main>
      <p className="text-2xl sm:text-4xl font-bold">Chat with Emails</p>
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
      <div className="w-full mx-auto "></div>
    </main>
  );
}
