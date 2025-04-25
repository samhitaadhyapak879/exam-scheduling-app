package com.exam.controller;

import com.exam.entity.Feedback;
import com.exam.service.FeedbackService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
	private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }
    
    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }


    @PostMapping
    public Feedback saveFeedback(@RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @GetMapping("/submission/{submissionId}")
    public Feedback getBySubmission(@PathVariable Long submissionId) {
        return feedbackService.getFeedbackBySubmissionId(submissionId);
    }
}
