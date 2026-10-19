package com.hospitality.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hospitalityOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hospitality Management System — REST API")
                        .description("Comprehensive REST API for managing hotels, rooms, guests, bookings, and payments with date-overlap availability verification.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("KARTHIKEYAN M")
                                .url("https://github.com/karthikeyan2172008888-code")
                                .email("karthikeyan.dev@hospitality.local"))
                        .license(new License().name("MIT License")));
    }
}
