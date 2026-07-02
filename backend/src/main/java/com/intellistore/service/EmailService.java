package com.intellistore.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        log.info("Mock sending verification email to: {} with token: {}", toEmail, token);
        // Implementation for JavaMailSender goes here
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        log.info("Mock sending password reset email to: {} with token: {}", toEmail, token);
        // Implementation for JavaMailSender goes here
    }
}
