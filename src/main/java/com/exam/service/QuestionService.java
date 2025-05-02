package com.exam.service;

import com.exam.entity.Question;
import com.exam.entity.Subject;
import com.exam.repository.QuestionRepository;
import com.exam.repository.SubjectRepository;

import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class QuestionService {
	private final QuestionRepository questionRepository;
	private final SubjectRepository subjectRepository;

	 public QuestionService(QuestionRepository questionRepository, SubjectRepository subjectRepository) {
	        this.questionRepository = questionRepository;
	        this.subjectRepository = subjectRepository;
	    }
	 
	 public Question addQuestion(Question question) {
	        if (question.getSubject() != null && question.getSubject().getId() != null) {
	            Subject subject = subjectRepository.findById(question.getSubject().getId())
	                    .orElseThrow(() -> new RuntimeException("Subject not found"));
	            question.setSubject(subject);
	        } else {
	            throw new RuntimeException("Subject ID is required");
	        }

	        return questionRepository.save(question);
	    }

   

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
    
    public List<Question> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }
    
    public List<Question> getQuestionsBySubject(Long subjectId) {
        return questionRepository.findBySubjectId(subjectId);
    }

    
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

}
