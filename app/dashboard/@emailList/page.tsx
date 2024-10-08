"use client";

import { EmailCard } from "@/components/email-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Loader2, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailList() {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [searchedData, setSearchedData] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [pageToken, setPageToken] = useState<string>("");
  const [emailAiStatus, setEmailAiStatus] = useState<string>("");

  useEffect(() => {
    fetchEmails();
    getEmailAiStatus();
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

  const getEmailAiStatus = async () => {
    try {
      const response = await fetch(`/api/email/ai/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      setEmailAiStatus(data?.status);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      // setLoading(false);
    }
  };

  const refreshEmailEmbeddings = async () => {
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
      console.log(data);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      setEmailAiStatus("in_progress");
    }
  };

  const goToChat = () => {
    router.push("/chat");
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
            <>
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </>
          )}
        </Button>
        {/* <Button onClick={() => chatWithEmails(search)}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Chat with emails"
          )}
        </Button> */}
      </div>
      <div>
        {emailAiStatus === "in_progress" ? (
          <Alert className="border-yellow-500 bg-yellow-100">
            {/* <AlertTitle>Heads up!</AlertTitle> */}
            <AlertDescription>
              AI is processing your emails. Please wait.
            </AlertDescription>
          </Alert>
        ) : emailAiStatus === "completed" ? (
          <Alert className="border-green-500 bg-green-100">
            {/* <AlertTitle>Heads up!</AlertTitle> */}
            <AlertDescription>
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <p className="text-center sm:text-left mb-2 sm:mb-0 font-bold">
                  AI has processed your emails. You can now chat with them.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button onClick={goToChat} className="w-full sm:w-auto">
                    Chat with emails
                  </Button>
                  <Button
                    onClick={() => refreshEmailEmbeddings()}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Refresh Email Data
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : null}
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
