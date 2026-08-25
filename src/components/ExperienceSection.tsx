import { Calendar, MapPin, Building, ExternalLink } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies?: string[];
  website?: string;
}

const experiences: Experience[] = [
  {
    title: "Founding Engineer & Product Manager",
    company: "KnowThyself360°",
    location: "United States · Remote",
    period: "January 2024 - Present",
    description: [
      "Sole developer of an AI 360° feedback platform, around 113k lines of Svelte and TypeScript.",
      "Built the multi-stage LLM report pipeline (anonymization, theme extraction, narrative reports, blind-spot insights), Stripe billing, multi-week feedback workflows and an internal harness that benchmarks the pipeline across five models.",
      "Run sales demos, onboarding and support for B2B clients including an NHS trust. Handle pricing, paid campaigns, email deliverability and website copy."
    ],
    technologies: ["Svelte 5", "SvelteKit", "TypeScript", "Prisma", "PostgreSQL (Neon)", "Tailwind CSS", "Vercel AI SDK", "Stripe", "Inngest", "Resend", "ElevenLabs"],
    website: "https://knowthyself360.ai"
  },
  {
    title: "Lead Developer",
    company: "Navar",
    location: "Hamburg, Germany · Remote",
    period: "July 2023 - Present",
    description: [
      "Sole engineer (950+ commits) of a B2B platform for AI-assisted business transformation: chat workspaces with live AI-edited documents, and \"lenses\", AI advisors modeled on real experts or on the user's own decision-making.",
      "Built the multi-model AI layer (Claude, GPT, Gemini) with provider failover, prompt caching and context-window management.",
      "Wrote an MCP server and an OAuth 2.1 authorization server so tools like Claude Code and Cursor can consult lenses directly.",
      "Added per-step cost tracking, credit metering and usage-based billing for agentic loops, plus durable background jobs and document ingestion."
    ],
    technologies: ["TypeScript", "SvelteKit", "Svelte 5", "Prisma", "PostgreSQL (Neon)", "Tailwind", "Vercel AI SDK", "MCP", "OAuth 2.1", "Polar", "Upstash Redis", "Vercel"],
    website: "https://navar.ai"
  },
  {
    title: "Chief Technology Officer and Full Stack Web Developer",
    company: "Audemic",
    location: "Madrid, Community of Madrid, Spain",
    period: "March 2022 - March 2024",
    description: [
      "Led development of the online web platform as a full stack developer and implemented the cloud architecture on AWS.",
      "Oversaw development of a production-grade machine learning NLP model.",
      "Built the Audemic Insights mobile app, owning the backend infrastructure and the React Native frontend."
    ],
    technologies: ["AWS", "Machine Learning", "NLP", "React Native", "Full Stack Development"],
    website: "https://audemic.io"
  },
  {
    title: "Lead Developer",
    company: "Audemic",
    location: "United Kingdom",
    period: "December 2021 - March 2022",
    description: [
      "Lead developer role at Audemic focusing on early-stage product development and technical architecture."
    ],
    technologies: ["JavaScript", "React", "Node.js", "AWS"],
    website: "https://audemic.io"
  },
  {
    title: "Web Development Teaching Assistant",
    company: "Le Wagon",
    location: "Madrid, Community of Madrid, Spain",
    period: "December 2021 - May 2022",
    description: [
      "Skills: JavaScript · Ruby · Ruby on Rails · StimulusJS · Heroku · sidekiq"
    ],
    technologies: ["JavaScript", "Ruby", "Ruby on Rails", "Heroku", "Sidekiq"]
  },
  // {
  //   title: "Business Analyst Intern",
  //   company: "editorji",
  //   location: "New Delhi, Delhi, India",
  //   period: "August 2018 - March 2019",
  //   description: [
  //     "Conducted competitor analysis, and recommended adoption strategies for a newly founded Indian video news technology startup. This was presented in 6 reports to senior executives and the founder of the company. Utilised Mandarin proficiency to analyse the employment of artificial intelligence in Chinese video news applications and conducted consumer research within the Chinese market."
  //   ]
  // },
  // {
  //   title: "Data Analytics & Entrepreneurship Intern",
  //   company: "IT Consultis",
  //   location: "Shanghai, China",
  //   period: "June 2018 - August 2018",
  //   description: [
  //     "Created a company pitch deck for potential investors, including key financial projections and company analysis. This involved working with the founders of the company to establish key company goals and direction in the deck. Coded and organised password database for company use on different inhouse platforms using LastPass. Programmed an interactive dashboard displaying the companies KPI's and other statistics live within the office building."
  //   ]
  // }
];

export function ExperienceSection() {
  return (
    <div className="py-16 px-8 md:px-16 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">
            Professional Experience
          </h2>
          <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white hidden md:block"></div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} experience={exp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="relative md:ml-16">
      {/* Timeline dot */}
      {/* <div className="absolute -left-20 top-6 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-border ring-2 ring-blue-600/30 shadow-lg hidden md:block"></div> */}

      <LiquidGlassCard
        draggable={true}
        blurIntensity="sm"
        shadowIntensity="md"
        glowIntensity="sm"
        borderRadius="12px"
        className="group p-6"
      >
        <div className="relative z-30">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl text-white mb-1">{experience.title}</h3>
              <div className="flex items-center gap-2 text-blue-300 mb-2">
                <Building className="w-4 h-4" />
                {experience.website ? (
                  <a
                    href={experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-100 transition-colors flex items-center gap-1 group"
                  >
                    <span>{experience.company}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span>{experience.company}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{experience.period}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{experience.location}</span>
              </div>
            </div>
          </div>

          {experience.description.length > 0 && (
            <div className="space-y-2 mb-4">
              {experience.description.map((desc, index) => (
                <p key={index} className="text-white/90 leading-relaxed">
                  • {desc}
                </p>
              ))}
            </div>
          )}

          {experience.technologies && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
              {experience.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </LiquidGlassCard>
    </div>
  );
}