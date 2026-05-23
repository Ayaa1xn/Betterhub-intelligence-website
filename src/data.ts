import {
  Slide,
  ServiceDetailItem,
  ProductDetailItem,
  IndustryItem,
  BlogPost,
  CareerRole,
  MediaFields,
  MetricStat,
  SiteContent,
  SitePageMedia,
  SiteSettings,
  Testimonial,
} from './types';

const MEDIA_IMAGES = {
  officeTeam: '/uploads/generated-team-office.png',
  developerDualMonitor: '/uploads/generated-web-dev.png',
  doctorLaptop: '/uploads/generated-healthcare.png',
  classroomTech: '/uploads/generated-education.png',
  restaurantPos: '/uploads/generated-restaurant.png',
  warehouse: '/uploads/generated-logistics.png',
  cityOffice: '/uploads/industry-real-estate.png',
  ecommerceDesk: '/uploads/generated-ecommerce.png',
  serverRack: '/uploads/generated-networking.png',
  industryHealthcare: '/uploads/industry-healthcare-portrait.jpg',
  industryEducation: '/uploads/industry-education-portrait.jpg',
  industryRetail: '/uploads/industry-retail-portrait.jpg',
  industryHospitality: '/uploads/industry-hospitality-portrait.jpg',
  industryLogistics: '/uploads/industry-logistics-portrait.jpg',
  industryRealEstate: '/uploads/industry-real-estate-portrait.jpg',
} as const;

const MEDIA_VIDEOS = {
  homeHeroWebDev: '/uploads/home-hero-web-dev.mp4',
  homeHeroAi: '/uploads/home-hero-ai.mp4',
  homeHeroHrms: '/uploads/home-hero-hrms.mp4',
  homeHeroSmartBuilding: '/uploads/home-hero-smart-building.mp4',
  homeHeroEcommerce: '/uploads/home-hero-ecommerce.mp4',
  webDev: '/uploads/generated-web-dev.mp4',
  teamOffice: '/uploads/generated-team-office.mp4',
  digitalMarketing: '/uploads/generated-digital-marketing.mp4',
  ecommerce: '/uploads/generated-ecommerce.mp4',
  ai: '/uploads/generated-ai.mp4',
  hrms: '/uploads/generated-hrms.mp4',
  smartBuilding: '/uploads/generated-smart-building.mp4',
  servicesCatalog: '/uploads/page-services-catalog.mp4',
  careersHero: '/uploads/page-careers-hero.mp4',
} as const;

export const HERO_SLIDES: Slide[] = [
  {
    id: "slide-1",
    title: "High-Performance Web Development with SEO in its DNA",
    subtitle: "At BetterHub, we build your digital foundation with search visibility and performance as the starting point. From clean, lightweight code to lightning-fast speeds, we make sure you're found from Day One.",
    ctaText: "Get Your SEO-Ready Website Today",
    ctaPath: "/service/seo-web-dev",
    image: MEDIA_IMAGES.developerDualMonitor,
    video: MEDIA_VIDEOS.homeHeroWebDev
  },
  {
    id: "slide-2",
    title: "Enterprise-Grade AI That Delivers Real ROI",
    subtitle: "We transform cutting-edge Artificial Intelligence into practical, secure business tools. From custom LLMs trained on private data to intelligent predictive analytics, we secure your competitive edge in the 2026 digital economy.",
    ctaText: "Explore Partner AI Capabilities",
    ctaPath: "/service/ai-solutions",
    image: MEDIA_IMAGES.officeTeam,
    video: MEDIA_VIDEOS.homeHeroAi
  },
  {
    id: "slide-3",
    title: "AI-Powered HRMS Engineered for the UAE Labor Landscape",
    subtitle: "Automate Wages Protection System (WPS) compliance, MOHRE declarations, Emiratization (Nafis) targets, and precise End of Service Benefit (EOSB) calculations with our smart, bilingual HR platform.",
    ctaText: "Request an HRMS Live Demo",
    ctaPath: "/product/hrms",
    image: MEDIA_IMAGES.officeTeam,
    video: MEDIA_VIDEOS.homeHeroHrms
  },
  {
    id: "slide-4",
    title: "Advanced Extra-Low Voltage (ELV) and Smart Buildings",
    subtitle: "Sophisticated SIRA & MCC compliant IP-CCTV surveillance, AI-powered Access Control with UAE PASS, and civil defense-approved fire/PA systems. The physical and digital nervous system of your space.",
    ctaText: "Consult with an ELV Architect",
    ctaPath: "/service/elv-engineering",
    image: MEDIA_IMAGES.cityOffice,
    video: MEDIA_VIDEOS.homeHeroSmartBuilding
  },
  {
    id: "slide-5",
    title: "High-Conversion E-Commerce Optimised for 2026",
    subtitle: "Stop chasing traffic, start engineering sales. Decoupled headless architecture leveraging composable MACH principles, integrated with local favorites like Tabby, Tamara, and UAE payment gateways.",
    ctaText: "Build Your Headless Store",
    ctaPath: "/service/ecommerce-solutions",
    image: MEDIA_IMAGES.ecommerceDesk,
    video: MEDIA_VIDEOS.homeHeroEcommerce
  }
];

