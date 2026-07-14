import { Suspense } from "react"
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { MarketingChat } from "@/components/chat/marketing-chat";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <Suspense>
        <MarketingChat />
      </Suspense>
    </div>
  );
}
