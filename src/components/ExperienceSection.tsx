import { Calendar, MapPin, Building, ExternalLink } from 'lucide-react';

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
    title: "Lead Developer",
    company: "Navar",
    location: "Hamburg, Germany",
    period: "July 2023 - Present",
    description: [
      "I'm the Lead Developer at Navar, where we're deploying AI to redefine business transformation. Our tool is a catalyst for change, aiding in market adaptation, tech modernization, and efficiency gains. My role is twofold: leveraging LLMS to automate transformational consulting for B2B clients and ensuring a topnotch user experience and product.",
      "Key Responsibilities:",
      "Architect and implement multi-model AI systems utilizing OpenAI GPT models, Google Gemini, and Anthropic Claude to provide diverse AI capabilities and optimal performance for different use cases.",
      "Design and maintain RAG (Retrieval-Augmented Generation) pipelines that enhance AI responses with contextual business data and domain-specific knowledge.",
      "Developing early stage product and scaling to a more comprehensive transformation platform with enterprise-grade AI integration.",
      "Working on infrastructure aspects to ensure optimal performance, privacy, and security across multiple AI model providers.",
      "Leading technical architecture decisions for seamless AI model switching and fallback mechanisms."
    ],
    technologies: ["TypeScript", "SvelteKit", "Svelte", "Prisma ORM", "Tailwind", "Vercel AI SDK", "OpenAI GPT", "Google Gemini", "Anthropic Claude", "Azure OpenAI", "Pinecone", "RAG"],
    website: "https://navar.ai"
  },
  {
    title: "Software Engineer & Product Manager",
    company: "KnowThyself360°",
    location: "United States · Remote",
    period: "January 2024 - Present",
    description: [
      "Founder and developer for small tech startup based in the US.",
      "Responsible for product management and technical development of app.",
      "Tech stack: Svelte, Sveltekit, Shadcn, TypeScript, Sveltekit, Svelte, Prisma ORM, Tailwind, integrated with OpenAI API."
    ],
    technologies: ["Svelte", "SvelteKit", "TypeScript", "Prisma ORM", "Tailwind CSS", "OpenAI API"],
    website: "https://knowthyself360.ai"
  },
  {
    title: "Chief Technology Officer and Full Stack Web Developer",
    company: "Audemic",
    location: "Madrid, Community of Madrid, Spain",
    period: "March 2022 - March 2024",
    description: [
      "As the CTO at Audemic, I am responsible for the development of our online web platform as a Full Stack Developer, implementing our cloud architecture on AWS, and overseeing the development of a productiongrade machine learning NLP model. We are now in the process of developing a new product which will be interfaced through a mobile application \"Audemic Insights\". I am in charge of the development of both the backend infrastructure and the React Native frontend."
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
    <div className="py-16 px-8 md:px-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block"></div>
          
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
      <div className="absolute -left-20 top-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
      
      <div className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl text-gray-900 mb-1">{experience.title}</h3>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Building className="w-4 h-4" />
              {experience.website ? (
                <a 
                  href={experience.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors flex items-center gap-1 group"
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
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{experience.period}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{experience.location}</span>
            </div>
          </div>
        </div>
        
        {experience.description.length > 0 && (
          <div className="space-y-2 mb-4">
            {experience.description.map((desc, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                • {desc}
              </p>
            ))}
          </div>
        )}
        
        {experience.technologies && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {experience.technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm border border-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}