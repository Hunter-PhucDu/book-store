import Navigation from "./Navigation";
import Footer from "./Footer";
import { cn } from "@/lib/utils/cn";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  );
}
