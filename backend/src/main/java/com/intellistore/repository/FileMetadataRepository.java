package com.intellistore.repository;

import com.intellistore.entity.File;
import com.intellistore.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    Optional<FileMetadata> findByFile(File file);
}
