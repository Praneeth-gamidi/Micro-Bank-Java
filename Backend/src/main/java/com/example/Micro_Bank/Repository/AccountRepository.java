package com.example.Micro_Bank.Repository;
import java.util.Optional;
import com.example.Micro_Bank.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserId(Long userId);
}