export const SERVICES: ServiceDetailItem[] = [
  {
    id: "seo-web-dev",
    title: "Custom SEO-First Web Development",
    subtitle: "We don't use bloated templates. We build custom, lightweight websites using semantic HTML5, CSS3, and modern React architectures to ensure perfect indexing, speed, and sleek transitions, loved by search engines and humans.",
    tagline: "We Build Websites That Search Engines Love and Humans Adore.",
    longDescription: "Most agencies build a site and then 'add SEO.' At BetterHub, we integrate technical SEO directly into every line of code, ensuring your site ranks higher, loads sub-2 seconds, and converts better from the moment of launch.",
    bulletTitle: "Our Strategic Web Design Approach:",
    bullets: [
      "Semantic HTML5 Markup & JSON-LD Rich Schema structured specifically for search indexing.",
      "Vitals Optimization ensuring Google 'Core Web Vitals' indicators are consistently in the deep green.",
      "Mobile-First Responsive Liquid Layouts built seamlessly to adapt from 5-inch mobile displays to 32-inch ultra-wide monitors.",
      "Advanced content mapping structured for Generative Engine Optimisation (GEO) so AI agents cite your brand."
    ],
    techTitle: "Technical Standards Implemented:",
    techs: ["React & Vite SPA", "Tailwind CSS", "Semantic HTML5/CSS3", "JSON-LD Structured Markup", "Node.js Serverless Rendering"],
    features: [
      { featureTitle: "Ultra-Fast Speeds", description: "Optimized server responses, minified assets, and next-gen WebP formatting.", impact: "Reduces bounce rates and boosts search rankings by up to 45%." },
      { featureTitle: "Full SSL/TLS & Trust", description: "Secure security integrations following banking-grade guidelines.", impact: "Builds user credibility and signals immediate Google priority." },
      { featureTitle: "Sitemap Auto-Gen", description: "Seamless, dynamic, auto-updated XML sitemaps mapped strictly to robots.txt rules.", impact: "Guarantees indexation of new pages under 24 hours." }
    ],
    image: MEDIA_IMAGES.developerDualMonitor,
    video: MEDIA_VIDEOS.webDev
  },
  {
    id: "mobile-apps",
    title: "Mobile Applications Development",
    subtitle: "Create responsive and high-performance native and cross-platform mobile apps aligned with UAE expectations, focusing on battery efficiency, low data overhead, and lightning-fast launching times.",
    tagline: "Performance-Driven Mobile Apps. Engineered for Deep Brand Organic Visibility.",
    longDescription: "We don't just build apps; we build custom-tailored digital ecosystems. BetterHub creates secure iOS and Android software with built-in metadata schemas, smooth transition animations, and high ASO ratings on major marketplaces.",
    bulletTitle: "Core Mobile Specializations:",
    bullets: [
      "Native iOS (Swift) & Android (Kotlin) engineering for extreme performance and hardware-level stability.",
      "Cross-Platform solutions using Flutter & React Native, ensuring 100% feature consistency across all clients.",
      "App Store Optimization (ASO) pre-integrated directly into core schemas, assets, and app store configurations.",
      "Offline cache support allowing continuous functionality under irregular network environments."
    ],
    techTitle: "Frameworks & Native Technologies:",
    techs: ["Flutter", "React Native", "Swift / Kotlin", "Node.js Gateway APIs", "Secure OAuth2 / UAE PASS Integration"],
    features: [
      { featureTitle: "User-Centric UI/UX", description: "Reduced friction journeys designed to keep active retention levels elevated.", impact: "Ensures higher retention and 5-star marketplace review profiles." },
      { featureTitle: "Deep Web-Mobile Sync", description: "Universal deep-linking structures that connect search pages right into app modules.", impact: "Creates a circular traffic funnel across web and native apps." },
      { featureTitle: "Robust Backend APIs", description: "Secure, cached, structured Rest/GraphQL pipelines mapped with encryption guidelines.", impact: "Maintains absolute data protection and instant sub-100ms state updates." }
    ],
    image: MEDIA_IMAGES.officeTeam
  },
  {
    id: "digital-marketing",
    title: "Performance Branding & Digital Marketing",
    subtitle: "Integrate highly advanced SEO, Generative Engine Optimization (GEO), and culturally intelligent branding that transforms Middle Eastern digital products from basic links into industry authorities.",
    tagline: "Don't Just Build a Brand. Build an Undisputed Industry Authority.",
    longDescription: "In 2026, digital marketing is no longer about simple keyword reach—it's about relevance and intent retrieval. BetterHub blends data-driven SEO audits with high-impact visuals to ensure your platforms rank on humans and AI engines.",
    bulletTitle: "Our Strategic Direct-Response Framework:",
    bullets: [
      "Generative Engine Optimisation (GEO) to get your services quoted on modern answer engines and intelligent search assistants.",
      "Predictive Analytics & Audience Slicing to mapping buyer persona gaps in the local UAE & MENA business landscapes.",
      "Omnichannel Messaging Sync that integrates search visibility, targeted campaigns, and key corporate accounts.",
      "Expert-led content clusters signaling maximum E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)."
    ],
    techTitle: "Our Performance Arsenal:",
    techs: ["GEO Semantic Analytics", "Full-Funnel CRO Testing", "Multi-channel Attribution Modellers", "Google Enterprise Analytics"],
    features: [
      { featureTitle: "SEO Authority Clusters", description: "Highly localized Search landscapes mapped specifically with intent-centric content.", impact: "Generates pure organic traffic which outperforms ads expense ratios." },
      { featureTitle: "Culturally Intelligent Design", description: "Branding built for multilingual UAE customer pools without losing brand tone.", impact: "Increases conversions across diverse demographic groups in Dubai." },
      { featureTitle: "Social Search Mastery", description: "Optimizing platform indexes for TikTok, Instagram and LinkedIn discovery grids.", impact: "Secures search exposure across younger demographic platforms." }
    ],
    image: MEDIA_IMAGES.ecommerceDesk,
    video: MEDIA_VIDEOS.digitalMarketing
  },
  {
    id: "ecommerce-solutions",
    title: "Composable & Headless E-Commerce solutions",
    subtitle: "High-conversion commerce engines built utilizing robust headless MACH principles to drive fast loading speeds and optimize conversion metrics.",
    tagline: "Stop Chasing Digital Traffic. Start Engineering Direct Sales.",
    longDescription: "Don't be locked into slow, non-compliant ecommerce architectures. We construct lightning-fast composable websites that decouple the design layer from back-end parameters, resulting in immediate load times and perfect Middle Eastern local integrations.",
    bulletTitle: "Core E-Commerce Infrastructure Features:",
    bullets: [
      "Composable Headless Storefronts isolating frontend React frameworks from Shopify Plus, Adobe Magento, or custom databases.",
      "Mandatory integration with localized Middle Eastern favorites like Tabby, Tamara, and modern digital wallets.",
      "Real-time synchronized inventory modules that instantly update visual elements across multi-tenant feeds.",
      "Dynamic localized checkouts that adapt language, currencies (AED, SAR), and local UAE addresses seamlessly."
    ],
    techTitle: "Compatible Platforms & Tools:",
    techs: ["Shopify Plus", "Adobe Commerce/Magento", "BigCommerce Headless", "Next.js & React Storefronts", "Stripe, Tabby & Tamara APIs"],
    features: [
      { featureTitle: "Zero-Lag Checkout Flows", description: "Optimized one-click checkout procedures configured with pre-saved values.", impact: "Reduces cart abandonment metrics by up to 35% instantly." },
      { featureTitle: "AI Semantic Filtering", description: "Context-aware item search capabilities that interpret buyer intent in natural language.", impact: "Increases average order value (AOV) through precise visual recommendation." },
      { featureTitle: "Automated Shipping Sync", description: "Direct native API connections to Middle Eastern providers including Aramex and DHL.", impact: "Streamlines fulfillment pipeline and updates customers automatically." }
    ],
    image: MEDIA_IMAGES.ecommerceDesk,
    video: MEDIA_VIDEOS.ecommerce
  },
  {
    id: "computer-networking",
    title: "Computer Networking & Cloud Solutions",
    subtitle: "Design, provision, and maintain secure Zero-Trust wide-area private channels (SD-WAN) and IT networks designed for high-availability enterprise applications.",
    tagline: "The Resilient Digital Backbone of Your Enterprise. Optimized for Low Latency.",
    longDescription: "In a world of distributed architectures and cloud-heavy systems, your connection is literally your business lifeline. BetterHub architects secure networks that prioritize sub-millisecond route optimization, zero-trust protocols, and immediate horizontal scaling.",
    bulletTitle: "Enterprise Networking Specialities:",
    bullets: [
      "SD-WAN Installations linking cloud instances across azure, AWS, and localized GCC data centers.",
      "Zero-Trust Architecture verifying every data payload, using security tunnels and encrypted gateways.",
      "Slightly-built Wi-Fi 6E & 7 high-density wireless layouts for corporate offices, workspaces, and luxury hospitality blocks.",
      "Structured cabling using high-speed Class E sub-elements and high-speed multi-mode fiber networks."
    ],
    techTitle: "Network & SASE Partners:",
    techs: ["Cisco Systems", "Ubiquiti UniFi Enterprise", "Fortinet Secure Gateways", "AWS Transit Gateway", "Cloudflare SASE Tunneling"],
    features: [
      { featureTitle: "AI-Ops Proactive Monitoring", description: "Intelligent analytics checking route errors, interface load, and packet details 24/7.", impact: "Predicts software failures before they impact staff operations, reaching 99.99% uptime." },
      { featureTitle: "Localized Server Config", description: "Physical server setups, custom racks, and power units with secure failover architectures.", impact: "Ensures compliance with national cloud protection guidelines." },
      { featureTitle: "IP Telephony & PABX Setup", description: "VoIP and SIP trunk setups linking all corporate endpoints seamlessly.", impact: "Streamlines inter-departmental communications at scale." }
    ],
    image: MEDIA_IMAGES.serverRack
  },
  {
    id: "ai-solutions",
    title: "Artificial Intelligence Solutions",
    subtitle: "Incorporate powerful AI models, private LLMs, predictive tools, and document OCR systems natively aligned with localized requirements.",
    tagline: "Move Beyond the Hype. Deploy Practical AI with Verified Financial ROI.",
    longDescription: "BetterHub translates neural networks into actual, functional tools. We specialize in building secure, custom-trained large language models, structured recommendation pipelines, and smart automation agents that operate in compliance with Middle Eastern regulatory frameworks.",
    bulletTitle: "Robust Artificial Intelligence Vectors:",
    bullets: [
      "Bespoke Private LLM systems trained with your internal company manuals and documents, preserving absolute confidentiality.",
      "Predictive analytics assessing historical database tables to forecast transactional behavior, inventory demands, and sales trends.",
      "Multilingual cognitive chatbots providing natural Arabic and English client help desk assistance 24/7.",
      "Computer Vision systems tracking inventory details, security anomalies, and automated document reading."
    ],
    techTitle: "AI Stack & Framework Expertise:",
    techs: ["Open-weight LLM Frameworks", "Hugging Face Models", "Python FastAPI Hubs", "Pinecone Vector Indexes", "LangChain & Agentic Workflows"],
    features: [
      { featureTitle: "Strict Data Sovereignty", description: "Ensuring models run on sandboxed environments or regional secure cloud locations.", impact: "Protects proprietary company intellectual values from leakages." },
      { featureTitle: "Agentic Workflow Automation", description: "Deploying bots that integrate with ERP endpoints to complete complex clerical jobs.", impact: "Reduces redundant administrative efforts by up to 60%." },
      { featureTitle: "Personalized Recommendation", description: "Providing personalized e-commerce suggestions based on deep search histories.", impact: "Provides immediate, quantifiable boosts to sales conversion metrics." }
    ],
    image: MEDIA_IMAGES.officeTeam,
    video: MEDIA_VIDEOS.ai
  },
  {
    id: "elv-engineering",
    title: "Advanced Extra-Low Voltage (ELV) Engineering",
    subtitle: "Design and implement sophisticated SIRA/MCC approved IP-CCTV surveillance systems, access controls, fire alarms, and smart building management.",
    tagline: "The Intelligent and Compliant Physical Nervous System of Your Buildings.",
    longDescription: "BetterHub acts as a certified specialist in Extra-Low Voltage systems across Dubai and the UAE. We craft interconnected solutions that link building environmental details with automation and security, optimizing operations and ensuring safety standards.",
    bulletTitle: "Certified ELV Engineering Areas:",
    bullets: [
      "IP-CCTV systems compliant with local SIRA (Dubai) and MCC (Abu Dhabi) governmental specifications.",
      "Biometric, RFID, and mobile access frameworks integrated directly with corporate security databases.",
      "Civil defense approved Fire Detection systems coupled with multilingual Public Address and Voice Evacuation mechanisms.",
      "Full Building Management Systems (BMS) enabling micro-control over HVAC, lighting, and performance diagnostics."
    ],
    techTitle: "Hardware Partners & Standards:",
    image: MEDIA_IMAGES.cityOffice,
    video: MEDIA_VIDEOS.smartBuilding,
    techs: ["Honeywell BMS", "Schneider Electric Controls", "Bosch Security Systems", "SIRA / MCC Regulatory Codes", "BACnet & Modbus Protocols"],
    features: [
      { featureTitle: "SIRA & MCC Compliance Audit", description: "Pre-inspection checklists verifying camera focal points, frame outputs, and local servers.", impact: "Ensures immediate, hassle-free municipal operating license renewals." },
      { featureTitle: "AI Visual Analytics", description: "Facial recognition patterns, license plate scanners (ANPR), and behavioral sensors.", impact: "Provides automated, pro-active emergency response mechanisms." },
      { featureTitle: "Smart Energy Optimization", description: "Integrating occupancy patterns right into HVAC and corridor illumination controls.", impact: "Cuts down administrative utility bills by up to 25%." }
    ]
  }
];

