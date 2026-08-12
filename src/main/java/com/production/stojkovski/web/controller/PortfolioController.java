package com.production.stojkovski.web.controller;

import com.production.stojkovski.model.PortfolioProject;
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

    @GetMapping
    public List<PortfolioProject> getProjects() {
        return portfolioService.getProjects();
    }

    @PostMapping("/upload")
    public ResponseEntity<PortfolioProject> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("duration") String duration,
            @RequestParam("description") String description
    ) {
        PortfolioProject savedProject = portfolioService.uploadMedia(
                file,
                title,
                category,
                duration,
                description
        );

        return ResponseEntity.ok(savedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        portfolioService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}