package com.exam.service;

import com.exam.entity.Feedback;
import com.exam.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class FeedbackService {
	private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    // ✅ Save feedback
    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // ✅ Get all feedbacks
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    // ✅ Get feedback by submission ID
    public Feedback getFeedbackBySubmissionId(Long submissionId) {
        return feedbackRepository.findBySubmissionId(submissionId);
    }
}
