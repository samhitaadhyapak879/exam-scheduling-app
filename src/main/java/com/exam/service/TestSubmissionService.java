package com.exam.service;
import com.exam.entity.Exam;
import com.exam.entity.Student;
import com.exam.entity.TestSubmission;
import com.exam.repository.TestSubmissionRepository;
import org.springframework.stereotype.Service;
import com.exam.repository.ExamRepository;
import com.exam.repository.StudentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TestSubmissionService {
	 private final TestSubmissionRepository submissionRepository;
	 private final StudentRepository studentRepository;
	 private final ExamRepository examRepository;

	 public TestSubmissionService(
	            TestSubmissionRepository submissionRepository,
	            StudentRepository studentRepository,
	            ExamRepository examRepository) {
	        this.submissionRepository = submissionRepository;
	        this.studentRepository = studentRepository;
	        this.examRepository = examRepository;
	    }
	 
	    public TestSubmission submitTest(TestSubmission submission) {
	        Long studentId = submission.getStudent().getId();
	        Long examId = submission.getExam().getId();

	        Student student = studentRepository.findById(studentId)
	            .orElseThrow(() -> new RuntimeException("Student not found"));

	        Exam exam = examRepository.findById(examId)
	            .orElseThrow(() -> new RuntimeException("Exam not found"));

	        submission.setStudent(student);
	        submission.setExam(exam);
	        submission.setStartTime(LocalDateTime.now());
	        
	        // Set back-references for answers
	        if (submission.getAnswers() != null) {
	            submission.getAnswers().forEach(answer -> answer.setTestSubmission(submission));
	        }

	        // Set back-reference for feedback
	        if (submission.getFeedback() != null) {
	            submission.getFeedback().setSubmission(submission);
	        }
	        
	        List<TestSubmission> existing = submissionRepository
	        	    .findByStudentIdAndExamId(submission.getStudent().getId(), submission.getExam().getId());

	        	if (!existing.isEmpty()) {
	        	    throw new RuntimeException("Test already submitted by student.");
	        	}


	        return submissionRepository.save(submission);
	    }


	    public List<TestSubmission> getAllSubmissions() {
	        return submissionRepository.findAll();
	    }
	    
	    public TestSubmission getSubmissionById(Long id) {
	        return submissionRepository.findById(id).orElseThrow();
	    }

	    public TestSubmission updateSubmission(TestSubmission submission) {
	        return submissionRepository.save(submission);
	    }
	    public List<TestSubmission> getSubmissionsByStudent(Long studentId) {
	        return submissionRepository.findByStudentId(studentId);
	    }


}
