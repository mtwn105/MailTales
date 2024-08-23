"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
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
      onPress={handleClick}
      isPressable
      className="w-full my-4 cursor-pointer "
    >
      <CardHeader className="flex gap-3">
        <div className="">
          <p className="text-md font-bold">{email?.subject}</p>
          <p className="text-small text-default-500">
            From: <span className="text-primary">{email?.from}</span>
          </p>
        </div>
      </CardHeader>
      <Divider />
      {email?.snippet ? <CardBody>{email?.snippet}</CardBody> : null}
      <Divider />
    </Card>
  );
};