export const PRODUCTS: ProductDetailItem[] = [
  {
    id: "his-medical",
    title: "Hospital Information System (HIS)",
    category: "Medical Management Software",
    subtitle: "A comprehensive, paperless clinical and administrative ERP software built for Middle Eastern medical hubs, clinics, and multi-specialty hospitals.",
    tagline: "Natively Integrated with Dubai Nabidh, Abu Dhabi Malaffi, and Northern Emirates Riayati.",
    longDescription: "Our Hospital Information System serves as the clinical engine your team deserves. It simplifies the electronic health tracking pipeline from initial booking to secure local billing, ensuring compliance with strict healthcare rules across all UAE emirates.",
    features: [
      "Unified Electronic Health Records (EHR) displaying laboratory sheets, medication scripts, and historical charts on one single grid.",
      "Bilingual patient dashboards allowing booking, chat, and telemetry checks using secure UAE PASS logins.",
      "Integrated Revenue Cycle Management (RCM) utilizing local coding guidelines (ICD-10 CM, CPT) to scrub claims.",
      "Automatic synchronization with DHA Nabidh, DOH Malaffi, and MOHAP Riayati protocols."
    ],
    advantageTitle: "The BetterHub Medical Edge:",
    advantages: [
      { feature: "Regulatory Integration", standard: "Direct native syncing with Nabidh, Malaffi, and Riayati pipelines.", need: "Eliminates penalties and guarantees immediate facility license renewals." },
      { feature: "Claims Scrubber", standard: "Automatic real-time validation against coding guidelines matching ICD-10 protocols.", need: "Lowers insurance rejections by 92% and speeds up payments." },
      { feature: "Data Sovereignty", standard: "100% locally hosted in secure UAE-compliant private clouds.", need: "Fully aligns with UAE Health Data Protection laws." }
    ],
    processTitle: "Our Clinical Implementation Roadmap:",
    processes: [
      "Workflow Analysis: We shadow your doctors, specialists, and desks to copy existing flows.",
      "Data Migration: Professional, secure transfer of legacy patient database records, files, and templates.",
      "Gateway Sync: Connecting interfaces with local insurers, laboratory systems, and health networks.",
      "24/7 Dedicated Help Desk Support: Direct telephone lines for clinical assistance and immediate updates."
    ],
    image: MEDIA_IMAGES.industryHealthcare
  },
  {
    id: "ems-education",
    title: "Education Management System (EMS)",
    category: "Educational Institution Management Software",
    subtitle: "An all-in-one institutional ERP linking curriculum targets, parent communications, school fees, and KHDA/ADEK reporting guidelines.",
    tagline: "Empower Your Educators, Simplify Compliance. Build the Class of 2026.",
    longDescription: "Our Education Management System streamlines complex academic workflows. We provide academic hubs, international colleges, and nurseries with the exact tools needed to achieve high regulatory rankings and construct fully modern learning spaces.",
    features: [
      "KHDA, ADEK & SPEA custom automated data synchronization systems to instantly export inspection-ready statistics.",
      "Cognitive personalized learning layers assessing pupil performance to notify teachers of potential academic gaps.",
      "Unified school fee collectors integrated with digital platforms including Apple Pay, Google Pay, and UAE direct debit.",
      "Parent portal dashboards showcasing real-time homework cards, event timelines, and IoT school bus trackers."
    ],
    advantageTitle: "The BetterHub Academic Edge:",
    advantages: [
      { feature: "Inspection Readiness", standard: "Immediate export files for KHDA (Dubai), ADEK (Abu Dhabi), and SPEA (Sharjah) audits.", need: "Saves administrative prep hours before inspectors arrive." },
      { feature: "Personalized Education", standard: "Adaptive grading grids built with automated learning recommendations.", need: "Boosts average class completion rates by up to 22%." },
      { feature: "WPS Compliance Sync", standard: "Preconfigured Wage Protection System templates for school payrolls.", need: "Keeps financial departments transparent and natively lawful." }
    ],
    processTitle: "Our Academic Deployment Steps:",
    processes: [
      "Curriculum Mapping: Configuring grids to reflect British, American, IB, or CBSE parameters directly.",
      "Student Import: Securely synchronizing historical student profiles, transcripts, and financial logs.",
      "Platform Onboarding: Interactive tutorials for teachers, desk staff, and parent representatives.",
      "Inspection Dry-runs: Simulating government reporting pipelines to ensure data fields match correctly."
    ],
    image: MEDIA_IMAGES.industryEducation
  },
  {
    id: "hrms",
    title: "AI-Powered HRMS",
    category: "HR Management Software",
    subtitle: "A highly intuitive, fully compliant Human Resource system crafted for the specific regulatory and recruitment parameters of the United Arab Emirates.",
    tagline: "Smart Visa Tracking, Automated WPS, MOHRE Alignment, and Nafis Tracking Dashboards.",
    longDescription: "In 2026, managing a corporate team in Dubai is heavily tied to rapid updates. BetterHub HRMS bridges standard HR grids with direct Wages Protection System (WPS) files, MOHRE-approved contracts, and active targets tracking.",
    features: [
      "Direct Wage Protection System (WPS) integrations generating verified, ready-to-upload SIF documents.",
      "Emiratization (Nafis) data widgets tracking hire percentages and suggesting appropriate job codes for visa submissions.",
      "Smart document count-down trackers flagging passport, visa, and corporate license expirations 90/60/30 days out.",
      "Bilingual English and Arabic mobile self-service employee platform enabling vacation requests and payslip audits."
    ],
    advantageTitle: "The BetterHub HRMS Edge:",
    advantages: [
      { feature: "Fine Prevention", standard: "Automated passport, Emirates ID, and MOHRE updates with push warnings.", need: "Protects corporations from costly administrative penalties." },
      { feature: "Emiratization Target Tracker", standard: "Real-time projection widgets outlining Nafis compliance ratios.", need: "Keeps your enterprise aligned with government quotas." },
      { feature: "End of Service Benefit (EOSB)", standard: "Accurate local calculations based on Basic Wage parameters and UAE Labor laws.", need: "Eliminates calculating errors during offboarding operations." }
    ],
    processTitle: "Our HR System Implementation Cycle:",
    processes: [
      "Compliance Review: Standardizing current employee data files to match MOHRE definitions.",
      "Data Migration: Moving all employee history profiles, visa records, and payroll histories.",
      "Payment Setup: Connecting platform engines with your bank's WPS portal interface.",
      "Go-Live Onboarding: Launching the bilingual WhatsApp-style self-service mobile interfaces."
    ],
    image: MEDIA_IMAGES.officeTeam,
    video: MEDIA_VIDEOS.hrms
  },
  {
    id: "pos-restaurant",
    title: "Next-Gen Restaurant POS",
    category: "Restaurant POS Systems",
    subtitle: "A cloud-first, SIRA-approved restaurant management POS syncing localized delivery gates, smart inventory costing, and e-invoicing laws.",
    tagline: "Pre-Configured with Mandatory FTA E-Invoicing and Seamless Aggregator Integration.",
    longDescription: "Stop fighting delivery aggregator tablet chaos. Our POS serves as the single digital command center of your culinary business, linking Talabat, Deliveroo, and Careem tickets directly to your Kitchen Display, while instantly filing VAT records.",
    features: [
      "Unified multi-channel ordering syncing aggregator tickets straight into high-speed Kitchen displays (KDS).",
      "Mandatory Federal Tax Authority (FTA) E-Invoicing complying with PINT-AE XML parameters natively.",
      "Smart inventory deduction subtraction down to the gram, with automated weekend low-stock push warnings.",
      "Support for hybrid regional payment modes including Apple Pay, online credits, and NFC card services."
    ],
    advantageTitle: "The BetterHub POS Edge:",
    advantages: [
      { feature: "Tablet Consolidation", standard: "One single engine linking Talabat, Deliveroo, and Careem feeds.", need: "Eliminates administrative ordering errors and saves front-desk space." },
      { feature: "FTA Compliance", standard: "Immediate, locked-down transmission of transaction VAT profiles to tax authorities.", need: "Eliminates AED 50,000 corporate non-conformance tax penalties." },
      { feature: "Offline Continuity", standard: "Automatic storage syncing features if physical shop connection fails temporarily.", need: "Guarantees continuous transaction processing without interruptions." }
    ],
    processTitle: "Our Restaurant POS Setup Cycle:",
    processes: [
      "Menu Architecting: Designing digital layouts and kitchen routing parameters.",
      "Aggregator Links: Hooking up APIs with Talabat, Deliveroo, and Careem accounts.",
      "Terminal Mounting: Installing secure, spill-proof restaurant sales displays and printers.",
      "Staff Drills: Live, fast tutorials ensuring cashier competency in under 15 minutes."
    ],
    image: MEDIA_IMAGES.restaurantPos
  }
];

