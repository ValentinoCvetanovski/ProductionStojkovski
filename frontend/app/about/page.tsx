"use client";

import { useEffect, useState } from "react";
import "../css/about.css";

export default function About() {
    return (
        <>

            <main>
                <section className="about-hero">
                    <div className="about-hero-inner reveal is-visible">
                        <p className="section-kicker">About our production</p>
                        <h1>Stories filmed with emotion, detail and style.</h1>
                        <p>
                            Produkcija Stojkovski is a photo and video production focused on
                            weddings, birthdays, maturi and special events. This is example text
                            that you can replace later with your real story.
                        </p>
                    </div>
                </section>

                <section className="section-shell about-story">
                    <div className="section-heading reveal is-visible">
                        <div>
                            <p className="section-kicker">Our story</p>
                            <h2>Produkcija Stojkovski</h2>
                        </div>
                        <p>
                            We create cinematic memories for people who want their important
                            moments to feel natural, elegant and timeless.
                        </p>
                    </div>

                    <div className="about-grid">
                        <div className="about-copy reveal is-visible">
                            <p>
                                This is example about text. Write here how the production started,
                                what kind of events you record, what makes your work different and
                                why clients choose you for their special day.
                            </p>
                            <p>
                                Our goal is to capture real emotions, clean details and the full
                                atmosphere of every celebration. From the first meeting to the final
                                video, every project is handled with care.
                            </p>
                        </div>

                        <div className="about-image reveal is-visible">
                            <img src="/images/about-production.jpg" alt="Produkcija Stojkovski" />
                        </div>
                    </div>
                </section>

                <section className="section-shell about-services">
                    <div className="section-heading reveal is-visible">
                        <div>
                            <p className="section-kicker">What we film</p>
                            <h2>Events we cover</h2>
                        </div>
                        <p>
                            Replace this text with a short description of your packages, working
                            style or the type of moments you want to show.
                        </p>
                    </div>

                    <div className="service-grid">
                        <article className="service-card reveal is-visible">
                            <span>01</span>
                            <h3>Weddings</h3>
                            <p>
                                Cinematic wedding films and photography focused on emotion,
                                elegance and the full story of the day.
                            </p>
                        </article>

                        <article className="service-card reveal is-visible">
                            <span>02</span>
                            <h3>Birthdays</h3>
                            <p>
                                Warm and dynamic coverage for birthdays, family celebrations and
                                private events.
                            </p>
                        </article>

                        <article className="service-card reveal is-visible">
                            <span>03</span>
                            <h3>Maturi</h3>
                            <p>
                                Stylish photo and video memories for graduation celebrations and
                                milestone moments.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="section-shell about-cta-shell">
                    <div className="about-cta reveal is-visible">
                        <div>
                            <p className="section-kicker">Book your date</p>
                            <h2>Tell us about your event.</h2>
                            <p>
                                Choose the type of event, select a date and send us a request.
                                We will contact you as soon as possible.
                            </p>
                        </div>

                        <a className="about-button" href="/bookAProject">
                            Reserve
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}