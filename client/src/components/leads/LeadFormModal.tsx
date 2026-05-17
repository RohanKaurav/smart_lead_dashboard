import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Lead } from '../../types/lead';
import { leadFormSchema, type LeadFormValues } from '../../schemas/lead.schema';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../types/lead';
import { applyApiErrorsToForm } from '../../utils/formErrors';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { useState } from 'react';

interface LeadFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  lead?: Lead | null;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}

export function LeadFormModal({ isOpen, mode, lead, onClose, onSubmit }: LeadFormModalProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'new',
      source: 'website',
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      lead
        ? {
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source,
          }
        : {
            name: '',
            email: '',
            status: 'new',
            source: 'website',
          },
    );
    setFormError(null);
  }, [isOpen, lead, reset]);

  const submit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(applyApiErrorsToForm(error, setError));
    }
  });

  return (
    <Modal title={mode === 'create' ? 'Create lead' : 'Edit lead'} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {formError ? <Alert message={formError} /> : null}

        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="Status"
          error={errors.status?.message}
          options={LEAD_STATUSES.map((status) => ({ value: status, label: status }))}
          {...register('status')}
        />

        <Select
          label="Source"
          error={errors.source?.message}
          options={LEAD_SOURCES.map((source) => ({ value: source, label: source }))}
          {...register('source')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {mode === 'create' ? 'Create lead' : 'Save changes'}
        </Button>
      </form>
    </Modal>
  );
}
