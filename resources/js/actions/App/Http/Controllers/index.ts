import PdfConverterController from './PdfConverterController'
import PaymentController from './PaymentController'

const Controllers = {
    PdfConverterController: Object.assign(PdfConverterController, PdfConverterController),
    PaymentController: Object.assign(PaymentController, PaymentController),
}

export default Controllers