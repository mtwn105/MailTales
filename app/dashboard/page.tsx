// "use client";

// import { EmailCard } from "@/components/email-card";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import {Spinner} from "@nextui-org/spinner";

// async function getData() {

//   const res = await fetch(`/api/email/recent`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     next: { revalidate: 60 }, // Cache revalidation
//   });

//   if (res.status === 401) {
//     throw new Error("Unauthorized");
//   }

//   return res.json();
// }

export default function Dashboard() {
  // const [data, setData] = useState<any>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // // const router = useRouter();

  // useEffect(() => {
  //   fetch("/api/email/recent", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     next: { revalidate: 60 }, // Cache revalidation
  //   })
  //     .then((res) => res?.json())
  //     .then((data) => {
  //       setData(data);
  //       setLoading(false);
  //     });
  // }, []);


  return (
      <div className="w-full mx-auto ">
        <p className="fade-in-up text-4xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pb-8 animate-fade-in">
          Dashboard
        </p>
       </div>
  );
}
