package com.production.stojkovski.service;

import com.production.stojkovski.dto.BookingRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class BookingEmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${admin.email}")
    private String adminEmail;

    public BookingEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingRequest(BookingRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(adminEmail);
        message.setSubject("Novo baranje za rezervacija - " + safe(request.getService()));

        message.setText("""
                Novo baranje za rezervacija

                Ime na klient: %s
                Telefon: %s
                Datum: %s
                Nastan: %s
                Tip: %s
                Dodatoci: %s
                Vkupno: %s EUR
                """.formatted(
                safe(request.getClientName()),
                safe(request.getClientPhone()),
                safe(request.getBookingDate()),
                safe(request.getService()),
                safe(request.getServiceType()),
                request.getAddons() == null || request.getAddons().isEmpty()
                        ? "Nema"
                        : String.join(", ", request.getAddons()),
                request.getTotal() == null ? "0" : request.getTotal().toString()
        ));

        mailSender.send(message);
    }

    private String safe(String value) {
        return StringUtils.hasText(value) ? value : "/";
    }
}
