<?php

namespace App\Services;

use CloudConvert\CloudConvert;
use CloudConvert\Models\Job;
use CloudConvert\Models\Task;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class PdfToDocxConverter
{
    /**
     * Convert a PDF file to DOCX format using CloudConvert API.
     */
    public function convert(UploadedFile $pdfFile): string
    {
        try {
            $apiKey = config('services.cloudconvert.api_key');

            if (! $apiKey) {
                throw new \RuntimeException('CloudConvert API key is not configured. Please add CLOUDCONVERT_API_KEY to your .env file.');
            }

            // Initialize CloudConvert client
            $cloudConvert = new CloudConvert(['api_key' => $apiKey, 'sandbox' => config('services.cloudconvert.sandbox', false)]);

            // Create a job
            $job = (new Job)
                ->addTask(
                    (new Task('import/upload', 'upload-pdf'))
                )
                ->addTask(
                    (new Task('convert', 'convert-to-docx'))
                        ->set('input', 'upload-pdf')
                        ->set('output_format', 'docx')
                )
                ->addTask(
                    (new Task('export/url', 'export-docx'))
                        ->set('input', 'convert-to-docx')
                );

            // Create the job
            $job = $cloudConvert->jobs()->create($job);

            // Upload the PDF file
            $uploadTask = $job->getTasks()->whereStatus(Task::STATUS_WATING)->whereName('upload-pdf')[0];
            $cloudConvert->tasks()->upload($uploadTask, fopen($pdfFile->getRealPath(), 'r'), $pdfFile->getClientOriginalName());

            // Wait for the job to finish
            $job = $cloudConvert->jobs()->wait($job);

            // Get the export task
            $exportTask = $job->getTasks()->whereStatus(Task::STATUS_FINISHED)->whereName('export-docx')[0];

            // Download the converted file
            $outputPath = storage_path('app/temp/'.uniqid('doc_').'.docx');

            // Ensure temp directory exists
            if (! file_exists(dirname($outputPath))) {
                mkdir(dirname($outputPath), 0755, true);
            }

            // Download the file
            $source = $cloudConvert->getHttpTransport()->download($exportTask->getResult()->files[0]->url)->detach();
            $dest = fopen($outputPath, 'w');
            stream_copy_to_stream($source, $dest);
            fclose($dest);

            Log::info('PDF converted successfully using CloudConvert', [
                'input_file' => $pdfFile->getClientOriginalName(),
                'output_file' => basename($outputPath),
                'file_size' => filesize($outputPath),
                'job_id' => $job->getId(),
            ]);

            return $outputPath;
        } catch (\Exception $e) {
            Log::error('CloudConvert conversion failed', [
                'error' => $e->getMessage(),
                'file' => $pdfFile->getClientOriginalName(),
            ]);

            throw new \RuntimeException('Failed to convert PDF to DOCX: '.$e->getMessage(), 0, $e);
        }
    }
}
