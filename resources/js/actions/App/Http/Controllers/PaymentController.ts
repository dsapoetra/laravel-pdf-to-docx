import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::create
* @see app/Http/Controllers/PaymentController.php:19
* @route '/payment/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/payment/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::create
* @see app/Http/Controllers/PaymentController.php:19
* @route '/payment/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::create
* @see app/Http/Controllers/PaymentController.php:19
* @route '/payment/create'
*/
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::create
* @see app/Http/Controllers/PaymentController.php:19
* @route '/payment/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::create
* @see app/Http/Controllers/PaymentController.php:19
* @route '/payment/create'
*/
createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
export const status = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/payment/{payment}/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
status.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return status.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
status.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
status.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
const statusForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
statusForm.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PaymentController::status
* @see app/Http/Controllers/PaymentController.php:43
* @route '/payment/{payment}/status'
*/
statusForm.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\PaymentController::simulate
* @see app/Http/Controllers/PaymentController.php:55
* @route '/payment/{payment}/simulate'
*/
export const simulate = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulate.url(args, options),
    method: 'post',
})

simulate.definition = {
    methods: ["post"],
    url: '/payment/{payment}/simulate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::simulate
* @see app/Http/Controllers/PaymentController.php:55
* @route '/payment/{payment}/simulate'
*/
simulate.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return simulate.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::simulate
* @see app/Http/Controllers/PaymentController.php:55
* @route '/payment/{payment}/simulate'
*/
simulate.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::simulate
* @see app/Http/Controllers/PaymentController.php:55
* @route '/payment/{payment}/simulate'
*/
const simulateForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::simulate
* @see app/Http/Controllers/PaymentController.php:55
* @route '/payment/{payment}/simulate'
*/
simulateForm.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulate.url(args, options),
    method: 'post',
})

simulate.form = simulateForm

/**
* @see \App\Http\Controllers\PaymentController::callback
* @see app/Http/Controllers/PaymentController.php:68
* @route '/payment/callback'
*/
export const callback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

callback.definition = {
    methods: ["post"],
    url: '/payment/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::callback
* @see app/Http/Controllers/PaymentController.php:68
* @route '/payment/callback'
*/
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::callback
* @see app/Http/Controllers/PaymentController.php:68
* @route '/payment/callback'
*/
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::callback
* @see app/Http/Controllers/PaymentController.php:68
* @route '/payment/callback'
*/
const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: callback.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::callback
* @see app/Http/Controllers/PaymentController.php:68
* @route '/payment/callback'
*/
callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: callback.url(options),
    method: 'post',
})

callback.form = callbackForm

const PaymentController = { create, status, simulate, callback }

export default PaymentController