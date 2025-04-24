package com.exam.entity;

import jakarta.persistence.*;

@Entity
public class Question {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String questionText;
	    private String optionA;
	    private String optionB;
	    private String optionC;
	    private String optionD;

	    private String correctOption;

	    @ManyToOne
	    @JoinColumn(name = "subject_id")
	    private Subject subject;

	    @ManyToOne
	    @JoinColumn(name = "exam_id")
	    private Exam exam;

	    // Constructors
	    public Question() {}
	    
	    public Question(String questionText, String optionA, String optionB, String optionC, String optionD, String correctOption, Subject subject, Exam exam) {
	        this.questionText = questionText;
	        this.optionA = optionA;
	        this.optionB = optionB;
	        this.optionC = optionC;
	        this.optionD = optionD;
	        this.correctOption = correctOption;
	        this.subject = subject;
	        this.exam = exam;
	    }

	    // Getters and Setters
	    public Long getId() {
	        return id;
	    }

	    public void setId(Long id) {
	        this.id = id;
	    }

	    public String getQuestionText() {
	        return questionText;
	    }

	    public void setQuestionText(String questionText) {
	        this.questionText = questionText;
	    }

	    public String getOptionA() {
	        return optionA;
	    }

	    public void setOptionA(String optionA) {
	        this.optionA = optionA;
	    }

	    public String getOptionB() {
	        return optionB;
	    }

	    public void setOptionB(String optionB) {
	        this.optionB = optionB;
	    }

	    public String getOptionC() {
	        return optionC;
	    }

	    public void setOptionC(String optionC) {
	        this.optionC = optionC;
	    }

	    public String getOptionD() {
	        return optionD;
	    }

	    public void setOptionD(String optionD) {
	        this.optionD = optionD;
	    }

	    public String getCorrectOption() {
	        return correctOption;
	    }

	    public void setCorrectOption(String correctOption) {
	        this.correctOption = correctOption;
	    }

	    public Subject getSubject() {
	        return subject;
	    }

	    public void setSubject(Subject subject) {
	        this.subject = subject;
	    }

	    public Exam getExam() {
	        return exam;
	    }

	    public void setExam(Exam exam) {
	        this.exam = exam;
	    }

}
