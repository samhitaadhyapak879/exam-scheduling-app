package com.exam.dto;

public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
    private String role; // "ADMIN" or "STUDENT"

    // Only for students
    private String name;
    private String usn;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

   

    public String getUsn() { return usn; }
    public void setUsn(String usn) { this.usn = usn; }
}
