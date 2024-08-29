"use client";

import { useState, useEffect } from "react";
import { sanitizeHTML } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function EmailDisplay({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/email/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Email data:", data);
        setEmail(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
        setLoading(false);
      });
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
    <Card className="w-full mx-auto mt-2">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
        <p className="text-sm text-default-500">From: {email.from}</p>
        <p className="text-sm text-default-500">To: {email.to}</p>
        <p className="text-sm text-default-500">
          Date: {new Date(email.date).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent>
        {email?.body
          ?.split("\n")
          .map((line: string, index: number) => <p key={index}>{line}</p>)}
      </CardContent>
    </Card>
  );
}
