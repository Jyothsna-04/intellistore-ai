package com.intellistore.service;

import com.intellistore.exception.EncryptionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class EncryptionServiceTest {

    private EncryptionService encryptionService;
    private String testKeyBase64;

    @BeforeEach
    void setUp() {
        encryptionService = new EncryptionService();
        // 32-byte AES key base64 encoded
        byte[] keyBytes = new byte[32];
        for (int i = 0; i < 32; i++) keyBytes[i] = (byte) i;
        testKeyBase64 = Base64.getEncoder().encodeToString(keyBytes);
        ReflectionTestUtils.setField(encryptionService, "encryptionKeyBase64", testKeyBase64);
    }

    @Test
    void testEncryptAndDecryptSuccess() throws Exception {
        String plainText = "IntelliStore AI Enterprise Confidential Document Data";
        Path tempPlain = Files.createTempFile("test_plain_", ".txt");
        Files.writeString(tempPlain, plainText);

        EncryptionService.EncryptionResult result = encryptionService.encrypt(tempPlain);
        assertNotNull(result);
        assertNotNull(result.getIvBase64());
        assertTrue(Files.exists(result.getEncryptedFilePath()));

        byte[] encryptedBytes = Files.readAllBytes(result.getEncryptedFilePath());
        assertNotEquals(plainText, new String(encryptedBytes));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (InputStream in = new ByteArrayInputStream(encryptedBytes)) {
            encryptionService.decrypt(in, result.getIvBase64(), out);
        }

        assertEquals(plainText, out.toString());

        Files.deleteIfExists(tempPlain);
        Files.deleteIfExists(result.getEncryptedFilePath());
    }

    @Test
    void testEncryptMissingKeyThrowsException() {
        ReflectionTestUtils.setField(encryptionService, "encryptionKeyBase64", null);
        assertThrows(EncryptionException.class, () -> encryptionService.encrypt(Path.of("dummy")));
    }
}
