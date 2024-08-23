import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - MailTales",
  description: "Your email dashboard",
};

export default function DashboardLayout({
  children,
  emailList,
}: {
  children: React.ReactNode;
  emailList: React.ReactNode;
}) {
  return (
    <main>
      {children}
      {emailList}
   </main>
  );
}
