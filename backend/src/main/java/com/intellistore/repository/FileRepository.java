package com.intellistore.repository;

import com.intellistore.entity.File;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FileRepository extends JpaRepository<File, UUID> {

    Optional<File> findByIdAndDeletedAtNull(UUID id);

    Page<File> findByOwnerAndDeletedAtNull(User owner, Pageable pageable);

    List<File> findByFolderAndDeletedAtNull(Folder folder);

    List<File> findByOwnerAndFolderAndDeletedAtNull(User owner, Folder folder);

    Optional<File> findByOwnerAndNameAndFolderAndDeletedAtNull(User owner, String name, Folder folder);

    Page<File> findByOwnerAndDeletedAtNotNull(User owner, Pageable pageable);

    List<File> findByChecksumSha256AndDeletedAtNull(String checksumSha256);

    Optional<File> findByIdAndOwnerAndDeletedAtNull(UUID id, User owner);

    Optional<File> findByIdAndOwnerAndDeletedAtNotNull(UUID id, User owner);

    List<File> findByOwnerAndNameContainingIgnoreCaseAndDeletedAtNull(User owner, String name);

    List<File> findByOwnerAndDeletedAtNotNull(User owner);
}
