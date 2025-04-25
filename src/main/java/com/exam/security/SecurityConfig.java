package com.exam.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .disable()  // This will disable CSRF protection for testing purposes.
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers( "/api/users/**","/api/students/**","/api/exams/**", "/api/subjects/**", "/api/questions/**", "/api/schedules/**", "/api/submissions/**", "/api/answers/**", "/api/feedbacks/**").permitAll()  // Allow student endpoints
                .anyRequest().authenticated()                    // Require login for others
            )
            .formLogin(form -> form
                .defaultSuccessUrl("/api/students", true)
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );

        return http.build();
    }
}
