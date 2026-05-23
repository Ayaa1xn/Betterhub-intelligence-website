import { useState } from 'react';
import { CheckCircle2, Send, X } from 'lucide-react';
import { submitContactInquiry } from '../lib/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    solution: 'general',
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitContactInquiry({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        subject: formState.solution,
        website: formState.website,
        message: [formState.company ? `Company: ${formState.company}` : '', formState.message]
          .filter(Boolean)
          .join('\n\n'),
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Could not send your request.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      company: '',
      solution: 'general',
      message: '',
      website: '',
    });
    setSubmitted(false);
    setLoading(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400" />
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="Close consultation dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            <div className="pr-8">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Speak with the BetterHub team
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                This request is saved into the management dashboard so the team can review and
                follow up properly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formState.website}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, website: value.target.value }))
                }
                className="hidden"
                aria-hidden="true"
              />
              <Field
                label="Full name"
                value={formState.name}
                onChange={(value) => setFormState((current) => ({ ...current, name: value }))}
                placeholder="e.g. Tariq Al Mansoor"
              />
              <Field
                label="Work email"
                type="email"
                value={formState.email}
                onChange={(value) => setFormState((current) => ({ ...current, email: value }))}
                placeholder="e.g. name@company.com"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Phone number"
                value={formState.phone}
                onChange={(value) => setFormState((current) => ({ ...current, phone: value }))}
                placeholder="e.g. +971 50 123 4567"
              />
              <Field
                label="Company"
                value={formState.company}
                onChange={(value) => setFormState((current) => ({ ...current, company: value }))}
                placeholder="e.g. BetterHub Trading LLC"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Area of interest
              </label>
              <select
                value={formState.solution}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, solution: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="general">General consultation</option>
                <option value="products">Product suite</option>
                <option value="services">Service engagement</option>
                <option value="website">Website management</option>
                <option value="careers">Hiring and careers</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                What do you need help with?
              </label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, message: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Tell us what you want to improve, launch, or manage more efficiently."
              />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? 'Sending...' : 'Send request'}
              {!loading && <Send className="h-4 w-4" />}
            </button>
          </form>
        ) : (
          <div className="space-y-4 p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Request received
            </h3>
            <p className="mx-auto max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Thanks, {formState.name}. Your request has been saved successfully and is now visible
              in the management dashboard for follow-up.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}
