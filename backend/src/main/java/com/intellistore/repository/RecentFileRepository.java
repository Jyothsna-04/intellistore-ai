package com.intellistore.repository;

import com.intellistore.entity.File;
import com.intellistore.entity.RecentFile;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecentFileRepository extends JpaRepository<RecentFile, UUID> {
    List<RecentFile> findFirst10ByUserOrderByAccessedAtDesc(User user);
    Optional<RecentFile> findByUserAndFile(User user, File file);
}
