package com.production.stojkovski.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class PortfolioMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String src;
    private String alt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    @JsonIgnore
    private PortfolioFolder folder;

    public PortfolioMedia() {
    }

    public PortfolioMedia(String type, String src, String alt, PortfolioFolder folder) {
        this.type = type;
        this.src = src;
        this.alt = alt;
        this.folder = folder;
    }
}