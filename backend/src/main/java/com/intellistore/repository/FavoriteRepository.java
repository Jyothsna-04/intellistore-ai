package com.intellistore.repository;

import com.intellistore.entity.Favorite;
import com.intellistore.entity.File;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndFile(User user, File file);
    Optional<Favorite> findByUserAndFolder(User user, Folder folder);
    boolean existsByUserAndFile(User user, File file);
    boolean existsByUserAndFolder(User user, Folder folder);
}
