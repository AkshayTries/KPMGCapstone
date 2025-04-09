// src/main/java/com/example/demo/controller/AnnouncementController.java
package com.example.demo.controller;

import com.example.demo.model.Announcement;
import com.example.demo.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:4200")  // Allow Angular app
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    // Get all announcements (sorted by newest first)
    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    // Create new announcement (Admin only)
    @PostMapping
    public Announcement createAnnouncement(
            @RequestBody Announcement announcement,
            @RequestHeader("Authorization") String token) {
        // Extract username from token (you'll need JWT parsing logic)
        String username = extractUsernameFromToken(token);  
        announcement.setCreatedBy(username);
        announcement.setCreatedAt(LocalDateTime.now());
        return announcementRepository.save(announcement);
    }

    // Delete announcement (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAnnouncement(@PathVariable Long id) {
        announcementRepository.deleteById(id);
    }

    // Helper method to extract username from JWT
    private String extractUsernameFromToken(String token) {
        // Implement your JWT parsing logic here
        return "admin";  // Placeholder (use real JWT parsing)
    }
}