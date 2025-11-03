import { Footer } from "@/components/local/shared";
import {Header} from "@/components/local/shared/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
