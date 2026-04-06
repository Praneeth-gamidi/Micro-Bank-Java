package com.example.Micro_Bank.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.example.Micro_Bank.Service.AccountService;
import com.example.Micro_Bank.DTO.DepositRequestDTO;
import com.example.Micro_Bank.DTO.WithdrawRequestDTO;
@RestController
@RequestMapping("/api/account")
public class AccountController {
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Account API is working!");
    }
    @Autowired
    private AccountService accountService;
    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody DepositRequestDTO dto) {

        accountService.deposit(dto);
        return ResponseEntity.ok("Amount deposited successfully");
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody WithdrawRequestDTO dto) {

        accountService.withdraw(dto);
        return ResponseEntity.ok("Amount withdrawn successfully");
    }
}