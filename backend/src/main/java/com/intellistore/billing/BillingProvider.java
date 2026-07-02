package com.intellistore.billing;

import java.util.Map;
import java.util.Optional;

/**
 * Generic billing provider abstraction. Allows swapping Stripe, Razorpay, Paddle, etc.
 */
public interface BillingProvider {

    /**
     * Create a customer in the billing system.
     * @param email Customer email
     * @param metadata Optional metadata (e.g., name, organization)
     * @return Provider‑specific customer identifier
     */
    String createCustomer(String email, Map<String, String> metadata);

    /**
     * Create or update a subscription for a customer.
     * @param customerId Provider‑specific customer id
     * @param planId Identifier of the pricing plan
     * @param trialDays Optional trial period in days
     * @return Subscription identifier
     */
    String createOrUpdateSubscription(String customerId, String planId, Optional<Integer> trialDays);

    /**
     * Generate an invoice for a customer.
     * @param customerId Provider‑specific customer id
     * @param amount Amount to bill (in smallest currency unit, e.g., cents)
     * @param currency ISO‑4217 currency code (e.g., "USD")
     * @param description Human‑readable description
     * @return Invoice identifier or URL
     */
    String generateInvoice(String customerId, long amount, String currency, String description);

    /**
     * Retrieve usage for a customer. Implementations can return usage metrics such as
     * storage bytes, AI credit consumption, or API call counts.
     */
    Map<String, Object> getUsage(String customerId);
}
