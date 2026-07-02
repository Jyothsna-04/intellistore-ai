package com.intellistore.repository;

import com.intellistore.entity.File;
import com.intellistore.entity.FileVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FileVersionRepository extends JpaRepository<FileVersion, UUID> {
    List<FileVersion> findByFileOrderByVersionNumberDesc(File file);
    Optional<FileVersion> findByFileAndVersionNumber(File file, int versionNumber);
}
