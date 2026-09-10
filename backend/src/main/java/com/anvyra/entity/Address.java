package com.anvyra.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "addresses",
    indexes = { @Index(name = "idx_address_user", columnList = "user_id") }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Phone is required")
    @Column(nullable = false, length = 15)
    private String phone;

    @NotBlank(message = "Street address is required")
    @Column(nullable = false)
    private String street;

    private String street2;

    @NotBlank(message = "City is required")
    @Column(nullable = false, length = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Column(nullable = false, length = 100)
    private String state;

    @NotBlank(message = "Postal code is required")
    @Column(nullable = false, length = 20)
    private String postalCode;

    @NotBlank(message = "Country is required")
    @Column(nullable = false, length = 100)
    private String country;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isDefault = false;
}
