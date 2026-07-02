package com.intellistore.service;

import com.intellistore.dto.FolderCreateRequest;
import com.intellistore.dto.FolderDto;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.repository.FolderRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderService(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FolderDto createFolder(FolderCreateRequest request, UUID ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder parent = null;
        String newPath = "/" + request.getName();

        if (request.getParentId() != null) {
            parent = folderRepository.findByIdAndDeletedAtNull(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
            newPath = parent.getPath() + "/" + request.getName();
        }

        if (folderRepository.existsByNameAndParentAndOwnerAndDeletedAtNull(request.getName(), parent, owner)) {
            throw new RuntimeException("Folder already exists in this location");
        }

        Folder folder = Folder.builder()
                .name(request.getName())
                .parent(parent)
                .owner(owner)
                .path(newPath)
                .build();

        Folder savedFolder = folderRepository.save(folder);
        return mapToFolderDto(savedFolder);
    }

    @Transactional(readOnly = true)
    public List<FolderDto> getFoldersByParent(UUID parentId, UUID ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Folder> folders;
        if (parentId == null) {
            folders = folderRepository.findByOwnerAndParentAndDeletedAtNull(owner, null);
        } else {
            Folder parent = folderRepository.findByIdAndDeletedAtNull(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
            folders = folderRepository.findByOwnerAndParentAndDeletedAtNull(owner, parent);
        }

        return folders.stream()
                .map(this::mapToFolderDto)
                .collect(Collectors.toList());
    }

    private FolderDto mapToFolderDto(Folder folder) {
        return FolderDto.builder()
                .id(folder.getId())
                .name(folder.getName())
                .parentId(folder.getParent() != null ? folder.getParent().getId() : null)
                .ownerId(folder.getOwner().getId())
                .path(folder.getPath())
                .isShared(folder.isShared())
                .createdAt(folder.getCreatedAt().toString())
                .updatedAt(folder.getUpdatedAt().toString())
                .build();
    }
}
