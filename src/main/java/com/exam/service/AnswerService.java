package com.exam.service;
import com.exam.entity.Answer;
import com.exam.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnswerService {
	private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer saveAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }
    
    public List<Answer> getAnswersByStudent(Long studentId) {
        return answerRepository.findByStudentId(studentId);
    }
    
    public List<Answer> getAnswersByQuestion(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public List<Answer> getAnswersBySubmission(Long submissionId) {
        return answerRepository.findByTestSubmissionId(submissionId);
    }

    public Map<String, Long> getOptionCounts(Long questionId) {
        List<Object[]> results = answerRepository.countAnswersByOption(questionId);
        Map<String, Long> counts = new HashMap<>();

        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }

        return counts;
    }


}
