package com.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

//import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
	    @JsonIgnoreProperties({"user", "schedules", "submissions"}) // ✅ prevent deep recursion
	    private Student student;

	    @ManyToOne
	    @JoinColumn(name = "exam_id", nullable = false)
	    @JsonIgnoreProperties({"questions", "schedules", "submissions", "subject"}) // ✅ prevent deep loop
	    private Exam exam;
	    
	    @OneToMany(mappedBy = "testSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference
	    private List<Answer> answers;
	    
	    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference
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
	    
	    public List<Answer> getAnswers() {
	        return answers;
	    }

	    public void setAnswers(List<Answer> answers) {
	        this.answers = answers;
	    }

	    public Feedback getFeedback() {
	        return feedback;
	    }

	    public void setFeedback(Feedback feedback) {
	        this.feedback = feedback;
	    }

}
