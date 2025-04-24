package com.exam.entity;

import jakarta.persistence.*;

@Entity
public class Answer {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String selectedOption;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "submission_id")
    private TestSubmission testSubmission;
    

    public Answer() {}

    public Answer(String selectedOption, Question question, Student student) {
        this.selectedOption = selectedOption;
        this.question = question;
        this.student = student;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    
    public TestSubmission getTestSubmission() { return testSubmission; }
    public void setTestSubmission(TestSubmission testSubmission) {
        this.testSubmission = testSubmission;
    }
}
