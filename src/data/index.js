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
  creative
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
    id: "events",
    title: "Events",
  },
  {
    id: "certifications",
    title: "Certifications",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const experiences = [
  {
    title: "YouTube Content Creator",
    company_name: "Self Employed",
    date: "2016 - Present",
    details: [
      "Built a subscriber base of over <span style='color: white;'>500,000 subscribers</span> by creating video content to help programmers.",
      "Crafted visually appealling programming videos that have garnered over <span style='color: white;'>30,000,000 views</span>.",
      "Produced high-quality educational and entertaining videos for clients including <span style='color: white;'>Intel, JetBrains, and MicroCenter</span>.",
    ],
  },
  {
    title: "Software Developer",
    company_name: "Indie",
    date: "2019 - 2023",
    details: [
      "Developed and delivered custom interdisciplinary coding portfolio for clients including <span style='color: white;'>Nvidia, Hostinger, and Amazon</span>.",
      "<span style='color: white;'>Designed and developed innovative</span> AI applications and interactive websites.",
      "<span style='color: white;'>Managed full project lifecycle</span> from concept to deployment in successful and timely project completions.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Prime 3",
    date: "2018 - 2019",
    details: [
      "Built custom enterprise applications for a <span style='color: white;'>Fortune 500 company</span> as a full-stack software engineer.",
      "Developed and maintained <span style='color: white;'>scalable backend services</span>, ensuring high availability for critical business applications.",
      "<span style='color: white;'>Collaborated with a team</span> to design and implement front-end interfaces.",
    ],
  },
  {
    title: "Computer Science",
    company_name: "ODU",
    date: "2015 - 2018",
    details: [
      "Built a <span style='color: white;'>computer science foundation</span> learning theory, computer architecture, and software engineering.",
      "Worked and interned at <span style='color: white;'>NASA and Norfolk Southern Railway</span> to gain practical experience in the field of data analysis.",
      "Acted as a member of the <span style='color: white;'>Association for Computing Machinery</span> (ACM).",
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
    title: "National Hackathon — Finalist",
    category: "Technical",
    date: "Oct 2024",
    description: "Reached the national finals with a real-time logistics optimization tool, competing among 300+ teams across the country.",
    images: [technical],
    heightClass: "h-[260px]"
  },
  {
    title: "Tree Plantation Drive",
    category: "Community",
    date: "Jul 2024",
    description: "Co-organized a drive planting 200+ saplings across 3 neighborhoods.",
    images: [community],
    heightClass: "h-[260px]"
  },
  {
    title: "Tech Talk — Cloud Arch.",
    category: "Leadership",
    date: "Jan 2025",
    description: "40-min session on microservices to 80+ students.",
    images: [leadership],
    heightClass: "h-[200px]"
  },
  {
    title: "IEEE Research Paper",
    category: "Academic",
    date: "Mar 2025",
    description: "Published on cloud-native distributed tracing.",
    images: [academic],
    heightClass: "h-[200px]"
  },
  {
    title: "Open-Source Project",
    category: "Creative",
    date: "May 2025",
    description: "DevOps toolkit — 500+ stars, 40 contributors.",
    images: [creative],
    heightClass: "h-[200px]"
  }
];

const certifications = [
  { abbr: "AZ", name: "Azure Fundamentals (AZ-900)", platform: "Microsoft Azure", date: "Jan 2025", id: "AZ-3F8A-2025", tags: ["Cloud", "Azure", "IaaS", "Security"], color: "#0078D4", glow: "rgba(0,120,212,0.28)" },
  { abbr: "AWS", name: "AWS Cloud Practitioner", platform: "Amazon Web Services", date: "Mar 2025", id: "CLF-C02-7B2D", tags: ["AWS", "EC2", "S3", "IAM"], color: "#FF9900", glow: "rgba(255,153,0,0.28)" },
  { abbr: ".NET", name: "Programming in C# (.NET 8)", platform: "Microsoft", date: "Aug 2024", id: "MS-70483-9E1C", tags: ["C#", ".NET", "OOP", "LINQ"], color: "#7c5cfc", glow: "rgba(124,92,252,0.28)" },
  { abbr: "GCP", name: "Google Cloud Essentials", platform: "Google Cloud", date: "Nov 2024", id: "GCP-ASSOC-4D7F", tags: ["GCP", "Kubernetes", "Cloud Run"], color: "#34a853", glow: "rgba(52,168,83,0.28)" },
  { abbr: "DKR", name: "Docker Certified Associate", platform: "Docker / CNCF", date: "May 2024", id: "DCA-5A3B-2024", tags: ["Docker", "Containers", "DevOps"], color: "#2496ED", glow: "rgba(36,150,237,0.28)" },
  { abbr: "LF", name: "DevOps & Cloud Native Essentials", platform: "Linux Foundation", date: "Feb 2025", id: "LFD-8C2E-2025", tags: ["CI/CD", "GitHub Actions", "Pipeline"], color: "#E87722", glow: "rgba(232,119,34,0.28)" },
];

export { experiences, portfolio, events, certifications };

