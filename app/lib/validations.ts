import { z } from 'zod';

export const InvoiceFormSchema = z.object({
 id: z.string(),
 customerId: z.string().nonempty({ message: 'Please select a customer.' }),
 amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
 status: z.enum(['pending', 'paid'], {
    errorMap: () => ({ message: 'Please select an invoice status.' }),
  }),
 date: z.string(),
});

export const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
export const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export type CreateInvoiceValues = z.infer<typeof CreateInvoice>;
export type UpdateInvoiceValues = z.infer<typeof UpdateInvoice>;
