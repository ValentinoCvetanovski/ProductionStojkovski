package com.production.stojkovski.dto;

import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    private String bookingDate;
    private String service;
    private String serviceType;
    private String clientName;
    private String clientPhone;
    private List<String> addons;
    private Integer total;
}