package com.exam.service;

import com.exam.entity.Exam;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import com.exam.repository.ScheduleRepository;
import com.exam.repository.TestSubmissionRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamService {
	 private final ExamRepository examRepository;
	 private final QuestionRepository questionRepository;
	 private final ScheduleRepository scheduleRepository;
	 private final TestSubmissionRepository testSubmissionRepository;
	 
	 public ExamService(
		        ExamRepository examRepository,
		        QuestionRepository questionRepository,
		        ScheduleRepository scheduleRepository,
		        TestSubmissionRepository testSubmissionRepository
		    ) {
		        this.examRepository = examRepository;
		        this.questionRepository = questionRepository;
		        this.scheduleRepository = scheduleRepository;
		        this.testSubmissionRepository = testSubmissionRepository;
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
	    
	    @Transactional
	    public void deleteExam(Long id) {
	    	 // Step 1: Delete related entities first
	        scheduleRepository.deleteAllByExamId(id);
	        testSubmissionRepository.deleteAllByExamId(id);
	        questionRepository.deleteAllByExamId(id);

	        // Step 2: Now delete the exam itself
	        examRepository.deleteById(id);
	    }

}
