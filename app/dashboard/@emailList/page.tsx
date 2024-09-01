"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Loader2 } from "lucide-react";

import { useState, useEffect } from "react";

export default function EmailList() {
  const [data, setData] = useState<any>(null);
  const [searchedData, setSearchedData] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [pageToken, setPageToken] = useState<string>("");

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/email/recent?pageToken=${pageToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      setData(data?.data);
      setPageToken(data?.nextCursor);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = async (currentData: any, pageToken: string) => {
    setLoadingLoadMore(true);
    try {
      const response = await fetch(`/api/email/recent?pageToken=${pageToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      setPageToken(data?.nextCursor);
      setData([...currentData, ...data.data]);
    } catch (error) {
      console.error("Error fetching more emails:", error);
    } finally {
      setLoadingLoadMore(false);
    }
  };

  const searchEmails = async (search: string) => {
    setSearch(search);
    setLoading(true);
    try {
      const response = await fetch(`/api/email/search?search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      setSearchedData(data?.data);
    } catch (error) {
      console.error("Error searching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const chatWithEmails = async (search: string) => {
    try {
      const response = await fetch(`/api/email/ai/refresh`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      console.log("Data", data);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <main>
      <p className="text-2xl sm:text-4xl font-bold">Latest Emails</p>
      <div className="my-4 flex flex-col gap-4 sm:flex-row">
        <Input
          value={search}
          type="text"
          placeholder="Search emails..."
          className="w-full px-4 py-2 "
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => searchEmails(search)}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
        <Button onClick={() => chatWithEmails(search)}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Chat with emails"
          )}
        </Button>
      </div>
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
            {search
              ? searchedData?.map((item: any, index: number) => (
                  <EmailCard key={index} email={item} />
                ))
              : data?.map((item: any, index: number) => (
                  <EmailCard key={index} email={item} />
                ))}
            {loadingLoadMore ? (
              <LoadingSpinner message="Loading more emails..." />
            ) : (
              !search && (
                <Button
                  disabled={loadingLoadMore}
                  onClick={() => nextPage(data, pageToken)}
                >
                  Load More
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
