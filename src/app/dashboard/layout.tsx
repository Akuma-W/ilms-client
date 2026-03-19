import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Navbar } from "@/components/common/navbar";

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="sticky top-0 z-50">
        <Header />
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
