package com.anvyra.service;

import com.anvyra.dto.AddressRequest;
import com.anvyra.dto.AddressResponse;

import java.util.List;

public interface AddressService {
    AddressResponse create(Long userId, AddressRequest request);
    AddressResponse update(Long userId, Long addressId, AddressRequest request);
    AddressResponse getById(Long userId, Long addressId);
    List<AddressResponse> getUserAddresses(Long userId);
    void delete(Long userId, Long addressId);
    AddressResponse setDefault(Long userId, Long addressId);
}
