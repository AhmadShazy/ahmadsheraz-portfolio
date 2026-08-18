// Seeds MongoDB with the portfolio content from CONTEXT.md.
//
// Run with:  npm run seed
//
// Destructive by design: every collection it owns is cleared first so the DB
// always ends up an exact mirror of CONTEXT.md. It never touches `messages` —
// those are real contact submissions and must survive a reseed.
import connectDB from "./mongodb.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Education from "./models/Education.js";
import SocialLink from "./models/SocialLink.js";
import mongoose from "mongoose";

const PROJECTS = [
  {
    rank: 1,
    rating: 9.4,
    isStarred: true,
    title: "JobCraft AI",
    description:
      "AI-powered job application generator. Paste a job description, get a tailored resume + cover letter as .docx. Includes a Q&A assistant that answers screening questions in the user's own voice.",
    techStack: ["React 19", "FastAPI", "MongoDB", "Gemini API", "JWT", "Docker", "Resend"],
    tags: ["AI", "Full-Stack", "FastAPI", "React", "MongoDB", "Docker"],
    githubUrl: "https://github.com/AhmadShazy/JobCraft-AI-Application-Generator",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 2,
    rating: 9.1,
    title: "Emotion Detection System",
    description:
      "Multimodal Humanoid Assistant — detects human emotion in real time from speech and facial expressions simultaneously. Three cutting-edge AI models fused together.",
    techStack: ["Python", "Whisper", "SpeechBrain", "Wav2Vec2", "OpenFace"],
    tags: ["AI", "ML", "Multimodal", "NLP", "Computer Vision", "FYP"],
    githubUrl: "https://github.com/AhmadShazy/Emotion-Detection-System",
    liveUrl: null,
    isPrivate: true,
  },
  {
    rank: 3,
    rating: 8.7,
    title: "Smart Grid Energy Monitoring",
    description:
      "Real-time parallel and distributed IoT data pipeline for smart grid energy monitoring. Handles high-velocity household energy data streams at scale.",
    techStack: ["MQTT", "Apache Kafka", "PySpark", "InfluxDB", "Grafana", "Python"],
    tags: ["Data Engineering", "Kafka", "Spark", "IoT", "Distributed Systems"],
    githubUrl: "https://github.com/AhmadShazy/smart-grid-energy-monitoring",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 4,
    rating: 7.8,
    title: "Visual Cryptography Engine",
    description:
      "Securely encrypts and decrypts binary and RGB/grayscale images using a custom XOR One-Time Pad (OTP) algorithm with 2x pixel expansion.",
    techStack: ["Python", "NumPy", "PIL"],
    tags: ["Cryptography", "Image Processing", "Python", "Security"],
    githubUrl: "https://github.com/AhmadShazy/-visual-cryptography-encryption-engine",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 5,
    rating: 7.3,
    title: "Face Recognition Attendance System",
    description:
      "GUI-based face recognition attendance tracking system with a complete CV pipeline — real-time face detection, recognition, and automated attendance logging.",
    techStack: ["Python", "OpenCV", "Haar Cascade", "LBPH"],
    tags: ["Computer Vision", "OpenCV", "Python", "AI"],
    githubUrl: "https://github.com/AhmadShazy/Face_Recognition_App",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 6,
    rating: 6.2,
    title: "Income Predictor",
    description:
      "End-to-end ML pipeline predicting whether an individual earns over $50K/year. Includes full EDA, feature engineering with PCA, and comparative classification models.",
    techStack: ["Python", "scikit-learn", "Pandas", "PCA", "Jupyter"],
    tags: ["Machine Learning", "Python", "EDA", "scikit-learn"],
    githubUrl: "https://github.com/AhmadShazy/Income-Predictor",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 7,
    rating: 5.9,
    title: "Fullstack E-Commerce",
    description:
      "Responsive full-stack e-commerce application with secure authentication, persistent shopping carts, and a dedicated admin dashboard.",
    techStack: ["Node.js", "EJS", "Tailwind CSS", "Express.js"],
    tags: ["Full-Stack", "Node.js", "E-Commerce"],
    githubUrl: "https://github.com/AhmadShazy/fullstack-ecommerce-node",
    liveUrl: null,
    isPrivate: false,
  },
];

