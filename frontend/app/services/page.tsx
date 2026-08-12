"use client";

import { useEffect } from "react";
import "../css/services.css";
const services = [
    {
        number: "01",
        title: "Wedding Films",
        description:
            "Emotional storytelling, discreet coverage, and elegant edits for once-in-a-lifetime days.",
    },
    {
        number: "02",
        title: "Love Story Films",
        description:
            "Intimate pre-wedding and engagement films that capture two people falling in love, told as a short cinematic story.",
    },
    {
        number: "03",
        title: "Commercial Production",
        description:
            "Brand films, product visuals, launch assets, and social-first campaigns with premium polish.",
    },
    {
        number: "04",
        title: "Music & Events",
        description:
            "Performance-driven visuals, live event recaps, backstage moments, and energetic edits.",
    },
    {
        number: "05",
        title: "Drone Cinematography",
        description:
            "Sweeping aerial establishing shots, FPV chase sequences, and elevated perspectives that give a story scale.",
    },
    {
        number: "06",
        title: "Crane & Stabilized Shots",
        description:
            "Fluid crane moves, gimbal work, and dolly sequences for dramatic reveals and smooth, cinematic motion.",
    },
];

export default function ServicesPage() {
    useEffect(() => {
        const items = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <header className="site-header">
                <a className="brand-mark" href="/" aria-label="Production Stojkovski home">
                    <span className="brand-symbol">PS</span>
                    <span>Produkcija Stojkovski</span>
                </a>
                <nav className="site-nav">
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

            <section className="services section-shell" id="services" aria-labelledby="services-title">
                <p className="section-kicker reveal">Services</p>
                <div className="section-heading reveal">
                    <div>
                        <h2 id="services-title">Production services with a cinematic finish.</h2>
                        <p>Lean, experienced crews for intimate stories and larger productions alike.</p>
                    </div>
                </div>
                <div className="service-grid">
                    {services.map((service) => (
                        <article className="service-card reveal" key={service.number}>
                            <span>{service.number}</span>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}