import { sanitizeHTML } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BellIcon,
  BookHeadphonesIcon,
  BrainCircuitIcon,
  BriefcaseIcon,
  CalendarIcon,
  CircleHelpIcon,
  ClipboardIcon,
  CreditCardIcon,
  FrownIcon,
  HandshakeIcon,
  MailIcon,
  MegaphoneIcon,
  MehIcon,
  SmileIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import EmailAISummary from "@/components/email-ai-summary";
import EmailOriginal from "@/components/email-original";
import { cookies } from "next/headers";

const getCategory = async (aiResponse: string, id: string) => {
  try {
    const cookieStore = cookies();

    const userDetails = cookieStore.get("mailtales_user_details")?.value!;

    const response = await fetch(
      `${process.env.BASE_URL}/api/email/${id}/ai/categorize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `mailtales_user_details=${userDetails}`,
        },
        credentials: "include",
        body: JSON.stringify({ body: aiResponse }),
        next: {
          revalidate: 60 * 60 * 24 * 7, // 1 week
        },
      }
    );

    if (!response.ok) {
      console.error("Error fetching category:", response.statusText);
    }

    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

const getSentiment = async (aiResponse: string, id: string) => {
  try {
    const cookieStore = cookies();

    const userDetails = cookieStore.get("mailtales_user_details")?.value!;

    const response = await fetch(
      `${process.env.BASE_URL}/api/email/${id}/ai/sentiment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `mailtales_user_details=${userDetails}`,
        },
        credentials: "include",
        body: JSON.stringify({ body: aiResponse }),
        next: {
          revalidate: 60 * 60 * 24 * 7, // 1 week
        },
      }
    );

    if (!response.ok) {
      console.error("Error fetching sentiment:", response.statusText);
    }

    const data = await response.json();
    return data.sentiment;
  } catch (error) {
    console.error("Error fetching sentiment:", error);
  }
};

const getAIResponse = async (
  id: string
): Promise<{ sentiment: number; category: string; aiResponse: string }> => {
  try {
    const cookieStore = cookies();

    const userDetails = cookieStore.get("mailtales_user_details")?.value!;

    const response = await fetch(
      `${process.env.BASE_URL}/api/email/${id}/ai/text`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
          Cookie: `mailtales_user_details=${userDetails}`,
        },
        credentials: "include",
        next: {
          revalidate: 60 * 60 * 24 * 7, // 1 week
        },
      }
    );

    if (!response.ok) {
      console.error("Error fetching AI response:", response.statusText);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error(
        "Error fetching AI response:",
        "Response body is not readable"
      );
    }

    let accumulatedResponse = "";
    while (true) {
      const { done, value } = (await reader?.read()) || { done: true };
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      accumulatedResponse += chunk;
    }

    const [sentiment, category] = await Promise.all([
      getSentiment(accumulatedResponse, id),
      getCategory(accumulatedResponse, id),
    ]);

    return {
      sentiment,
      category,
      aiResponse: accumulatedResponse,
    };
  } catch (error) {
    console.error("Error fetching AI response:", error);
  }
  return { sentiment: 0, category: "", aiResponse: "" };
};

const getEmail = async (id: string) => {
  try {
    const cookieStore = cookies();

    const userDetails = cookieStore.get("mailtales_user_details")?.value!;

    const res = await fetch(`${process.env.BASE_URL}/api/email/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `mailtales_user_details=${userDetails}`,
      },
      credentials: "include",
      next: {
        revalidate: 60 * 60 * 24 * 7, // 1 week
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching email:", error);
  }
};

export default async function EmailDisplay({
  params,
}: {
  params: { id: string };
}) {
  const email = await getEmail(params.id);
  const {
    sentiment,
    category,
    aiResponse,
  }: { sentiment: number; category: string; aiResponse: string } =
    await getAIResponse(params.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <Link
          className="flex items-center text-sm text-default-500"
          href="/dashboard"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
      <Card className="w-full mx-auto mt-2">
        <CardHeader className="flex flex-col items-start">
          <div className="flex flex-col sm:flex-row justify-between w-full">
            <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <div className="text-sm text-default-500">
                {/* 'Work', 'Personal', 'Social', 'Marketing', 'Transactional', 'Event Invitation', 'Welcome Email', 'Survey', 'Notification', 'Customer Support', 'Other'  */}
                {category ? (
                  <div className="px-2 py-2 rounded-md font-semibold inline-block bg-blue-100 text-blue-800">
                    {category === "Work" && (
                      <BriefcaseIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Personal" && (
                      <UserIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Social" && (
                      <UsersIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Marketing" && (
                      <MegaphoneIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Transactional" && (
                      <CreditCardIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Event Invitation" && (
                      <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Welcome Email" && (
                      <HandshakeIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Survey" && (
                      <ClipboardIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Notification" && (
                      <BellIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Customer Support" && (
                      <CircleHelpIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category === "Other" && (
                      <TagIcon className="inline-block w-4 h-4 mr-1" />
                    )}
                    {category}
                  </div>
                ) : null}
              </div>
              <div className="text-sm text-default-500">
                {sentiment ? (
                  <div
                    className={`px-2 py-2 rounded-md font-semibold inline-block ${
                      sentiment >= 0 && sentiment <= 33
                        ? "bg-red-100 text-red-800"
                        : sentiment >= 34 && sentiment <= 66
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {sentiment >= 0 && sentiment <= 33 ? (
                      <>
                        <FrownIcon className="inline-block w-4 h-4 mr-1" />
                        Negative
                      </>
                    ) : sentiment >= 34 && sentiment <= 66 ? (
                      <>
                        <MehIcon className="inline-block w-4 h-4 mr-1" />
                        Neutral
                      </>
                    ) : (
                      <>
                        <SmileIcon className="inline-block w-4 h-4 mr-1" />
                        Positive
                      </>
                    )}
                    {/* <span className="ml-1 text-xs">
                ({sentiment}%)
              </span> */}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-default-500">From: {email.from}</p>
            <p className="text-sm text-default-500">To: {email.to}</p>
            <p className="text-sm text-default-500">
              Date: {new Date(parseInt(email.date) * 1000).toLocaleString()}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ai">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">
                <BrainCircuitIcon className="w-4 h-4 mr-1 hidden sm:inline-block" />{" "}
                AI Summary
              </TabsTrigger>
              <TabsTrigger value="story">
                <BookHeadphonesIcon className="w-4 h-4 mr-1 hidden sm:inline-block" />{" "}
                AI Story
              </TabsTrigger>
              <TabsTrigger value="original">
                <MailIcon className="w-4 h-4 mr-1 hidden sm:inline-block" />{" "}
                Original Email
              </TabsTrigger>
            </TabsList>
            <TabsContent key="ai" title="AI Summary" value={"ai"}>
              <div className="flex flex-col gap-2 my-2">
                <div className="flex flex-col gap-2 mt-4">
                  {aiResponse
                    ?.split("\n")
                    .map((line: string, index: number) => (
                      <p key={index}>{line}</p>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent key="story" title="AI Story" value={"story"}>
              <EmailAISummary id={params.id} aiResponse={aiResponse} />
            </TabsContent>
            <TabsContent
              key="original"
              title="Original Email"
              value={"original"}
            >
              <EmailOriginal email={email} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
