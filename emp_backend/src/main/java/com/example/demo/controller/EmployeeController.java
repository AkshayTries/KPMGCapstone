package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.TextAlignment;

@RestController
@RequestMapping("/api/v1/")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;
    
    private final Path rootLocation = Paths.get("uploads");
    
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder");
        }
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/employees")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping(value = "/employees", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Employee createEmployee(
            @RequestPart("employee") Employee employee,
            @RequestPart(value = "photo", required = false) MultipartFile file) {
        
        if (file != null && !file.isEmpty()) {
            try {
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
                employee.setPhotoPath(filename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to store file: " + e.getMessage());
            }
        }
        return employeeRepository.save(employee);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getByID(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " does not exist"));
        return ResponseEntity.ok(employee);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping(value = "/employees/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Employee> updateEmployeeByID(
            @PathVariable Long id,
            @RequestPart("employee") String employeeJson,
            @RequestPart(value = "photo", required = false) MultipartFile file) throws IOException {
        
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " does not exist"));

        // Parse the JSON string to Employee object
        ObjectMapper objectMapper = new ObjectMapper();
        Employee updateData = objectMapper.readValue(employeeJson, Employee.class);
        
        employee.setFname(updateData.getFname());
        employee.setLname(updateData.getLname());
        employee.setEmail(updateData.getEmail());
        employee.setDepartment(updateData.getDepartment());
        employee.setDesignation(updateData.getDesignation());
        employee.setJoiningDate(updateData.getJoiningDate());
        employee.setSalary(updateData.getSalary());

        if (file != null && !file.isEmpty()) {
            try {
                if (employee.getPhotoPath() != null) {
                    Files.deleteIfExists(this.rootLocation.resolve(employee.getPhotoPath()));
                }
                
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
                employee.setPhotoPath(filename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to update file: " + e.getMessage());
            }
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(updatedEmployee);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " does not exist"));
        
        if (employee.getPhotoPath() != null) {
            try {
                Files.deleteIfExists(this.rootLocation.resolve(employee.getPhotoPath()));
            } catch (IOException e) {
                System.err.println("Failed to delete photo file: " + e.getMessage());
            }
        }
        
        employeeRepository.delete(employee);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("Deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping(value = "/employees/download-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadEmployeePDF() throws IOException {
        List<Employee> employees = employeeRepository.findAll();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
        Document document = new Document(pdf);
        
        // Add title
        Paragraph title = new Paragraph("Employee List")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(20);
        document.add(title);
        document.add(new Paragraph("\n"));
        
        // Create table
        Table table = new Table(7);
        table.setWidth(UnitValue.createPercentValue(100));
        
        // Add headers
        table.addHeaderCell("ID");
        table.addHeaderCell("Name");
        table.addHeaderCell("Email");
        table.addHeaderCell("Department");
        table.addHeaderCell("Designation");
        table.addHeaderCell("Salary");
        table.addHeaderCell("Joining Date");
        
        // Add data
        for (Employee employee : employees) {
            table.addCell(String.valueOf(employee.getId()));
            table.addCell(employee.getFname() + " " + employee.getLname());
            table.addCell(employee.getEmail());
            table.addCell(employee.getDepartment());
            table.addCell(employee.getDesignation());
            table.addCell(String.valueOf(employee.getSalary()));
            table.addCell(employee.getJoiningDate().toString());
        }
        
        document.add(table);
        document.close();
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employees.pdf")
            .body(baos.toByteArray());
    }
}