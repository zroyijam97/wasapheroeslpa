// CHIP Payment Gateway Configuration for Malaysia

// CHIP configuration
const chipSecretKey = process.env.CHIP_SECRET_KEY || '';
const chipBrandId = process.env.CHIP_BRAND_ID || '';
const chipApiUrl = process.env.CHIP_API_URL || 'https://gate.chip-in.asia/api/v1';

// CHIP configuration for Malaysia
export const CHIP_CONFIG = {
  // Supported payment methods for Malaysia
  paymentMethods: [
    'fpx', // Malaysian online banking
    'card', // Credit/Debit cards
    'boost', // Boost e-wallet
    'grabpay', // GrabPay
    'tng', // Touch 'n Go eWallet
    'shopeepay', // ShopeePay
    'maybank_qr', // Maybank QR
    'duitnow_qr', // DuitNow QR
  ],
  
  // Currency for Malaysia
  currency: 'MYR',
  
  // FPX specific configuration
  fpx: {
    // Supported Malaysian banks for FPX
    supportedBanks: [
      'maybank2u',
      'cimb_clicks',
      'public_bank',
      'rhb_bank',
      'hong_leong_bank',
      'ambank',
      'affin_bank',
      'alliance_bank',
      'bank_islam',
      'bank_muamalat',
      'bank_rakyat',
      'bsn',
      'hsbc_bank',
      'kfh',
      'maybank2e',
      'ocbc_bank',
      'standard_chartered',
      'uob_bank',
    ],
  },
  
  // Recurring payment configuration
  subscription: {
    // Default billing intervals
    intervals: {
      monthly: 'month',
      yearly: 'year',
      weekly: 'week',
    },
    
    // Trial period options (in days)
    trialPeriods: [7, 14, 30],
  },
};

// CHIP API Client
class ChipClient {
  private secretKey: string;
  private brandId: string;
  private apiUrl: string;

  constructor() {
    this.secretKey = chipSecretKey;
    this.brandId = chipBrandId;
    this.apiUrl = chipApiUrl;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Create a purchase (payment intent equivalent)
  async createPurchase({
    amount,
    currency = 'MYR',
    description,
    clientEmail,
    clientName,
    successRedirect,
    failureRedirect,
    cancelRedirect,
    paymentMethodWhitelist,
    metadata = {},
  }: {
    amount: number;
    currency?: string;
    description?: string;
    clientEmail?: string;
    clientName?: string;
    successRedirect?: string;
    failureRedirect?: string;
    cancelRedirect?: string;
    paymentMethodWhitelist?: string[];
    metadata?: Record<string, any>;
  }) {
    const purchaseData = {
      purchase: {
        currency,
        products: [
          {
            name: description || 'Payment',
            price: Math.round(amount * 100), // Convert to cents
          },
        ],
      },
      brand_id: this.brandId,
      client: {
        email: clientEmail,
        full_name: clientName,
      },
      success_redirect: successRedirect,
      failure_redirect: failureRedirect,
      cancel_redirect: cancelRedirect,
      payment_method_whitelist: paymentMethodWhitelist,
      ...metadata,
    };

    return this.makeRequest('/purchases/', 'POST', purchaseData);
  }

  // Retrieve a purchase
  async retrievePurchase(purchaseId: string) {
    return this.makeRequest(`/purchases/${purchaseId}/`);
  }

  // Cancel a purchase
  async cancelPurchase(purchaseId: string) {
    return this.makeRequest(`/purchases/${purchaseId}/cancel/`, 'POST');
  }

  // Mark purchase as paid (for manual verification)
  async markAsPaid(purchaseId: string) {
    return this.makeRequest(`/purchases/${purchaseId}/mark_as_paid/`, 'POST');
  }

  // Refund a purchase
  async refundPurchase(purchaseId: string, amount?: number) {
    const refundData = amount ? { amount: Math.round(amount * 100) } : {};
    return this.makeRequest(`/purchases/${purchaseId}/refund/`, 'POST', refundData);
  }

  // Create recurring payment (subscription equivalent)
  async createRecurringPurchase({
    amount,
    currency = 'MYR',
    description,
    clientEmail,
    clientName,
    interval = 'month',
    trialPeriodDays,
    successRedirect,
    failureRedirect,
    cancelRedirect,
    metadata = {},
  }: {
    amount: number;
    currency?: string;
    description?: string;
    clientEmail?: string;
    clientName?: string;
    interval?: 'month' | 'year' | 'week';
    trialPeriodDays?: number;
    successRedirect?: string;
    failureRedirect?: string;
    cancelRedirect?: string;
    metadata?: Record<string, any>;
  }) {
    const purchaseData: any = {
      purchase: {
        currency,
        products: [
          {
            name: description || 'Subscription',
            price: Math.round(amount * 100), // Convert to cents
          },
        ],
      },
      brand_id: this.brandId,
      client: {
        email: clientEmail,
        full_name: clientName,
      },
      success_redirect: successRedirect,
      failure_redirect: failureRedirect,
      cancel_redirect: cancelRedirect,
      force_recurring: true,
      ...metadata,
    };

    // Add trial period if specified
    if (trialPeriodDays) {
      purchaseData.trial_period_days = trialPeriodDays;
    }

    return this.makeRequest('/purchases/', 'POST', purchaseData);
  }

  // Charge using saved token (for recurring payments)
  async chargeRecurringToken({
    recurringToken,
    amount,
    currency = 'MYR',
    description,
  }: {
    recurringToken: string;
    amount: number;
    currency?: string;
    description?: string;
  }) {
    const chargeData = {
      recurring_token: recurringToken,
      purchase: {
        currency,
        products: [
          {
            name: description || 'Recurring Payment',
            price: Math.round(amount * 100),
          },
        ],
      },
    };

    return this.makeRequest('/purchases/charge/', 'POST', chargeData);
  }

  // Delete recurring token
  async deleteRecurringToken(purchaseId: string) {
    return this.makeRequest(`/purchases/${purchaseId}/delete_recurring_token/`, 'POST');
  }
}

// Export singleton instance
export const chip = new ChipClient();

// Helper functions for easier integration

export const createSubscription = async ({
  amount,
  currency = 'MYR',
  description,
  clientEmail,
  clientName,
  interval = 'month',
  trialPeriodDays,
  successRedirect,
  failureRedirect,
  cancelRedirect,
  metadata = {},
}: {
  amount: number;
  currency?: string;
  description?: string;
  clientEmail?: string;
  clientName?: string;
  interval?: 'month' | 'year' | 'week';
  trialPeriodDays?: number;
  successRedirect?: string;
  failureRedirect?: string;
  cancelRedirect?: string;
  metadata?: Record<string, any>;
}) => {
  return chip.createRecurringPurchase({
    amount,
    currency,
    description,
    clientEmail,
    clientName,
    interval,
    trialPeriodDays,
    successRedirect,
    failureRedirect,
    cancelRedirect,
    metadata,
  });
};

export const createCustomer = async ({
  email,
  name,
  metadata = {},
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) => {
  // CHIP doesn't have separate customer creation, 
  // customer data is included in purchase creation
  return {
    id: `customer_${Date.now()}`,
    email,
    name,
    metadata,
  };
};

// Export CHIP client for direct usage
export { ChipClient };
export default chip;