export const INDUSTRIES: IndustryItem[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    tagline: "Natively integrated patient tracking and e-claims.",
    description: "Multi-specialty clinics and hospitals require seamless clinical workflows and absolute data protection. We architect medical portals integrated with Dubai Nabidh, Abu Dhabi Malaffi, and Northern Emirates Riayati, complying with all Health Data regulations.",
    iconName: "HeartPulse",
    challenges: [
      "Strict cloud storage and local patient information laws.",
      "High insurance e-claims rejection ratios due to billing errors.",
      "Data isolation across medical departments."
    ],
    solutions: [
      "100% locally-hosted patient databases.",
      "Automated Claims Scrubber interpreting local ICD-10 CPT rules.",
      "Unified clinical charts pooling data across radiology, labs, and pharmacies."
    ],
    image: MEDIA_IMAGES.doctorLaptop
  },
  {
    id: "education",
    name: "Education",
    tagline: "Pre-configured KHDA & ADEK school reporting systems.",
    description: "International learning campuses and nursery chains need integrated administrative systems. We sync curriculum pathways, dynamic gradebooks, digital fee controllers, and localized student registers to boost performance scores.",
    iconName: "GraduationCap",
    challenges: [
      "Slow municipal audit files preparation for annual cycles.",
      "Manual multi-curriculum grade reporting across school boards.",
      "Irregular parent engagement channels."
    ],
    solutions: [
      "Instant compliance export files mirroring KHDA & ADEK indicators.",
      "Personalized learning recommenders calculating school metrics.",
      "Bilingual mobile portals with push notifications and GPS tracking."
    ],
    image: MEDIA_IMAGES.classroomTech
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    tagline: "MACH headless storefronts integrated with Tabby & Tamara.",
    description: "Modern retail requires frictionless transactions across digital channels and offline storefronts. We implement fast composable checkouts, semantic AI catalog search, and Middle Eastern BNPL payment facilities.",
    iconName: "ShoppingBag",
    challenges: [
      "High mobile cart abandonment levels due to checkout delays.",
      "Irregular inventory syncing between online portals and warehouses.",
      "Rigid visual templates restricting custom campaign designs."
    ],
    solutions: [
      "Headless decoupled storefronts loading under a second.",
      "Real-time centralized multi-feeds updating instantly.",
      "Custom responsive layouts built directly on modern codebases."
    ],
    image: MEDIA_IMAGES.industryRetail
  },
  {
    id: "hospitality",
    name: "Hospitality & Food Service",
    tagline: "Tablet-free restaurant POS and high-density guest networks.",
    description: "Dubai stands as a world tourism center. BetterHub coordinates high-capacity guest networks, smart hospitality building systems, and omnichannel restaurant POS infrastructures designed to streamline guest experiences.",
    iconName: "UtensilsCrossed",
    challenges: [
      "Tablet clutter due to separate online food delivery systems.",
      "Irregular Wi-Fi coverage across spacious hotel layouts.",
      "High VAT filing error rates during peak holiday periods."
    ],
    solutions: [
      "API aggregators pushing delivery logs right into your POS KDS.",
      "High-density Wi-Fi 6E/7 networks dynamically routing traffic.",
      "PINT-AE compliant tax engines automating FTA records."
    ],
    image: MEDIA_IMAGES.industryHospitality
  },
  {
    id: "logistics",
    name: "Logistics & Transport",
    tagline: "Integrated middleware optimizing route and shipping metrics.",
    description: "Enable absolute fleet transparency across Dubai, Jebel Ali port, and global destinations. We coordinate route monitoring applications, real-time client trackers, and automated port custom clearances.",
    iconName: "Truck",
    challenges: [
      "Inefficient route tracking resulting in costly fuel consumption.",
      "Poor tracking details provided to final clients.",
      "Slow shipping documentation generation."
    ],
    solutions: [
      "Al-Ops route optimizers analyzing transit conditions.",
      "Interactive real-time map portals detailing cargo steps.",
      "Native integrations with shipping networks and customs databases."
    ],
    image: MEDIA_IMAGES.industryLogistics
  },
  {
    id: "realestate",
    name: "Real Estate & Construction",
    tagline: "SIRA security engineering and smart property portals.",
    description: "Dubai real estate remains highly competitive. We build reliable digital property portals alongside SIRA-certified physical systems to streamline investments and secure property properties.",
    iconName: "Building2",
    challenges: [
      "Ineffective security setups delaying municipal inspection releases.",
      "Slow search portals failing to index agent property profiles.",
      "Disjointed systems managing facility utilities."
    ],
    solutions: [
      "SIRA-compliant physical ELV IP-CCTV setups.",
      "SEO-rich real estate search engines loading under 2 seconds.",
      "Unified BMS panels optimizing environmental details."
    ],
    image: MEDIA_IMAGES.industryRealEstate
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "BetterHub isn't just a basic tech vendor; they are a genuine technical co-founder. They anticipated critical UAE WPS regulatory shifts months before they went live, ensuring our HRMS systems remained 100% compliant and fine-free.",
    author: "Fatima Al Mansoori",
    role: "Chief People Officer",
    company: "Apex Enterprise Group Dubai",
    rating: 5
  },
  {
    id: "test-2",
    quote: "Upgrading our medical network architecture to BetterHub HIS completely cut down our administrative claim delays. Their direct Nabidh syncing links our clinic records to Dubai DHA health nets natively. Absolute game-changer.",
    author: "Dr. Alexander Wright",
    role: "Medical Director",
    company: "Elysian Wellness Clinic Abu Dhabi",
    rating: 5
  },
  {
    id: "test-3",
    quote: "Converting our retail stores to BetterHub's Headless React storefront immediate cut our loading times to under a second, increasing mobile orders on Apple Pay by 42%. Their integrated Tabby and Tamara support was seamless.",
    author: "Yousuf Al Hashemi",
    role: "Head of Digital Commerce",
    company: "Hashemi Luxury Retail",
    rating: 5
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Navigating Middle Eastern AI Compliance in 2026",
    summary: "As secure data protection guidelines become strictly active in the UAE, here is how Middle Eastern businesses should safely train custom LLMs.",
    content: "<p>With local cloud requirements gaining serious legal weight, the traditional public-API-first approach represents a real operational risk. At BetterHub, we prioritize data sovereignty and tightly controlled deployment patterns.</p><p>This guide outlines practical steps for building private language workflows that improve operations while keeping sensitive company, customer, and medical data protected.</p>",
    category: "Artificial Intelligence",
    publishedAt: "2026-05-12",
    author: "Tariq Mahmud, AI Lead",
    readTime: "6 min read",
    image: MEDIA_IMAGES.officeTeam,
    status: "published"
  },
  {
    id: "blog-2",
    title: "Understanding Generative Engine Optimisation (GEO)",
    summary: "Standard Google search indexing has officially shifted. Learn how to optimize your company's semantic web assets so AI response models cite your brand.",
    content: "<p>When users ask answer engines directly instead of browsing lists of links, traditional keyword stuffing stops working. Generative Engine Optimisation represents the next step in digital visibility.</p><p>We look at schema markup standards, reusable facts, and semantic authority signals that help a brand stay visible in an answer-first web.</p>",
    category: "Digital Marketing",
    publishedAt: "2026-04-28",
    author: "Sarah Jenkins, Search Analyst",
    readTime: "5 min read",
    image: MEDIA_IMAGES.ecommerceDesk,
    status: "published"
  },
  {
    id: "blog-3",
    title: "ELV Security Standards and Dubai SIRA Operating Checks",
    summary: "A practical developer checklist for real estate directors to pass local building security inspection audits.",
    content: "<p>Dubai's Security Industry Regulatory Agency (SIRA) maintains strict regulations governing IP-CCTV focal lines, storage retention specifications, and redundancy architectures. Failing physical audits can delay or freeze operations.</p><p>This guide highlights common compliance mistakes and shows how better access-control design can simplify approvals.</p>",
    category: "Infrastructure",
    publishedAt: "2026-03-15",
    author: "Eng. Bassem Ghafour",
    readTime: "8 min read",
    image: MEDIA_IMAGES.cityOffice,
    status: "published"
  }
];

