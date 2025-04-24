package com.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity

public class TestSubmission {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private int score;

	    private LocalDateTime startTime;
	    private LocalDateTime endTime;

	    @Column(length = 1000)
	    private String answers; // Could store JSON or pipe-separated string of selected options

	    @ManyToOne
	    @JoinColumn(name = "student_id")
	    private Student student;

	    @ManyToOne
	    @JoinColumn(name = "exam_id")
	    private Exam exam;

	    public TestSubmission() {}

	    public TestSubmission(int score, LocalDateTime startTime, LocalDateTime endTime, String answers, Student student, Exam exam) {
	        this.score = score;
	        this.startTime = startTime;
	        this.endTime = endTime;
	        this.answers = answers;
	        this.student = student;
	        this.exam = exam;
	    }

	    // Getters and Setters
	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }

	    public int getScore() { return score; }
	    public void setScore(int score) { this.score = score; }

	    public LocalDateTime getStartTime() { return startTime; }
	    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

	    public LocalDateTime getEndTime() { return endTime; }
	    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

	    public String getAnswers() { return answers; }
	    public void setAnswers(String answers) { this.answers = answers; }

	    public Student getStudent() { return student; }
	    public void setStudent(Student student) { this.student = student; }

	    public Exam getExam() { return exam; }
	    public void setExam(Exam exam) { this.exam = exam; }
}
