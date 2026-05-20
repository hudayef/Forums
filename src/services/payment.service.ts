export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerDetails: {
    firstName: string;
    email: string;
  };
}

export interface PaymentResponse {
  transactionToken: string;
  redirectUrl: string;
}

/**
 * Midtrans Payment Gateway Mock Service
 * In a real environment, this uses midtrans-client package
 */
export class PaymentService {
  /**
   * Generates a payment token from Midtrans
   */
  static async createTransaction(request: PaymentRequest): Promise<PaymentResponse> {
    // Mocking Midtrans snap response
    console.log('[Midtrans Mock] Creating transaction for:', request.orderId);

    return {
      transactionToken: `mock-token-${request.orderId}-${Date.now()}`,
      redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-token-${request.orderId}`
    };
  }

  /**
   * Verifies payment status via Midtrans Core API
   */
  static async verifyPayment(orderId: string): Promise<boolean> {
    console.log('[Midtrans Mock] Verifying payment for:', orderId);
    // Mock success
    return true;
  }
}
