<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPdfRequest;
use App\Services\PaymentService;
use App\Services\PdfToDocxConverter;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PdfConverterController extends Controller
{
    public function __construct(
        private PdfToDocxConverter $converter,
        private PaymentService $paymentService
    ) {}

    public function index(): Response
    {
        return Inertia::render('pdf-converter');
    }

    public function convert(UploadPdfRequest $request): JsonResponse
    {
        try {
            $sessionId = $request->session()->getId();

            // Check if there's a valid paid payment
            $payment = $this->paymentService->getPaidPayment($sessionId);

            if (! $payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pembayaran diperlukan untuk melakukan konversi.',
                    'requires_payment' => true,
                ], 402);
            }

            $pdfFile = $request->file('pdf');

            // Convert PDF to DOCX
            $docxPath = $this->converter->convert($pdfFile);

            // Mark payment as used (update status to completed)
            // Only update payment status if paywall is enabled
            if (config('services.payment.enabled', true) && $payment->exists) {
                $payment->status = 'completed';
                $payment->save();
            }

            // Get the original filename without extension
            $originalName = pathinfo($pdfFile->getClientOriginalName(), PATHINFO_FILENAME);

            // Return the file path and name for download
            return response()->json([
                'success' => true,
                'message' => 'PDF berhasil dikonversi.',
                'download_url' => route('pdf.download', ['filename' => basename($docxPath)]),
                'filename' => $originalName.'.docx',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengkonversi PDF: '.$e->getMessage(),
            ], 500);
        }
    }

    public function download(string $filename): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filePath = storage_path('app/temp/'.$filename);

        if (! file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
