package com.example.Micro_Bank.DTO;

public class AccountResponseDTO {

    private Long accountId;
    private Double balance;
    private String status;
    private String token;
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getAccountId() {
        return accountId;
    }
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
    public Double getBalance() {
        return balance;
    }
    public void setBalance(Double balance) {
        this.balance = balance;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

   
}