export const CAREER_ROLES: CareerRole[] = [
  {
    id: "role-1",
    title: "Senior Full-Stack Engineer (React & Go)",
    department: "Custom Software Engineering",
    location: "Deira, Dubai, UAE (In-Office)",
    type: "Full-Time",
    experience: "5+ years",
    summary: "We are seeking a talented engineer to lead the development of our high-performance headless e-commerce architectures and custom regional ERP modules.",
    requirements: [
      "Absolute mastery of React, Vite, and Node.js alongside modern Go/Python environments.",
      "Proven experience building semantic, lightweight layouts and custom API endpoints.",
      "Solid knowledge of local payment interfaces (Tabby, Tamara, local payment networks).",
      "Familiarity with containerization (Docker, Kubernetes) and CI/CD pipelines."
    ],
    benefits: [
      "Competitive tax-free Dubai salary packet with annual flight allowance.",
      "Premium private medical insurance setup covering all dependents.",
      "Flexible, modern workspace in Al Yasmeen Building directly near transit links."
    ],
    isOpen: true
  },
  {
    id: "role-2",
    title: "AI Integrations & LLM Systems Architect",
    department: "Artificial Intelligence",
    location: "Deira, Dubai, UAE (In-Office)",
    type: "Full-Time",
    experience: "3+ years",
    summary: "Help us translate complex large language models and cognitive data chains into practical business systems for healthcare, real-estate and governmental sectors.",
    requirements: [
      "Deep expertise implementing modern LLM orchestration patterns and LangChain agents.",
      "Strong background deploying private sandboxed solutions and vector databases (Pinecone/Milvus).",
      "Professional knowledge of Arabic language NLP systems and tokenization nuances.",
      "Excellent client-facing technical consulting skills."
    ],
    benefits: [
      "Access to cutting-edge cloud resources and deep technical tooling.",
      "Corporate visa assistance and seamless onboarding relocation allowance.",
      "Annual performance-based bonuses tied to client implementation successes."
    ],
    isOpen: true
  }
];

