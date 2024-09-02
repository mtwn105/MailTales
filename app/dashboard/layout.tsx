import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
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
