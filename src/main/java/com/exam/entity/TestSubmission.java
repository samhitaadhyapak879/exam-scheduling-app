package com.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity

public class TestSubmission {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private int score;

	    private LocalDateTime startTime;
	    private LocalDateTime endTime;

	    @ManyToOne
	    @JoinColumn(name = "student_id", nullable = false)
	    private Student student;

	    @ManyToOne
	    @JoinColumn(name = "exam_id", nullable = false)
	    private Exam exam;
	    
	    @OneToMany(mappedBy = "testSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Answer> answers;
	    
	    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
	    private Feedback feedback;


	    public TestSubmission() {}

	    public TestSubmission(int score, LocalDateTime startTime, LocalDateTime endTime, Student student, Exam exam) {
	        this.score = score;
	        this.startTime = startTime;
	        this.endTime = endTime;
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

	    public Student getStudent() { return student; }
	    public void setStudent(Student student) { this.student = student; }

	    public Exam getExam() { return exam; }
	    public void setExam(Exam exam) { this.exam = exam; }
}
