// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Produkcija Stojkovski | Видео продукција",
    description:
        "Produkcija Stojkovski е видео продукција за свадби, реклами, музички видеа, настани, drone снимки и cinematic visual stories.",
};

// @ts-ignore
export default function RootLayout({ children }) {
    return (
        <html lang="mk">
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