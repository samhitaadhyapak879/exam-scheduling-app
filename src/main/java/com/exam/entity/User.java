package com.exam.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "users")

public class User {
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String username;
	    private String email;
	    private String password;
	    private String role; // STUDENT or ADMIN
	    
	    private String resetToken; // For password reset link
	    
	 // ✅ Add this if Student is linked to User
	    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	    @JsonManagedReference
	    private Student student;

	    // Constructors
	    public User() {}

	    public User(String username, String email, String password, String role) {
	        this.username = username;
	        this.email = email;
	        this.password = password;
	        this.role = role;
	    }

	    // Getters and setters
	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }

	    public String getUsername() { return username; }
	    public void setUsername(String username) { this.username = username; }

	    public String getEmail() { return email; }
	    public void setEmail(String email) { this.email = email; }

	    public String getPassword() { return password; }
	    public void setPassword(String password) { this.password = password; }

	    public String getRole() { return role; }
	    public void setRole(String role) { this.role = role; }
	    
	    public String getResetToken() {
	        return resetToken;
	    }

	    public void setResetToken(String resetToken) {
	        this.resetToken = resetToken;
	    }

	    public Student getStudent() {
	        return student;
	    }

	    public void setStudent(Student student) {
	        this.student = student;
	    }

}
