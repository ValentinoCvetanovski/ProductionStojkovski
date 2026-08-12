"use client";

import { useEffect } from "react";
import "../css/portfolio.css";

interface Project {
    id?: number;
    type?: "image" | "video";
    src?: string;
    category?: string;
    data?: string;
    title?: string;
    duration?: string;
    description?: string;
    alt?: string;
}

export default function Page() {
    useEffect(() => {
        const searchInput = document.querySelector<HTMLInputElement>("[data-search]");
        const mediaAddButton = document.querySelector<HTMLButtonElement>("[data-media-add]");
        const mediaDeleteButton = document.querySelector<HTMLButtonElement>("[data-media-delete]");
        const mediaUploadInput = document.querySelector<HTMLInputElement>("[data-media-upload]");
        const adminActions = document.querySelector<HTMLElement>("[data-admin-actions]");
        const projectGrid = document.querySelector<HTMLElement>("[data-project-grid]");

        const API_URL = "http://localhost:8080/api/portfolio";

        let isAdmin = false;

        const checkAdminStatus = async () => {
            try {
                const adminAuth = sessionStorage.getItem("adminAuth");

                const response = await fetch("http://localhost:8080/api/auth/me", {
                    headers: adminAuth
                        ? {
                            Authorization: adminAuth,
                        }
                        : {},
                });

                if (!response.ok) {
                    throw new Error("Auth check failed");
                }

                const auth = await response.json();
                isAdmin = auth.admin === true;

                if (adminActions && !isAdmin) {
                    adminActions.remove();
                }
            } catch (error) {
                console.error("Could not check admin status:", error);

                if (adminActions) {
                    adminActions.remove();
                }
            }
        };

        const normalize = (value: string) => value.trim().toLowerCase();

        const createProjectCard = (project: Project) => {
            const card = document.createElement("article");
            card.className = "project-card reveal";

            if (project.id) {
                card.dataset.id = String(project.id);
            }

            card.dataset.category = project.data || "custom";
            card.dataset.title = normalize(
                `${project.title} ${project.category} ${project.data || ""}`
            );

            const media = document.createElement("div");
            media.className = "project-media";

            if (project.type === "video") {
                const video = document.createElement("video");
                video.src = project.src || "";
                video.controls = true;
                video.preload = "metadata";
                video.playsInline = true;
                video.setAttribute("aria-label", project.alt || project.title || "");
                media.appendChild(video);
            } else {
                const image = document.createElement("img");
                image.src = project.src || "";
                image.alt = project.alt || project.title || "";
                media.appendChild(image);
            }

            const playIcon = document.createElement("span");
            playIcon.className = "play-icon";
            playIcon.setAttribute("aria-hidden", "true");

            const duration = document.createElement("span");
            duration.className = "duration";
            duration.textContent = project.duration || (project.type === "video" ? "Video" : "Photo");

            const copy = document.createElement("div");
            copy.className = "project-copy";

            const category = document.createElement("span");
            category.className = "project-category";
            category.textContent = project.category || "Custom";

            const title = document.createElement("h3");
            title.textContent = project.title || "Untitled Project";

            const description = document.createElement("p");
            description.textContent = project.description || "";

            media.append(playIcon, duration);
            copy.append(category, title, description);
            card.append(media, copy);

            return card;
        };

        const applyProjectSearch = () => {
            const query = searchInput ? normalize(searchInput.value) : "";

            document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
                const title = card.dataset.title || "";
                card.classList.toggle("is-hidden", !!query && !title.includes(query));
            });
        };

        const addProjectCard = (project: Project, placement: "append" | "prepend" = "append") => {
            if (!projectGrid) {
                return;
            }

            const card = createProjectCard(project);

            if (placement === "prepend") {
                projectGrid.prepend(card);
            } else {
                projectGrid.appendChild(card);
            }

            applyProjectSearch();
        };
        const loadProjectsFromDatabase = async () => {
            if (!projectGrid) return;

            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to load portfolio projects");
                }

                const projects: Project[] = await response.json();

                projects.forEach((project) => {
                    addProjectCard(project, "prepend");
                });
            } catch (error) {
                console.error("Could not load projects:", error);
            }
        };


        if (searchInput) {
            searchInput.addEventListener("input", applyProjectSearch);
        }


        loadProjectsFromDatabase();
        checkAdminStatus();

        const handleMediaAddClick = () => {
            mediaUploadInput?.click();
        };
        const handleMediaDeleteClick = async () => {
            if (!isAdmin) return;

            const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-card"));

            if (cards.length === 0) {
                window.alert("No media to delete.");
                return;
            }

            const title = window.prompt("Enter exact project title to delete:");

            if (!title) return;

            const normalizedTitle = normalize(title);

            const cardToDelete = cards.find((card) => {
                const cardTitle = card.dataset.title || "";
                return cardTitle.includes(normalizedTitle);
            });

            if (!cardToDelete) {
                window.alert("Project not found.");
                return;
            }

            const projectId = cardToDelete.dataset.id;

            if (!projectId) {
                window.alert("This project cannot be deleted because it has no database id.");
                return;
            }

            const confirmed = window.confirm("Are you sure you want to delete this media?");

            if (!confirmed) return;

            try {
                const adminAuth = sessionStorage.getItem("adminAuth");

                const response = await fetch(`${API_URL}/${projectId}`, {
                    method: "DELETE",
                    headers: adminAuth
                        ? {
                            Authorization: adminAuth,
                        }
                        : {},
                });

                if (!response.ok) {
                    throw new Error("Delete failed");
                }

                cardToDelete.remove();
            } catch (error) {
                console.error("Could not delete project:", error);
                window.alert("Delete failed. Check if backend is running.");
            }
        };
        const handleMediaUploadChange = async () => {
            if (!mediaUploadInput) return;

            for (const file of Array.from(mediaUploadInput.files || [])) {
                const isVideo = file.type.startsWith("video/");
                const fallbackTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");

                const title = window.prompt("Project title:", fallbackTitle) || fallbackTitle;
                const categoryLabel = window.prompt("Category:", "Custom") || "Custom";
                const duration =
                    window.prompt("Duration label:", isVideo ? "Video" : "Photo") || (isVideo ? "Video" : "Photo");
                const description = window.prompt("Short description:", "") || "";

                const formData = new FormData();
                formData.append("file", file);
                formData.append("title", title);
                formData.append("category", categoryLabel);
                formData.append("duration", duration);
                formData.append("description", description);

                try {
                    const adminAuth = sessionStorage.getItem("adminAuth");

                    const response = await fetch(`${API_URL}/upload`, {
                        method: "POST",
                        headers: adminAuth
                            ? {
                                Authorization: adminAuth,
                            }
                            : {},
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Upload failed");
                    }

                    const savedProject: Project = await response.json();
                    addProjectCard(savedProject, "prepend");
                } catch (error) {
                    console.error("Could not upload project:", error);
                    window.alert("Upload failed. Check if backend is running.");
                }
            }

            mediaUploadInput.value = "";
        };

        if (mediaAddButton && mediaUploadInput) {
            mediaAddButton.addEventListener("click", handleMediaAddClick);
            mediaUploadInput.addEventListener("change", handleMediaUploadChange);
        }
        if (mediaDeleteButton) {
            mediaDeleteButton.addEventListener("click", handleMediaDeleteClick);
        }

        return () => {

            if (searchInput) {
                searchInput.removeEventListener("input", applyProjectSearch);
            }
            if (mediaAddButton && mediaUploadInput) {
                mediaAddButton.removeEventListener("click", handleMediaAddClick);
                mediaUploadInput.removeEventListener("change", handleMediaUploadChange);
            }
            if (mediaDeleteButton) {
                mediaDeleteButton.removeEventListener("click", handleMediaDeleteClick);
            }
        };
    }, []);

    return (
        <>
            <header className="site-header" data-header>
                <a className="brand-mark" href="/" aria-label="Production Stojkovski home">
                    <span className="brand-symbol">PS</span>
                    <span>Produkcija Stojkovski</span>
                </a>

                <button className="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle>
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
            <section className="portfolio section-shell" id="portfolio" aria-labelledby="portfolio-title">
                <div className="section-kicker reveal">Selected Work</div>
                <div className="section-heading reveal">
                    <div>
                        <h2 id="portfolio-title">A gallery built for motion, emotion, and detail.</h2>
                        <p>
                            A curated selection of wedding films, branded stories, music visuals, live events, aerial sequences,
                            and cinematic editorials.
                        </p>
                    </div>
                    <form className="search-panel" role="search" aria-label="Search projects">
                        <label htmlFor="project-search">Search projects</label>
                        <input id="project-search" type="search" placeholder="Search by title, style, or category" data-search />
                    </form>
                </div>

                <div className="filter-row reveal" aria-label="Portfolio actions" data-admin-actions>
                    <button className="filter-chip" type="button" data-media-add>
                        Add Media
                    </button>

                    <button className="filter-chip" type="button" data-media-delete>
                        Delete Media
                    </button>

                    <input id="media-upload" type="file" accept="image/*,video/*" multiple data-media-upload hidden />
                </div>

                <div className="portfolio-grid" data-project-grid></div>

            </section>
        </>
    );
}