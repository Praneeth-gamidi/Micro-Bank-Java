package com.example.Micro_Bank.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.Micro_Bank.Service.TransactionService;
import com.example.Micro_Bank.DTO.TransferRequestDTO;
import com.example.Micro_Bank.DTO.TransactionResponseDTO;
import java.util.List;
@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequestDTO dto) {

        transactionService.transfer(dto);
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<TransactionResponseDTO>> getHistory(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getHistory(accountId));
    }
}