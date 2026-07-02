package com.intellistore.repository;

import com.intellistore.entity.File;
import com.intellistore.entity.FileShare;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FileShareRepository extends JpaRepository<FileShare, UUID> {
    Optional<FileShare> findByShareTokenAndIsActiveTrue(String shareToken);
    List<FileShare> findBySharedWithAndIsActiveTrue(User sharedWith);
    List<FileShare> findBySharedByAndIsActiveTrue(User sharedBy);
    Optional<FileShare> findByFileAndSharedWithAndIsActiveTrue(File file, User sharedWith);
    Optional<FileShare> findByFolderAndSharedWithAndIsActiveTrue(Folder folder, User sharedWith);
    List<FileShare> findByFileAndIsActiveTrue(File file);
    List<FileShare> findByFolderAndIsActiveTrue(Folder folder);
}
