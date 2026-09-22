package com.production.stojkovski.repository;

import com.production.stojkovski.model.PortfolioMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioMediaRepository extends JpaRepository<PortfolioMedia, Long> {
    List<PortfolioMedia> findByFolderIdOrderByIdDesc(Long folderId);
    void deleteByFolderId(Long folderId);
}