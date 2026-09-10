package com.anvyra.service.impl;

import com.anvyra.dto.OrderRequest;
import com.anvyra.dto.OrderResponse;
import com.anvyra.dto.PagedResponse;
import com.anvyra.entity.*;
import com.anvyra.entity.Order.OrderStatus;
import com.anvyra.exception.BadRequestException;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.exception.UnauthorizedException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.*;
import com.anvyra.service.CartService;
import com.anvyra.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final EntityMapper mapper;

    @Override
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        // 1. Load user & validate cart
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        // 2. Validate shipping address
        Address address = addressRepository.findById(request.shippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", request.shippingAddressId()));

        if (!address.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("This address does not belong to you");
        }

        // 3. Check stock & decrement
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // 4. Build order
        BigDecimal subtotal = cart.getTotalAmount();
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("999")) >= 0
                ? BigDecimal.ZERO : new BigDecimal("99");
        BigDecimal total = subtotal.add(shipping);

        Order order = Order.builder()
                .user(user)
                .shippingAddress(address)
                .subtotal(subtotal)
                .shippingCost(shipping)
                .totalAmount(total)
                .orderNumber(generateOrderNumber())
                .notes(request.notes())
                .status(OrderStatus.CONFIRMED)
                .build();

        // 5. Build order items from cart
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(ci -> {
                    String image = (ci.getProduct().getImages() != null && !ci.getProduct().getImages().isEmpty())
                            ? ci.getProduct().getImages().get(0) : null;
                    return OrderItem.builder()
                            .order(order)
                            .product(ci.getProduct())
                            .quantity(ci.getQuantity())
                            .price(ci.getPrice())
                            .productName(ci.getProduct().getName())
                            .productImage(image)
                            .selectedSize(ci.getSelectedSize())
                            .selectedColor(ci.getSelectedColor())
                            .build();
                })
                .toList();
        order.setItems(orderItems);

        // 6. Create payment record
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.paymentMethod())
                .amount(total)
                .paymentStatus(
                        request.paymentMethod() == Payment.PaymentMethod.COD
                                ? Payment.PaymentStatus.PENDING
                                : Payment.PaymentStatus.INITIATED
                )
                .build();
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // 7. Clear cart
        cartService.clearCart(userId);

        return mapper.toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id, Long userId) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        verifyOwnership(order, userId);
        return mapper.toOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber, Long userId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        verifyOwnership(order, userId);
        return mapper.toOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        Page<Order> page = orderRepository.findByUserId(userId, pageable);
        return toPagedResponse(page);
    }

    @Override
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        order.setStatus(status);
        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse cancelOrder(Long id, Long userId) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        verifyOwnership(order, userId);

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel an order that has been shipped or delivered");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        if (order.getPayment() != null) {
            order.getPayment().setPaymentStatus(Payment.PaymentStatus.CANCELLED);
        }

        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(Pageable pageable) {
        return toPagedResponse(orderRepository.findAll(pageable));
    }

    private void verifyOwnership(Order order, Long userId) {
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this order");
        }
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ANV-" + timestamp + "-" + random;
    }

    private PagedResponse<OrderResponse> toPagedResponse(Page<Order> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(mapper::toOrderResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }
}
