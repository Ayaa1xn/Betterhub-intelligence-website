import { useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, ChevronRight, MapPin, Send } from 'lucide-react';
import { submitCareerApplication } from '../lib/api';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';
import type { CareerRole } from '../types';

export default function Careers() {
  const {
    content: { careerRoles, siteSettings, pageMedia },
  } = useSiteContent();
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null);
  const [applicantData, setApplicantData] = useState({
    name: '',
    email: '',
    experience: 'mid',
    portfolio: '',
    coverText: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openRoles = useMemo(() => careerRoles.filter((role) => role.isOpen), [careerRoles]);

  const resetForm = () => {
    setSelectedRole(null);
    setApplicantData({
      name: '',
      email: '',
      experience: 'mid',
      portfolio: '',
      coverText: '',
      website: '',
    });
    setSubmitted(false);
    setLoading(false);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRole) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitCareerApplication({
        roleId: selectedRole.id,
        roleTitle: selectedRole.title,
        ...applicantData,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Could not submit your application.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <SmartMedia
          image={pageMedia.careersHero.image}
          video={pageMedia.careersHero.video}
          poster={pageMedia.careersHero.poster}
          alt={pageMedia.careersHero.alt || pageMedia.careersHero.title}
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.22] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Roles for people who like building cleaner systems
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            Explore current openings and submit your details directly through the site. If the
            right role is not listed today, we still welcome strong speculative applications.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.8fr]">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Open positions</h2>
            </div>

            {openRoles.length ? (
              openRoles.map((role) => (
                <article
                  key={role.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        {role.title}
                      </h3>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {[role.department, role.type, role.experience].join(' • ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole(role);
                        setSubmitted(false);
                        setError('');
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
                    >
                      Apply now
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                    {role.summary}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Requirements
                      </h4>
                      <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {role.requirements.map((requirement) => (
                          <li
                            key={requirement}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                          >
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Benefits
                      </h4>
                      <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {role.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                          >
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm leading-8 text-slate-600 dark:text-slate-300">
                  There are no live vacancies listed right now, but the team still welcomes strong
                  speculative applications for future hiring needs.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRole({
                      id: 'general-application',
                      title: 'General application',
                      department: 'Talent Pipeline',
                      location: 'Dubai, UAE',
                      type: 'Open Talent Pool',
                      experience: 'Flexible',
                      summary: 'A general submission for future roles and specialist opportunities.',
                      requirements: ['Share the best evidence of your work and operating style.'],
                      benefits: ['Your profile can be considered for future roles.'],
                      isOpen: true,
                    })
                  }
                  className="mt-5 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
                >
                  Submit a speculative application
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                A team that values clarity and ownership
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                We are building a stronger operating base across product, platform, infrastructure,
                and digital systems. The culture reward is simple: make things clearer and more
                dependable than they were before.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                Office details
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                  <span>{siteSettings.officeAddressLines.join(', ')}</span>
                </p>
                <p>{siteSettings.officeHours}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400" />
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                    Apply for {selectedRole.title}
                  </span>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    Submit your application
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={applicantData.website}
                    onChange={(event) =>
                      setApplicantData((current) => ({ ...current, website: event.target.value }))
                    }
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={applicantData.name}
                      onChange={(value) => setApplicantData((current) => ({ ...current, name: value }))}
                      placeholder="e.g. Tariq Al Mansoor"
                    />
                    <Field
                      label="Work email"
                      type="email"
                      value={applicantData.email}
                      onChange={(value) => setApplicantData((current) => ({ ...current, email: value }))}
                      placeholder="e.g. name@company.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Experience level"
                      value={applicantData.experience}
                      onChange={(value) =>
                        setApplicantData((current) => ({ ...current, experience: value }))
                      }
                      placeholder="mid"
                    />
                    <Field
                      label="Portfolio or resume link"
                      type="url"
                      value={applicantData.portfolio}
                      onChange={(value) =>
                        setApplicantData((current) => ({ ...current, portfolio: value }))
                      }
                      placeholder="https://your-work.example"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Brief introduction
                    </label>
                    <textarea
                      rows={4}
                      value={applicantData.coverText}
                      onChange={(event) =>
                        setApplicantData((current) => ({ ...current, coverText: event.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Tell us what you build well and where you create the most value."
                    />
                  </div>

                  {error && <p className="text-sm text-rose-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {loading ? 'Submitting...' : 'Submit application'}
                    {!loading && <Send className="h-4 w-4" />}
                  </button>
                </form>
              ) : (
                <div className="mt-8 space-y-4 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Application submitted
                  </h4>
                  <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Thanks, {applicantData.name}. Your submission for {selectedRole.title} has been
                    saved successfully.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    Return to careers
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
