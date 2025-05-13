import {
  writer,
  diet,
  lungfraud,
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
    name: "Lung Cancer Tampering Detection",
    description:
      "An AI-based system designed to detect fraudulent modifications in lung CT scans, specifically identifying artificially inserted cancerous nodules.",
    image: lungfraud,
  },
  {
    name: "DietX",
    description:
      "AI-powered Dietary Assistance Website analyzes meal photos to provide nutritional information and personalized dietary recommendations based on hospital-specific requirements.",
    image: diet,
  },
  {
    name: "Writer's Aid",
    description:
      "A website that leverages gemini API fetch to help writers with writer's block.",
    image: writer,
  },
];

export { experiences, portfolio };

