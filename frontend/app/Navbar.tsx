"use client";

import { useEffect } from "react";

export default function Navbar() {
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

    return (
        <header className="site-header" data-header>
            <a className="brand-mark" href="/" aria-label="Production Stojkovski home">
                <span className="brand-symbol">PS</span>
                <span>Produkcija Stojkovski</span>
            </a>

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
                <a href="/">Home</a>
                <a href="/portfolio">Portfolio</a>
                <a href="/services">Services</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a className="nav-cta" href="/bookAProject">
                    Book a Project
                </a>
            </nav>
        </header>
    );
}