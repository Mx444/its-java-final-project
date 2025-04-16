package com.biblioteca.controllers;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.biblioteca.dtos.LoginDTO;
import com.biblioteca.dtos.RegisterDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.providers.AuthService;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        ResponseDTO response = this.authService.register(registerDTO);
        return getResponseEntity(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        ResponseDTO response = this.authService.login(loginDTO);
        return getResponseEntity(response);
    }

    private ResponseEntity<ResponseDTO> getResponseEntity(ResponseDTO response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
