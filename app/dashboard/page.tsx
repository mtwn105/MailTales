// "use client";
const API_BASE_URL = process.env.BASE_URL || "http://localhost:3000";
import { cookies } from "next/headers";

// // Call API on load
const fetchData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("mailtales_user_token")?.value!;

  try {
    const response = await fetch(API_BASE_URL + "/api/email/recent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `mailtales_user_token=${token}`,
      },
    });
    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default async function Dashboard() {
  const data = await fetchData();

  return (
    <main>
      <div className="w-full mx-auto ">
        <p className="fade-in-up text-4xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 animate-fade-in">
          Dashboard
        </p>
        {/* loop over data and display it */}
        {data?.data?.map((item: any) => (
          <div key={item.id}>
            <p>{item.subject}</p>
            <p>{item.snippet}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
