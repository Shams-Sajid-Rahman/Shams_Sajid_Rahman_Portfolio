import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import BinaryRain from "@/components/BinaryRain";
import CustomCursor from "@/components/CustomCursor";
import InteractiveBackground from "@/components/InteractiveBackground";
import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Runs before first paint so the saved theme never flashes. Dark is the default.
const THEME_INIT = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){}`;

export const metadata = {
  title: "Shams Sajid Rahman | Developer Portfolio",
  description:
    "Computer Science & Engineering graduate building at the frontier of AI & software: ML research, IEEE publication, and full-stack projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <MotionProvider>
          <CustomCursor />
          <SmoothScroll />
          <div className="dark-grid" aria-hidden="true" />
          <BinaryRain />
          <InteractiveBackground />
          <Navbar />
          <main>{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