export const METRICS: MetricStat[] = [
  {
    id: "metric-1",
    value: "Site Speed",
    label: "Optimized for <2s load times",
    desc: "Reduces bounce rates and boosts rankings."
  },
  {
    id: "metric-2",
    value: "Security",
    label: "Full SSL (HTTPS) Integration",
    desc: "Builds user trust and is a Google ranking signal."
  },
  {
    id: "metric-3",
    value: "Indexability",
    label: "Auto-generated XML Sitemaps",
    desc: "Helps Google find and rank your new pages fast."
  },
  {
    id: "metric-4",
    value: "Structure",
    label: "Breadcrumb & Intuitive Navigation",
    desc: "Enhances UX and helps crawlers understand site depth."
  }
];

export const SITE_SETTINGS: SiteSettings = {
  companyName: "BetterHub Intelligence",
  contactEmail: "sales@betterhubai.com",
  phone: "+971 4 324 9406",
  whatsapp: "+971565227806",
  officeLabel: "Deira Office",
  officeAddressLines: [
    "Al Yasmeen Building",
    "Near Abu Hail Metro Station",
    "Hor Al Anz, Deira Dubai, UAE"
  ],
  officeHours: "Saturday - Thursday: 09:00 - 18:00 (UTC+4)"
};

export const PAGE_MEDIA: SitePageMedia = {
  servicesCatalogHero: {
    title: "Services Catalog Hero",
    description: "Backdrop media used in the services listing page hero section.",
    image: MEDIA_IMAGES.developerDualMonitor,
    video: MEDIA_VIDEOS.servicesCatalog,
    alt: "Abstract digital network and data backdrop for BetterHub services",
  },
  productsCatalogHero: {
    title: "Products Catalog Hero",
    description: "Backdrop media used in the products listing page hero section.",
    image: MEDIA_IMAGES.officeTeam,
    alt: "Business software planning session with laptops, dashboards, and collaborative product thinking",
  },
  industriesHero: {
    title: "Industries Hero",
    description: "Backdrop media used in the industries overview page hero section.",
    image: MEDIA_IMAGES.cityOffice,
    alt: "Modern city architecture representing multi-industry delivery and business infrastructure",
  },
  blogHero: {
    title: "Blog Hero",
    description: "Backdrop media used in the blog listing page hero section.",
    image: MEDIA_IMAGES.developerDualMonitor,
    alt: "Editorial workspace with notebook and digital tools for BetterHub articles and explainers",
  },
  careersHero: {
    title: "Careers Hero",
    description: "Backdrop media used in the careers page hero section.",
    image: MEDIA_IMAGES.officeTeam,
    video: MEDIA_VIDEOS.careersHero,
    alt: "Collaborative team environment representing hiring, culture, and growth at BetterHub",
  },
  contactHero: {
    title: "Contact Hero",
    description: "Backdrop media used in the contact page hero section.",
    image: MEDIA_IMAGES.officeTeam,
    alt: "Clean office environment representing direct contact, planning, and consultation conversations",
  },
  aboutHero: {
    title: "About Hero",
    description: "Backdrop media used in the about page hero section.",
    image: MEDIA_IMAGES.developerDualMonitor,
    alt: "Technology strategy session representing BetterHub delivery standards and business partnership",
  },
};

