import { Code, Database, Cloud, Brain, Smartphone, Users } from 'lucide-react';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Industry Knowledge",
    icon: <Brain className="w-6 h-6" />,
    skills: ["TypeScript", "Artificial Intelligence (AI)", "Large Language Models (LLM)", "API Development", "Full-Stack Development"],
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Tools & Technologies",
    icon: <Code className="w-6 h-6" />,
    skills: ["Svelte", "Sveltekit", "Prisma ORM", "PostgreSQL", "Amazon Web Services (AWS)", "Ruby on Rails", "React.js", "Ruby", "SQL", "Tailwind CSS", "Figma (Software)", "GitHub", "Git"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Interpersonal Skills",
    icon: <Users className="w-6 h-6" />,
    skills: ["Team Management"],
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Other Skills",
    icon: <Database className="w-6 h-6" />,
    skills: ["Langchain", "Vector Databases"],
    color: "from-purple-500 to-violet-500"
  }
];

export function SkillsSection() {
  return (
    <div className="py-16 px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            A comprehensive toolkit spanning modern web technologies, AI integration, and leadership
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} />
          ))}
        </div>
        
        {/* Education Section */}
        <div className="mt-16">
          <h3 className="text-2xl mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg mb-2 text-gray-900">Full Stack Web Developer, Computer Programming</h4>
              <p className="text-blue-600 mb-1">Le Wagon</p>
              <p className="text-gray-600 text-sm">2021</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg mb-2 text-gray-900">Business Major</h4>
              <p className="text-blue-600 mb-1">Erasmus University College</p>
              <p className="text-gray-600 text-sm">Rotterdam, Netherlands • 2020</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg mb-2 text-gray-900">International Baccalaureate diploma and High School diploma</h4>
              <p className="text-blue-600 mb-1">American Embassy School, New Delhi</p>
              <p className="text-gray-600 text-sm">2017</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg mb-2 text-gray-900">Global Entrepreneurship & Innovation Course</h4>
              <p className="text-blue-600 mb-1">Columbia University</p>
              <p className="text-gray-600 text-sm">Business/Commerce, General • June 2016</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  return (
    <div className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${category.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
          {category.icon}
        </div>
        <h3 className="text-lg text-gray-900 mb-3">{category.title}</h3>
      </div>
      
      <div className="space-y-2">
        {category.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
            <span className="text-gray-700">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}