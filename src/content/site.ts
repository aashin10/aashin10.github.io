// Every word on the site lives here. Edit this file to change copy, add a
// project, or update a role; the components only decide how it moves.

export const person = {
  name: 'Aashin Thomas',
  first: 'Aashin',
  last: 'Thomas',
  initials: 'AT',
  role: 'Web Developer & Software Engineer',
  location: 'Kerala, India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  year: 2026,
} as const

export const socials = [
  { label: 'LinkedIn', handle: 'in/aashin-thomas', href: 'https://www.linkedin.com/in/aashin-thomas/' },
  { label: 'GitHub', handle: '@aashin10', href: 'https://github.com/aashin10' },
] as const

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'off-script', label: 'Off script' },
  { id: 'contact', label: 'Contact' },
] as const

export const hero = {
  roles: ['Web Developer', 'Software Engineer', 'Event Host'],
  tagline: ['Websites with', 'stage presence.'],
  intro:
    'I design and build fast, animated, carefully engineered websites — with an engineer’s rigour and a host’s sense of timing.',
  primaryCta: 'Start a project',
  secondaryCta: 'See the work',
  badge: 'Available for freelance · 2026 ·',
  tape: ['Available for freelance', 'Web design', 'Development', 'Motion', 'Web apps'],
} as const

// The opening statement fills in word by word on scroll. `em` marks the
// phrases set in the italic serif.
export const manifesto: { text: string; em?: boolean }[] = [
  { text: 'I’m Aashin — a software engineer by trade and an' },
  { text: 'event host', em: true },
  { text: 'by habit. On weekdays I build the scheduling software that production plants across the United States run on. On stage I keep a thousand people looking the same way. I bring both to the web: sites' },
  { text: 'engineered to hold up', em: true },
  { text: 'and' },
  { text: 'staged to hold attention.', em: true },
]

export const about = {
  portraitCaption: 'On the mic at Experion’s annual celebration, 2026',
  paragraphs: [
    'I work full-stack: Angular and React up front, .NET and SQL behind, and enough motion design in between to make an interface feel alive rather than assembled.',
    'Freelance, that means one person who can take a site from a blank page to a launched, fast, accessible build — and who cares how it feels at every scroll position.',
  ],
  stats: [
    { value: 14, suffix: '', label: 'people co-led to a Best Project Award' },
    { value: 1000, suffix: '+', label: 'people in the room when I host' },
    { value: 18, suffix: '+', label: 'constraints the scheduler balances' },
    { value: 2, suffix: ' mo', label: 'from idea to an AI-enabled MVP' },
  ],
} as const

export type ProjectVisual = 'schedule' | 'kanban' | 'phone' | 'typewriter'

export interface Project {
  id: string
  title: string
  kicker: string
  year: string
  summary: string
  role: string
  stack: string[]
  highlights: string[]
  visual: ProjectVisual
  surface: 'surface-dark' | 'surface-paper' | 'surface-ember'
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    id: 'manufacturing-brain',
    title: 'Manufacturing Brain',
    kicker: 'Production scheduling platform',
    year: '2025 — Now',
    summary:
      'One system that lines up demand, supply, inventory and schedules for production plants across the United States — and re-plans when the day changes.',
    role: 'Associate Software Engineer, Experion Technologies',
    stack: ['.NET', 'OR-Tools CP-SAT', 'Azure Service Bus', 'MassTransit', 'SQL Server'],
    highlights: ['18+ scheduling constraints', 'Event-driven microservices', 'Multi-plant, in production'],
    visual: 'schedule',
    surface: 'surface-dark',
  },
  {
    id: 'project-management-tool',
    title: 'Project Management Tool',
    kicker: 'AI-enabled delivery platform',
    year: '2025',
    summary:
      'Sprint boards, an AI sprint planner, backlog, team chat and reporting — built for how Experion actually delivers. Idea to MVP in two months.',
    role: 'Co-lead of a 14-person team',
    stack: ['Angular', '.NET', 'SQL Server', 'AI planning'],
    highlights: ['Best Project Award', '300+ projects', '1000+ users'],
    visual: 'kanban',
    surface: 'surface-paper',
  },
  {
    id: 'debtflix',
    title: 'Debtflix',
    kicker: 'Borrowings tracker app',
    year: '2026',
    summary:
      'Who owes whom, without the awkward follow-up. A pocket ledger for money and things lent between friends and family.',
    role: 'Design & build, solo',
    stack: ['React Native', 'Supabase', 'TypeScript'],
    highlights: ['Open and settled tabs', 'Money and items', 'Built end to end'],
    visual: 'phone',
    surface: 'surface-ember',
  },
  {
    id: 'writers-aid',
    title: 'Writer’s Aid',
    kicker: 'A cure for the blank page',
    year: '2022',
    summary:
      'Set a deadline, get a prompt, start typing. A writing-sprint site built in a 40-hour hackathon that took Best Software Project among 30+ teams.',
    role: 'Team Decipherers, IEEE .hack();',
    stack: ['HTML', 'CSS', 'JavaScript', 'Gemini API'],
    highlights: ['Best Software Project', '40-hour build', '30+ teams'],
    visual: 'typewriter',
    surface: 'surface-dark',
    link: { label: 'Source on GitHub', href: 'https://github.com/aashin10/writer-s-aid' },
  },
]

