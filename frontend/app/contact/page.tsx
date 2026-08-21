"use client";

import { useEffect, useState } from "react";
import "../css/contact.css";

export default function Contact() {
    const [lang, setLang] = useState<"mk" | "en">("mk");
    const [isReady, setIsReady] = useState(false);

    const text = {
        mk: {
            contactUs: "Контакт",
            title: "Ајде да зборуваме за вашиот настан.",
            intro: "Пратете ни порака, посетете ја нашата локација или контактирајте не преку социјалните мрежи.",
            production: "Produkcija Stojkovski",
            getInTouch: "Контактирајте не",
            phone: "Телефон",
            email: "Е-пошта",
            location: "Локација",
            name: "Име",
            namePlaceholder: "Вашето име",
            phonePlaceholder: "+389...",
            message: "Порака",
            messagePlaceholder: "Кажете ни нешто за вашиот настан...",
            send: "Испрати порака",
            ourLocation: "Наша локација",
            visit: "Посетете ја нашата продавница",
            mapText: "Пронајдете не лесно преку мапата.",
            follow: "Следете не",
            online: "Најдете не онлајн",
            facebook: "Види страница",
            instagram: "Види профил",
            youtube: "Гледај видеа",
        },
        en: {
            contactUs: "Contact us",
            title: "Let’s talk about your event.",
            intro: "Send us a message, visit our shop location, or reach us through our social media channels.",
            production: "Produkcija Stojkovski",
            getInTouch: "Get in touch",
            phone: "Phone",
            email: "Email",
            location: "Location",
            name: "Name",
            namePlaceholder: "Your name",
            phonePlaceholder: "+389...",
            message: "Message",
            messagePlaceholder: "Tell us about your event...",
            send: "Send Message",
            ourLocation: "Our location",
            visit: "Visit our shop",
            mapText: "Find us easily through the map.",
            follow: "Follow us",
            online: "Find us online",
            facebook: "View page",
            instagram: "View profile",
            youtube: "Watch videos",
        },
    };

    useEffect(() => {
        const savedLang = localStorage.getItem("siteLang") as "mk" | "en" | null;

        if (savedLang === "mk" || savedLang === "en") {
            setLang(savedLang);
        }

        setIsReady(true);

        const handleLanguageChange = (event: Event) => {
            const customEvent = event as CustomEvent<"mk" | "en">;
            setLang(customEvent.detail);
        };

        window.addEventListener("languagechange", handleLanguageChange);

        return () => {
            window.removeEventListener("languagechange", handleLanguageChange);
        };
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <main className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-inner">
                    <p className="section-kicker">{text[lang].contactUs}</p>
                    <h1>{text[lang].title}</h1>
                    <p>{text[lang].intro}</p>
                </div>
            </section>

            <section className="contact-shell">
                <div className="contact-layout">
                    <div className="contact-info">
                        <p className="section-kicker">{text[lang].production}</p>
                        <h2>{text[lang].getInTouch}</h2>

                        <div className="info-list">
                            <div className="info-item">
                                <span>{text[lang].phone}</span>
                                <a href="tel:+38978286914">+389 78 286 914</a>
                            </div>
                            <div className="info-item">
                                <a href="tel:+38978296870">+389 78 296 870</a>
                            </div>

                            <div className="info-item">
                                <span>{text[lang].email}</span>
                                <a href="mailto:produkcijastojkovski@gmail.com">
                                    produkcijastojkovski@gmail.com
                                </a>
                            </div>

                            <div className="info-item">
                                <span>{text[lang].location}</span>
                                <p>4PM8+RVH, Garnizon Kumanovo</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form">
                        <div className="field">
                            <label htmlFor="name">{text[lang].name}</label>
                            <input id="name" name="name" type="text" placeholder={text[lang].namePlaceholder} />
                        </div>

                        <div className="field">
                            <label htmlFor="phone">{text[lang].phone}</label>
                            <input id="phone" name="phone" type="tel" placeholder={text[lang].phonePlaceholder} />
                        </div>

                        <div className="field">
                            <label htmlFor="message">{text[lang].message}</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder={text[lang].messagePlaceholder}
                            ></textarea>
                        </div>

                        <button className="contact-button" type="submit">
                            {text[lang].send}
                        </button>
                    </form>
                </div>
            </section>

            <section className="map-section">
                <div className="map-copy">
                    <p className="section-kicker">{text[lang].ourLocation}</p>
                    <h2>{text[lang].visit}</h2>
                    <p>{text[lang].mapText}</p>
                </div>

                <div className="map-frame">
                    <iframe
                        title="Produkcija Stojkovski location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184.92085757670168!2d21.717144399860572!3d42.1345834190822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13544fd12c59b939%3A0x8a2a86a8653da143!2sFoto%20Belco%20i%20Dane!5e0!3m2!1sen!2smk!4v1786548277930!5m2!1sen!2smk"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>

            <section className="social-section">
                <p className="section-kicker">{text[lang].follow}</p>
                <h2>{text[lang].online}</h2>

                <div className="social-grid">
                    <a href="https://www.facebook.com/Foto.Belco.i.Dane" target="_blank" rel="noreferrer">
                        <span>Facebook</span>
                        <strong>{text[lang].facebook}</strong>
                    </a>

                    <a href="https://www.instagram.com/foto_belcoidane/" target="_blank" rel="noreferrer">
                        <span>Instagram</span>
                        <strong>{text[lang].instagram}</strong>
                    </a>

                    <a href="https://www.youtube.com/@fotobelcodane7352" target="_blank" rel="noreferrer">
                        <span>YouTube</span>
                        <strong>{text[lang].youtube}</strong>
                    </a>
                </div>
            </section>
        </main>
    );
}