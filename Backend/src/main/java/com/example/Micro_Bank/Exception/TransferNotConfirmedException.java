package com.example.Micro_Bank.Exception;

public class TransferNotConfirmedException extends RuntimeException {
    public TransferNotConfirmedException() {
        super("Transfer above 10000 requires confirmation");
    }
}
