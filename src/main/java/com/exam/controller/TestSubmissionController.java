package com.exam.controller;

import com.exam.entity.TestSubmission;
import com.exam.service.TestSubmissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class TestSubmissionController {
	 private final TestSubmissionService submissionService;

	    public TestSubmissionController(TestSubmissionService submissionService) {
	        this.submissionService = submissionService;
	    }

	    @PostMapping
	    public TestSubmission submitTest(@RequestBody TestSubmission submission) {
	        return submissionService.submitTest(submission);
	    }

	    @GetMapping
	    public List<TestSubmission> getAll() {
	        return submissionService.getAllSubmissions();
	    }
}
