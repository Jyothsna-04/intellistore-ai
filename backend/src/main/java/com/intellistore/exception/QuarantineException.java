package com.intellistore.exception;

public class QuarantineException extends RuntimeException {
    public QuarantineException(String message) {
        super(message);
    }
    public QuarantineException(String message, Throwable cause) {
        super(message, cause);
    }
}
