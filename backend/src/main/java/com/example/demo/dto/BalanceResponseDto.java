package com.example.demo.dto;

import java.math.BigDecimal;

public class BalanceResponseDto {
    private BigDecimal balance;
    private String currency;
    private String accountNumber;
    
    public BalanceResponseDto() {}
    
    public BalanceResponseDto(BigDecimal balance, String currency, String accountNumber) {
        this.balance = balance;
        this.currency = currency;
        this.accountNumber = accountNumber;
    }
    
    // Getters and Setters
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
}