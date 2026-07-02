package com.intellistore.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuarantineServiceTest {

    @Mock
    private MinioService minioService;

    @InjectMocks
    private QuarantineService quarantineService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(quarantineService, "quarantineBucket", "test-quarantine");
    }

    @Test
    void testQuarantineFileSuccess() throws Exception {
        Path tempFile = Files.createTempFile("infected_", ".txt");
        Files.writeString(tempFile, "SIMULATED_INFECTED_FILE_CONTENT_FOR_QUARANTINE_TEST");

        UUID ownerId = UUID.randomUUID();
        quarantineService.quarantine(tempFile, "eicar.exe", ownerId, "Eicar-Test-Signature");

        verify(minioService, times(1)).uploadToBucket(
                eq("test-quarantine"),
                contains(ownerId.toString()),
                any(InputStream.class),
                eq("application/octet-stream"),
                anyLong()
        );
        Files.deleteIfExists(tempFile);
    }
}
