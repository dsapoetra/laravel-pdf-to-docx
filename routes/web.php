<?php

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PdfConverterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/converter', [PdfConverterController::class, 'index'])->name('pdf.converter');
Route::post('/convert', [PdfConverterController::class, 'convert'])->name('pdf.convert');
Route::get('/download/{filename}', [PdfConverterController::class, 'download'])->name('pdf.download');

// Payment routes
Route::post('/payment/create', [PaymentController::class, 'create'])->name('payment.create');
Route::get('/payment/{payment}/status', [PaymentController::class, 'status'])->name('payment.status');
Route::post('/payment/{payment}/simulate', [PaymentController::class, 'simulate'])->name('payment.simulate');
Route::post('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');
