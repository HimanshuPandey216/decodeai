/**
 * DECODE AI - Central Platform Configuration
 * Easy configuration file for managing site metadata, stats, social URLs, and settings.
 * Founder & Creator: Himanshu Pandey
 */

const DECODE_CONFIG = {
  siteName: "DECODE AI",
  tagline: "Learn AI. Build Future.",
  description: "A community-driven knowledge platform for learning Artificial Intelligence, Machine Learning, Data Science, and modern technology — one concept at a time.",
  url: "https://decodeai.onrender.com",
  
  // Header & Branding settings
  logoPath: "assets/logo.png",
  faviconPath: "assets/favicon.png",
  logoFallbackText: "DECODE AI",
  
  // Dashboard & Trust Strip Statistics
  stats: [
    { number: "50+", label: "Curated Resources", id: "stat-resources" },
    { number: "20+", label: "Learning Paths", id: "stat-paths" },
    { number: "16+", label: "Domain Topics", id: "stat-topics" },
    { number: "100%", label: "Community Driven", id: "stat-community" }
  ],
  
  // Author & Social Links
  author: {
    name: "Himanshu Pandey",
    role: "Founder & Lead Architect",
    github: "https://github.com/HimanshuPandey216",
    linkedin: "https://www.linkedin.com/in/himanshu-pandey12"
  },

  socialLinks: {
    github: "https://github.com/HimanshuPandey216",
    linkedin: "https://www.linkedin.com/in/himanshu-pandey12",
    twitter: "https://x.com/decodeai",
    discord: "https://discord.gg/decodeai"
  },
  
  // Contribution URLs
  contributionUrl: "https://github.com/HimanshuPandey216/decodeai/pulls",
  newIssueUrl: "https://github.com/HimanshuPandey216/decodeai/issues/new",
  
  // Resource types & color themes
  resourceTypes: [
    { type: "NOTES", label: "Notes", badgeClass: "badge-notes" },
    { type: "PDF", label: "PDF Document", badgeClass: "badge-pdf" },
    { type: "ROADMAP", label: "Roadmap", badgeClass: "badge-roadmap" },
    { type: "BOOK NOTES", label: "Book Notes", badgeClass: "badge-book" },
    { type: "RESEARCH", label: "Research Paper", badgeClass: "badge-research" },
    { type: "TUTORIAL", label: "Tutorial", badgeClass: "badge-tutorial" },
    { type: "CHEATSHEET", label: "Cheatsheet", badgeClass: "badge-cheatsheet" },
    { type: "PROJECT", label: "Project Guide", badgeClass: "badge-project" },
    { type: "INTERVIEW", label: "Interview Prep", badgeClass: "badge-interview" }
  ],

  // Levels
  levels: ["Beginner", "Intermediate", "Advanced"]
};

// Make available globally
if (typeof window !== "undefined") {
  window.DECODE_CONFIG = DECODE_CONFIG;
}
