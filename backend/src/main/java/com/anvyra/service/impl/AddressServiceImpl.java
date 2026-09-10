package com.anvyra.service.impl;

import com.anvyra.dto.AddressRequest;
import com.anvyra.dto.AddressResponse;
import com.anvyra.entity.Address;
import com.anvyra.entity.User;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.exception.UnauthorizedException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.AddressRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public AddressResponse create(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.isDefault())) {
            unsetCurrentDefault(userId);
        }

        Address address = mapper.toAddress(request, user);
        return mapper.toAddressResponse(addressRepository.save(address));
    }

    @Override
    public AddressResponse update(Long userId, Long addressId, AddressRequest request) {
        Address address = findAndVerify(userId, addressId);

        if (request.fullName() != null) address.setFullName(request.fullName());
        if (request.phone() != null) address.setPhone(request.phone());
        if (request.street() != null) address.setStreet(request.street());
        if (request.street2() != null) address.setStreet2(request.street2());
        if (request.city() != null) address.setCity(request.city());
        if (request.state() != null) address.setState(request.state());
        if (request.postalCode() != null) address.setPostalCode(request.postalCode());
        if (request.country() != null) address.setCountry(request.country());

        if (Boolean.TRUE.equals(request.isDefault())) {
            unsetCurrentDefault(userId);
            address.setIsDefault(true);
        }

        return mapper.toAddressResponse(addressRepository.save(address));
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getById(Long userId, Long addressId) {
        return mapper.toAddressResponse(findAndVerify(userId, addressId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(mapper::toAddressResponse)
                .toList();
    }

    @Override
    public void delete(Long userId, Long addressId) {
        findAndVerify(userId, addressId);
        addressRepository.deleteById(addressId);
    }

    @Override
    public AddressResponse setDefault(Long userId, Long addressId) {
        unsetCurrentDefault(userId);
        Address address = findAndVerify(userId, addressId);
        address.setIsDefault(true);
        return mapper.toAddressResponse(addressRepository.save(address));
    }

    private Address findAndVerify(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));
        if (!address.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("This address does not belong to you");
        }
        return address;
    }

    private void unsetCurrentDefault(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(a -> {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                });
    }
}
