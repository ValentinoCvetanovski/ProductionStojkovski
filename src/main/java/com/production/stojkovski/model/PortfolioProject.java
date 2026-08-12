package com.production.stojkovski.model;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class PortfolioProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String src;
    private String category;
    private String data;
    private String title;
    private String duration;

    @Column(length = 2000)
    private String description;

    private String alt;

    public PortfolioProject() {
    }

    public PortfolioProject(String type, String src, String category, String data, String title, String duration, String description, String alt) {
        this.type = type;
        this.src = src;
        this.category = category;
        this.data = data;
        this.title = title;
        this.duration = duration;
        this.description = description;
        this.alt = alt;
    }

}
