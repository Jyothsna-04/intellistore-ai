package com.intellistore.service;

import com.intellistore.exception.EncryptionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Value("${encryption.key}")
    private String encryptionKeyBase64;

    public static class EncryptionResult {
        private final Path encryptedFilePath;
        private final String ivBase64;

        public EncryptionResult(Path encryptedFilePath, String ivBase64) {
            this.encryptedFilePath = encryptedFilePath;
            this.ivBase64 = ivBase64;
        }

        public Path getEncryptedFilePath() {
            return encryptedFilePath;
        }

        public String getIvBase64() {
            return ivBase64;
        }
    }

    /**
     * Encrypts a temporary file using AES-256-GCM.
     * @param plainTextFile The input file.
     * @return EncryptionResult containing the path to the newly created encrypted file and the IV.
     */
    public EncryptionResult encrypt(Path plainTextFile) {
        if (encryptionKeyBase64 == null || encryptionKeyBase64.isEmpty()) {
            throw new EncryptionException("Encryption key is not configured.");
        }

        try {
            byte[] keyBytes = Base64.getDecoder().decode(encryptionKeyBase64);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

            Path encryptedFile = Files.createTempFile("encrypted_", ".tmp");

            try (InputStream in = Files.newInputStream(plainTextFile);
                 OutputStream out = Files.newOutputStream(encryptedFile);
                 CipherInputStream cipherIn = new CipherInputStream(in, cipher)) {

                byte[] buffer = new byte[8192];
                int read;
                while ((read = cipherIn.read(buffer)) >= 0) {
                    out.write(buffer, 0, read);
                }
            }

            return new EncryptionResult(encryptedFile, Base64.getEncoder().encodeToString(iv));
        } catch (Exception e) {
            throw new EncryptionException("Failed to encrypt file", e);
        }
    }

    /**
     * Decrypts an encrypted input stream using AES-256-GCM and writes to out.
     */
    public void decrypt(InputStream encryptedStream, String ivBase64, OutputStream out) {
        if (encryptionKeyBase64 == null || encryptionKeyBase64.isEmpty()) {
            throw new EncryptionException("Encryption key is not configured.");
        }

        try {
            byte[] keyBytes = Base64.getDecoder().decode(encryptionKeyBase64);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            byte[] iv = Base64.getDecoder().decode(ivBase64);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

            try (CipherInputStream cipherIn = new CipherInputStream(encryptedStream, cipher)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = cipherIn.read(buffer)) >= 0) {
                    out.write(buffer, 0, read);
                }
            }
        } catch (Exception e) {
            throw new EncryptionException("Failed to decrypt file", e);
        }
    }
}
