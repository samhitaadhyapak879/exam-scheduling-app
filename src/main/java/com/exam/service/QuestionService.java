package com.exam.service;

import com.exam.entity.Question;
import com.exam.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class QuestionService {
	private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    public List<Question> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }

}
