import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Navbar } from "@/components/common/navbar";
import { ProtectedRoute } from "@/components/route/protected-route";

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
      <main className="flex-1">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
