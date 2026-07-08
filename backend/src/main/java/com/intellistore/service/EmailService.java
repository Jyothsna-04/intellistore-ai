package com.intellistore.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@Slf4j
public class EmailService {

    @Value("${resend.api.key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Value("${resend.from.email:${RESEND_FROM_EMAIL:IntelliStore AI <onboarding@resend.dev>}}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Welcome to IntelliStore AI - Verify Your Account";
        String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 16px;'>"
                + "<h1 style='color: #60a5fa; margin-bottom: 12px;'>Welcome to IntelliStore AI!</h1>"
                + "<p style='font-size: 16px; color: #cbd5e1; line-height: 1.5;'>Thank you for registering. Your account is ready for enterprise-grade AI cloud storage optimization.</p>"
                + "<div style='margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 12px;'>"
                + "<p style='margin: 0; font-size: 14px; color: #94a3b8;'>Verification Code / Token:</p>"
                + "<p style='margin: 8px 0 0; font-size: 18px; font-weight: bold; color: #38bdf8;'>" + token + "</p></div>"
                + "<a href='https://intellistore-ai.vercel.app/login' style='display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;'>Open IntelliStore AI</a>"
                + "</div>";

        sendResendEmail(toEmail, subject, html);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "IntelliStore AI - Password Reset Request";
        String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 16px;'>"
                + "<h1 style='color: #f87171; margin-bottom: 12px;'>Reset Your Password</h1>"
                + "<p style='font-size: 16px; color: #cbd5e1; line-height: 1.5;'>We received a request to reset your IntelliStore AI password. Use the token below:</p>"
                + "<div style='margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 12px;'>"
                + "<p style='margin: 0; font-size: 18px; font-weight: bold; color: #f87171;'>" + token + "</p></div>"
                + "</div>";

        sendResendEmail(toEmail, subject, html);
    }

    @Async
    public void sendShareNotificationEmail(String toEmail, String fileName, String sharedBy) {
        String subject = sharedBy + " shared a file with you on IntelliStore AI";
        String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 16px;'>"
                + "<h1 style='color: #60a5fa; margin-bottom: 12px;'>New Shared File</h1>"
                + "<p style='font-size: 16px; color: #cbd5e1; line-height: 1.5;'><b>" + sharedBy + "</b> has shared the file <b>" + fileName + "</b> with your account.</p>"
                + "<a href='https://intellistore-ai.vercel.app/files' style='display: inline-block; margin-top: 16px; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;'>View Shared Files</a>"
                + "</div>";

        sendResendEmail(toEmail, subject, html);
    }

    private void sendResendEmail(String toEmail, String subject, String html) {
        if (resendApiKey == null || resendApiKey.trim().isEmpty()) {
            log.info("[EmailService] RESEND_API_KEY not set. Simulated email to: {} | Subject: {}", toEmail, subject);
            return;
        }

        try {
            String escapedSubject = subject.replace("\"", "\\\"");
            String escapedHtml = html.replace("\"", "\\\"").replace("\r", "").replace("\n", "");

            String jsonBody = "{"
                    + "\"from\": \"" + fromEmail + "\","
                    + "\"to\": [\"" + toEmail + "\"],"
                    + "\"subject\": \"" + escapedSubject + "\","
                    + "\"html\": \"" + escapedHtml + "\""
                    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("[EmailService] Successfully sent email to {} via Resend API. Response: {}", toEmail, response.body());
            } else {
                log.error("[EmailService] Failed to send email to {}. Status: {} | Body: {}", toEmail, response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("[EmailService] Error calling Resend API for {}: {}", toEmail, e.getMessage());
        }
    }
}

