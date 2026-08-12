package com.production.stojkovski.service;

import com.production.stojkovski.model.PortfolioProject;
import com.production.stojkovski.repository.PortfolioProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class PortfolioService {

    private final PortfolioProjectRepository repository;

    @Value("${portfolio.upload-dir}")
    private String uploadDir;

    @Value("${portfolio.public-url}")
    private String publicUrl;

    public PortfolioService(PortfolioProjectRepository repository) {
        this.repository = repository;
    }

    public List<PortfolioProject> getProjects() {
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(PortfolioProject::getId).reversed())
                .toList();
    }

    public PortfolioProject uploadMedia(
            MultipartFile file,
            String title,
            String category,
            String duration,
            String description
    ) {
        try {
            Files.createDirectories(Path.of(uploadDir));

            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = Path.of(uploadDir).resolve(fileName).toAbsolutePath().normalize();

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String contentType = file.getContentType();
            String type = contentType != null && contentType.startsWith("video") ? "video" : "image";

            String categorySlug = category.toLowerCase()
                    .replace("&", " ")
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-|-$", "");

            PortfolioProject project = new PortfolioProject(
                    type,
                    publicUrl + "/uploads/" + fileName,
                    category,
                    categorySlug + " custom " + type,
                    title,
                    duration,
                    description,
                    title
            );

            return repository.save(project);
        } catch (Exception e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    public void deleteProject(Long id) {
        repository.deleteById(id);
    }
}
