'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { State, updateInvoice } from '@/app/lib/actions';
import { useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateInvoice, type UpdateInvoiceValues } from '@/app/lib/validations';
import { FieldError } from '../field-error';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [serverState, formAction] = useActionState(updateInvoiceWithId, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateInvoiceValues>({
    resolver: zodResolver(UpdateInvoice),
    mode: 'onChange',
    defaultValues: {
      customerId: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status as 'pending' | 'paid',
    },
  });

  const onValidSubmit = (data: UpdateInvoiceValues) => {
    const formData = new FormData();
    formData.append('customerId', data.customerId);
    formData.append('amount', data.amount.toString());
    formData.append('status', data.status);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              {...register('customerId')}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            >
              <option value="" disabled>Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* Client & Server Errors */}
          <FieldError 
            id="customer-error" 
            clientError={errors.customerId?.message} 
            serverErrors={serverState.errors?.customerId} 
          />
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                {...register('amount')}
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <FieldError 
              id="amount-error" 
              clientError={errors.amount?.message} 
              serverErrors={serverState.errors?.amount} 
            />
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">Set the invoice status</legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              {['pending', 'paid'].map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    id={status}
                    {...register('status')}
                    type="radio"
                    value={status}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600"
                  />
                  <label
                    htmlFor={status}
                    className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                      status === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} 
                    {status === 'paid' ? <CheckIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <FieldError 
            id="status-error" 
            clientError={errors.status?.message} 
            serverErrors={serverState.errors?.status} 
          />
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/invoices" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}