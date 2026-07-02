package com.intellistore.service;

import com.intellistore.dto.SearchResultDto;
import com.intellistore.entity.File;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FolderRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SearchService {

    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public SearchService(FileRepository fileRepository, FolderRepository folderRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SearchResultDto> searchFilesAndFolders(String query, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<SearchResultDto> results = new ArrayList<>();

        // Basic ILIKE search for now. Can be upgraded to tsvector or Elasticsearch.
        List<File> matchedFiles = fileRepository.findByOwnerAndNameContainingIgnoreCaseAndDeletedAtNull(user, query);
        for (File file : matchedFiles) {
            results.add(SearchResultDto.builder()
                    .id(file.getId())
                    .name(file.getName())
                    .type("FILE")
                    .mimeType(file.getMimeType())
                    .sizeBytes(file.getSizeBytes())
                    .parentFolderId(file.getFolder() != null ? file.getFolder().getId() : null)
                    .ownerName(file.getOwner().getFullName())
                    .createdAt(file.getCreatedAt().toString())
                    .build());
        }

        List<Folder> matchedFolders = folderRepository.findByOwnerAndNameContainingIgnoreCaseAndDeletedAtNull(user, query);
        for (Folder folder : matchedFolders) {
            results.add(SearchResultDto.builder()
                    .id(folder.getId())
                    .name(folder.getName())
                    .type("FOLDER")
                    .mimeType("inode/directory")
                    .sizeBytes(0)
                    .parentFolderId(folder.getParent() != null ? folder.getParent().getId() : null)
                    .ownerName(folder.getOwner().getFullName())
                    .createdAt(folder.getCreatedAt().toString())
                    .build());
        }

        return results;
    }
}
