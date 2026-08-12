package com.production.stojkovski.web.controller;

import com.production.stojkovski.dto.BookingRequest;
import com.production.stojkovski.service.BookingEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final BookingEmailService bookingEmailService;

    public BookingController(BookingEmailService bookingEmailService) {
        this.bookingEmailService = bookingEmailService;
    }

    @PostMapping("/booking-request")
    public ResponseEntity<Map<String, String>> createBookingRequest(@RequestBody BookingRequest request) {
        try {
            bookingEmailService.sendBookingRequest(request);

            return ResponseEntity.ok(Map.of(
                    "message", "Booking request sent successfully"
            ));
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(500).body(Map.of(
                    "message", "Email failed: " + e.getMessage()
            ));
        }
    }
}