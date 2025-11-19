import { Footer } from "@/components/local";
import Breadcrumbs from "@/components/local/shared/Breadcrumbs";
import {Header} from "@/components/local/shared/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <Breadcrumbs />
      <main className="min-h-screen bg-[#ffffff]">{children}</main>
      <Footer />
    </div>
  );
}
