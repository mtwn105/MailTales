"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
          <div className="flex flex-col gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="w-full h-36 p-4 mb-4">
                <Skeleton className="w-full h-12 " />
                <Skeleton className="w-full h-4 mt-2" />
                <Skeleton className="w-[80%] h-4 mt-2" />
              </Card>
            ))}
          </div>
        ) : (
          <div>
            {/* loop over data and display it */}
            {data?.map((item: any, index: number) => (

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
