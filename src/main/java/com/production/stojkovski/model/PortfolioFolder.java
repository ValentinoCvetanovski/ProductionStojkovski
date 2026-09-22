package com.production.stojkovski.model;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class PortfolioFolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String duration;

    @Column(length = 2000)
    private String description;

    private String thumbnailSrc;
    private String alt;

    public PortfolioFolder() {
    }

    public PortfolioFolder(String title, String category, String duration, String description, String thumbnailSrc, String alt) {
        this.title = title;
        this.category = category;
        this.duration = duration;
        this.description = description;
        this.thumbnailSrc = thumbnailSrc;
        this.alt = alt;
    }
}