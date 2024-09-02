import { Metadata } from "next";

const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <main className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">About</h1>
        <p className="text-lg mb-4">
          Hello! I'm Amit Wani, the developer behind MailTales. I'm passionate
          about creating innovative solutions that make people's lives easier.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>

        <div className="flex flex-col space-y-2">
          <p className="text-lg">
            Email:{" "}
            <a
              href="mailto:mtwn105@gmail.com"
              className="text-primary hover:underline"
            >
              mtwn105@gmail.com
            </a>
          </p>
          <p className="text-lg">
            X:{" "}
            <a
              href="https://x.com/mtwn105"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @mtwn105
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
