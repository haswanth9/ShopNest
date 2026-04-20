package com.shopnest.backend.controller;

import com.shopnest.backend.model.Address;
import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.AddressRepository;
import com.shopnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.get("fullName").toString());
        address.setPhone(request.get("phone").toString());
        address.setStreetAddress(request.get("streetAddress").toString());
        address.setCity(request.get("city").toString());
        address.setState(request.get("state").toString());
        address.setZipCode(request.get("zipCode").toString());
        address.setCountry(request.get("country").toString());
        address.setDefault(Boolean.parseBoolean(request.getOrDefault("isDefault", "false").toString()));

        addressRepository.save(address);
        return ResponseEntity.ok(Map.of("message", "Address added successfully!"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressRepository.findByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setFullName(request.get("fullName").toString());
        address.setPhone(request.get("phone").toString());
        address.setStreetAddress(request.get("streetAddress").toString());
        address.setCity(request.get("city").toString());
        address.setState(request.get("state").toString());
        address.setZipCode(request.get("zipCode").toString());
        address.setCountry(request.get("country").toString());

        addressRepository.save(address);
        return ResponseEntity.ok(Map.of("message", "Address updated!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Address deleted!"));
    }
}