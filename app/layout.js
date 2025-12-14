import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { KanbanProvider } from "./context/KanbanContext";
import { ProjectProvider } from "./context/ProjectContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FlowDeck - AI-Powered Freelance Workspace",
  description: "Manage your freelance projects with AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ProjectProvider>
            <KanbanProvider>
              {children}
            </KanbanProvider>
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
