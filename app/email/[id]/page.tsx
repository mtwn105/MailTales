"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { sanitizeHTML } from "@/lib/utils";

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
        console.log("Email data:");
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
        <Spinner size="lg" color="primary" label="Loading email..." />
      </div>
    );
  }

  if (!email) {
    return <div>Email not found</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-2">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
        <p className="text-sm text-default-500">
          From: <span className="text-primary">{email.from[0]?.email}</span>
        </p>
        <p className="text-sm text-default-500">
          To: <span className="text-primary">{email.to[0]?.email}</span>
        </p>
        <p className="text-sm text-default-500">
          Date: {new Date(email.date).toLocaleString()}
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(email.body) }} />
      </CardBody>
    </Card>
  );
}
