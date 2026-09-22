package com.production.stojkovski.repository;

import com.production.stojkovski.model.PortfolioFolder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioFolderRepository extends JpaRepository<PortfolioFolder, Long> {
}