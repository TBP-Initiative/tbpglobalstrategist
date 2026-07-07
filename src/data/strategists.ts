export interface StrategistProfile {
  id: string;
  name: string;
  headline: string;
  badge: string;
  stage?: string;
  sector?: string | null;
  avatar: string;
  coverImage: string;
  bio: string;
  shortBio: string;
  expertiseAreas: string[];
  industries: string[];
  strategicFocusAreas: { title: string; description: string }[];
  collaborationStatus: "open" | "limited" | "closed";
  affiliation: { organization: string; role: string; logo: string } | null;
  stats: { projects: number; publications: number; network: number; yearsActive: number };
  featuredProjects: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image: string;
    status: string;
  }[];
  activityTimeline: { date: string; type: string; title: string; description: string }[];
  publications: { title: string; journal: string; year: number; link: string }[];
  achievements: { title: string; organization: string; year: number; description: string }[];
  mediaGallery: { url: string; title: string; type: "image" | "video" }[];
  network: { id: string; name: string; role: string; avatar: string; connection: string }[];
  contact: { email: string; linkedin: string; website: string };
  location: string;
  createdAt: string;
}

const strategists: StrategistProfile[] = [
  {
    id: "elena-voss",
    name: "Dr. Elena Voss",
    headline: "Chief Digital Strategist & Innovation Architect",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-1",
    bio: "Dr. Elena Voss is a globally recognized digital transformation leader with over two decades of experience architecting enterprise-wide innovation programs. She has led 50+ large-scale transformations across Fortune 500 companies, specializing in bridging the gap between cutting-edge technology and organizational strategy. Her work has been featured in Harvard Business Review, McKinsey Quarterly, and World Economic Forum publications. She holds a Ph.D. in Information Systems from MIT and serves on the advisory boards of three tech unicorns.",
    shortBio: "Award-winning strategist specializing in digital transformation and innovation architecture for global enterprises.",
    expertiseAreas: ["Digital Transformation", "Innovation Strategy", "Organizational Design", "Technology Adoption"],
    industries: ["Technology & Software", "Financial Services", "Healthcare & Life Sciences", "Media & Telecommunications"],
    strategicFocusAreas: [
      { title: "AI-Driven Strategy", description: "Leveraging artificial intelligence to reshape business models and create competitive advantage." },
      { title: "Digital Maturity", description: "Assessing and accelerating organizational digital maturity across all operational dimensions." },
      { title: "Innovation Ecosystems", description: "Building interconnected innovation networks that drive sustained growth and market leadership." },
      { title: "Change Architecture", description: "Designing comprehensive change frameworks that ensure successful transformation adoption." },
    ],
    collaborationStatus: "open",
    affiliation: {
      organization: "Voss Innovation Partners",
      role: "Founder & CEO",
      logo: "VIP",
    },
    stats: { projects: 52, publications: 34, network: 12800, yearsActive: 22 },
    featuredProjects: [
      {
        id: "proj-1",
        title: "Global Bank Digital Transformation",
        description: "Led a $450M digital overhaul for a top-10 global bank, resulting in 40% operational efficiency gain.",
        tags: ["Digital Transformation", "Fintech", "AI"],
        image: "gradient-a",
        status: "completed",
      },
      {
        id: "proj-2",
        title: "Healthcare AI Platform",
        description: "Architected an AI-driven diagnostics platform serving 200+ hospitals across Europe and Asia.",
        tags: ["Healthcare", "AI", "Innovation"],
        image: "gradient-b",
        status: "completed",
      },
      {
        id: "proj-3",
        title: "Telco 5G Strategy",
        description: "Developed go-to-market strategy for a major telecom's 5G enterprise division, generating $1.2B in new revenue.",
        tags: ["Telecommunications", "5G", "Strategy"],
        image: "gradient-c",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-04-15", type: "publication", title: "Published 'The AI Strategy Imperative'", description: "New whitepaper on integrating AI into corporate strategy frameworks." },
      { date: "2026-03-01", type: "speaking", title: "Keynote at World Innovation Summit", description: "Delivered keynote on 'Leading Through Digital Disruption' in Dubai." },
      { date: "2026-01-20", type: "project", title: "Launched Innovation Lab", description: "Opened a new innovation lab in Singapore focused on AI-driven strategy." },
      { date: "2025-11-10", type: "award", title: "Received Global Strategy Leader Award", description: "Recognized as one of the top 50 strategists worldwide." },
      { date: "2025-09-05", type: "project", title: "Completed Fintech Transformation", description: "Successfully delivered the Global Bank Digital Transformation project." },
    ],
    publications: [
      { title: "The AI Strategy Imperative: Winning in the Intelligent Age", journal: "Harvard Business Review", year: 2026, link: "#" },
      { title: "Digital Maturity: A Framework for Transformation", journal: "MIT Sloan Management Review", year: 2025, link: "#" },
      { title: "Innovation Ecosystems in the Post-COVID Era", journal: "McKinsey Quarterly", year: 2024, link: "#" },
      { title: "The Architecture of Organizational Change", journal: "Journal of Strategic Management", year: 2023, link: "#" },
      { title: "Leading Digital: From Strategy to Execution", journal: "Strategy & Leadership", year: 2022, link: "#" },
    ],
    achievements: [
      { title: "Global Strategy Leader of the Year", organization: "International Strategy Forum", year: 2025, description: "Recognized for outstanding contributions to the field of strategic management." },
      { title: "Innovation Excellence Award", organization: "World Innovation Congress", year: 2024, description: "For pioneering work in AI-driven business transformation." },
      { title: "Top 50 Strategists Worldwide", organization: "Thinkers50", year: 2024, description: "Ranked among the world's most influential business strategists." },
      { title: "Digital Transformation Leader", organization: "Forbes Technology Council", year: 2023, description: "Named as a leading voice in digital transformation." },
    ],
    mediaGallery: [
      { url: "gradient-a", title: "Innovation Lab Launch", type: "image" },
      { url: "gradient-b", title: "Summit Keynote", type: "image" },
      { url: "gradient-c", title: "Strategy Session", type: "image" },
      { url: "gradient-d", title: "Award Ceremony", type: "image" },
    ],
    network: [
      { id: "n1", name: "Dr. Sarah Chen", role: "Chief Innovation Officer", avatar: "", connection: "Collaborator" },
      { id: "n2", name: "Marcus Williams", role: "CEO, TechVentures Global", avatar: "", connection: "Client" },
      { id: "n3", name: "Prof. James Hartley", role: "MIT Sloan Faculty", avatar: "", connection: "Academic" },
      { id: "n4", name: "Priya Patel", role: "Head of Strategy, McKinsey", avatar: "", connection: "Colleague" },
      { id: "n5", name: "Alex Nakamura", role: "CTO, InnovateCorp", avatar: "", connection: "Partner" },
    ],
    contact: { email: "elena.voss@vossinnovation.com", linkedin: "https://linkedin.com/in/elenavoss", website: "https://vossinnovation.com" },
    location: "🇩🇪 Berlin, Germany",
    createdAt: "2024-01-15",
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    headline: "Senior M&A Strategist & Financial Transformation Lead",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-2",
    bio: "Marcus Chen brings 25+ years of experience in financial strategy, mergers & acquisitions, and organizational restructuring. He has advised on over $75B in transaction value across technology, healthcare, and industrial sectors. A former Managing Director at Goldman Sachs, Marcus now leads his own strategic advisory firm, helping mid-to-large enterprises navigate complex financial transformations and value creation initiatives.",
    shortBio: "Veteran M&A strategist with $75B+ in transaction experience across global markets.",
    expertiseAreas: ["Mergers & Acquisitions", "Financial Strategy", "Risk Management", "Market Expansion"],
    industries: ["Financial Services", "Technology & Software", "Manufacturing & Industrial", "Healthcare & Life Sciences"],
    strategicFocusAreas: [
      { title: "Value Creation", description: "Systematic approach to identifying and executing value creation opportunities in M&A." },
      { title: "Financial Restructuring", description: "Comprehensive financial restructuring for optimized capital allocation and growth." },
      { title: "Cross-Border Strategy", description: "Navigating complex cross-border transactions with cultural and regulatory expertise." },
      { title: "Post-Merger Integration", description: "Seamless integration frameworks that maximize deal value from day one." },
    ],
    collaborationStatus: "limited",
    affiliation: {
      organization: "Chen Strategic Advisors",
      role: "Founding Partner",
      logo: "CSA",
    },
    stats: { projects: 89, publications: 12, network: 9400, yearsActive: 26 },
    featuredProjects: [
      {
        id: "proj-4",
        title: "Cross-Border Fintech Merger",
        description: "Advised on a $12B cross-border merger between two leading fintech platforms across APAC and Europe.",
        tags: ["M&A", "Fintech", "Cross-Border"],
        image: "gradient-d",
        status: "completed",
      },
      {
        id: "proj-5",
        title: "Industrial Conglomerate Restructuring",
        description: "Led the financial restructuring of a $8B industrial conglomerate across 12 operating units.",
        tags: ["Restructuring", "Industrial", "Strategy"],
        image: "gradient-e",
        status: "completed",
      },
      {
        id: "proj-6",
        title: "Healthcare PE Portfolio Optimization",
        description: "Optimized a private equity portfolio of healthcare assets valued at $3.5B.",
        tags: ["Healthcare", "Private Equity", "Optimization"],
        image: "gradient-f",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-05-01", type: "deal", title: "Closed $2.3B Tech Acquisition", description: "Advised on a transformative tech acquisition for a Fortune 500 client." },
      { date: "2026-02-14", type: "publication", title: "Published M&A Trends Report 2026", description: "Annual report on global M&A trends and predictions." },
      { date: "2025-12-01", type: "speaking", title: "Panelist at Global M&A Summit", description: "Spoke on 'The Future of Cross-Border Transactions' in London." },
      { date: "2025-08-20", type: "project", title: "Completed Restructuring Engagement", description: "Successfully delivered the Industrial Conglomerate Restructuring project." },
    ],
    publications: [
      { title: "M&A in the Age of Uncertainty: 2026 Trends and Outlook", journal: "Financial Times", year: 2026, link: "#" },
      { title: "Value Creation Through Strategic Divestiture", journal: "Harvard Business Review", year: 2025, link: "#" },
      { title: "Cross-Border M&A: Navigating Regulatory Complexity", journal: "The Wall Street Journal", year: 2024, link: "#" },
    ],
    achievements: [
      { title: "Deal of the Year Award", organization: "M&A Advisor Awards", year: 2025, description: "For the $12B cross-border fintech merger." },
      { title: "Top 100 M&A Advisors", organization: "Financial Times", year: 2024, description: "Ranked among the top M&A advisors globally." },
      { title: "Lifetime Achievement in Finance", organization: "Global Finance Forum", year: 2023, description: "Recognized for contributions to financial strategy." },
    ],
    mediaGallery: [
      { url: "gradient-d", title: "M&A Summit Panel", type: "image" },
      { url: "gradient-e", title: "Client Meeting", type: "image" },
      { url: "gradient-f", title: "Award Ceremony", type: "image" },
    ],
    network: [
      { id: "n6", name: "Jennifer Torres", role: "CFO, GlobalTech Industries", avatar: "", connection: "Client" },
      { id: "n7", name: "Dr. Robert Kim", role: "Managing Director, Goldman Sachs", avatar: "", connection: "Former Colleague" },
      { id: "n8", name: "Lisa Andersen", role: "Partner, Kirkland & Ellis", avatar: "", connection: "Collaborator" },
    ],
    contact: { email: "marcus@chenadvisors.com", linkedin: "https://linkedin.com/in/marcuschen", website: "https://chenadvisors.com" },
    location: "🇸🇬 Singapore",
    createdAt: "2024-02-20",
  },
  {
    id: "priya-kapoor",
    name: "Priya Kapoor",
    headline: "Sustainability & ESG Strategy Director",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-3",
    bio: "Priya Kapoor is a pioneering force in corporate sustainability and ESG strategy. With 15 years of experience spanning three continents, she has helped over 40 organizations integrate environmental and social governance into their core business strategies. Priya led the development of the first net-zero transition framework adopted by the UN Global Compact and regularly advises Fortune 500 boards on climate strategy, circular economy, and sustainable innovation.",
    shortBio: "Pioneering ESG strategist driving sustainable transformation for Fortune 500 enterprises.",
    expertiseAreas: ["Sustainability & ESG", "Innovation Strategy", "Organizational Design", "Risk Management"],
    industries: ["Energy & Utilities", "Manufacturing & Industrial", "Consumer Goods & Retail", "Agriculture & Food"],
    strategicFocusAreas: [
      { title: "Net-Zero Transition", description: "Comprehensive frameworks for achieving net-zero emissions across operations and supply chains." },
      { title: "Circular Economy", description: "Designing circular business models that eliminate waste and maximize resource efficiency." },
      { title: "ESG Integration", description: "Embedding environmental and social governance into corporate strategy and reporting." },
      { title: "Sustainable Innovation", description: "Driving innovation through sustainability-focused R&D and product development." },
    ],
    collaborationStatus: "open",
    affiliation: {
      organization: "Kapoor Sustainability Group",
      role: "Founder & Director",
      logo: "KSG",
    },
    stats: { projects: 43, publications: 28, network: 7600, yearsActive: 16 },
    featuredProjects: [
      {
        id: "proj-7",
        title: "Global Energy Net-Zero Roadmap",
        description: "Developed a 20-year net-zero transition roadmap for a top-5 global energy company.",
        tags: ["Energy", "Net-Zero", "Sustainability"],
        image: "gradient-g",
        status: "completed",
      },
      {
        id: "proj-8",
        title: "Circular Economy Initiative",
        description: "Launched a circular economy program for a major consumer goods company, reducing waste by 60%.",
        tags: ["Circular Economy", "Consumer Goods", "Innovation"],
        image: "gradient-h",
        status: "active",
      },
      {
        id: "proj-9",
        title: "ESG Reporting Framework",
        description: "Created an industry-leading ESG reporting framework adopted by 50+ corporations globally.",
        tags: ["ESG", "Reporting", "Standards"],
        image: "gradient-i",
        status: "completed",
      },
    ],
    activityTimeline: [
      { date: "2026-04-28", type: "publication", title: "Launched Net-Zero Framework v2.0", description: "Updated net-zero transition framework with new sector-specific guidelines." },
      { date: "2026-03-15", type: "speaking", title: "Keynote at COP36 Side Event", description: "Presented on corporate climate action strategies." },
      { date: "2026-01-10", type: "project", title: "Started New ESG Mandate", description: "Engaged by a Fortune 100 manufacturer for comprehensive ESG transformation." },
      { date: "2025-10-20", type: "award", title: "Received Climate Leadership Award", description: "Recognized for outstanding contributions to corporate climate action." },
    ],
    publications: [
      { title: "The Net-Zero Imperative: A CEO's Guide to Climate Transition", journal: "Stanford Social Innovation Review", year: 2026, link: "#" },
      { title: "Circular Economy as Competitive Advantage", journal: "MIT Sloan Management Review", year: 2025, link: "#" },
      { title: "ESG: From Compliance to Value Creation", journal: "Harvard Business Review", year: 2024, link: "#" },
      { title: "Sustainable Supply Chains in the Age of Climate Risk", journal: "Supply Chain Management Review", year: 2023, link: "#" },
    ],
    achievements: [
      { title: "Climate Leadership Award", organization: "United Nations Global Compact", year: 2025, description: "For pioneering work in corporate net-zero transition frameworks." },
      { title: "Top 100 Sustainability Leaders", organization: "Forbes", year: 2024, description: "Ranked among the world's most influential sustainability professionals." },
      { title: "Innovation for Impact Award", organization: "World Economic Forum", year: 2023, description: "For circular economy innovation in consumer goods." },
    ],
    mediaGallery: [
      { url: "gradient-g", title: "COP36 Presentation", type: "image" },
      { url: "gradient-h", title: "Circular Economy Workshop", type: "image" },
      { url: "gradient-i", title: "Award Reception", type: "image" },
    ],
    network: [
      { id: "n9", name: "Dr. Anne Larsson", role: "Chief Sustainability Officer, IKEA", avatar: "", connection: "Collaborator" },
      { id: "n10", name: "Michael Tran", role: "Head of ESG, BlackRock", avatar: "", connection: "Partner" },
      { id: "n11", name: "Sarah Bloomberg", role: "CEO, GreenTech Solutions", avatar: "", connection: "Client" },
    ],
    contact: { email: "priya@kapoorsustainability.com", linkedin: "https://linkedin.com/in/priyakapoor", website: "https://kapoorsustainability.com" },
    location: "🇬🇧 London, UK",
    createdAt: "2024-03-10",
  },
  {
    id: "james-okafo",
    name: "James Okafor",
    headline: "Global Market Expansion & Operational Excellence Strategist",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-4",
    bio: "James Okafor is a dual-threat strategist combining deep expertise in market expansion with operational excellence. Over his 20-year career, he has led market entry strategies for 30+ countries across Africa, Southeast Asia, and Latin America. His operational turnaround programs have consistently delivered 30-50% efficiency improvements. James advises sovereign wealth funds, multinational corporations, and high-growth startups on scaling operations across emerging markets.",
    shortBio: "Market expansion expert who has led successful entry into 30+ emerging markets worldwide.",
    expertiseAreas: ["Market Expansion", "Operational Excellence", "Supply Chain Optimization", "Risk Management"],
    industries: ["Manufacturing & Industrial", "Consumer Goods & Retail", "Transportation & Logistics", "Agriculture & Food"],
    strategicFocusAreas: [
      { title: "Emerging Market Entry", description: "Comprehensive market entry strategies tailored to emerging market dynamics and local contexts." },
      { title: "Operational Turnaround", description: "Rapid operational improvement programs delivering measurable efficiency gains within quarters." },
      { title: "Supply Chain Resilience", description: "Building robust supply chains capable of weathering global disruptions and geopolitical risks." },
      { title: "Growth Scaling", description: "Scalable operational frameworks for high-growth organizations expanding across multiple markets." },
    ],
    collaborationStatus: "open",
    affiliation: {
      organization: "Okafor Global Strategy",
      role: "Managing Partner",
      logo: "OGS",
    },
    stats: { projects: 67, publications: 15, network: 8200, yearsActive: 21 },
    featuredProjects: [
      {
        id: "proj-10",
        title: "Pan-African Retail Expansion",
        description: "Led market entry and operational setup for a major retailer across 12 African countries.",
        tags: ["Retail", "Market Entry", "Africa"],
        image: "gradient-j",
        status: "completed",
      },
      {
        id: "proj-11",
        title: "Supply Chain Resilience Program",
        description: "Redesigned global supply chain for a manufacturing conglomerate, reducing disruption risk by 45%.",
        tags: ["Supply Chain", "Resilience", "Manufacturing"],
        image: "gradient-k",
        status: "completed",
      },
      {
        id: "proj-12",
        title: "SEA Logistics Hub Strategy",
        description: "Developed a regional logistics hub strategy for Southeast Asia for a global shipping company.",
        tags: ["Logistics", "Southeast Asia", "Strategy"],
        image: "gradient-l",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-05-10", type: "project", title: "Launched SEA Logistics Initiative", description: "Commenced the Southeast Asia logistics hub strategy engagement." },
      { date: "2026-03-20", type: "speaking", title: "Africa Business Forum Keynote", description: "Spoke on 'The Next Frontier: Scaling Operations in Africa'." },
      { date: "2025-12-15", type: "publication", title: "Published 'Supply Chain Resilience in a Fragmented World'", description: "New report on building resilient supply chains." },
      { date: "2025-09-30", type: "project", title: "Completed Retail Expansion", description: "Successfully delivered the Pan-African Retail Expansion project." },
    ],
    publications: [
      { title: "Supply Chain Resilience in a Fragmented World", journal: "Supply Chain Management Review", year: 2026, link: "#" },
      { title: "The Africa Opportunity: A Strategist's Guide", journal: "McKinsey Quarterly", year: 2025, link: "#" },
      { title: "Operational Excellence in Emerging Markets", journal: "Journal of Business Strategy", year: 2024, link: "#" },
    ],
    achievements: [
      { title: "African Business Leader of the Year", organization: "African Business Awards", year: 2025, description: "For transformative impact on African retail and manufacturing sectors." },
      { title: "Supply Chain Innovation Award", organization: "Supply Chain Council", year: 2024, description: "For innovative supply chain resilience framework." },
      { title: "Top 50 Strategy Consultants", organization: "Consulting Magazine", year: 2023, description: "Ranked among top strategy consultants globally." },
    ],
    mediaGallery: [
      { url: "gradient-j", title: "Africa Business Forum", type: "image" },
      { url: "gradient-k", title: "Supply Chain Workshop", type: "image" },
      { url: "gradient-l", title: "Client Strategy Session", type: "image" },
    ],
    network: [
      { id: "n12", name: "Dr. Aisha Mbowe", role: "Minister of Trade, Kenya", avatar: "", connection: "Government" },
      { id: "n13", name: "Carlos Mendez", role: "CEO, LogiTrans Global", avatar: "", connection: "Client" },
      { id: "n14", name: "Wei Zhang", role: "VP Operations, Alibaba", avatar: "", connection: "Collaborator" },
    ],
    contact: { email: "james@okaforglobal.com", linkedin: "https://linkedin.com/in/jamesokafo", website: "https://okaforglobal.com" },
    location: "🇰🇪 Nairobi, Kenya",
    createdAt: "2024-04-05",
  },
  {
    id: "yuki-tanaka",
    name: "Dr. Yuki Tanaka",
    headline: "AI & Technology Adoption Strategist",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-5",
    bio: "Dr. Yuki Tanaka is at the forefront of AI-driven business transformation. With a Ph.D. in Machine Learning from Stanford and experience at DeepMind and BCG, she bridges the gap between cutting-edge AI capabilities and practical business applications. Her work focuses on helping organizations navigate the complex landscape of AI adoption, from strategy development to implementation. She was named one of Forbes' '30 Under 30' in enterprise technology.",
    shortBio: "AI strategy expert bridging cutting-edge machine learning with enterprise transformation.",
    expertiseAreas: ["Technology Adoption", "Digital Transformation", "Data & Analytics", "Innovation Strategy"],
    industries: ["Technology & Software", "Financial Services", "Healthcare & Life Sciences", "Media & Telecommunications"],
    strategicFocusAreas: [
      { title: "AI Strategy & Roadmapping", description: "Developing comprehensive AI strategies aligned with business objectives and capabilities." },
      { title: "Machine Learning Operations", description: "Building scalable MLOps infrastructure for enterprise AI deployment." },
      { title: "Responsible AI", description: "Implementing ethical AI frameworks that ensure fairness, transparency, and compliance." },
      { title: "AI-Driven Innovation", description: "Identifying and validating high-impact AI use cases for competitive advantage." },
    ],
    collaborationStatus: "open",
    affiliation: {
      organization: "Tanaka AI Strategy",
      role: "Principal Consultant",
      logo: "TAS",
    },
    stats: { projects: 18, publications: 22, network: 5400, yearsActive: 8 },
    featuredProjects: [
      {
        id: "proj-13",
        title: "Enterprise AI Maturity Assessment",
        description: "Assessed AI maturity across a Fortune 100 company, developing a 3-year AI transformation roadmap.",
        tags: ["AI", "Assessment", "Roadmap"],
        image: "gradient-m",
        status: "completed",
      },
      {
        id: "proj-14",
        title: "ML Platform Architecture",
        description: "Designed and deployed a centralized ML platform serving 15+ business units at a global bank.",
        tags: ["ML Platform", "Architecture", "Banking"],
        image: "gradient-n",
        status: "completed",
      },
      {
        id: "proj-15",
        title: "Responsible AI Framework",
        description: "Created a responsible AI governance framework now used by multiple Fortune 500 organizations.",
        tags: ["Responsible AI", "Governance", "Framework"],
        image: "gradient-o",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-05-05", type: "publication", title: "Published 'AI Adoption in Financial Services'", description: "Research paper on AI adoption patterns in global banking." },
      { date: "2026-04-01", type: "speaking", title: "NeurIPS 2026 Panelist", description: "Spoke on 'Responsible AI in Enterprise Deployments'." },
      { date: "2026-02-10", type: "project", title: "Started Responsible AI Engagement", description: "Began work on responsible AI framework for a tech consortium." },
      { date: "2025-11-20", type: "award", title: "Forbes 30 Under 30 Recognition", description: "Named to Forbes 30 Under 30 in Enterprise Technology." },
    ],
    publications: [
      { title: "AI Adoption in Financial Services: Patterns, Barriers, and Success Factors", journal: "Nature Machine Intelligence", year: 2026, link: "#" },
      { title: "Responsible AI: From Principles to Practice", journal: "Stanford HAI Review", year: 2025, link: "#" },
      { title: "MLOps at Scale: Lessons from Enterprise Deployments", journal: "ACM Computing Surveys", year: 2025, link: "#" },
      { title: "The AI Maturity Model: A Framework for Assessment", journal: "MIT Technology Review", year: 2024, link: "#" },
    ],
    achievements: [
      { title: "30 Under 30 - Enterprise Technology", organization: "Forbes", year: 2025, description: "Recognized for contributions to enterprise AI strategy." },
      { title: "Best Paper Award", organization: "NeurIPS 2025", year: 2025, description: "For research on responsible AI deployment frameworks." },
      { title: "AI Innovation Award", organization: "World AI Summit", year: 2024, description: "For innovative ML platform architecture in banking." },
    ],
    mediaGallery: [
      { url: "gradient-m", title: "AI Summit Presentation", type: "image" },
      { url: "gradient-n", title: "Workshop Session", type: "image" },
      { url: "gradient-o", title: "Team Collaboration", type: "image" },
    ],
    network: [
      { id: "n15", name: "Dr. Andrew Ng", role: "Co-Founder, DeepLearning.AI", avatar: "", connection: "Mentor" },
      { id: "n16", name: "Fei-Fei Li", role: "Professor, Stanford University", avatar: "", connection: "Academic" },
      { id: "n17", name: "Sundar Pichai", role: "CEO, Google", avatar: "", connection: "Former Colleague" },
    ],
    contact: { email: "yuki@tanakaai.com", linkedin: "https://linkedin.com/in/yukitanaka", website: "https://tanakaai.com" },
    location: "🇯🇵 Tokyo, Japan",
    createdAt: "2024-05-20",
  },
  {
    id: "sarah-alrashid",
    name: "Sarah Al-Rashid",
    headline: "Risk & Change Management Strategist",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-6",
    bio: "Sarah Al-Rashid is a leading authority in enterprise risk management and organizational change. With 18 years of experience advising governments and multinational corporations, she specializes in navigating complex risk landscapes and leading large-scale change initiatives. Her frameworks for geopolitical risk assessment are used by Fortune 500 companies and government agencies worldwide. She previously served as Director of Strategic Risk at the World Economic Forum.",
    shortBio: "Enterprise risk expert who has advised 20+ governments and 100+ corporations on strategic risk.",
    expertiseAreas: ["Risk Management", "Change Management", "Organizational Design", "Sustainability & ESG"],
    industries: ["Government & Public Sector", "Energy & Utilities", "Financial Services", "Aerospace & Defense"],
    strategicFocusAreas: [
      { title: "Geopolitical Risk", description: "Assessing and mitigating geopolitical risks in an increasingly fragmented global landscape." },
      { title: "Change Leadership", description: "Leading organizational change through structured frameworks and stakeholder alignment." },
      { title: "Crisis Management", description: "Comprehensive crisis preparedness and response strategies for organizations of all sizes." },
      { title: "Resilience Strategy", description: "Building organizational resilience through adaptive strategy and robust risk frameworks." },
    ],
    collaborationStatus: "limited",
    affiliation: {
      organization: "Al-Rashid Risk Advisory",
      role: "CEO",
      logo: "ARA",
    },
    stats: { projects: 48, publications: 20, network: 6900, yearsActive: 19 },
    featuredProjects: [
      {
        id: "proj-16",
        title: "National Risk Assessment Framework",
        description: "Developed a national risk assessment framework for a G20 government, covering 150+ risk scenarios.",
        tags: ["Risk", "Government", "Framework"],
        image: "gradient-p",
        status: "completed",
      },
      {
        id: "proj-17",
        title: "Global Energy Crisis Response",
        description: "Led crisis management strategy for a major energy company during global supply disruptions.",
        tags: ["Crisis Management", "Energy", "Strategy"],
        image: "gradient-q",
        status: "completed",
      },
      {
        id: "proj-18",
        title: "Digital Transformation Change Program",
        description: "Managed the organizational change component of a $2B digital transformation for a government agency.",
        tags: ["Change Management", "Digital Transformation", "Government"],
        image: "gradient-r",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-04-20", type: "publication", title: "Published 'Geopolitical Risk in 2026'", description: "Annual report on emerging geopolitical risks and their business implications." },
      { date: "2026-02-28", type: "speaking", title: "Davos 2026 Session Lead", description: "Led a session on 'Building Resilient Organizations in a Fragmented World'." },
      { date: "2025-10-15", type: "project", title: "Started Government Transformation", description: "Began work on digital transformation change program for a G20 government." },
      { date: "2025-07-01", type: "award", title: "Risk Manager of the Year", description: "Recognized by the Global Risk Management Institute." },
    ],
    publications: [
      { title: "Geopolitical Risk in 2026: A Strategic Imperative", journal: "Foreign Affairs", year: 2026, link: "#" },
      { title: "Organizational Resilience in the Age of Polycrisis", journal: "Harvard Business Review", year: 2025, link: "#" },
      { title: "Change Management in the Public Sector", journal: "Journal of Public Administration", year: 2024, link: "#" },
      { title: "The New Risk Landscape: A CEO's Guide", journal: "McKinsey Quarterly", year: 2023, link: "#" },
    ],
    achievements: [
      { title: "Risk Manager of the Year", organization: "Global Risk Management Institute", year: 2025, description: "For outstanding contributions to enterprise risk management." },
      { title: "Women in Leadership Award", organization: "International Strategy Forum", year: 2024, description: "Recognized for leadership in strategic risk and change management." },
      { title: "Distinguished Alumni Award", organization: "Harvard Kennedy School", year: 2023, description: "For contributions to public sector risk management." },
    ],
    mediaGallery: [
      { url: "gradient-p", title: "Risk Summit Keynote", type: "image" },
      { url: "gradient-q", title: "Strategy Workshop", type: "image" },
      { url: "gradient-r", title: "Davos Session", type: "image" },
    ],
    network: [
      { id: "n18", name: "Klaus Schwab", role: "Founder, World Economic Forum", avatar: "", connection: "Former Colleague" },
      { id: "n19", name: "Dr. Ngozi Okonjo-Iweala", role: "Director-General, WTO", avatar: "", connection: "Collaborator" },
      { id: "n20", name: "Ray Dalio", role: "Founder, Bridgewater Associates", avatar: "", connection: "Peer" },
    ],
    contact: { email: "sarah@alrashidadvisory.com", linkedin: "https://linkedin.com/in/sarahalrashid", website: "https://alrashidadvisory.com" },
    location: "🇦🇪 Dubai, UAE",
    createdAt: "2024-06-12",
  },
  {
    id: "dmitri-volkov",
    name: "Dmitri Volkov",
    headline: "Supply Chain & Operational Excellence Director",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-7",
    bio: "Dmitri Volkov is a world-class supply chain strategist with 27 years of experience optimizing global operations. A former VP of Global Supply Chain at Siemens, he has led operational transformations across 40+ countries. His lean-six sigma methodologies have delivered over $2B in cumulative cost savings for clients. Dmitri is a certified Master Black Belt and the author of three books on operational excellence and supply chain optimization.",
    shortBio: "Supply chain veteran who has delivered $2B+ in cost savings through operational excellence programs.",
    expertiseAreas: ["Supply Chain Optimization", "Operational Excellence", "Risk Management", "Technology Adoption"],
    industries: ["Manufacturing & Industrial", "Transportation & Logistics", "Energy & Utilities", "Consumer Goods & Retail"],
    strategicFocusAreas: [
      { title: "Supply Chain Digitalization", description: "End-to-end digital transformation of supply chain operations using AI and IoT." },
      { title: "Lean Operations", description: "Systematic lean transformation programs delivering sustainable efficiency improvements." },
      { title: "Global Sourcing Strategy", description: "Strategic sourcing and supplier relationship management across global markets." },
      { title: "Inventory Optimization", description: "Advanced inventory management strategies balancing service levels and working capital." },
    ],
    collaborationStatus: "closed",
    affiliation: null,
    stats: { projects: 94, publications: 7, network: 5100, yearsActive: 28 },
    featuredProjects: [
      {
        id: "proj-19",
        title: "Global Supply Chain Digitalization",
        description: "Led the digitalization of a $15B global supply chain network spanning 35 countries.",
        tags: ["Digitalization", "Supply Chain", "Global"],
        image: "gradient-s",
        status: "completed",
      },
      {
        id: "proj-20",
        title: "Manufacturing Lean Transformation",
        description: "Implemented lean manufacturing across 50 plants, achieving 35% productivity improvement.",
        tags: ["Lean", "Manufacturing", "Transformation"],
        image: "gradient-t",
        status: "completed",
      },
      {
        id: "proj-21",
        title: "Procurement Optimization Program",
        description: "Optimized procurement operations for a $8B industrial company, saving $400M annually.",
        tags: ["Procurement", "Optimization", "Cost Savings"],
        image: "gradient-u",
        status: "completed",
      },
    ],
    activityTimeline: [
      { date: "2026-03-10", type: "publication", title: "Published 'Supply Chain Digitalization Playbook'", description: "Comprehensive guide to digitalizing global supply chain operations." },
      { date: "2025-11-01", type: "speaking", title: "Keynote at Supply Chain World 2025", description: "Spoke on 'The Future of Supply Chain: AI-Driven Operations'." },
      { date: "2025-08-15", type: "project", title: "Completed Lean Transformation", description: "Successfully delivered the Manufacturing Lean Transformation project." },
      { date: "2025-04-20", type: "award", title: "Lifetime Achievement in Supply Chain", description: "Recognized by the Supply Chain Management Institute." },
    ],
    publications: [
      { title: "Supply Chain Digitalization Playbook", journal: "Industry Week", year: 2026, link: "#" },
      { title: "Operational Excellence in the Digital Age", journal: "Journal of Supply Chain Management", year: 2024, link: "#" },
    ],
    achievements: [
      { title: "Lifetime Achievement Award", organization: "Supply Chain Management Institute", year: 2025, description: "For decades of contributions to supply chain and operational excellence." },
      { title: "Master Black Belt Certification", organization: "American Society for Quality", year: 2010, description: "Highest level of Six Sigma expertise." },
    ],
    mediaGallery: [
      { url: "gradient-s", title: "Supply Chain Conference", type: "image" },
      { url: "gradient-t", title: "Plant Tour", type: "image" },
      { url: "gradient-u", title: "Award Ceremony", type: "image" },
    ],
    network: [
      { id: "n21", name: "Klaus Kleinfeld", role: "Former CEO, Siemens", avatar: "", connection: "Former Manager" },
      { id: "n22", name: "Dr. Bernd Leukert", role: "CTO, SAP", avatar: "", connection: "Collaborator" },
    ],
    contact: { email: "dmitri@volkovconsulting.com", linkedin: "https://linkedin.com/in/dmitrvolkov", website: "https://volkovconsulting.com" },
    location: "🇨🇭 Zurich, Switzerland",
    createdAt: "2024-07-08",
  },
  {
    id: "amara-osei",
    name: "Amara Osei",
    headline: "Customer Experience & Innovation Strategy Consultant",
    badge: "TBP Global Strategist",
    stage: "CONTRIBUTOR",
    sector: null,
    avatar: "",
    coverImage: "gradient-8",
    bio: "Amara Osei is a dynamic customer experience strategist who combines deep human-centered design expertise with business strategy. Starting her career at IDEO and later leading CX at a top consulting firm, she has helped 30+ brands transform their customer experiences, driving measurable improvements in NPS, retention, and revenue. She is passionate about using design thinking to solve complex business challenges and create experiences that customers love.",
    shortBio: "CX innovator who has transformed customer experiences for 30+ global brands.",
    expertiseAreas: ["Customer Experience", "Innovation Strategy", "Digital Transformation", "Organizational Design"],
    industries: ["Consumer Goods & Retail", "Technology & Software", "Financial Services", "Hospitality & Tourism"],
    strategicFocusAreas: [
      { title: "Experience Design", description: "Human-centered design of end-to-end customer experiences that drive loyalty and growth." },
      { title: "Voice of Customer", description: "Systematic VOC programs that surface insights and drive continuous improvement." },
      { title: "Journey Orchestration", description: "Omnichannel journey design and orchestration for seamless customer interactions." },
      { title: "Innovation Sprints", description: "Rapid innovation sprints using design thinking to validate and launch new experiences." },
    ],
    collaborationStatus: "open",
    affiliation: {
      organization: "Osei Customer Strategy",
      role: "Founder & Lead Consultant",
      logo: "OCS",
    },
    stats: { projects: 32, publications: 10, network: 3800, yearsActive: 9 },
    featuredProjects: [
      {
        id: "proj-22",
        title: "Retail CX Transformation",
        description: "Transformed the omnichannel customer experience for a major retailer, increasing NPS by 45 points.",
        tags: ["Retail", "CX", "Omnichannel"],
        image: "gradient-v",
        status: "completed",
      },
      {
        id: "proj-23",
        title: "Banking App Redesign",
        description: "Led the design and launch of a mobile banking app that achieved 4.8-star rating and 5M downloads.",
        tags: ["Fintech", "Mobile", "Design"],
        image: "gradient-w",
        status: "completed",
      },
      {
        id: "proj-24",
        title: "Hospitality Brand Innovation",
        description: "Developed an innovation strategy for a luxury hotel chain, launching 3 new experience concepts.",
        tags: ["Hospitality", "Innovation", "Brand"],
        image: "gradient-x",
        status: "active",
      },
    ],
    activityTimeline: [
      { date: "2026-04-10", type: "speaking", title: "SXSW 2026 Panel", description: "Led a panel on 'Designing Experiences for the AI Era'." },
      { date: "2026-02-20", type: "project", title: "Started Hospitality Engagement", description: "Began innovation strategy work with a luxury hotel chain." },
      { date: "2025-12-01", type: "publication", title: "Published 'The Experience Economy 2.0'", description: "Whitepaper on the evolution of customer experience in the digital age." },
      { date: "2025-09-15", type: "award", title: "CX Leader of the Year", description: "Recognized by the Customer Experience Professionals Association." },
    ],
    publications: [
      { title: "The Experience Economy 2.0: Designing for the AI Era", journal: "Forbes", year: 2026, link: "#" },
      { title: "Design Thinking as Business Strategy", journal: "Stanford Social Innovation Review", year: 2025, link: "#" },
      { title: "The ROI of Customer Experience", journal: "Harvard Business Review", year: 2024, link: "#" },
    ],
    achievements: [
      { title: "CX Leader of the Year", organization: "Customer Experience Professionals Association", year: 2025, description: "For outstanding contributions to customer experience strategy." },
      { title: "Design Excellence Award", organization: "IDSA", year: 2024, description: "For innovative banking app design and user experience." },
      { title: "30 Under 30 - Design", organization: "Forbes", year: 2023, description: "Recognized for leadership in experience design and innovation." },
    ],
    mediaGallery: [
      { url: "gradient-v", title: "SXSW Panel", type: "image" },
      { url: "gradient-w", title: "Design Workshop", type: "image" },
      { url: "gradient-x", title: "Client Presentation", type: "image" },
    ],
    network: [
      { id: "n23", name: "Tim Brown", role: "Chair, IDEO", avatar: "", connection: "Mentor" },
      { id: "n24", name: "Julie Zhuo", role: "Former VP Design, Facebook", avatar: "", connection: "Peer" },
      { id: "n25", name: "Brian Chesky", role: "CEO, Airbnb", avatar: "", connection: "Collaborator" },
    ],
    contact: { email: "amara@oseicx.com", linkedin: "https://linkedin.com/in/amaraosei", website: "https://oseicx.com" },
    location: "🇺🇸 New York, USA",
    createdAt: "2024-08-01",
  },
];

export function getStrategists(): StrategistProfile[] {
  return strategists;
}

export function getStrategistById(id: string): StrategistProfile | undefined {
  return strategists.find((s) => s.id === id);
}

export function getUniqueExpertiseAreas(): string[] {
  const areas = new Set<string>();
  strategists.forEach((s) => s.expertiseAreas.forEach((a) => areas.add(a)));
  return Array.from(areas).sort();
}

export function getUniqueIndustries(): string[] {
  const industries = new Set<string>();
  strategists.forEach((s) => s.industries.forEach((i) => industries.add(i)));
  return Array.from(industries).sort();
}
