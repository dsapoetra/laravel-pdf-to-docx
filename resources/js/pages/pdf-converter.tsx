import { Head } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';

interface Payment {
    id: number;
    order_id: string;
    amount: number;
    status: 'pending' | 'paid' | 'completed' | 'expired';
    qr_code_url: string;
    expires_at: string;
    payment_data: {
        gateway: string;
    };
}

export default function PdfConverter() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [checkingPayment, setCheckingPayment] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                setError('Hanya file PDF yang diperbolehkan.');
                setSelectedFile(null);
                return;
            }

            // Validate file size (100MB)
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            if (file.size > maxSize) {
                setError('File PDF tidak boleh melebihi 100MB.');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setError(null);
            setSuccess(null);
        }
    };

    const createPayment = async () => {
        try {
            const response = await fetch('/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            setPayment(data.payment);
            setShowPaymentModal(true);
        } catch (err) {
            setError('Gagal membuat pembayaran. Silakan coba lagi.');
        }
    };

    const checkPaymentStatus = async () => {
        if (!payment) return;

        setCheckingPayment(true);
        try {
            const response = await fetch(`/payment/${payment.id}/status`);
            const data = await response.json();
            setPayment(data.payment);

            if (data.payment.status === 'paid') {
                setShowPaymentModal(false);
                setSuccess('Pembayaran berhasil! Silakan lanjutkan konversi.');
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
        } finally {
            setCheckingPayment(false);
        }
    };

    const simulatePayment = async () => {
        if (!payment) return;

        try {
            const response = await fetch(`/payment/${payment.id}/simulate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            setPayment(data.payment);
            setShowPaymentModal(false);
            setSuccess(data.message);
        } catch (err) {
            setError('Gagal mensimulasikan pembayaran.');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Silakan pilih file PDF untuk diunggah.');
            return;
        }

        setConverting(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('pdf', selectedFile);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.status === 402 && data.requires_payment) {
                // Payment required
                setConverting(false);
                await createPayment();
                return;
            }

            if (data.success) {
                setSuccess(data.message);

                // Automatically trigger download
                const link = document.createElement('a');
                link.href = data.download_url;
                link.download = data.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Reset form
                setSelectedFile(null);
                setPayment(null);
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengkonversi PDF. Silakan coba lagi.');
        } finally {
            setConverting(false);
        }
    };

    // Auto-check payment status every 3 seconds when modal is open
    useEffect(() => {
        if (showPaymentModal && payment && payment.status === 'pending') {
            const interval = setInterval(() => {
                checkPaymentStatus();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [showPaymentModal, payment]);

    return (
        <>
            <Head title="PDF to DOCX Converter">
                <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-800">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                    <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
                        Konversi PDF ke DOCX
                    </h1>

                    {/* Pricing info */}
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <p className="text-center text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-bold">Rp 500</span> per konversi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="pdf-upload"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Pilih File PDF
                            </label>
                            <input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:file:bg-gray-600 dark:hover:file:bg-gray-500"
                                disabled={converting}
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Ukuran file maksimum: 100MB
                            </p>
                        </div>

                        {selectedFile && (
                            <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Dipilih:</span> {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!selectedFile || converting}
                            className="w-full rounded-lg bg-gray-800 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            {converting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Mengkonversi...
                                </span>
                            ) : (
                                'Konversi ke DOCX'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && payment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                            Pembayaran QRIS
                        </h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Order ID:</p>
                            <p className="font-mono text-sm font-semibold text-gray-800 dark:text-white">
                                {payment.order_id}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Jumlah:</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                Rp {payment.amount.toLocaleString('id-ID')}
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="mb-4 flex justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                            <img
                                src={payment.qr_code_url}
                                alt="QRIS Code"
                                className="h-64 w-64"
                            />
                        </div>

                        <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            Scan kode QR di atas dengan aplikasi pembayaran Anda
                        </p>

                        <div className="mb-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                            <p className="text-center text-xs text-yellow-800 dark:text-yellow-200">
                                Pembayaran akan kedaluwarsa dalam 15 menit
                            </p>
                        </div>

                        {/* Demo mode - show simulate button */}
                        {payment.payment_data.gateway === 'demo' && (
                            <button
                                onClick={simulatePayment}
                                className="mb-3 w-full rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Simulasi Pembayaran (Demo Mode)
                            </button>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={checkPaymentStatus}
                                disabled={checkingPayment}
                                className="flex-1 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {checkingPayment ? 'Memeriksa...' : 'Periksa Status'}
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Tutup
                            </button>
                        </div>

                        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                            Status akan diperbarui otomatis setiap 3 detik
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
