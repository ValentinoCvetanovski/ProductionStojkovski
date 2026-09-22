"use client";

import { useEffect, useState } from "react";

type Lang = "mk" | "en";

export default function Navbar() {
    const [lang, setLang] = useState<Lang>("mk");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("siteLang") as Lang | null;

        if (savedLang === "mk" || savedLang === "en") {
            setLang(savedLang);
            document.documentElement.lang = savedLang;
        } else {
            document.documentElement.lang = "mk";
        }

        setIsReady(true);
    }, []);

    useEffect(() => {
        const header = document.querySelector<HTMLElement>("[data-header]");
        const nav = document.querySelector<HTMLElement>("[data-nav]");
        const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");

        if (!header || !nav || !navToggle) return;

        const setHeaderState = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        };

        const toggleNav = () => {
            const isOpen = nav.classList.toggle("is-open");
            document.body.classList.toggle("nav-open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        };

        const closeNav = () => {
            nav.classList.remove("is-open");
            document.body.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        };

        navToggle.addEventListener("click", toggleNav);

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNav);
        });

        window.addEventListener("scroll", setHeaderState, { passive: true });
        setHeaderState();

        return () => {
            navToggle.removeEventListener("click", toggleNav);
            window.removeEventListener("scroll", setHeaderState);

            nav.querySelectorAll("a").forEach((link) => {
                link.removeEventListener("click", closeNav);
            });
        };
    }, []);

    const changeLanguage = () => {
        const nextLang: Lang = lang === "mk" ? "en" : "mk";

        setLang(nextLang);
        localStorage.setItem("siteLang", nextLang);
        document.documentElement.lang = nextLang;
        window.dispatchEvent(new CustomEvent("languagechange", { detail: nextLang }));
    };

    const text = {
        mk: {
            home: "Почетна",
            portfolio: "Портфолио",
            services: "Услуги",
            about: "За нас",
            contact: "Контакт",
            book: "Резервирај",
            langLabel: "Промени јазик",
        },
        en: {
            home: "Home",
            portfolio: "Portfolio",
            services: "Services",
            about: "About",
            contact: "Contact",
            book: "Book a Project",
            langLabel: "Change language",
        },
    };
    if (!isReady) {
        return null;
    }
    return (
        <header className="site-header" data-header>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="brand-mark" href="/" aria-label="Produkcija Stojkovski home">
                <span className="brand-symbol">PS</span>
                <span>Produkcija Stojkovski</span>
            </a>

            <button
                className="language-toggle"
                type="button"
                aria-label={text[lang].langLabel}
                onClick={changeLanguage}
            >
                <span className={lang === "mk" ? "is-active" : ""}>MK</span>
                <span aria-hidden="true"> | </span>
                <span className={lang === "en" ? "is-active" : ""}>EN</span>
            </button>

            <button
                className="nav-toggle"
                type="button"
                aria-label="Open navigation"
                aria-expanded="false"
                data-nav-toggle
            >
                <span></span>
                <span></span>
            </button>

            <nav className="site-nav" data-nav>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/">{text[lang].home}</a>
                <a href="/portfolio">{text[lang].portfolio}</a>
                <a href="/services">{text[lang].services}</a>
                <a href="/about">{text[lang].about}</a>
                <a href="/contact">{text[lang].contact}</a>
                <a className="nav-cta" href="/bookAProject">
                    {text[lang].book}
                </a>
            </nav>
        </header>
    );
}