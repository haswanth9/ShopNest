package com.shopnest.backend.controller;

import com.shopnest.backend.model.Category;
import com.shopnest.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> request) {
        String name = request.get("name").toString();

        if (categoryRepository.existsByName(name)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Category already exists!"));
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(request.get("description").toString());
        category.setImageUrl(request.getOrDefault("imageUrl", "").toString());

        if (request.containsKey("parentId") && request.get("parentId") != null) {
            Long parentId = Long.valueOf(request.get("parentId").toString());
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }

        categoryRepository.save(category);
        return ResponseEntity.ok(Map.of("message", "Category created successfully!"));
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findByParentIsNull());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(category);
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<Category>> getSubCategories(@PathVariable Long id) {
        return ResponseEntity.ok(categoryRepository.findByParentId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted!"));
    }
}