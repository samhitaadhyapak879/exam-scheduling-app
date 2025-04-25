package com.exam.entity;

import jakarta.persistence.*;

@Entity
public class Feedback {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private String strengths;
    private String weaknesses;

    @OneToOne
    @JoinColumn(name = "submission_id")
    private TestSubmission submission;

    public Feedback() {}

    public Feedback(String comment, String strengths, String weaknesses, TestSubmission submission) {
        this.comment = comment;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.submission = submission;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public TestSubmission getSubmission() { return submission; }
    public void setSubmission(TestSubmission submission) { this.submission = submission; }
}
