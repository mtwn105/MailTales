"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const EmailCard = (props: any) => {
  const { email } = props;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/email/${email?.id}`);
  };

  return (
    <div className="m-2">
      <Card isHoverable className="w-full mb-4 cursor-pointer" onClick={handleClick}>
        <CardHeader className="flex gap-3">
          <div className="">
            <p className="text-md font-bold">{email?.subject}</p>
            <p className="text-small text-default-500">
              From:{" "}
                <span className="text-primary">{email?.from[0]?.email}</span>
            </p>
          </div>
        </CardHeader>
        <Divider />
        {email?.snippet ? <CardBody>{email?.snippet}</CardBody> : null}
        <Divider />
        {/* <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui"
          >
            Visit source code on GitHub.
          </Link>
        </CardFooter> */}
      </Card>

      {/* <div className="w-full mx-auto">
        <div className="flex flex-col gap-4 justify-center items-center mt-4">
          <div className="w-full mx-auto">
            <p>{email.subject}</p>
            <p>{email.from}</p>
            <p>{email.to}</p>
            <p>{email.date}</p>
            <p>{email.body}</p>
            <p>{email.html}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};
