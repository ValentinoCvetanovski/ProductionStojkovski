"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-header]");
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
    const parallaxVideo = document.querySelector<HTMLVideoElement>("[data-parallax-video]");
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");
    const searchInput = document.querySelector<HTMLInputElement>("[data-search]");
    const loadMore = document.querySelector<HTMLButtonElement>("[data-load-more]");

    if (!header || !nav || !navToggle) return;

    const activateHeroVideo = () => {
      if (!parallaxVideo) return;
      parallaxVideo.classList.add("is-ready");
    };

    if (parallaxVideo) {
      if (parallaxVideo.dataset.videoSrc && !parallaxVideo.src) {
        parallaxVideo.src = parallaxVideo.dataset.videoSrc;
        parallaxVideo.load();
      }

      parallaxVideo.addEventListener("canplay", activateHeroVideo, { once: true });
      parallaxVideo.addEventListener("playing", activateHeroVideo, { once: true });
      parallaxVideo.play().catch(() => {
        parallaxVideo.classList.remove("is-ready");
      });
    }

    const setHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);

      if (parallaxVideo) {
        const offset = Math.min(window.scrollY * 0.12, 80);
        parallaxVideo.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    };

    const closeNav = () => {
      document.body.classList.remove("nav-open");
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    let activeFilter = "all";
    const normalize = (value: string) => value.trim().toLowerCase();

    const applyProjectFilters = () => {
      if (!searchInput) return;
      const query = normalize(searchInput.value);

      document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
        const categories = card.dataset.category || "";
        const title = card.dataset.title || "";
        const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
        const matchesSearch = !query || title.includes(query) || categories.includes(query);

        card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        activeFilter = button.dataset.filter || "all";
        applyProjectFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyProjectFilters);
    }

    if (loadMore) {
      loadMore.addEventListener("click", () => {
        const extraProjects = [
          {
            category: "Commercials / Drone",
            data: "commercials drone brand city aerial",
            title: "Cityline Campaign",
            duration: "02:10",
            image:
                "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1200&q=86",
            alt: "Commercial portrait captured with cinematic lighting",
            description:
                "A sharp social campaign mixing portrait direction, city texture, and controlled aerial movement.",
          },
          {
            category: "Cinematic",
            data: "cinematic documentary portrait creative short",
            title: "Quiet Frames",
            duration: "06:18",
            image:
                "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1200&q=86",
            alt: "Cinematic projector and theater atmosphere",
            description:
                "A contemplative short film with patient framing, natural sound, and a subdued color palette.",
          },
        ];

        const grid = document.querySelector<HTMLElement>("[data-project-grid]");
        if (!grid) return;

        extraProjects.forEach((project) => {
          const card = document.createElement("article");
          card.className = "project-card reveal is-visible";
          card.dataset.category = project.data;
          card.dataset.title = `${project.title} ${project.data}`.toLowerCase();
          card.innerHTML = `
            <div class="project-media">
              <img src="${project.image}" alt="${project.alt}" />
              <span class="play-icon" aria-hidden="true"></span>
              <span class="duration">${project.duration}</span>
            </div>
            <div class="project-copy">
              <span class="project-category">${project.category}</span>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
            </div>
          `;
          grid.appendChild(card);
        });

        loadMore.textContent = "All Projects Loaded";
        loadMore.disabled = true;
        applyProjectFilters();
      });
    }

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    return () => {
      window.removeEventListener("scroll", setHeaderState);
      revealObserver.disconnect();
    };
  }, []);

  return (
      <>
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

        <main>
          <section className="hero" id="home" aria-label="Cinematic hero">
            <div className="hero-fallback" aria-hidden="true"></div>
            <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2200&q=85"
                data-video-src="/videos/Nina & Filip 19.06.2026.mp4"
                data-parallax-video
            ></video>
            <div className="hero-scrim"></div>
            <div className="hero-gradient"></div>
            <div className="hero-content reveal">
              <h1>Produkcija Stojkovski</h1>
              <br />
              <br />
              <p className="eyebrow">Film Production / Skopje / Worldwide</p>
              <div className="hero-actions" aria-label="Primary actions">
                <a className="button button-primary" href="/portfolio">
                  View Portfolio
                </a>
                <a className="button button-secondary" href="/contact">
                  Get in Touch
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <a className="brand-mark" href="/public" aria-label="Production Stojkovski home">
            <span className="brand-symbol">PS</span>
            <span>Production Stojkovski</span>
          </a>
          <div className="footer-links" aria-label="Social media">
            <a href="https://www.facebook.com/Foto.Belco.i.Dane">Facebook</a>
            <a href="https://www.instagram.com/foto_belcoidane/">Instagram</a>
            <a href="https://www.youtube.com/@fotobelcodane7352">YouTube</a>
          </div>
          <p>&copy; 2026 Production Stojkovski. All rights reserved.</p>
        </footer>
      </>
  );
}