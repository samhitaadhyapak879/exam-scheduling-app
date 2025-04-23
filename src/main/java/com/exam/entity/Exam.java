package com.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String subject;
    private LocalDateTime examDate; // You can use LocalDateTime for date and time
    private int duration; // Duration in minutes

    // Constructors
    public Exam() {}

    public Exam(String name, String subject, LocalDateTime examDate, int duration) {
        this.name = name;
        this.subject = subject;
        this.examDate = examDate;
        this.duration = duration;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getExamDate() { return examDate; }
    public void setExamDate(LocalDateTime examDate) { this.examDate = examDate; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
