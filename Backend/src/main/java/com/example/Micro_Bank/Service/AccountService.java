package com.example.Micro_Bank.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.Micro_Bank.DTO.DepositRequestDTO;
import com.example.Micro_Bank.DTO.WithdrawRequestDTO;
import com.example.Micro_Bank.Entity.Account;
import com.example.Micro_Bank.Entity.Transaction;
import com.example.Micro_Bank.Exception.InvalidPinException;
import com.example.Micro_Bank.Repository.*;

@Service
public class AccountService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public void deposit(DepositRequestDTO dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (dto.getAmount() <= 0)
            throw new RuntimeException("Amount must be positive");

        account.setBalance(account.getBalance() + dto.getAmount());
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setAmount(dto.getAmount());
        txn.setType("DEPOSIT");
        txn.setStatus("SUCCESS");
        txn.setReceiverAccount(account);
        txn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(txn);
    }

    public void withdraw(WithdrawRequestDTO dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String hashedPin = account.getUser().getPin();
        if (hashedPin == null || !passwordEncoder.matches(dto.getPin(), hashedPin))
            throw new InvalidPinException();

        if (dto.getAmount() <= 0)
            throw new RuntimeException("Amount must be positive");

        if (account.getBalance() < dto.getAmount())
            throw new RuntimeException("Insufficient balance");

        account.setBalance(account.getBalance() - dto.getAmount());
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setAmount(dto.getAmount());
        txn.setType("WITHDRAW");
        txn.setStatus("SUCCESS");
        txn.setSenderAccount(account);
        txn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(txn);
    }
}
