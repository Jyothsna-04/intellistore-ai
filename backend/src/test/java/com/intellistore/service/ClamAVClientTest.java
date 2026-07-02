package com.intellistore.service;

import com.intellistore.exception.ClamAVUnavailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class ClamAVClientTest {

    private ClamAVClient clamAVClient;

    @BeforeEach
    void setUp() {
        clamAVClient = new ClamAVClient();
        ReflectionTestUtils.setField(clamAVClient, "host", "localhost");
        ReflectionTestUtils.setField(clamAVClient, "port", 3310);
        ReflectionTestUtils.setField(clamAVClient, "timeoutMs", 2000);
    }

    @Test
    void testScanOfflineThrowsClamAVUnavailableException() throws Exception {
        Path tempFile = Files.createTempFile("scan_test_", ".txt");
        Files.writeString(tempFile, "clean file content");

        // When clamd container is offline during test build, scan should throw ClamAVUnavailableException
        assertThrows(ClamAVUnavailableException.class, () -> clamAVClient.scan(tempFile));

        Files.deleteIfExists(tempFile);
    }
}
