"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const EmailCard = (props: any) => {
  const { email } = props;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/email/${email?.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="w-full my-4 cursor-pointer bg-background border-b hover:bg-accent"
    >
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-sm font-bold mb-2">Subject: {email?.subject}</p>
          <p className="text-sm font-bold mb-2 text-muted-foreground">
            From: {email?.from}
          </p>
          {email?.snippet ? (
            <p className="text-sm text-muted-foreground">
              {email?.snippet?.length > 140
                ? `${email?.snippet?.substring(0, 140)}...`
                : email?.snippet}
            </p>
          ) : null}
        </div>
      </CardHeader>
    </Card>
  );
};
