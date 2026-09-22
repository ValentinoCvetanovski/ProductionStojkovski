package com.production.stojkovski.service;

import com.production.stojkovski.model.PortfolioFolder;
import com.production.stojkovski.model.PortfolioMedia;
import com.production.stojkovski.repository.PortfolioFolderRepository;
import com.production.stojkovski.repository.PortfolioMediaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class PortfolioService {

    private final PortfolioFolderRepository folderRepository;
    private final PortfolioMediaRepository mediaRepository;

    @Value("${portfolio.upload-dir}")
    private String uploadDir;

    @Value("${portfolio.public-url}")
    private String publicUrl;

    public PortfolioService(
            PortfolioFolderRepository folderRepository,
            PortfolioMediaRepository mediaRepository
    ) {
        this.folderRepository = folderRepository;
        this.mediaRepository = mediaRepository;
    }

    public List<PortfolioFolder> getFolders() {
        return folderRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(PortfolioFolder::getId).reversed())
                .toList();
    }

    public PortfolioFolder createFolder(
            MultipartFile thumbnail,
            String title,
            String category,
            String duration,
            String description
    ) {
        try {
            String thumbnailUrl = saveFile(thumbnail);

            PortfolioFolder folder = new PortfolioFolder(
                    title,
                    category,
                    duration,
                    description,
                    thumbnailUrl,
                    title
            );

            return folderRepository.save(folder);
        } catch (Exception e) {
            throw new RuntimeException("Folder creation failed", e);
        }
    }

    public List<PortfolioMedia> getFolderMedia(Long folderId) {
        return mediaRepository.findByFolderIdOrderByIdDesc(folderId);
    }

    public PortfolioMedia addMediaToFolder(Long folderId, MultipartFile file, String alt) {
        try {
            PortfolioFolder folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("Folder not found"));

            String fileUrl = saveFile(file);
            String contentType = file.getContentType();
            String type = contentType != null && contentType.startsWith("video") ? "video" : "image";

            PortfolioMedia media = new PortfolioMedia(
                    type,
                    fileUrl,
                    alt,
                    folder
            );

            return mediaRepository.save(media);
        } catch (Exception e) {
            throw new RuntimeException("Media upload failed", e);
        }
    }
    @Transactional
    public void deleteFolder(Long folderId) {
        mediaRepository.deleteByFolderId(folderId);
        folderRepository.deleteById(folderId);
    }

    public void deleteMedia(Long mediaId) {
        mediaRepository.deleteById(mediaId);
    }

    private String saveFile(MultipartFile file) throws Exception {
        Files.createDirectories(Path.of(uploadDir));

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = Path.of(uploadDir).resolve(fileName).toAbsolutePath().normalize();

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return publicUrl + "/uploads/" + fileName;
    }
}