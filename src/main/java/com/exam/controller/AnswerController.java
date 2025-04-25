package com.exam.controller;

import com.exam.entity.Answer;
import com.exam.entity.Question;
import com.exam.entity.TestSubmission;
import com.exam.repository.QuestionRepository;
import com.exam.repository.TestSubmissionRepository;
import com.exam.service.AnswerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")

public class AnswerController {
	private final AnswerService answerService;
	private final QuestionRepository questionRepository;
	private final TestSubmissionRepository testSubmissionRepository;

    public AnswerController(AnswerService answerService,QuestionRepository questionRepository,
            TestSubmissionRepository testSubmissionRepository) {
        this.answerService = answerService;
        this.questionRepository = questionRepository;
        this.testSubmissionRepository = testSubmissionRepository;
    }

    @PostMapping
    public Answer submitAnswer(@RequestBody Answer answer) {
        Question fullQuestion = questionRepository.findById(answer.getQuestion().getId())
            .orElseThrow(() -> new RuntimeException("Question not found"));

        TestSubmission fullSubmission = testSubmissionRepository.findById(answer.getTestSubmission().getId())
            .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (!fullQuestion.getExam().getId().equals(fullSubmission.getExam().getId())) {
            throw new IllegalArgumentException("❌ Question does not belong to the same exam as the submission.");
        }

        // Replace references with fully fetched objects
        answer.setQuestion(fullQuestion);
        answer.setTestSubmission(fullSubmission);

        return answerService.saveAnswer(answer);
    }

    @GetMapping
    public List<Answer> getAllAnswers() {
        return answerService.getAllAnswers();
    }
    
    @GetMapping("/student/{studentId}")
    public List<Answer> getAnswersByStudent(@PathVariable Long studentId) {
        return answerService.getAnswersByStudent(studentId);
    }
    
    @GetMapping("/question/{questionId}")
    public List<Answer> getAnswersByQuestion(@PathVariable Long questionId) {
        return answerService.getAnswersByQuestion(questionId);
    }

    @GetMapping("/submission/{submissionId}")
    public List<Answer> getAnswersBySubmission(@PathVariable Long submissionId) {
        return answerService.getAnswersBySubmission(submissionId);
    }
    
    @GetMapping("/question/{questionId}/analytics")
    public Map<String, Long> getOptionAnalytics(@PathVariable Long questionId) {
        return answerService.getOptionCounts(questionId);
    }



}
