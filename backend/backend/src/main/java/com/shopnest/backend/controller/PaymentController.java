package com.shopnest.backend.controller;

import com.shopnest.backend.model.Order;
import com.shopnest.backend.model.Payment;
import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.OrderRepository;
import com.shopnest.backend.repository.PaymentRepository;
import com.shopnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> makePayment(@RequestBody Map<String, Object> request) {
        Long orderId = Long.valueOf(request.get("orderId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        String paymentMethod = request.get("paymentMethod").toString();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (paymentRepository.findByOrderId(orderId).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment already made for this order!"));
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setUser(user);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus("SUCCESS");

        paymentRepository.save(payment);

        order.setStatus("PAID");
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of(
                "message", "Payment successful!",
                "transactionId", payment.getTransactionId(),
                "amount", payment.getAmount()
        ));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentByOrder(@PathVariable Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentRepository.findByUserId(userId));
    }
}