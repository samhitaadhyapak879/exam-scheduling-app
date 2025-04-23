package com.exam.service;

import com.exam.entity.Exam;
import com.exam.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamService {
	 private final ExamRepository examRepository;

	    @Autowired
	    public ExamService(ExamRepository examRepository) {
	        this.examRepository = examRepository;
	    }

	    public Exam saveExam(Exam exam) {
	        return examRepository.save(exam);
	    }

	    public List<Exam> getAllExams() {
	        return examRepository.findAll();
	    }

	    public Optional<Exam> getExamById(Long id) {
	        return examRepository.findById(id);
	    }
}
