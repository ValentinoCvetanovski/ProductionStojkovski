import "../css/contact.css";

export default function Contact() {
    return (
        <>
            <header className="site-header">
                <a className="brand-mark" href="/" aria-label="Produkcija Stojkovski home">
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

            <main className="contact-page">
                <section className="contact-hero">
                    <div className="contact-hero-inner">
                        <p className="section-kicker">Contact us</p>
                        <h1>Let’s talk about your event.</h1>
                        <p>
                            Send us a message, visit our shop location, or reach us through our
                            social media channels.
                        </p>
                    </div>
                </section>

                <section className="contact-shell">
                    <div className="contact-layout">
                        <div className="contact-info">
                            <p className="section-kicker">Production Stojkovski</p>
                            <h2>Get in touch</h2>

                            <div className="info-list">
                                <div className="info-item">
                                    <span>Phone</span>
                                    <a href="tel:+38970000000">+389 70 000 000</a>
                                </div>

                                <div className="info-item">
                                    <span>Email</span>
                                    <a href="mailto:produkcijastojkovski@gmail.com">
                                        produkcijastojkovski@gmail.com
                                    </a>
                                </div>

                                <div className="info-item">
                                    <span>Location</span>
                                    <p>YOUR_SHOP_ADDRESS</p>
                                </div>
                            </div>
                        </div>

                        <form className="contact-form">
                            <div className="field">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" type="text" placeholder="Your name" />
                            </div>

                            <div className="field">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" name="phone" type="tel" placeholder="+389..." />
                            </div>

                            <div className="field">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us about your event..."
                                ></textarea>
                            </div>

                            <button className="contact-button" type="submit">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>

                <section className="map-section">
                    <div className="map-copy">
                        <p className="section-kicker">Our location</p>
                        <h2>Visit our shop</h2>
                        <p>
                            Replace the map address with the exact shop location so clients can
                            easily find you.
                        </p>
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
                    <p className="section-kicker">Follow us</p>
                    <h2>Find us online</h2>

                    <div className="social-grid">
                        <a href="https://www.facebook.com/Foto.Belco.i.Dane" target="_blank" rel="noreferrer">
                            <span>Facebook</span>
                            <strong>View page</strong>
                        </a>

                        <a href="https://www.instagram.com/foto_belcoidane/" target="_blank" rel="noreferrer">
                            <span>Instagram</span>
                            <strong>View profile</strong>
                        </a>

                        <a href="https://www.youtube.com/@fotobelcodane7352" target="_blank" rel="noreferrer">
                            <span>YouTube</span>
                            <strong>Watch videos</strong>
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}