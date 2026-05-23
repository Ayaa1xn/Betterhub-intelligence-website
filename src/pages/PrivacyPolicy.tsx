import { ChevronDown, ChevronRight, Mail, ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

type PolicyTopic = {
  title: string;
  summary: string;
  learnMore: string[];
  bullets?: string[];
};

type PolicySection = {
  id: string;
  label: string;
  title: string;
  intro: string;
  topics?: PolicyTopic[];
  notes?: string[];
};

const POLICY_EFFECTIVE_DATE = 'May 22, 2026';

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'introduction',
    label: '01',
    title: 'Introduction',
    intro:
      'This privacy policy explains how BetterHub Intelligence collects, uses, stores, and protects personal information when someone interacts with our website, submits a lead form, applies for a role, or communicates with us through public digital channels.',
    notes: [
      'It applies to website visitors, inquiry submitters, job applicants, newsletter or content readers, and approved internal contributors using the site management system.',
      'If BetterHub delivers a software product, chatbot, portal, or business system to a client, that client may operate under its own privacy notice for the end users of that system.',
      'Supplementary notices can be issued for specific products, services, campaigns, or regulated deployments when extra data handling detail is required.',
    ],
  },
  {
    id: 'information-we-collect',
    label: '02',
    title: 'Personal information we collect and use',
    intro:
      'We collect only the information that is reasonably necessary to operate the website, respond to business inquiries, process applications, improve service quality, and maintain secure digital systems.',
    topics: [
      {
        title: 'Website inquiries and contact forms',
        summary:
          'When you contact us, request a consultation, or ask for information, we collect the details you choose to provide.',
        learnMore: [
          'This may include your name, work email, telephone number, company name, subject line, and message content.',
          'We use that information to respond to the request, qualify the inquiry, route it internally, and keep an operational record of the interaction inside our management system.',
        ],
        bullets: ['Name and contact details', 'Business inquiry content', 'Follow-up status history'],
      },
      {
        title: 'Careers and recruitment activity',
        summary:
          'When you apply for a role or share a CV, we collect recruitment-related information needed to assess the application.',
        learnMore: [
          'This may include your resume, role interest, location, work history, portfolio links, and any information you submit with your application.',
          'We use this information to review candidates, communicate about opportunities, schedule interviews, and maintain a record of recruitment activity.',
        ],
        bullets: ['Resume and application data', 'Interview and review notes', 'Candidate communication history'],
      },
      {
        title: 'Website usage and technical signals',
        summary:
          'Like most modern websites, we collect limited technical information needed to operate and improve the website securely.',
        learnMore: [
          'This may include IP address, device type, browser type, approximate location derived from IP, referring source, visited pages, and interaction timing.',
          'We use this information for performance analysis, security monitoring, abuse prevention, and improving the relevance and usability of the site.',
        ],
        bullets: ['Browser and device metadata', 'Page visit and interaction patterns', 'Diagnostic and security signals'],
      },
      {
        title: 'Administrative and content operations',
        summary:
          'If you are an authorized internal user managing the website, additional operational records may be created when content is published or updated.',
        learnMore: [
          'This may include uploaded assets, content revisions, login activity, and other administrative actions performed within the site management environment.',
          'We use this information to support accountability, content governance, troubleshooting, and security reviews.',
        ],
        bullets: ['Content change records', 'Uploaded media files', 'Administrative access activity'],
      },
    ],
  },
  {
    id: 'how-we-use-and-share',
    label: '03',
    title: 'How we use and share information',
    intro:
      'The information we collect is used to run the website responsibly, deliver requested communication, support hiring activity, protect our digital systems, and improve business operations.',
    topics: [
      {
        title: 'Business operations and communication',
        summary:
          'We use submitted information to answer questions, arrange consultations, provide requested material, and maintain continuity in our business conversations.',
        learnMore: [
          'Operational use can include assigning inquiries internally, tracking response quality, and maintaining records that help our team follow through on requests accurately.',
        ],
      },
      {
        title: 'Service providers and controlled sharing',
        summary:
          'We may share information with trusted service providers that help us host the website, store submissions, secure systems, or operate essential business tooling.',
        learnMore: [
          'Any such sharing is limited to what is reasonably necessary for the task involved and is subject to access control, contractual protection, or operational safeguards.',
          'We do not sell personal information as part of our normal website operations.',
        ],
      },
      {
        title: 'Legal, compliance, and protection purposes',
        summary:
          'We may use or disclose information where reasonably necessary to comply with law, protect rights, investigate abuse, or defend legitimate business interests.',
        learnMore: [
          'This may include responding to lawful requests, enforcing website terms, addressing fraud or misuse, or preserving evidence connected to security and compliance matters.',
        ],
      },
    ],
  },
  {
    id: 'cookies-and-analytics',
    label: '04',
    title: 'Cookies and similar technologies',
    intro:
      'We may use cookies and related technologies to keep the website functional, understand usage patterns, measure performance, and improve the overall browsing experience.',
    topics: [
      {
        title: 'Essential website functions',
        summary:
          'Some cookies or local storage behaviors may be necessary for navigation, interface continuity, theme preferences, or core website functionality.',
        learnMore: [
          'Disabling essential functions at the browser level may affect how parts of the website behave or how settings are remembered between visits.',
        ],
      },
      {
        title: 'Analytics and performance insight',
        summary:
          'We may use analytics to understand which pages are used, where visitors drop off, what content performs best, and where technical improvements are needed.',
        learnMore: [
          'Analytics information is reviewed to improve content structure, page performance, conversion journeys, and service clarity.',
        ],
      },
      {
        title: 'Third-party content and embeds',
        summary:
          'If the website includes externally hosted media, social links, or third-party assets, those providers may apply their own technical controls and privacy practices.',
        learnMore: [
          'Users should review the privacy practices of those external providers when interacting with content that leaves the BetterHub website environment.',
        ],
      },
    ],
  },
  {
    id: 'retention-and-security',
    label: '05',
    title: 'Retention, security, and controlled access',
    intro:
      'We retain personal information only for as long as it is reasonably needed for operational, contractual, recruitment, support, legal, or security purposes.',
    topics: [
      {
        title: 'Retention periods',
        summary:
          'Different categories of information may be retained for different periods depending on the purpose and business context involved.',
        learnMore: [
          'Inquiry records may be retained for sales follow-up and operational history, while recruitment records may be kept for active hiring review or future candidate consideration where appropriate.',
          'Information may also be retained longer where required for legal, regulatory, audit, or dispute-handling purposes.',
        ],
      },
      {
        title: 'Security controls',
        summary:
          'We use reasonable technical and organizational safeguards designed to reduce unauthorized access, disclosure, misuse, or accidental loss.',
        learnMore: [
          'Controls may include access restriction, credential protection, administrative oversight, hosting safeguards, content governance, and routine review of operational workflows.',
          'No website or online service can guarantee absolute security, but we aim to apply practical controls proportionate to the systems we operate.',
        ],
      },
      {
        title: 'Cross-team and vendor access',
        summary:
          'Access to information is limited to the people, teams, or vendors who need it for a legitimate operational reason.',
        learnMore: [
          'Where third-party tools or service providers are involved, access is expected to remain limited, documented, and aligned with the purpose for which the data was collected.',
        ],
      },
    ],
  },
  {
    id: 'your-rights-and-choices',
    label: '06',
    title: 'Your rights and choices',
    intro:
      'Depending on your location and the context in which information was collected, you may have rights relating to access, correction, deletion, restriction, or objection.',
    topics: [
      {
        title: 'Access, correction, and deletion requests',
        summary:
          'You can contact us to request access to the information we hold about you or to request that inaccurate information be corrected.',
        learnMore: [
          'You may also request deletion where retention is no longer necessary and no overriding legal, security, or contractual basis requires continued retention.',
        ],
      },
      {
        title: 'Marketing and communication preferences',
        summary:
          'If you receive communication from us and no longer wish to do so, you can ask us to stop or adjust the type of communication you receive.',
        learnMore: [
          'Operational follow-up regarding an active inquiry, application, or service request may still be necessary even if general marketing communication is reduced or withdrawn.',
        ],
      },
      {
        title: 'Cookie and browser controls',
        summary:
          'You may be able to manage cookies or similar tracking behaviors through browser settings or device-level controls.',
        learnMore: [
          'Changes made through browser settings may affect site behavior, interface continuity, or performance measurement functionality.',
        ],
      },
    ],
  },
  {
    id: 'contact-and-updates',
    label: '07',
    title: 'Contact and policy updates',
    intro:
      'We may revise this privacy policy when the website, our services, or our operational practices change. When we do, we update the effective date shown on this page.',
    notes: [
      'Material updates should be reflected here so visitors can understand the current version of the policy being applied.',
      'If you have privacy-related questions, requests, or concerns, contact us using the details provided on this page so the request can be reviewed by the appropriate team.',
    ],
  },
];

