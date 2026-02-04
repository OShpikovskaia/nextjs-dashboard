import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FieldErrorProps {
  id: string;
  clientError?: string;
  serverErrors?: string[];
}

export function FieldError({ id, clientError, serverErrors }: FieldErrorProps) {
  const error = clientError || serverErrors?.[0];

  if (!error) return null;

  return (
    <div 
      id={id} 
      aria-live="polite" 
      aria-atomic="true"
      className="flex items-center gap-1 mt-2"
    >
      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      <p className="text-sm text-red-500">
        {error}
      </p>
    </div>
  );
}