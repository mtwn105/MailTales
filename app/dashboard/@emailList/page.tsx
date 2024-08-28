"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";

import { useState, useEffect } from "react";

export default function EmailList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageToken, setPageToken] = useState<string>("");

  useEffect(() => {
    fetch(`/api/email/recent?pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      next: { revalidate: 60 }, // Cache revalidation
    })
      .then((res) => res?.json())
      .then((data) => {
        setData(data?.data);
        setPageToken(data?.nextCursor);
        setLoading(false);
      });
  }, []);

  const nextPage = (currentData: any, pageToken: string) => {
    fetch(`/api/email/recent?pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      next: { revalidate: 60 }, // Cache revalidation
    })
      .then((res) => res?.json())
      .then((data) => {
        data = [...currentData, ...data.data];
        setData(data);
        setPageToken(data?.nextCursor);
        setLoading(false);
      });
  };

  return (
    <main>
      <p className="text-2xl font-bold">Latest Emails</p>
      <div className="w-full mx-auto ">
        {loading ? (
          <LoadingSpinner message="Fetching your latest emails..." />
        ) : (
          <div>
            {/* loop over data and display it */}
            {data?.map((item: any, index: number) => (
              // <div>
              // <p key={item.id}>{JSON.stringify(item)}</p>
              // </div>
              <EmailCard key={index} email={item} />
            ))}

            <Button onClick={() => nextPage(data, pageToken)}>Load More</Button>
          </div>
        )}
      </div>
    </main>
  );
}