export interface IndexEntry {
  title: string
  detail: string
  tag: string
  year: string
  href: string
  image?: string
}

export const moreWork: IndexEntry[] = [
  {
    title: 'Team Agents',
    detail: 'Claude Code plugins that run a staged, human-gated software delivery pipeline.',
    tag: 'AI tooling',
    year: '2026',
    href: 'https://github.com/aashin10/sparc-agents',
  },
  {
    title: 'DietX',
    detail: 'Reads a photo of a meal and gives hospital patients dietary guidance.',
    tag: 'Web · AI',
    year: '2025',
    href: 'https://github.com/aashin10/AI-powered-dietery-assistance-website',
    image: 'dietx',
  },
  {
    title: 'CT-Scan Tamper Detection',
    detail: 'Flags artificially inserted nodules in lung CT scans.',
    tag: 'Machine learning',
    year: '2025',
    href: 'https://github.com/aashin10/Lung-Cancer-Fraud-Detection',
  },
  {
    title: 'Space Apps: Eclipses',
    detail: 'Visualisations, upcoming dates and visibility maps for solar eclipses, built for the NASA Space Apps Challenge.',
    tag: 'Hackathon',
    year: '',
    href: 'https://github.com/aashin10/nasa-space-apps-challenge',
  },
]

export const certifications: IndexEntry[] = [
  {
    title: 'Claude Code 101',
    detail: 'Claude Academy',
    tag: 'AI agents',
    year: '2026',
    href: 'https://academy.claude.com/verify/796dceb9e7c5cb09077400b21fccfcab',
    image: 'cert-claude-code-101',
  },
  {
    title: 'Machine Learning with Python',
    detail: 'IBM · Coursera',
    tag: 'Machine learning',
    year: '2024',
    href: 'https://coursera.org/share/8792f951700bc85ef973dc3563049e79',
    image: 'cert-machine-learning',
  },
  {
    title: 'Computer Vision & Image Processing',
    detail: 'IBM · Coursera',
    tag: 'Computer vision',
    year: '2024',
    href: 'https://coursera.org/share/08c5165ddafee3b852c91095f279aafd',
    image: 'cert-image-processing',
  },
]

