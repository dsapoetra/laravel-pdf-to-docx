<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Str;

class PaymentService
{
    public const CONVERSION_PRICE = 500;

    /**
     * Create a payment for PDF conversion.
     */
    public function createPayment(string $sessionId): Payment
    {
        $orderId = 'ORDER-'.strtoupper(Str::random(10));

        $payment = new Payment;
        $payment->order_id = $orderId;
        $payment->session_id = $sessionId;
        $payment->amount = self::CONVERSION_PRICE;
        $payment->payment_method = 'qris';
        $payment->status = 'pending';
        $payment->expires_at = now()->addMinutes(15);

        // Generate QRIS code (using Midtrans, Xendit, or other payment gateway)
        $qrisData = $this->generateQRIS($orderId, self::CONVERSION_PRICE);

        $payment->qr_code_url = $qrisData['qr_code_url'];
        $payment->payment_data = $qrisData;

        $payment->save();

        return $payment;
    }

    /**
     * Generate QRIS payment using payment gateway.
     */
    protected function generateQRIS(string $orderId, int $amount): array
    {
        $gateway = config('services.payment.gateway', 'xendit');

        return match ($gateway) {
            'xendit' => $this->generateXenditQRIS($orderId, $amount),
            'midtrans' => $this->generateMidtransQRIS($orderId, $amount),
            default => $this->generateDemoQRIS($orderId, $amount),
        };
    }

    /**
     * Generate Xendit QRIS.
     */
    protected function generateXenditQRIS(string $orderId, int $amount): array
    {
        $apiKey = config('services.xendit.secret_key');

        if (! $apiKey) {
            return $this->generateDemoQRIS($orderId, $amount);
        }

        try {
            $response = \Http::withBasicAuth($apiKey, '')
                ->post('https://api.xendit.co/qr_codes', [
                    'external_id' => $orderId,
                    'type' => 'DYNAMIC',
                    'callback_url' => route('payment.callback'),
                    'amount' => $amount,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'qr_code_url' => $data['qr_string'] ?? null,
                    'gateway' => 'xendit',
                    'gateway_response' => $data,
                ];
            }
        } catch (\Exception $e) {
            \Log::error('Xendit QRIS generation failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId,
            ]);
        }

        return $this->generateDemoQRIS($orderId, $amount);
    }

    /**
     * Generate Midtrans QRIS.
     */
    protected function generateMidtransQRIS(string $orderId, int $amount): array
    {
        $serverKey = config('services.midtrans.server_key');
        $isProduction = config('services.midtrans.is_production', false);

        if (! $serverKey) {
            return $this->generateDemoQRIS($orderId, $amount);
        }

        try {
            $url = $isProduction
                ? 'https://api.midtrans.com/v2/charge'
                : 'https://api.sandbox.midtrans.com/v2/charge';

            $response = \Http::withBasicAuth($serverKey, '')
                ->post($url, [
                    'payment_type' => 'qris',
                    'transaction_details' => [
                        'order_id' => $orderId,
                        'gross_amount' => $amount,
                    ],
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'qr_code_url' => $data['actions'][0]['url'] ?? null,
                    'gateway' => 'midtrans',
                    'gateway_response' => $data,
                ];
            }
        } catch (\Exception $e) {
            \Log::error('Midtrans QRIS generation failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId,
            ]);
        }

        return $this->generateDemoQRIS($orderId, $amount);
    }

    /**
     * Generate demo QRIS for testing (without actual payment gateway).
     */
    protected function generateDemoQRIS(string $orderId, int $amount): array
    {
        // Generate a demo QR code URL for testing
        // In production, replace this with actual payment gateway
        $qrData = "00020101021226670016COM.MERCHANT.WWW01189360050300000898740214{$orderId}0303UME51440014ID.CO.QRIS.WWW0215ID{$orderId}0303UME5204581153033605802ID5909PDFCONVERTER6007JAKARTA61051234062070503***63046B8A";

        return [
            'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.urlencode($qrData),
            'gateway' => 'demo',
            'gateway_response' => [
                'order_id' => $orderId,
                'amount' => $amount,
                'qr_string' => $qrData,
            ],
        ];
    }

    /**
     * Check payment status.
     */
    public function checkPaymentStatus(Payment $payment): Payment
    {
        if ($payment->isPaid() || $payment->isExpired()) {
            return $payment;
        }

        // In demo mode, allow manual verification
        if ($payment->payment_data['gateway'] === 'demo') {
            return $payment;
        }

        // Check with payment gateway
        $gateway = $payment->payment_data['gateway'] ?? 'demo';

        $isPaid = match ($gateway) {
            'xendit' => $this->checkXenditStatus($payment),
            'midtrans' => $this->checkMidtransStatus($payment),
            default => false,
        };

        if ($isPaid) {
            $payment->status = 'paid';
            $payment->paid_at = now();
            $payment->save();
        }

        return $payment->fresh();
    }

    /**
     * Check Xendit payment status.
     */
    protected function checkXenditStatus(Payment $payment): bool
    {
        $apiKey = config('services.xendit.secret_key');

        if (! $apiKey) {
            return false;
        }

        try {
            $qrId = $payment->payment_data['gateway_response']['id'] ?? null;

            if (! $qrId) {
                return false;
            }

            $response = \Http::withBasicAuth($apiKey, '')
                ->get("https://api.xendit.co/qr_codes/{$qrId}");

            if ($response->successful()) {
                $data = $response->json();

                return $data['status'] === 'COMPLETED';
            }
        } catch (\Exception $e) {
            \Log::error('Xendit status check failed', [
                'error' => $e->getMessage(),
                'payment_id' => $payment->id,
            ]);
        }

        return false;
    }

    /**
     * Check Midtrans payment status.
     */
    protected function checkMidtransStatus(Payment $payment): bool
    {
        $serverKey = config('services.midtrans.server_key');
        $isProduction = config('services.midtrans.is_production', false);

        if (! $serverKey) {
            return false;
        }

        try {
            $url = $isProduction
                ? "https://api.midtrans.com/v2/{$payment->order_id}/status"
                : "https://api.sandbox.midtrans.com/v2/{$payment->order_id}/status";

            $response = \Http::withBasicAuth($serverKey, '')
                ->get($url);

            if ($response->successful()) {
                $data = $response->json();

                return in_array($data['transaction_status'], ['capture', 'settlement']);
            }
        } catch (\Exception $e) {
            \Log::error('Midtrans status check failed', [
                'error' => $e->getMessage(),
                'payment_id' => $payment->id,
            ]);
        }

        return false;
    }

    /**
     * Get or create pending payment for session.
     */
    public function getPendingPayment(string $sessionId): ?Payment
    {
        return Payment::query()
            ->where('session_id', $sessionId)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();
    }

    /**
     * Get paid payment for session that hasn't been used.
     */
    public function getPaidPayment(string $sessionId): ?Payment
    {
        // If paywall is disabled, return a mock payment to bypass the check
        if (! config('services.payment.enabled', true)) {
            return new Payment;
        }

        return Payment::query()
            ->where('session_id', $sessionId)
            ->where('status', 'paid')
            ->latest()
            ->first();
    }

    /**
     * Simulate payment (for demo/testing purposes).
     */
    public function simulatePayment(Payment $payment): Payment
    {
        if ($payment->payment_data['gateway'] === 'demo') {
            $payment->status = 'paid';
            $payment->paid_at = now();
            $payment->save();
        }

        return $payment->fresh();
    }
}
