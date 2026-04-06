package com.example.Micro_Bank.DTO;

public class WithdrawRequestDTO {

    private Long accountId;
    private Double amount;
    private String pin;

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
