package com.intellistore.repository;

import com.intellistore.entity.Tag;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    List<Tag> findByOwner(User owner);
    Optional<Tag> findByNameAndOwner(String name, User owner);
}
