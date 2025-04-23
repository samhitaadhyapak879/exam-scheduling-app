package com.exam.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String name;

	    // Constructors
	    public Subject() {}
	    public Subject(String name) {
	        this.name = name;
	    }

	    // Getters and Setters
	    public Long getId() {
	        return id;
	    }

	    public String getName() {
	        return name;
	    }

	    public void setName(String name) {
	        this.name = name;
	    }
}
