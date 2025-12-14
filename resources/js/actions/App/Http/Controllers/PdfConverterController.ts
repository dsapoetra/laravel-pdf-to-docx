import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/converter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::index
* @see app/Http/Controllers/PdfConverterController.php:21
* @route '/converter'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\PdfConverterController::convert
* @see app/Http/Controllers/PdfConverterController.php:26
* @route '/convert'
*/
export const convert = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(options),
    method: 'post',
})

convert.definition = {
    methods: ["post"],
    url: '/convert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PdfConverterController::convert
* @see app/Http/Controllers/PdfConverterController.php:26
* @route '/convert'
*/
convert.url = (options?: RouteQueryOptions) => {
    return convert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PdfConverterController::convert
* @see app/Http/Controllers/PdfConverterController.php:26
* @route '/convert'
*/
convert.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PdfConverterController::convert
* @see app/Http/Controllers/PdfConverterController.php:26
* @route '/convert'
*/
const convertForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PdfConverterController::convert
* @see app/Http/Controllers/PdfConverterController.php:26
* @route '/convert'
*/
convertForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(options),
    method: 'post',
})

convert.form = convertForm

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
export const download = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/download/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
download.url = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { filename: args }
    }

    if (Array.isArray(args)) {
        args = {
            filename: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        filename: args.filename,
    }

    return download.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
download.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
download.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
const downloadForm = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
downloadForm.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PdfConverterController::download
* @see app/Http/Controllers/PdfConverterController.php:69
* @route '/download/{filename}'
*/
downloadForm.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const PdfConverterController = { index, convert, download }

export default PdfConverterController