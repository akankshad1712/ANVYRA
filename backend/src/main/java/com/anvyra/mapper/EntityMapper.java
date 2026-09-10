package com.anvyra.mapper;

import com.anvyra.dto.*;
import com.anvyra.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getProfileImage(),
                user.getRole(),
                user.getEnabled(),
                user.getCreatedAt()
        );
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getActive()
        );
    }

    public ProductResponse toProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getBrand(),
                product.getPrice(),
                product.getDiscountPrice(),
                product.getEffectivePrice(),
                product.getQuantity(),
                product.getActive(),
                product.getFeatured(),
                product.getImages(),
                product.getSizes(),
                product.getColors(),
                toCategoryResponse(product.getCategory()),
                product.getAverageRating(),
                product.getTotalReviews(),
                product.getCreatedAt()
        );
    }

    public AddressResponse toAddressResponse(Address address) {
        if (address == null) return null;
        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhone(),
                address.getStreet(),
                address.getStreet2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getIsDefault()
        );
    }

    public CartItemResponse toCartItemResponse(CartItem item) {
        Product product = item.getProduct();
        String image = (product.getImages() != null && !product.getImages().isEmpty())
                ? product.getImages().get(0) : null;
        return new CartItemResponse(
                item.getId(),
                product.getId(),
                product.getName(),
                image,
                item.getPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.getSelectedSize(),
                item.getSelectedColor()
        );
    }

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();
        return new CartResponse(
                cart.getId(),
                items,
                cart.getTotalItems(),
                cart.getTotalAmount()
        );
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProductName(),
                item.getProductImage(),
                item.getQuantity(),
                item.getPrice(),
                item.getSubtotal(),
                item.getSelectedSize(),
                item.getSelectedColor()
        );
    }

    public OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::toOrderItemResponse)
                .toList();

        Payment payment = order.getPayment();
        Payment.PaymentMethod method = payment != null ? payment.getPaymentMethod() : null;
        Payment.PaymentStatus status = payment != null ? payment.getPaymentStatus() : null;
        String txId = payment != null ? payment.getTransactionId() : null;

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                items,
                toAddressResponse(order.getShippingAddress()),
                order.getStatus(),
                order.getSubtotal(),
                order.getShippingCost(),
                order.getDiscount(),
                order.getTotalAmount(),
                method,
                status,
                txId,
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public ReviewResponse toReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getFirstName(),
                review.getUser().getLastName(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.getVerified(),
                review.getCreatedAt()
        );
    }

    public Product toProduct(ProductRequest req, Category category) {
        return Product.builder()
                .name(req.name())
                .description(req.description())
                .brand(req.brand())
                .price(req.price())
                .discountPrice(req.discountPrice() != null ? req.discountPrice() : BigDecimal.ZERO)
                .quantity(req.quantity() != null ? req.quantity() : 0)
                .active(req.active() != null ? req.active() : true)
                .featured(req.featured() != null ? req.featured() : false)
                .images(req.images() != null ? req.images() : List.of())
                .sizes(req.sizes() != null ? req.sizes() : List.of())
                .colors(req.colors() != null ? req.colors() : List.of())
                .category(category)
                .build();
    }

    public Address toAddress(AddressRequest req, User user) {
        return Address.builder()
                .user(user)
                .fullName(req.fullName())
                .phone(req.phone())
                .street(req.street())
                .street2(req.street2())
                .city(req.city())
                .state(req.state())
                .postalCode(req.postalCode())
                .country(req.country())
                .isDefault(req.isDefault() != null ? req.isDefault() : false)
                .build();
    }
}