export default function PrivacyPolicy() {
  const {
    content: { siteSettings },
  } = useSiteContent();

  const privacyContactLink = `mailto:${siteSettings.contactEmail}?subject=Privacy%20policy%20request`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.55fr)] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <span>Home</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Privacy</span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
                  Privacy Policy
                </h1>
                <p className="max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                  This page explains how {siteSettings.companyName} handles personal information
                  across the public website, inquiry flows, careers activity, and website
                  management operations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                  Effective date: {POLICY_EFFECTIVE_DATE}
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                  This privacy policy has been updated
                </span>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Previous versions can be provided on request.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  If you need a version history, clarification on a specific section, or want to
                  raise a privacy-related request, contact the BetterHub team directly.
                </p>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white dark:bg-slate-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Policy scope
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    Visitors, leads, candidates, and authorized site contributors
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <li>Applies to public website usage, contact forms, content interactions, and careers flows.</li>
                <li>Supplementary notices may apply to client-owned systems or specialized product environments.</li>
                <li>Privacy requests can be sent to the team using the direct contact channel below.</li>
              </ul>

              <a
                href={privacyContactLink}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <Mail className="h-4 w-4" />
                Contact privacy team
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                On this page
              </p>
              <nav className="mt-4 space-y-2" aria-label="Privacy policy sections">
                {POLICY_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <span className="mr-2 font-bold text-blue-600 dark:text-blue-300">{section.label}</span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-12">
            {POLICY_SECTIONS.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Section {section.label}
                    </p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-300">
                  {section.intro}
                </p>

                {section.notes ? (
                  <div className="mt-6 space-y-4">
                    {section.notes.map((note) => (
                      <div
                        key={note}
                        className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.topics ? (
                  <div className="mt-8 space-y-5">
                    {section.topics.map((topic) => (
                      <div
                        key={topic.title}
                        className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {topic.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {topic.summary}
                        </p>

                        {topic.bullets ? (
                          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {topic.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-300" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <details className="group mt-5 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                            Learn more
                            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                          </summary>
                          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {topic.learnMore.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}

            <section className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm dark:border-slate-800 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
                Privacy Requests
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Need help with a privacy question or request?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
                For access, correction, deletion, policy clarification, or operational privacy
                questions related to this website, contact us directly and we will route the
                request to the appropriate team.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={privacyContactLink}
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-slate-200"
                >
                  Email {siteSettings.contactEmail}
                </a>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/8"
                >
                  Call {siteSettings.phone}
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
