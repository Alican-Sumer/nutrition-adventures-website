package com.dhes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Security configured for Shibboleth/SAML SSO. No form login or password auth;
     * users authenticate at the IdP and are provisioned via SamlUserService.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // TODO: Configure SAML 2.0 login (when spring-security-saml2-service-provider is added),
        // permit IdP metadata and ACS URLs, require authentication for /api/** except public endpoints
        return http.build();
    }
}
