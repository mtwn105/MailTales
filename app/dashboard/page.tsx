"use client";
export default function Dashboard() {
  // Call API on load
  const fetchData = async () => {
    try {
      const response = await fetch("/api/email/recent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchData();

  return (
    <main>
      <div className="w-full mx-auto ">
        <p className="fade-in-up text-4xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 animate-fade-in">
          Dashboard
        </p>
      </div>
    </main>
  );
}
