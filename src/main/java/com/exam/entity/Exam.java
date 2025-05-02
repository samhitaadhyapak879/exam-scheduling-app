package com.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDateTime examDate; // You can use LocalDateTime for date and time
    private int duration; // Duration in minutes
    
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Question> questions;
    
    @OneToMany(mappedBy = "exam")
    @JsonIgnore
    private List<TestSubmission> submissions;

    @OneToMany(mappedBy = "exam")
    @JsonIgnore
    private List<Schedule> schedules;



    // Constructors
    public Exam() {}

    public Exam(String name, LocalDateTime examDate, int duration, Subject subject) {
        this.name = name;
        this.examDate = examDate;
        this.duration = duration;
        this.subject = subject;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDateTime getExamDate() { return examDate; }
    public void setExamDate(LocalDateTime examDate) { this.examDate = examDate; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    
    public List<Schedule> getSchedules() {
        return schedules;
    }
    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }

    public List<Question> getQuestions() {
        return questions;
    }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<TestSubmission> getSubmissions() {
        return submissions;
    }
    public void setSubmissions(List<TestSubmission> submissions) {
        this.submissions = submissions;
    }

}
