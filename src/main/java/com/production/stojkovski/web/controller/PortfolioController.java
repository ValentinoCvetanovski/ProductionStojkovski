package com.production.stojkovski.web.controller;

import com.production.stojkovski.model.PortfolioFolder;
import com.production.stojkovski.model.PortfolioMedia;
import com.production.stojkovski.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/folders")
    public List<PortfolioFolder> getFolders() {
        return portfolioService.getFolders();
    }

    @PostMapping("/folders")
    public ResponseEntity<PortfolioFolder> createFolder(
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("duration") String duration,
            @RequestParam("description") String description
    ) {
        PortfolioFolder savedFolder = portfolioService.createFolder(
                thumbnail,
                title,
                category,
                duration,
                description
        );

        return ResponseEntity.ok(savedFolder);
    }

    @GetMapping("/folders/{folderId}/media")
    public List<PortfolioMedia> getFolderMedia(@PathVariable Long folderId) {
        return portfolioService.getFolderMedia(folderId);
    }

    @PostMapping("/folders/{folderId}/media")
    public ResponseEntity<PortfolioMedia> addMediaToFolder(
            @PathVariable Long folderId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("alt") String alt
    ) {
        PortfolioMedia savedMedia = portfolioService.addMediaToFolder(folderId, file, alt);
        return ResponseEntity.ok(savedMedia);
    }

    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long folderId) {
        portfolioService.deleteFolder(folderId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId) {
        portfolioService.deleteMedia(mediaId);
        return ResponseEntity.noContent().build();
    }
}