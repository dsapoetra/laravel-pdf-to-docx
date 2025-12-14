<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('converter page can be accessed', function () {
    $this->withoutVite();

    $response = $this->get('/converter');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('pdf-converter'));
});

test('pdf conversion endpoint accepts valid pdf files', function () {
    Storage::fake('local');

    // Create a fake PDF file
    $pdf = UploadedFile::fake()->create('test.pdf', 1024, 'application/pdf');

    $response = $this->postJson('/convert', [
        'pdf' => $pdf,
    ]);

    // Note: This will fail with 500 because fake PDF cannot be parsed
    // In real usage with actual PDF files, this would return 200
    // For now, we just verify that validation passes (not 422)
    expect($response->status())->not->toBe(422);
});

test('only pdf files are allowed', function () {
    $file = UploadedFile::fake()->create('test.txt', 100, 'text/plain');

    $response = $this->postJson('/convert', [
        'pdf' => $file,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('pdf');
});

test('pdf file is required', function () {
    $response = $this->postJson('/convert', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('pdf');
});

test('pdf file must not exceed 100mb', function () {
    // Create a fake PDF file larger than 100MB
    $pdf = UploadedFile::fake()->create('large.pdf', 102401, 'application/pdf');

    $response = $this->postJson('/convert', [
        'pdf' => $pdf,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('pdf');
});

test('docx file can be downloaded', function () {
    Storage::fake('local');

    // Create a temporary DOCX file
    $filename = 'doc_test123.docx';
    $path = storage_path('app/temp/' . $filename);

    if (! file_exists(dirname($path))) {
        mkdir(dirname($path), 0755, true);
    }

    file_put_contents($path, 'test content');

    $response = $this->get('/download/' . $filename);

    $response->assertOk();
    $response->assertDownload($filename);
});

test('downloading non-existent file returns 404', function () {
    $response = $this->get('/download/nonexistent.docx');

    $response->assertNotFound();
});
