import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Settings, Zap, Shield, Image as ImageIcon, X, FileText, Lock } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdPlaceholder } from './components/AdPlaceholder';
import { ResultRow } from './components/ResultRow';
import { compressImage } from './utils/compression';
import { ProcessedFile, CompressionSettings } from './types';

// Simple Cookie Consent Component for AdSense Compliance
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem('optipress-consent');
      if (!consented) {
        setVisible(true);
      }
    } catch (e) {
      console.warn('LocalStorage access restricted, showing consent banner default state.');
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem('optipress-consent', 'true');
    } catch (e) {
      console.warn('LocalStorage write failed');
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
          By using our site, you agree to our use of cookies.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={accept}
            className="bg-primary hover:bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            Accept All
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Legal Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500 max-h-[60vh] overflow-y-auto pr-2">
              {children}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Global Settings
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 0.8,
    format: 'image/webp',
    maxWidth: 1920
  });

  const clearFiles = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
  };

  const processFiles = useCallback(async (newFiles: File[]) => {
    const processingQueue: ProcessedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      originalFile: file,
      compressedBlob: null,
      status: 'processing',
      originalSize: file.size,
      compressedSize: 0,
      compressionRatio: 0,
      previewUrl: URL.createObjectURL(file),
      settings: { ...settings }
    }));

    setFiles(prev => [...processingQueue, ...prev]);

    for (const pFile of processingQueue) {
      try {
        const compressedBlob = await compressImage(pFile.originalFile, settings);
        
        setFiles(prev => prev.map(f => {
            if (f.id === pFile.id) {
                const ratio = ((pFile.originalSize - compressedBlob.size) / pFile.originalSize) * 100;
                return {
                    ...f,
                    compressedBlob,
                    status: 'done',
                    compressedSize: compressedBlob.size,
                    compressionRatio: ratio > 0 ? ratio : 0
                };
            }
            return f;
        }));
      } catch (error) {
         console.error("Error compressing", error);
         setFiles(prev => prev.map(f => f.id === pFile.id ? { ...f, status: 'error' } : f));
      }
    }
  }, [settings]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        const validFiles = filesArray.filter((f) => f.type && f.type.startsWith('image/'));
        if (validFiles.length > 0) {
          processFiles(validFiles);
        }
    }
  };

  const handleSettingsChange = (key: keyof CompressionSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-indigo-700 pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative max-w-4xl mx-auto z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Free Online Image Compressor <br/> Reduce File Size for SEO
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Reduce image file sizes by up to 90% without losing quality. 
              Secure, private, and runs entirely in your browser.
            </p>

            {/* Settings Bar */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-6 inline-flex flex-wrap gap-4 items-center justify-center border border-white/20">
               <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm font-medium">Format:</span>
                  <select 
                      value={settings.format}
                      onChange={(e) => handleSettingsChange('format', e.target.value)}
                      className="bg-indigo-900 border-none rounded text-sm py-1 pl-2 pr-8 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                  >
                      <option value="image/webp">WebP (Recommended)</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                  </select>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Quality:</span>
                  <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={settings.quality}
                      onChange={(e) => handleSettingsChange('quality', parseFloat(e.target.value))}
                      className="w-24 accent-green-400"
                  />
                  <span className="text-xs w-8 text-left">{Math.round(settings.quality * 100)}%</span>
               </div>
            </div>

            {/* Upload Area */}
            <div 
              id="upload-area"
              className={`
                  bg-white rounded-xl shadow-2xl p-8 sm:p-12 border-2 border-dashed transition-all duration-200 cursor-pointer
                  ${isDragging ? 'border-green-400 bg-green-50 scale-102' : 'border-indigo-300 hover:border-indigo-400'}
              `}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  className="hidden" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp" 
              />
              <div className="flex flex-col items-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop images here</h3>
                  <p className="text-gray-500 mb-6">Supports JPG, PNG, and WebP</p>
                  <button className="bg-primary hover:bg-indigo-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5">
                      Select Images
                  </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot 1 */}
        <div className="max-w-4xl mx-auto px-4">
           <AdPlaceholder format="horizontal" />
        </div>

        {/* Results Section */}
        {files.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="results">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Optimization Results</h2>
                  <button 
                      onClick={clearFiles}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                      Clear All
                  </button>
              </div>
              <div className="space-y-4">
                  {files.map(file => (
                      <ResultRow key={file.id} file={file} />
                  ))}
              </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-white scroll-mt-16" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold text-gray-900">Why Choose OptiPress?</h2>
                  <p className="mt-4 text-lg text-gray-500">
                    The professional choice for web developers, bloggers, and SEO specialists.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">100% Secure & Private</h3>
                      <p className="text-gray-600">
                          We use advanced client-side compression technology (WASM/Canvas). Your photos never leave your device, ensuring total privacy.
                      </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast Processing</h3>
                      <p className="text-gray-600">
                          Optimize dozens of images in seconds. Our algorithm efficiently reduces file size while maintaining visual fidelity for Retina displays.
                      </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                          <ImageIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Lossy Compression</h3>
                      <p className="text-gray-600">
                          Intelligent algorithms analyze every pixel to strip unnecessary metadata and optimize color profiles without noticeable quality loss.
                      </p>
                  </div>
              </div>
          </div>
        </section>

        {/* Knowledge Base Section (Crucial for AdSense) */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Understanding Image Optimization</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    JPEG vs. PNG vs. WebP
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choosing the right format is the first step in optimization. <strong>JPEG</strong> is ideal for photographs and complex images with many colors. <strong>PNG</strong> is best for images requiring transparency or sharp lines (like logos). <strong>WebP</strong> is a modern format developed by Google that provides superior lossless and lossy compression for images on the web, often reducing file sizes by 30% compared to JPEG.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    Why Compression Matters for SEO
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Page speed is a direct ranking factor for Google. Large images are the primary culprit for slow Largest Contentful Paint (LCP) scores. By compressing your images, you ensure your website loads faster, reducing bounce rates and improving your Core Web Vitals, which can lead to higher search engine rankings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-indigo-500" />
                    Client-Side vs. Server-Side Compression
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    OptiPress uses client-side compression. This means your images are processed directly on your device using your browser's capabilities. Unlike server-side tools where you upload your data to a remote cloud, client-side processing guarantees that your sensitive files never leave your computer, offering 100% data privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot 2 */}
        <div className="max-w-4xl mx-auto px-4 bg-gray-50 py-8">
           <AdPlaceholder format="horizontal" />
        </div>

        {/* How it works */}
        <section className="py-16 bg-white border-t border-gray-200 scroll-mt-16" id="how-it-works">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Reduce Image Size</h2>
              <div className="prose prose-indigo mx-auto text-gray-600">
                  <ul className="space-y-4 list-none pl-0">
                      <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                          <span><strong>Upload:</strong> Drag & drop your files into the optimization box. We support bulk uploading.</span>
                      </li>
                      <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                          <span><strong>Configure:</strong> Adjust the quality slider. For most webs uses, 80% quality offers the perfect balance.</span>
                      </li>
                      <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                          <span><strong>Download:</strong> Instantly download your compressed images.</span>
                      </li>
                  </ul>
              </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 scroll-mt-16" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-8">
                  <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Is this image compressor free?</h3>
                      <p className="text-gray-500">Yes, OptiPress is completely free to use. There are no daily limits, no watermarks, and no registration required.</p>
                  </div>
                  <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">What is the best format for websites?</h3>
                      <p className="text-gray-500">We highly recommend <strong>WebP</strong>. It provides superior compression and quality characteristics compared to older JPEG and PNG formats.</p>
                  </div>
                  <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Do you keep my photos?</h3>
                      <p className="text-gray-500">No. OptiPress operates entirely in your browser. Your images are never sent to a server.</p>
                  </div>
              </div>
          </div>
        </section>
      </main>

      <Footer onOpenPrivacy={() => setShowPrivacy(true)} onOpenTerms={() => setShowTerms(true)} />
      <CookieConsent />

      {/* Legal Modals */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <div className="prose prose-sm">
          <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          <p>At OptiPress, accessible from https://optipress.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by OptiPress and how we use it.</p>
          <h4>1. Client-Side Processing</h4>
          <p>OptiPress is a client-side tool. When you "upload" an image to compress, it is processed entirely within your web browser. Your images are <strong>never</strong> uploaded to our servers, stored, or viewed by us. You retain full ownership and privacy of your files.</p>
          <h4>2. Cookies and Web Beacons</h4>
          <p>Like any other website, OptiPress uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
          <h4>3. Google DoubleClick DART Cookie</h4>
          <p>Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet.</p>
          <h4>4. Third Party Privacy Policies</h4>
          <p>OptiPress's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.</p>
        </div>
      </Modal>

      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <div className="prose prose-sm">
          <p><strong>1. Terms</strong></p>
          <p>By accessing this Website, accessible from https://optipress.app, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
          <p><strong>2. Use License</strong></p>
          <p>Permission is granted to temporarily download one copy of the materials on OptiPress's Website for personal, non-commercial transitory viewing only.</p>
          <p><strong>3. Disclaimer</strong></p>
          <p>The materials on OptiPress's Website are provided "as is". OptiPress makes no warranties, may it be expressed or implied, and hereby disclaims and negates all other warranties.</p>
          <p><strong>4. Limitations</strong></p>
          <p>In no event shall OptiPress or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OptiPress's Website.</p>
        </div>
      </Modal>
    </div>
  );
}

export default App;