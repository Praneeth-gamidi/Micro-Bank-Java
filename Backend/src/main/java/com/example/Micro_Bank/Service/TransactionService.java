package com.example.Micro_Bank.Service;

import com.example.Micro_Bank.DTO.TransactionResponseDTO;
import com.example.Micro_Bank.DTO.TransferRequestDTO;
import com.example.Micro_Bank.Exception.InvalidPinException;
import com.example.Micro_Bank.Exception.TransferNotConfirmedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Micro_Bank.Repository.*;
import com.example.Micro_Bank.Entity.Account;
import com.example.Micro_Bank.Entity.Transaction;

@Service
public class TransactionService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public void transfer(TransferRequestDTO dto) {
        Account sender = accountRepository.findById(dto.getSenderAccountId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Account receiver = accountRepository.findById(dto.getReceiverAccountId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        String hashedPin = sender.getUser().getPin();
        if (hashedPin == null || !passwordEncoder.matches(dto.getPin(), hashedPin))
            throw new InvalidPinException();

        if (dto.getAmount() <= 0)
            throw new RuntimeException("Amount must be positive");

        if (dto.getAmount() > 10000 && !dto.isConfirmed())
            throw new TransferNotConfirmedException();

        if (sender.getBalance() < dto.getAmount())
            throw new RuntimeException("Insufficient balance");

        sender.setBalance(sender.getBalance() - dto.getAmount());
        receiver.setBalance(receiver.getBalance() + dto.getAmount());
        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction txn = new Transaction();
        txn.setTransactionId(UUID.randomUUID().toString());
        txn.setAmount(dto.getAmount());
        txn.setType("TRANSFER");
        txn.setStatus("SUCCESS");
        txn.setSenderAccount(sender);
        txn.setReceiverAccount(receiver);
        txn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(txn);
    }

    public List<TransactionResponseDTO> getHistory(Long accountId) {
        return transactionRepository
                .findBySenderAccountIdOrReceiverAccountId(accountId, accountId)
                .stream().map(t -> {
                    TransactionResponseDTO dto = new TransactionResponseDTO();
                    dto.setTransactionId(t.getTransactionId());
                    dto.setAmount(t.getAmount());
                    dto.setType(t.getType());
                    dto.setStatus(t.getStatus());
                    dto.setCreatedAt(t.getCreatedAt());
                    return dto;
                }).collect(Collectors.toList());
    }
}
