package com.intellistore.exception;

public class ClamAVUnavailableException extends RuntimeException {
    public ClamAVUnavailableException(String message) {
        super(message);
    }
    public ClamAVUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
