import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="jr-progress" aria-hidden="true" />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
