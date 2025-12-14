<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(public PaymentService $paymentService)
    {
    }

    /**
     * Create a new payment for conversion.
     */
    public function create(Request $request)
    {
        $sessionId = $request->session()->getId();

        // Check if there's already a pending payment
        $existingPayment = $this->paymentService->getPendingPayment($sessionId);

        if ($existingPayment) {
            return response()->json([
                'payment' => $existingPayment,
            ]);
        }

        // Create new payment
        $payment = $this->paymentService->createPayment($sessionId);

        return response()->json([
            'payment' => $payment,
        ]);
    }

    /**
     * Check payment status.
     */
    public function status(Payment $payment)
    {
        $payment = $this->paymentService->checkPaymentStatus($payment);

        return response()->json([
            'payment' => $payment,
        ]);
    }

    /**
     * Simulate payment (for demo/testing).
     */
    public function simulate(Payment $payment)
    {
        $payment = $this->paymentService->simulatePayment($payment);

        return response()->json([
            'payment' => $payment,
            'message' => 'Pembayaran berhasil disimulasikan',
        ]);
    }

    /**
     * Payment callback from gateway.
     */
    public function callback(Request $request)
    {
        // Handle payment gateway callback
        // This will vary based on the payment gateway used

        \Log::info('Payment callback received', $request->all());

        return response()->json(['status' => 'success']);
    }
}
