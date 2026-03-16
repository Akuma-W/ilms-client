import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import NavSidebar from "@/components/common/nav-sidebar";
import Navbar from "@/components/common/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        // isLoggedIn={isLoggedIn}
        // onOpenSidebar={() => setOpenSidebar(true)}
        // showSign={false}
      />
      <Navbar />
      {/* <NavSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} /> */}

      <main className="flex-1 relative py-4 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
