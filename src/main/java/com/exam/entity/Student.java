package com.exam.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String usn;

    @Column(unique = true)
    private String email;

    // Link to User entity
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestSubmission> submissions;


    // Placeholder for future scheduling (we’ll create Schedule entity soon)
     @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
     private List<Schedule> schedules;

    // Constructors
    public Student() {}

    public Student(String name, String usn, String email, User user) {
        this.name = name;
        this.usn = usn;
        this.email = email;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsn() { return usn; }
    public void setUsn(String usn) { this.usn = usn; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
