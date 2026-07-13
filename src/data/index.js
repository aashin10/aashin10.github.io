import {
  writer,
  diet,
  lungfraud,
  overview,
  silos,
  truck,
  BestProject,
  Executives,
  technical,
  community,
  leadership,
  academic,
  creative,
  ImageProcessingCertificate,
  MachineLearningCertificate,
  borrowingsTracker,
} from "../assets";

export const navLinks = [
  {
    id: "hero",
    title: "Hero",
  },
  {
    id: "portfolio",
    title: "Portfolio",
  },
  {
    id: "experience",
    title: "Experience",
  },
  {
    id: "education",
    title: "Education",
  },
  {
    id: "events",
    title: "Events",
  },
  {
    id: "certifications",
    title: "Certifications",
  },
  {
    id: "socials",
    title: "Socials",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const experiences = [
  {
    title: "Associate Software Engineer",
    company_name: "Experion Technologies",
    date: "Dec 2025 - Present",
    details: [
      "Developing and maintaining <span style='color: white;'>enterprise-scale manufacturing software</span> used across multiple production plants in the United States.",
      "Designing and implementing <span style='color: white;'>.NET backend services, REST APIs, and SQL solutions</span> powering production scheduling and operational workflows.",
      "Contributing to a <span style='color: white;'>microservices-based platform</span> with CI/CD pipelines, cloud-hosted services, and complex business logic involving 18+ scheduling constraints.",
    ],
  },
  {
    title: "Software Engineer Trainee",
    company_name: "Experion Technologies",
    date: "Aug 2025 - Dec 2025",
    details: [
      "Co-led development of Experion's <span style='color: white;'>award-winning Project Management Tool (PMT)</span>, delivering an AI-enabled MVP within two months.",
      "Built and integrated features including <span style='color: white;'>Sprint Boards, AI Sprint Planner, Backlog Management, Reports, and Team Collaboration modules</span>.",
      "Collaborated within a <span style='color: white;'>14-member cross-functional team</span> and contributed to a project that received the company's Best Project Award.",
    ],
  },
];

const portfolio = [
  {
    name: "Manufacturing Brain",
    description:
      "A centralized production management system that aligns demand, supply, inventory, and scheduling decisions.",
    images: [truck, overview, silos],
  },
  {
    name: "Project Management Tool",
    description:
      "A comprehensive project management solution for teams to collaborate and track progress.",
    images: [BestProject, Executives],
  },
  {
    name: "Writer's Aid",
    description:
      "A website that leverages gemini API fetch to help writers with writer's block.",
    images: [writer],
  },
];

const events = [
  {
    title: "IEEE Hackathon — Best Project Winner",
    category: "Technical",
    date: "Jan 2022",
    description: "Won the best project award for building an intuitive website for writers to aid with their writing, competing among 30+ teams across the country.",
    images: [technical],
    heightClass: "h-[260px]"
  },
  {
    title: "Hosting Events",
    category: "Extra-Curricular",
    date: "Mar 2026",
    description: "Coordinated corporate programs and stage events with 1000+ attendees.",
    images: [creative],
    heightClass: "h-[260px]"
  },
  {
    title: "Led a 14 Member Team",
    category: "Leadership",
    date: "Nov 2025",
    description: "Led development of Project Management Tool for Experion Technologies with 300+ Projects and 1000+ Users.",
    images: [BestProject],
    heightClass: "h-[200px]"
  },
  {
    title: "Community Marathon",
    category: "Community",
    date: "Mar 2026",
    description: "Participated in a local marathon with theme \"𝐍𝐨 𝐭𝐨 𝐃𝐫𝐮𝐠𝐬, 𝐘𝐞𝐬 𝐭𝐨 𝐅𝐢𝐭𝐧𝐞𝐬𝐬.\" to raise awareness against the use of drugs in the community.",
    images: [academic],
    heightClass: "h-[200px]"
  },
  {
    title: "Borrowings Tracker",
    category: "Entrepreneurship",
    date: "May 2026",
    description: "A simple application to track borrowings and lendings among friends and family, built using React Native and Supabase.",
    images: [borrowingsTracker],
    heightClass: "h-[200px]"
  }
];

const certifications = [
  {
    abbr: "IP",
    name: "Image Processing",
    platform: "IBM - Coursera",
    date: "2025",
    id: "08c5165ddafee3b852c91095f279aafd",
    tags: ["Image Processing", "Computer Vision", "Python"],
    color: "#0056D2",
    glow: "rgba(0,86,210,0.28)",
    image: ImageProcessingCertificate,
    link: "https://coursera.org/share/08c5165ddafee3b852c91095f279aafd",
  },
  {
    abbr: "ML",
    name: "Machine Learning",
    platform: "IBM - Coursera",
    date: "2025",
    id: "8792f951700bc85ef973dc3563049e79",
    tags: ["Machine Learning", "AI", "Python"],
    color: "#0056D2",
    glow: "rgba(0,86,210,0.28)",
    image: MachineLearningCertificate,
    link: "https://coursera.org/share/8792f951700bc85ef973dc3563049e79",
  },
];

// Social profiles rendered by the Socials section. Add up to a couple more
// here (keep an `icon` that maps to a glyph in Socials.jsx) and the layout
// stays centred and balanced automatically.
const socials = [
  {
    id: "github",
    icon: "github",
    label: "GitHub",
    handle: "@aashin10",
    url: "https://github.com/aashin10",
    blurb: "Where the code lives — projects, experiments, and the occasional late-night commit.",
    accent: "#8b5cf6",
  },
  {
    id: "linkedin",
    icon: "linkedin",
    label: "LinkedIn",
    handle: "in/aashin-thomas",
    url: "https://www.linkedin.com/in/aashin-thomas/",
    blurb: "The professional side — experience, milestones, and a network worth talking to.",
    accent: "#1689C8",
  },
];

// Academic timeline rendered by the Education section, newest first. Add more
// entries here (icon maps to a glyph in Education.jsx) and the timeline grows
// automatically.
const education = [
  {
    icon: "cap",
    title: "B.Tech in Computer Science",
    institution: "Mar Athanasius College of Engineering",
    score: { value: 7.54, decimals: 2, trailing: "", label: "CGPA" },
    accent: "#1689C8",
  },
  {
    icon: "book",
    title: "Senior Secondary",
    institution: "Marygiri CMI Public School",
    score: { value: 93.4, decimals: 1, trailing: "%", label: "Percentage" },
    accent: "#38BDF8",
  },
  {
    icon: "book",
    title: "High School",
    institution: "Marygiri CMI Public School",
    score: { value: 90.4, decimals: 1, trailing: "%", label: "Percentage" },
    accent: "#818CF8",
  },
];

export { experiences, portfolio, events, certifications, socials, education };

