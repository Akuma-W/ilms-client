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
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
