package com.exam.controller;

import com.exam.entity.Exam;
import com.exam.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {
	 private final ExamService examService;

	    @Autowired
	    public ExamController(ExamService examService) {
	        this.examService = examService;
	    }

	    @PostMapping
	    public Exam addExam(@RequestBody Exam exam) {
	        return examService.saveExam(exam);
	    }

	    @GetMapping
	    public List<Exam> getAllExams() {
	        return examService.getAllExams();
	    }
}