export const services = {
  intro: 'Three things I do well, usually in the same project.',
  items: [
    {
      title: 'Websites',
      line: 'Designed and built from a blank page.',
      body: 'Portfolio, landing and business sites that load fast, read clearly on any screen and are easy for you to update afterwards.',
      points: ['Design & art direction', 'Responsive build', 'Accessibility & SEO basics', 'Hand-over you can maintain'],
    },
    {
      title: 'Motion & interaction',
      line: 'The reason people keep scrolling.',
      body: 'Scroll choreography, micro-interactions and the occasional WebGL moment — tuned so it feels alive and still runs smoothly.',
      points: ['Scroll-driven storytelling', 'Micro-interactions', 'WebGL & shaders', 'Reduced-motion fallbacks'],
    },
    {
      title: 'Web apps & APIs',
      line: 'The engineering I do for a living.',
      body: 'Dashboards, sign-in, databases and integrations. Production habits from enterprise work, pointed at your idea.',
      points: ['React & Angular front ends', '.NET and Node APIs', 'SQL & Supabase', 'Deploys and CI'],
    },
  ],
  processTitle: 'Running order',
  process: [
    { step: 'Brief', body: 'We talk. I listen for what the site actually has to do, and for whom.' },
    { step: 'Script', body: 'Structure and words first: pages, sections, the one thing each must say.' },
    { step: 'Set design', body: 'Type, colour, layout and a motion direction you can react to early.' },
    { step: 'Build', body: 'Hand-coded, responsive, component by component, with previews as it grows.' },
    { step: 'Dress rehearsal', body: 'Speed, accessibility and real-device checks before anyone else sees it.' },
    { step: 'Opening night', body: 'Launch, hand-over, and a tidy codebase you are not afraid to touch.' },
  ],
} as const

export const experience = [
  {
    period: 'Dec 2025 — Now',
    title: 'Associate Software Engineer',
    place: 'Experion Technologies · Ernakulam',
    points: [
      'Build and maintain enterprise manufacturing software used across production plants in the United States.',
      'Design .NET services, REST APIs and SQL behind production scheduling and day-to-day plant workflows.',
      'Ship inside an event-driven microservices platform with CI/CD, balancing 18+ scheduling constraints.',
    ],
  },
  {
    period: 'Aug — Dec 2025',
    title: 'Software Engineer Trainee',
    place: 'Experion Technologies · Thiruvananthapuram',
    points: [
      'Co-led a 14-person cross-functional team building Experion’s Project Management Tool.',
      'Delivered an AI-enabled MVP in two months: sprint boards, AI sprint planner, backlog, reports, team chat.',
      'The project went on to win the company’s Best Project Award.',
    ],
  },
  {
    period: '2021 — 2025',
    title: 'B.Tech, Computer Science',
    place: 'Mar Athanasius College of Engineering',
    points: ['CGPA 7.54. IEEE member. Hackathons on the side — including a Best Software Project win.'],
  },
  {
    period: 'Before that',
    title: 'Senior Secondary & High School',
    place: 'Marygiri CMI Public School',
    points: ['93.4% in Class XII and 90.4% in Class X.'],
  },
] as const

export const offScript = {
  intro: 'Hosting, hackathons and the occasional 10K.',
  hintDrag: 'Drag them around.',
  hintSwipe: 'Swipe through.',
  cards: [
    { image: 'host-portrait', title: 'On the mic', note: 'Hosting company events for 1000+ people', tag: '2026' },
    { image: 'best-project-award', title: 'Best Project Award', note: 'For the Project Management Tool', tag: '2025' },
    { image: 'marathon', title: 'GTECH Marathon', note: '10 km for a drug-free Kerala', tag: '2026' },
    { image: 'hackathon-certificate', title: '.hack(); 2022', note: 'Best Software Project, IEEE MACE SB', tag: '2022' },
    { image: 'team-executives', title: 'Full house', note: 'The PMT team with Experion leadership', tag: 'PMT' },
    { image: 'team-outing', title: 'Day off', note: 'The scheduling crew, unscheduled', tag: 'Team' },
  ],
} as const

export const stack = [
  ['React', 'TypeScript', 'Motion', 'WebGL', 'Tailwind CSS', 'Angular', 'React Native'],
  ['.NET', 'C#', 'SQL Server', 'Azure', 'Supabase', 'Python', 'OR-Tools'],
] as const

export const contact = {
  heading: ['Let’s build', 'something', 'worth an encore.'],
  intro:
    'Have a site, an idea or a half-finished build? Tell me what it needs to do. I read every message myself.',
  // Same form endpoint the previous site used.
  endpoint: 'https://getform.io/f/8b086558-47d4-49d0-852d-ec8c22da40f7',
  topics: ['A new website', 'A redesign', 'Motion & interaction', 'A web app', 'Something else'],
  success: 'Message sent. Thank you — I’ll be in touch soon.',
  failure: 'That didn’t go through. Try again, or reach me on LinkedIn.',
} as const
