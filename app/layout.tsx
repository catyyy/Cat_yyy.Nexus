import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import GlobalBackground from "@/components/GlobalBackground";
import ProjectInitializer from "@/components/ProjectInitializer";
import { getProjects } from "@/lib/projects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cat_yyy.Nexus()",
  description: "a",
  icons: {
    icon: '/avatar.jpeg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <ProjectInitializer projects={projects} />
        <GlobalBackground />
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
