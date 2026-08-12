package com.production.stojkovski.repository;

import com.production.stojkovski.model.PortfolioProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
}