// `icon` holds a Lucide component name; the Skills section maps it back to a
// component. "GithubIcon" is the inline SVG fallback (lucide has no brand marks).
const SKILL_GROUPS = {
  Languages: [
    ["Python", "Code2"],
    ["JavaScript", "Braces"],
    ["SQL", "Database"],
    ["C++", "Binary"],
  ],
  Frontend: [
    ["React.js", "Atom"],
    ["Next.js", "Triangle"],
    ["Tailwind CSS", "Wind"],
    ["Three.js / R3F", "Box"],
    ["HTML/CSS", "FileCode"],
  ],
  "Backend & APIs": [
    ["FastAPI", "Zap"],
    ["Node.js", "Hexagon"],
    ["Express.js", "Route"],
    ["REST APIs", "Webhook"],
    ["JWT Auth", "ShieldCheck"],
  ],
  "AI / ML": [
    ["Gemini API", "Sparkles"],
    ["OpenAI Whisper", "Mic"],
    ["SpeechBrain", "AudioLines"],
    ["OpenFace", "ScanFace"],
    ["OpenCV", "Eye"],
    ["scikit-learn", "LineChart"],
    ["Deep Learning", "BrainCircuit"],
  ],
  "Data Engineering": [
    ["Apache Kafka", "Workflow"],
    ["Apache Spark (PySpark)", "Flame"],
    ["MQTT (Mosquitto)", "Radio"],
    ["InfluxDB", "Activity"],
    ["Grafana", "BarChart3"],
  ],
  Databases: [
    ["MongoDB", "Leaf"],
    ["MySQL", "Database"],
    ["InfluxDB", "Activity"],
  ],
  "DevOps & Tools": [
    ["Docker", "Container"],
    ["Docker Compose", "Layers"],
    ["Git", "GitBranch"],
    ["GitHub", "GithubIcon"],
    ["Vercel", "Cloud"],
    ["Render", "Server"],
    ["Linux", "Terminal"],
    ["Postman", "Send"],
  ],
};

const SKILLS = Object.entries(SKILL_GROUPS).flatMap(([category, entries]) =>
  entries.map(([name, icon], i) => ({ name, category, icon, order: i }))
);

const EDUCATION = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "COMSATS University Islamabad, Lahore Campus",
    startYear: 2023,
    endYear: 2027,
    specialization: "AI/ML · Data Engineering · Backend Engineering",
    coursework: [
      "Data Structures",
      "Algorithms",
      "Machine Learning",
      "Database Systems",
      "Computer Networks",
      "Parallel & Distributed Computing",
      "Computer Vision",
    ],
    fyp: "Emotion Detection System — Multimodal AI using Whisper + SpeechBrain + OpenFace",
  },
];

const EXPERIENCE = [
  {
    role: "Actively Seeking First Industry Role",
    company:
      "Open to AI Engineering · Data Engineering · Backend Engineering positions",
    isCurrent: true,
    description:
      "Currently focused on building production-grade AI systems and data pipelines through academic projects and self-directed development.",
    bullets: [
      "Currently focused on building production-grade AI systems and data pipelines through academic projects and self-directed development.",
    ],
    order: 0,
  },
];

const SOCIAL_LINKS = [
  { platform: "GitHub", url: "https://github.com/AhmadShazy", icon: "GithubIcon", order: 0 },
  { platform: "LinkedIn", url: "https://linkedin.com/in/ahmadshazy", icon: "LinkedinIcon", order: 1 },
];

async function seed() {
  await connectDB();
  console.log("connected to:", mongoose.connection.name);

  // Content collections are replaced wholesale. `messages` is deliberately
  // excluded — real submissions must not be wiped by a reseed.
  await Promise.all([
    Project.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Education.deleteMany({}),
    SocialLink.deleteMany({}),
  ]);
  console.log("cleared content collections (messages preserved)");

  const [projects, skills, experience, education, social] = await Promise.all([
    Project.insertMany(PROJECTS),
    Skill.insertMany(SKILLS),
    Experience.insertMany(EXPERIENCE),
    Education.insertMany(EDUCATION),
    SocialLink.insertMany(SOCIAL_LINKS),
  ]);

  console.log("seeded:");
  console.log("  projects   :", projects.length);
  console.log("  skills     :", skills.length);
  console.log("  experience :", experience.length);
  console.log("  education  :", education.length);
  console.log("  social     :", social.length);

  await mongoose.disconnect();
  console.log("done");
}

seed().catch((err) => {
  console.error("SEED FAILED:", err.message);
  process.exit(1);
});
