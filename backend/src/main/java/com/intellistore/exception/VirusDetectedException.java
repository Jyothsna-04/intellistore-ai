package com.intellistore.exception;

public class VirusDetectedException extends RuntimeException {
    public VirusDetectedException(String message) {
        super(message);
    }
    public VirusDetectedException(String message, Throwable cause) {
        super(message, cause);
    }
}
