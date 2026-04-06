package com.example.Micro_Bank.Service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.Micro_Bank.Entity.Account;
import com.example.Micro_Bank.Entity.User;
import com.example.Micro_Bank.Repository.UserRepository;
import com.example.Micro_Bank.Repository.AccountRepository;
import com.example.Micro_Bank.DTO.AccountResponseDTO;
import com.example.Micro_Bank.Security.JwtUtil;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public AccountResponseDTO register(String name, String email, String password, String pin) {
        if (userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email already registered");

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPin(passwordEncoder.encode(pin));
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Account account = new Account();
        account.setUser(user);
        account.setBalance(0.0);
        account.setStatus("ACTIVE");
        account.setCreatedAt(LocalDateTime.now());
        accountRepository.save(account);

        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setAccountId(account.getId());
        dto.setBalance(account.getBalance());
        dto.setStatus(account.getStatus());
        dto.setToken(jwtUtil.generateToken(email));
        return dto;
    }

    public AccountResponseDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid password");

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setAccountId(account.getId());
        dto.setBalance(account.getBalance());
        dto.setStatus(account.getStatus());
        dto.setToken(jwtUtil.generateToken(email));
        return dto;
    }

    public void setPin(String email, String pin) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPin(passwordEncoder.encode(pin));
        userRepository.save(user);
    }
}