export const SITE_CONTENT_SEED: SiteContent = {
  heroSlides: HERO_SLIDES,
  services: SERVICES,
  products: PRODUCTS,
  industries: INDUSTRIES,
  testimonials: TESTIMONIALS,
  blogPosts: BLOG_POSTS,
  careerRoles: CAREER_ROLES,
  metrics: METRICS,
  siteSettings: SITE_SETTINGS,
  pageMedia: PAGE_MEDIA,
};

export function createSiteContentSeed(): SiteContent {
  return JSON.parse(JSON.stringify(SITE_CONTENT_SEED)) as SiteContent;
}

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    heroSlides: mergeMediaList(content.heroSlides, HERO_SLIDES, (item) => item.title),
    services: mergeMediaList(content.services, SERVICES, (item) => item.title),
    products: mergeMediaList(content.products, PRODUCTS, (item) => item.title),
    industries: mergeMediaList(content.industries, INDUSTRIES, (item) => item.name),
    blogPosts: mergeMediaList(content.blogPosts, BLOG_POSTS, (item) => item.title),
    pageMedia: {
      servicesCatalogHero: normalizeMediaEntry(
        content.pageMedia?.servicesCatalogHero,
        PAGE_MEDIA.servicesCatalogHero,
        PAGE_MEDIA.servicesCatalogHero.title,
      ),
      productsCatalogHero: normalizeMediaEntry(
        content.pageMedia?.productsCatalogHero,
        PAGE_MEDIA.productsCatalogHero,
        PAGE_MEDIA.productsCatalogHero.title,
      ),
      industriesHero: normalizeMediaEntry(
        content.pageMedia?.industriesHero,
        PAGE_MEDIA.industriesHero,
        PAGE_MEDIA.industriesHero.title,
      ),
      blogHero: normalizeMediaEntry(
        content.pageMedia?.blogHero,
        PAGE_MEDIA.blogHero,
        PAGE_MEDIA.blogHero.title,
      ),
      careersHero: normalizeMediaEntry(
        content.pageMedia?.careersHero,
        PAGE_MEDIA.careersHero,
        PAGE_MEDIA.careersHero.title,
      ),
      contactHero: normalizeMediaEntry(
        content.pageMedia?.contactHero,
        PAGE_MEDIA.contactHero,
        PAGE_MEDIA.contactHero.title,
      ),
      aboutHero: normalizeMediaEntry(
        content.pageMedia?.aboutHero,
        PAGE_MEDIA.aboutHero,
        PAGE_MEDIA.aboutHero.title,
      ),
    },
  };
}

function mergeMediaList<T extends MediaFields & { id: string }>(
  current: T[],
  seed: T[],
  getLabel: (item: T) => string,
) {
  return current.map((item) => {
    const seeded = seed.find((candidate) => candidate.id === item.id);
    return normalizeMediaEntry(item, seeded, getLabel(item));
  });
}

function normalizeMediaEntry<T extends MediaFields>(
  current: T | undefined,
  seeded: T | undefined,
  label: string,
) {
  const base = seeded || current;
  if (!base) {
    throw new Error(`Missing media seed for ${label}.`);
  }

  return {
    ...seeded,
    ...current,
    image: current?.image || seeded?.image || '',
    video: current?.video || seeded?.video || undefined,
    poster: current?.poster || current?.image || seeded?.poster || seeded?.image || '',
    alt: current?.alt || seeded?.alt || label,
  } as T;
}
