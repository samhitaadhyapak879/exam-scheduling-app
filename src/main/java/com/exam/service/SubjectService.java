package com.exam.service;

import com.exam.entity.Subject;
import com.exam.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {
	 @Autowired
	    private SubjectRepository subjectRepository;

	    public List<Subject> getAllSubjects() {
	        return subjectRepository.findAll();
	    }

	    public Subject createSubject(Subject subject) {
	        return subjectRepository.save(subject);
	    }

}
