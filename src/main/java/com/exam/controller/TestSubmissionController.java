package com.exam.controller;

import com.exam.entity.TestSubmission;
import com.exam.service.TestSubmissionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class TestSubmissionController {
	 private final TestSubmissionService submissionService;

	    public TestSubmissionController(TestSubmissionService submissionService) {
	        this.submissionService = submissionService;
	    }
	    
	    @GetMapping("/{id}")
	    public TestSubmission getSubmissionById(@PathVariable Long id) {
	        return submissionService.getSubmissionById(id);
	    }


	    @PostMapping
	    public ResponseEntity<TestSubmission> submitTest(@RequestBody TestSubmission submission) {
	        TestSubmission saved = submissionService.submitTest(submission);
	        return ResponseEntity.ok(saved); // ✅ return full object as JSON
	    }


	    @GetMapping
	    public List<TestSubmission> getAll() {
	        return submissionService.getAllSubmissions();
	    }
	    
	    @PutMapping("/{id}")
	    public TestSubmission updateSubmission(@PathVariable Long id, @RequestBody TestSubmission updatedSubmission) {
	        TestSubmission existing = submissionService.getSubmissionById(id);
	        existing.setScore(updatedSubmission.getScore());
	        existing.setEndTime(updatedSubmission.getEndTime());
	        return submissionService.updateSubmission(existing);
	    }
	    
	    @GetMapping("/student/{studentId}")
	    public List<TestSubmission> getSubmissionsByStudent(@PathVariable Long studentId) {
	        return submissionService.getSubmissionsByStudent(studentId);
	    }


}
