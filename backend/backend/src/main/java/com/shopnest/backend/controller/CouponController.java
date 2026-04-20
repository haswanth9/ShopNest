package com.shopnest.backend.controller;

import com.shopnest.backend.model.Coupon;
import com.shopnest.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @PostMapping
    public ResponseEntity<?> createCoupon(@RequestBody Map<String, Object> request) {
        if (couponRepository.existsByCode(request.get("code").toString())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coupon code already exists!"));
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.get("code").toString().toUpperCase());
        coupon.setDiscountPercentage(Double.parseDouble(request.get("discountPercentage").toString()));
        coupon.setMinOrderAmount(Double.parseDouble(request.get("minOrderAmount").toString()));
        coupon.setExpiryDate(LocalDateTime.parse(request.get("expiryDate").toString()));

        couponRepository.save(coupon);
        return ResponseEntity.ok(Map.of("message", "Coupon created successfully!"));
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase())
                .orElse(null);

        if (coupon == null) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid coupon code!"));
        }
        if (!coupon.isActive()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Coupon is inactive!"));
        }
        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Coupon has expired!"));
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "discountPercentage", coupon.getDiscountPercentage(),
                "minOrderAmount", coupon.getMinOrderAmount(),
                "message", "Coupon is valid!"
        ));
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted!"));
    }
}