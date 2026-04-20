package com.shopnest.backend.controller;

import com.shopnest.backend.model.Address;
import com.shopnest.backend.model.Order;
import com.shopnest.backend.model.Shipping;
import com.shopnest.backend.repository.AddressRepository;
import com.shopnest.backend.repository.OrderRepository;
import com.shopnest.backend.repository.ShippingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingRepository shippingRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;

    @PostMapping
    public ResponseEntity<?> createShipment(@RequestBody Map<String, Object> request) {
        Long orderId = Long.valueOf(request.get("orderId").toString());
        Long addressId = Long.valueOf(request.get("addressId").toString());
        String carrier = request.get("carrier").toString();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (shippingRepository.findByOrderId(orderId).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Shipment already exists for this order!"));
        }

        Shipping shipping = new Shipping();
        shipping.setOrder(order);
        shipping.setAddress(address);
        shipping.setCarrier(carrier);
        shipping.setShippedDate(LocalDateTime.now());
        shipping.setEstimatedDelivery(LocalDateTime.now().plusDays(5));

        shippingRepository.save(shipping);

        order.setStatus("SHIPPED");
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of(
                "message", "Shipment created!",
                "trackingNumber", shipping.getTrackingNumber(),
                "estimatedDelivery", shipping.getEstimatedDelivery().toString()
        ));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getShipmentByOrder(@PathVariable Long orderId) {
        Shipping shipping = shippingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        return ResponseEntity.ok(shipping);
    }

    @PutMapping("/status/{orderId}")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        Shipping shipping = shippingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        String status = request.get("status");
        shipping.setStatus(status);

        if ("DELIVERED".equalsIgnoreCase(status)) {
            shipping.setDeliveredDate(LocalDateTime.now());
        }

        shippingRepository.save(shipping);
        return ResponseEntity.ok(Map.of("message", "Shipping status updated to " + status));
    }
}