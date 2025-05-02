package com.exam.controller;

import com.exam.dto.RegistrationRequest;
import com.exam.entity.Student;
import com.exam.entity.User;
import com.exam.repository.StudentRepository;
import com.exam.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepo;
    private final StudentRepository studentRepo;

    public AuthController(UserRepository userRepo, StudentRepository studentRepo) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // NOTE: You can hash this later
        user.setRole(request.getRole().toUpperCase());

        User savedUser = userRepo.save(user);

        if (request.getRole().equalsIgnoreCase("STUDENT")) {
            Student student = new Student();
            student.setName(request.getName());
            student.setUsn(request.getUsn());
            student.setEmail(request.getEmail());
            student.setUser(savedUser);
            studentRepo.save(student);
        }

        return ResponseEntity.ok("User registered successfully");
    }
}
