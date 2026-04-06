package com.example.Micro_Bank.Repository;
import com.example.Micro_Bank.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccountIdOrReceiverAccountId(Long senderId, Long receiverId);

    Optional<Transaction> findByTransactionId(String transactionId);
}
