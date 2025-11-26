import React from 'react';
import { Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToUpload = () => {
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
      uploadArea.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a 
              href="/"
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer" 
              onClick={scrollToTop}
              aria-label="OptiPress Homepage - Online Image Compressor"
            >
              <Layers className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900">OptiPress</span>
            </a>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              >
                How to Use
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, 'faq')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              >
                FAQ
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={scrollToUpload}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              aria-label="Start Compressing Images"
            >
              Start Compressing
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};