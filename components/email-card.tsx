"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
      className="w-full my-4 cursor-pointer hover:bg-gray-100"
    >
      <CardHeader className="flex gap-3">
        <div className="">
          <p className="text-md font-bold">{email?.subject}</p>
          <p className="text-small text-default-500">From: {email?.from}</p>
        </div>
      </CardHeader>
      {email?.snippet ? <CardContent>{email?.snippet}</CardContent> : null}
    </Card>
  );
};
