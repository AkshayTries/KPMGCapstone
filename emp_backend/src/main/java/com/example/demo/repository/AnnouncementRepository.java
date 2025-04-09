// src/main/java/com/example/demo/repository/AnnouncementRepository.java
package com.example.demo.repository;

import com.example.demo.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();  // Newest first
}