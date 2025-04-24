package com.exam.service;
import com.exam.entity.TestSubmission;
import com.exam.repository.TestSubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestSubmissionService {
	 private final TestSubmissionRepository submissionRepository;

	    public TestSubmissionService(TestSubmissionRepository submissionRepository) {
	        this.submissionRepository = submissionRepository;
	    }

	    public TestSubmission submitTest(TestSubmission submission) {
	        return submissionRepository.save(submission);
	    }

	    public List<TestSubmission> getAllSubmissions() {
	        return submissionRepository.findAll();
	    }
}
