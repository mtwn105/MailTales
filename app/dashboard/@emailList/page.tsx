"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Loader2 } from "lucide-react";

import { useState, useEffect } from "react";

export default function EmailList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const nextPage = (currentData: any, pageToken: string) => {
    setLoadingLoadMore(true);
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
        setPageToken(data?.nextCursor);
        setData([...currentData, ...data.data]);
      })
      .finally(() => {
        setLoadingLoadMore(false);
      });
  };

  return (
    <main>
      <p className="text-2xl sm:text-4xl font-bold">Latest Emails</p>
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
            {loadingLoadMore ? (
              <LoadingSpinner message="Loading more emails..." />
            ) : (
              <Button
                disabled={loadingLoadMore}
                onClick={() => nextPage(data, pageToken)}
              >
                Load More
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
