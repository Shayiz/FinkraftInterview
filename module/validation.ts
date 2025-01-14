import * as Joi from "joi";
const CreateVendorRequestValidation = Joi.object({
  vendorName: Joi.string().required().messages({
    "any.required": "name name is required",
  }),
  vendorLocation: Joi.string().required().messages({
    "any.required": "location is a required field",
  }),
});

const CreateBookingRequestValidation = Joi.object({
  customerName: Joi.string().required().messages({
    "any.required": "customer name is required",
  }),
  bookingDate: Joi.date().min("now").required().messages({
    "any.required": "bookingDate is a required field",
    "date.min": "bookingDate must be today or a future date",
  }),
  amount: Joi.number().required().messages({
    "any.required": "amount is a required field",
  }),
  vendorId: Joi.string().required().messages({
    "any.required": "vendorId is a required field",
  }),
});
export { CreateVendorRequestValidation, CreateBookingRequestValidation };
