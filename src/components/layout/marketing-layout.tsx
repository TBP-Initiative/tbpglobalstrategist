import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import dynamic from "next/dynamic";

const MarketingChat = dynamic(
  () => import("@/components/chat/marketing-chat").then((m) => ({ default: m.MarketingChat })),
  { ssr: false }
);

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
      <MarketingChat />
    </div>
  );
}
