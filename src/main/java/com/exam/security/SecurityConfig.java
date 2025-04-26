package com.exam.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults; 


@Configuration
public class SecurityConfig {
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://127.0.0.1:5500"); // your VSCode Live Server URL
        configuration.addAllowedMethod("*");  // Allow GET, POST, etc.
        configuration.addAllowedHeader("*");  // Allow all headers
        configuration.setAllowCredentials(true); // Important for cookies/session if needed
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/api/users/**",
                                        "/api/students/**",
                                        "/api/exams/**",
                                        "/api/subjects/**",
                                        "/api/questions/**",
                                        "/api/schedules/**",
                                        "/api/submissions/**",
                                        "/api/answers/**",
                                        "/api/feedbacks/**"
                                ).permitAll()
                                .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())  // ❌ Disable Spring Boot's default login form
                .httpBasic(basic -> basic.disable())               // ❌ Disable Basic Auth popups too
                .logout(logout -> logout.permitAll());

	        return http.build();
	    }


	}
