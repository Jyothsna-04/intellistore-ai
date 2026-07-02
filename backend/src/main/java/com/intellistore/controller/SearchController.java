package com.intellistore.controller;

import com.intellistore.dto.ApiResponse;
import com.intellistore.dto.SearchResultDto;
import com.intellistore.security.UserDetailsImpl;
import com.intellistore.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SearchResultDto>>> search(@RequestParam String q) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<SearchResultDto> results = searchService.searchFilesAndFolders(q, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(results, "Search completed"));
    }
}
