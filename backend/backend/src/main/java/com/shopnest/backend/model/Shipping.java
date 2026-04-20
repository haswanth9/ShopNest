package com.shopnest.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    private String trackingNumber;
    private String carrier;
    private String status;
    private LocalDateTime shippedDate;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime deliveredDate;

    @PrePersist
    public void prePersist() {
        this.trackingNumber = "SHIP-" + System.currentTimeMillis();
        this.status = "PROCESSING";
    }
}