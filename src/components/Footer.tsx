import { Heart, Coffee, Zap } from 'lucide-react';

export function Footer() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-12 px-8 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="text-2xl text-white mb-4">Let's Build Something Amazing Together</h3>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Ready to innovate with AI-powered solutions and cutting-edge web technologies? 
            Let's connect and discuss your next project.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex items-center gap-2 text-cyan-300">
            <Zap className="w-5 h-5" />
            <span>AI Enthusiast</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Coffee className="w-5 h-5" />
            <span>Problem Solver</span>
          </div>
          <div className="flex items-center gap-2 text-pink-300">
            <Heart className="w-5 h-5" />
            <span>Tech Innovator</span>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <p className="text-white/60">
            © 2024 Pascal Tiberghien • Crafted with modern web technologies
          </p>
          <p className="text-white/40 text-sm mt-2">
            "The future belongs to those who believe in the beauty of their dreams" - Eleanor Roosevelt
          </p>
        </div>
      </div>
    </div>
  );
}