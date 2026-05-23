import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { submitContactInquiry } from '../lib/api';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

export default function Contact() {
  const {
    content: { siteSettings, pageMedia },
  } = useSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General website inquiry',
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitContactInquiry(formData);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Could not send your message.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General website inquiry',
      message: '',
      website: '',
    });
    setSubmitted(false);
    setLoading(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <SmartMedia
          image={pageMedia.contactHero.image}
          video={pageMedia.contactHero.video}
          poster={pageMedia.contactHero.poster}
          alt={pageMedia.contactHero.alt || pageMedia.contactHero.title}
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.22] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Start with the conversation that matters most
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            Reach out for product discussions, delivery planning, content operations, or a cleaner
            path for managing the website itself.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Send a direct inquiry
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Your message is now saved into the website management system for follow-up.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, website: event.target.value }))
                    }
                    className="hidden"
                    aria-hidden="true"
                  />
                  <Field
                    label="Full name"
                    value={formData.name}
                    onChange={(value) => setFormData((current) => ({ ...current, name: value }))}
                    placeholder="e.g. Tariq Al Mansoor"
                  />
                  <Field
                    label="Work email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => setFormData((current) => ({ ...current, email: value }))}
                    placeholder="e.g. contact@company.ae"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Phone number"
                    value={formData.phone}
                    onChange={(value) => setFormData((current) => ({ ...current, phone: value }))}
                    placeholder="e.g. +971 50 123 4567"
                  />
                  <Field
                    label="Subject"
                    value={formData.subject}
                    onChange={(value) => setFormData((current) => ({ ...current, subject: value }))}
                    placeholder="General website inquiry"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, message: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Tell us what you want to improve, launch, or simplify."
                  />
                </div>

                {error && <p className="text-sm text-rose-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
                >
                  {loading ? 'Sending...' : 'Send inquiry'}
                  {!loading && <Send className="h-4 w-4" />}
                </button>
              </form>
            ) : (
              <div className="space-y-4 py-10 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Message received
                </h3>
                <p className="mx-auto max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Thanks, {formData.name}. Your inquiry has been saved successfully and is ready for
                  team follow-up inside the management dashboard.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Send another inquiry
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                Office details
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                  <span>{siteSettings.officeAddressLines.join(', ')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                  <a href={`tel:${siteSettings.phone}`} className="font-semibold hover:underline">
                    {siteSettings.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="font-semibold hover:underline"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  {siteSettings.officeHours}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Why this matters</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                A better contact flow is not just visual polish. It means fewer lost leads, better
                follow-up visibility, and a management process your team can actually operate.
              </p>
            </div>
          </div>
        </div>
      </section>
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
