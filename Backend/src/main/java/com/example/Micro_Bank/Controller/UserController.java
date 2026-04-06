package com.example.Micro_Bank.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Micro_Bank.Service.UserService;
import com.example.Micro_Bank.DTO.AccountResponseDTO;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AccountResponseDTO> register(@RequestBody Map<String, String> body) {
        AccountResponseDTO dto = userService.register(
                body.get("name"), body.get("email"), body.get("password"), body.get("pin"));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AccountResponseDTO> login(@RequestBody Map<String, String> body) {
        AccountResponseDTO dto = userService.login(body.get("email"), body.get("password"));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/set-pin")
    public ResponseEntity<String> setPin(@RequestBody Map<String, String> body) {
        userService.setPin(body.get("email"), body.get("pin"));
        return ResponseEntity.ok("PIN set successfully");
    }
}
