package com.shopnest.backend.controller;

import com.shopnest.backend.model.Product;
import com.shopnest.backend.model.User;
import com.shopnest.backend.model.WishlistItem;
import com.shopnest.backend.repository.ProductRepository;
import com.shopnest.backend.repository.UserRepository;
import com.shopnest.backend.repository.WishlistItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long productId = Long.valueOf(request.get("productId").toString());

        if (wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already in wishlist!"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);

        wishlistItemRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Added to wishlist!"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistItem>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistItemRepository.findByUserId(userId));
    }

    @DeleteMapping("/{userId}/{productId}")
    @Transactional
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist!"));
    }
}