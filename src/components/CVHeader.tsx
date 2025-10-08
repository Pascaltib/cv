import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';

export function CVHeader() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
      
      {/* Abstract pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-white/25 rounded-full"></div>
      </div>
      
      <div className="relative z-10 px-8 py-16 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl text-white mb-4 tracking-tight">
              Pascal Tiberghien
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Full Stack Developer
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <ContactItem 
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value="pascaltib@gmail.com"
              href="mailto:pascaltib@gmail.com"
            />
            <ContactItem 
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              value="+34 645587412"
              href="tel:+34645587412"
            />
            <ContactItem 
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
              value="pascaltib"
              href="https://linkedin.com/in/pascaltib"
            />
            <ContactItem 
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              value="Pascaltib"
              href="https://github.com/Pascaltib"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value, href }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a 
      href={href}
      className="group flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
    >
      <div className="text-cyan-300 group-hover:text-cyan-200 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-white/80 text-sm">{label}</p>
        <p className="text-white truncate">{value}</p>
      </div>
    </a>
  );
}