import React from 'react';
import { Layers } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const scrollToSection = (e: React.MouseEvent, id: string) => {
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

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div 
              className="flex items-center gap-2 mb-4 cursor-pointer" 
              onClick={(e) => scrollToTop(e)}
            >
              <Layers className="h-6 w-6 text-gray-400" />
              <span className="font-bold text-lg text-gray-700">OptiPress</span>
            </div>
            <p className="text-sm text-gray-500">
              The smartest way to optimize your images for the web. Free, secure, and client-side processing.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={(e) => scrollToSection(e, 'upload-area')} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  Image Compressor
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, 'upload-area')} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  WebP Converter
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, 'upload-area')} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  Resize Image
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={(e) => scrollToSection(e, 'features')} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, 'faq')} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="text-sm text-gray-500 hover:text-primary transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Connect</h3>
             <ul className="space-y-3">
              <li>
                <span className="text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors">Twitter</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors">GitHub</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} OptiPress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};