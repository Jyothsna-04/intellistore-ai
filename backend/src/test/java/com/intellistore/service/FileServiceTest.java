package com.intellistore.service;

import com.intellistore.dto.FileDto;
import com.intellistore.entity.File;
import com.intellistore.entity.User;
import com.intellistore.exception.StorageException;
import com.intellistore.exception.VirusDetectedException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FileVersionRepository;
import com.intellistore.repository.FolderRepository;
import com.intellistore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileRepository fileRepository;

    @Mock
    private FileVersionRepository fileVersionRepository;

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MinioService minioService;

    @Mock
    private ClamAVClient clamAVClient;

    @Mock
    private EncryptionService encryptionService;

    @Mock
    private QuarantineService quarantineService;

    @InjectMocks
    private FileService fileService;

    private User testUser;
    private UUID ownerId;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID();
        testUser = User.builder()
                .id(ownerId)
                .email("test@intellistore.ai")
                .storageUsedBytes(0L)
                .storageQuotaBytes(10_000_000L)
                .build();
    }

    @Test
    void testUploadFileSuccessPipelineOrder() throws Exception {
        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World Data".getBytes());

        when(userRepository.findById(ownerId)).thenReturn(Optional.of(testUser));

        // 1. Virus scan does nothing (clean)
        doNothing().when(clamAVClient).scan(any(Path.class));

        // 4. Encrypt returns dummy path and IV
        Path dummyEncrypted = Files.createTempFile("enc_test_", ".tmp");
        Files.writeString(dummyEncrypted, "encrypted bytes");
        when(encryptionService.encrypt(any(Path.class))).thenReturn(new EncryptionService.EncryptionResult(dummyEncrypted, "dummyIV"));

        // 5. Minio upload
        doNothing().when(minioService).uploadFile(anyString(), any(InputStream.class), anyString(), anyLong());

        // Save repository
        when(fileRepository.save(any(File.class))).thenAnswer(invocation -> {
            File f = invocation.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });

        FileDto result = fileService.uploadFile(multipartFile, null, ownerId);

        assertNotNull(result);
        assertEquals("test.txt", result.getOriginalName());
        assertEquals("text/plain", result.getMimeType());

        verify(clamAVClient, times(1)).scan(any(Path.class));
        verify(encryptionService, times(1)).encrypt(any(Path.class));
        verify(minioService, times(1)).uploadFile(anyString(), any(InputStream.class), eq("text/plain"), anyLong());
        verify(fileRepository, times(1)).save(any(File.class));

        Files.deleteIfExists(dummyEncrypted);
    }

    @Test
    void testUploadFileVirusDetectedThrowsStorageExceptionAndQuarantines() throws Exception {
        MultipartFile multipartFile = new MockMultipartFile("file", "virus.exe", "application/octet-stream", "bad content".getBytes());

        when(userRepository.findById(ownerId)).thenReturn(Optional.of(testUser));

        doThrow(new VirusDetectedException("FOUND: Win.Test.EICAR_HDB-1")).when(clamAVClient).scan(any(Path.class));

        assertThrows(StorageException.class, () -> fileService.uploadFile(multipartFile, null, ownerId));

        verify(quarantineService, times(1)).quarantine(any(Path.class), eq("virus.exe"), eq(ownerId), eq("FOUND: Win.Test.EICAR_HDB-1"));
        verifyNoInteractions(encryptionService);
        verifyNoInteractions(minioService);
        verifyNoInteractions(fileRepository);
    }
}
