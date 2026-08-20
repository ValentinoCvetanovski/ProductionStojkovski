// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Production Stojkovski | Cinematic Video Production",
    description:
        "Production Stojkovski is a premium video production and cinematic filmmaking brand crafting weddings, commercials, music videos, events, drone films, and timeless visual stories.",
};

// @ts-ignore
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://images.unsplash.com" />
            <link rel="preconnect" href="https://videos.pexels.com" />
        </head>

        <body className={inter.className}>
        <Navbar />
        {children}
        </body>
        </html>
    );
}