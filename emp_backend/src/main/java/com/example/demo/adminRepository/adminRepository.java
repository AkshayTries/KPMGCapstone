package com.example.demo.adminRepository;

import com.example.demo.adminModel.adminModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface adminRepository extends JpaRepository<adminModel, Long> {
    Optional<adminModel> findByAdminNameAndAdminPassword(String adminName, String adminPassword);
}
