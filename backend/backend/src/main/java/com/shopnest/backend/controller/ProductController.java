package com.shopnest.backend.controller;

import com.shopnest.backend.model.Product;
import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.ProductRepository;
import com.shopnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> request) {
        Long sellerId = Long.valueOf(request.get("sellerId").toString());
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = new Product();
        product.setName(request.get("name").toString());
        product.setDescription(request.get("description").toString());
        product.setPrice(Double.parseDouble(request.get("price").toString()));
        product.setQuantity(Integer.parseInt(request.get("quantity").toString()));
        product.setCategory(request.get("category").toString());
        product.setImageUrl(request.get("imageUrl").toString());
        product.setSeller(seller);

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product added successfully!"));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(name));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productRepository.findByCategory(category));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(productRepository.findBySellerId(sellerId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String keyword) {

        List<Product> products = productRepository.findAll();

        if (keyword != null && !keyword.isEmpty()) {
            String lowerKeyword = keyword.toLowerCase();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(lowerKeyword)
                            || p.getDescription().toLowerCase().contains(lowerKeyword))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price_asc":
                    products.sort((a, b) -> Double.compare(a.getPrice(), b.getPrice()));
                    break;
                case "price_desc":
                    products.sort((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
                    break;
                case "name_asc":
                    products.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
                    break;
                case "name_desc":
                    products.sort((a, b) -> b.getName().compareToIgnoreCase(a.getName()));
                    break;
            }
        }

        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.get("name").toString());
        product.setDescription(request.get("description").toString());
        product.setPrice(Double.parseDouble(request.get("price").toString()));
        product.setQuantity(Integer.parseInt(request.get("quantity").toString()));
        product.setCategory(request.get("category").toString());
        product.setImageUrl(request.get("imageUrl").toString());

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product updated successfully!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted!"));
    }
}