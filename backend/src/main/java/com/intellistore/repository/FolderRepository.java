package com.intellistore.repository;

import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FolderRepository extends JpaRepository<Folder, UUID> {

    Optional<Folder> findByIdAndDeletedAtNull(UUID id);

    List<Folder> findByOwnerAndDeletedAtNull(User owner);

    List<Folder> findByOwnerAndParentAndDeletedAtNull(User owner, Folder parent);

    List<Folder> findByParentAndDeletedAtNull(Folder parent);

    boolean existsByNameAndParentAndOwnerAndDeletedAtNull(String name, Folder parent, User owner);

    List<Folder> findByOwnerAndNameContainingIgnoreCaseAndDeletedAtNull(User owner, String name);
}
