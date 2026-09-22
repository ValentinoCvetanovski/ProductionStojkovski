"use client";

import { useEffect, useState } from "react";
import "../css/portfolio.css";

interface PortfolioFolder {
    id?: number;
    title?: string;
    category?: string;
    duration?: string;
    description?: string;
    thumbnailSrc?: string;
    alt?: string;
}

interface PortfolioMedia {
    id?: number;
    type?: "image" | "video";
    src?: string;
    alt?: string;
}

export default function Page() {
    const [selectedFolder, setSelectedFolder] = useState<PortfolioFolder | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<PortfolioMedia[]>([]);
    const [selectedPreviewMedia, setSelectedPreviewMedia] = useState<PortfolioMedia | null>(null);
    const [isAdminState, setIsAdminState] = useState(false);

    const handleFolderMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedFolder?.id) return;

        const files = Array.from(event.target.files || []);
        const adminAuth = sessionStorage.getItem("adminAuth");

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("alt", selectedFolder.title || "Portfolio media");

            const response = await fetch(`http://localhost:8080/api/portfolio/folders/${selectedFolder.id}/media`, {
                method: "POST",
                headers: adminAuth ? { Authorization: adminAuth } : {},
                body: formData,
            });

            if (response.ok) {
                const savedMedia: PortfolioMedia = await response.json();
                setSelectedMedia((current) => [savedMedia, ...current]);
            }
        }

        event.target.value = "";
    };
    useEffect(() => {
        const searchInput = document.querySelector<HTMLInputElement>("[data-search]");
        const folderAddButton = document.querySelector<HTMLButtonElement>("[data-folder-add]");
        const folderUploadInput = document.querySelector<HTMLInputElement>("[data-folder-upload]");
        const mediaDeleteButton = document.querySelector<HTMLButtonElement>("[data-media-delete]");
        const adminActions = document.querySelector<HTMLElement>("[data-admin-actions]");
        const projectGrid = document.querySelector<HTMLElement>("[data-project-grid]");

        const API_URL = "http://localhost:8080/api/portfolio";

        let isAdmin = false;
        const openFolder = async (folder: PortfolioFolder) => {
            if (!folder.id) return;

            try {
                const response = await fetch(`${API_URL}/folders/${folder.id}/media`);

                if (!response.ok) {
                    throw new Error("Failed to load folder media");
                }

                const media: PortfolioMedia[] = await response.json();

                setSelectedFolder(folder);
                setSelectedMedia(media);
            } catch (error) {
                console.error("Could not open folder:", error);
                window.alert("Could not open this folder.");
            }
        };
        const handleFolderAddClick = () => {
            if (!isAdmin) return;
            folderUploadInput?.click();
        };

        const handleFolderUploadChange = async () => {
            if (!folderUploadInput) return;

            const file = folderUploadInput.files?.[0];
            if (!file) return;

            const fallbackTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");

            const title = window.prompt("Folder title:", fallbackTitle) || fallbackTitle;
            const category = window.prompt("Category:", "Custom") || "Custom";
            const duration = window.prompt("Duration label:", "Folder") || "Folder";
            const description = window.prompt("Short description:", "") || "";

            const formData = new FormData();
            formData.append("thumbnail", file);
            formData.append("title", title);
            formData.append("category", category);
            formData.append("duration", duration);
            formData.append("description", description);

            try {
                const adminAuth = sessionStorage.getItem("adminAuth");

                const response = await fetch(`${API_URL}/folders`, {
                    method: "POST",
                    headers: adminAuth ? { Authorization: adminAuth } : {},
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Folder upload failed");
                }

                const savedFolder: PortfolioFolder = await response.json();
                addFolderCard(savedFolder, "prepend");
            } catch (error) {
                console.error("Could not create folder:", error);
                window.alert("Could not create folder.");
            }

            folderUploadInput.value = "";
        };
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
                setIsAdminState(isAdmin);

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

        const createFolderCard = (folder: PortfolioFolder) => {
            const card = document.createElement("article");
            card.className = "project-card reveal";

            if (folder.id) {
                card.dataset.id = String(folder.id);
            }

            card.dataset.title = normalize(`${folder.title} ${folder.category || ""}`);
            card.dataset.folderTitle = folder.title || "Untitled Folder";

            const media = document.createElement("div");
            media.className = "project-media";

            const image = document.createElement("img");
            image.src = folder.thumbnailSrc || "";
            image.alt = folder.alt || folder.title || "";
            media.appendChild(image);

            const duration = document.createElement("span");
            duration.className = "duration";
            duration.textContent = folder.duration || "Folder";

            const copy = document.createElement("div");
            copy.className = "project-copy";

            const category = document.createElement("span");
            category.className = "project-category";
            category.textContent = folder.category || "Portfolio Folder";

            const title = document.createElement("h3");
            title.textContent = folder.title || "Untitled Folder";

            const description = document.createElement("p");
            description.textContent = folder.description || "";

            media.append(duration);
            copy.append(category, title, description);
            card.append(media, copy);

            card.addEventListener("click", async () => {
                await openFolder(folder);
            });

            return card;
        };

        const applyProjectSearch = () => {
            const query = searchInput ? normalize(searchInput.value) : "";

            document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
                const title = card.dataset.title || "";
                card.classList.toggle("is-hidden", !!query && !title.includes(query));
            });
        };


        const addFolderCard = (folder: PortfolioFolder, placement: "append" | "prepend" = "append") => {
            if (!projectGrid) return;

            const card = createFolderCard(folder);

            if (placement === "prepend") {
                projectGrid.prepend(card);
            } else {
                projectGrid.appendChild(card);
            }

            applyProjectSearch();
        };

        const loadFoldersFromDatabase = async () => {
            if (!projectGrid) return;

            try {
                const response = await fetch(`${API_URL}/folders`);

                if (!response.ok) {
                    throw new Error("Failed to load portfolio folders");
                }

                const folders: PortfolioFolder[] = await response.json();

                folders.forEach((folder) => {
                    addFolderCard(folder, "prepend");
                });
            } catch (error) {
                console.error("Could not load folders:", error);
            }
        };


        if (searchInput) {
            searchInput.addEventListener("input", applyProjectSearch);
        }


        loadFoldersFromDatabase();
        checkAdminStatus();

        const handleMediaDeleteClick = async () => {
            if (!isAdmin) return;

            const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-card"));

            if (cards.length === 0) {
                window.alert("No folders to delete.");
                return;
            }

            const folderOptions = cards
                .map((card, index) => {
                    const title = card.dataset.folderTitle || card.dataset.title || `Folder ${index + 1}`;
                    return `${index + 1}. ${title}`;
                })
                .join("\n");

            const selectedNumber = window.prompt(
                `Choose folder to delete:\n\n${folderOptions}\n\nEnter folder number:`
            );

            if (!selectedNumber) return;

            const selectedIndex = Number(selectedNumber) - 1;

            if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= cards.length) {
                window.alert("Invalid folder number.");
                return;
            }

            const cardToDelete = cards[selectedIndex];
            const folderId = cardToDelete.dataset.id;
            const folderTitle = cardToDelete.dataset.folderTitle || cardToDelete.dataset.title || "this folder";

            if (!folderId) {
                window.alert("This folder cannot be deleted because it has no database id.");
                return;
            }

            const confirmed = window.confirm(`Are you sure you want to delete "${folderTitle}"?`);

            if (!confirmed) return;

            try {
                const adminAuth = sessionStorage.getItem("adminAuth");

                const response = await fetch(`${API_URL}/folders/${folderId}`, {
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
                console.error("Could not delete folder:", error);
                window.alert("Delete failed. Check if backend is running.");
            }
        };

        if (folderAddButton && folderUploadInput) {
            folderAddButton.addEventListener("click", handleFolderAddClick);
            folderUploadInput.addEventListener("change", handleFolderUploadChange);
        }
        if (mediaDeleteButton) {
            mediaDeleteButton.addEventListener("click", handleMediaDeleteClick);
        }

        return () => {

            if (searchInput) {
                searchInput.removeEventListener("input", applyProjectSearch);
            }
            if (folderAddButton && folderUploadInput) {
                folderAddButton.removeEventListener("click", handleFolderAddClick);
                folderUploadInput.removeEventListener("change", handleFolderUploadChange);
            }
            if (mediaDeleteButton) {
                mediaDeleteButton.removeEventListener("click", handleMediaDeleteClick);
            }
        };
    }, []);

    return (
        <>

            <section className="portfolio section-shell" id="portfolio" aria-labelledby="portfolio-title">
                <div className="section-kicker reveal">Selected Work</div>
                <div className="section-heading reveal">
                    <div>
                        <h2 id="portfolio-title">A gallery built for motion, emotion, and detail.</h2>
                        <p>
                            A curated selection of wedding films, branded stories, music visuals, live events, aerial sequences,
                            and cinematic editorials.
                        </p>
                    </div></div>

                <div className="filter-row reveal" aria-label="Portfolio actions" data-admin-actions>
                    <button className="filter-chip" type="button" data-folder-add>
                        Add Folder
                    </button>

                    <button className="filter-chip" type="button" data-media-delete>
                        Delete Folder
                    </button>

                    <input id="folder-upload" type="file" accept="image/*" data-folder-upload hidden />
                </div>

                <div className="portfolio-grid" data-project-grid></div>

            </section>
            {selectedFolder && (
                <div className="media-popup" role="dialog" aria-modal="true">
                    <button
                        className="media-popup-backdrop"
                        type="button"
                        onClick={() => {
                            setSelectedFolder(null);
                            setSelectedMedia([]);
                            setSelectedPreviewMedia(null);
                        }}
                    />

                    <div className="media-popup-content">
                        <button
                            className="media-popup-close"
                            type="button"
                            onClick={() => {
                                setSelectedFolder(null);
                                setSelectedMedia([]);
                            }}
                        >
                            ×
                        </button>

                        <div className="media-popup-copy">
                            <span>{selectedFolder.category || "Portfolio Folder"}</span>
                            <h3>{selectedFolder.title}</h3>
                            <p>{selectedFolder.description}</p>

                            {isAdminState && (
                                <button
                                    className="filter-chip"
                                    type="button"
                                    onClick={() =>
                                        document
                                            .querySelector<HTMLInputElement>("[data-folder-media-upload]")
                                            ?.click()
                                    }
                                >
                                    Add Media To Folder
                                </button>
                            )}
                        </div>

                        <div className="popup-media-grid">
                            {selectedMedia.map((item) => (
                                <button
                                    key={item.id}
                                    className="popup-media-item"
                                    type="button"
                                    onClick={() => setSelectedPreviewMedia(item)}
                                >
                                    {item.type === "video" ? (
                                        <video src={item.src || ""} muted playsInline preload="metadata" />
                                    ) : (
                                        <img src={item.src || ""} alt={item.alt || ""} />
                                    )}
                                </button>
                            ))}
                        </div>

                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            hidden
                            data-folder-media-upload
                            onChange={handleFolderMediaUpload}
                        />
                    </div>
                </div>
            )}
            {selectedPreviewMedia && (
                <div className="media-preview-popup" role="dialog" aria-modal="true">
                    <button
                        className="media-preview-backdrop"
                        type="button"
                        aria-label="Close media preview"
                        onClick={() => setSelectedPreviewMedia(null)}
                    />

                    <div className="media-preview-content">
                        <button
                            className="media-preview-close"
                            type="button"
                            aria-label="Close media preview"
                            onClick={() => setSelectedPreviewMedia(null)}
                        >
                            ×
                        </button>

                        {selectedPreviewMedia.type === "video" ? (
                            <video
                                src={selectedPreviewMedia.src || ""}
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <img
                                src={selectedPreviewMedia.src || ""}
                                alt={selectedPreviewMedia.alt || ""}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}