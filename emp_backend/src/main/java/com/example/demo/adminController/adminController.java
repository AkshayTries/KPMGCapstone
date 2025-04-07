package com.example.demo.adminController;

import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.Collections;
import org.springframework.web.bind.annotation.*; // if not already imported

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.adminModel.adminModel;
import com.example.demo.adminRepository.adminRepository;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "http://localhost:4200") // optional: for CORS issues
public class adminController {

    @Autowired
    private adminRepository repo;

    // Get all admins
    @GetMapping("/admin")
    public List<adminModel> getAllAdmins() {
        return repo.findAll();
    }

    // Register new admin (POST)
   @PostMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE)
@ResponseBody
public Map<String, String> registerAdmin(@RequestBody adminModel admin) {
    Map<String, String> response = new HashMap<>();
    try {
        repo.save(admin);
        response.put("message", "Admin registered successfully");
    } catch (Exception e) {
        e.printStackTrace();
        response.put("message", "Error registering admin");
    }
    return response;
}
@PostMapping("/login")
public ResponseEntity<?> loginAdmin(@RequestBody adminModel admin) {
    Optional<adminModel> existingAdmin = repo.findByAdminNameAndAdminPassword(
    admin.getAdminName(), admin.getAdminPassword()
);


    if (existingAdmin.isPresent()) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("adminName", existingAdmin.get().getAdminName());
        return ResponseEntity.ok().body(response);
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid credentials"));
    }
}



}
