import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "HIMA — Student Organization",
  description:
    "HIMA is a student organization dedicated to fostering academic excellence, community engagement, and professional development.",
  keywords: ["student organization", "hima", "university", "campus"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
