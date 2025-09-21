import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, ArrowLeft, Search, Shield, Package, 
  Settings, Download, Mail, Phone 
} from 'lucide-react';

const popularPages = [
  {
    name: 'Products',
    path: '/products',
    icon: Package,
    description: 'Browse our security solutions'
  },
  {
    name: 'Solutions',
    path: '/solutions',
    icon: Settings,
    description: 'Complete security systems'
  },
  {
    name: 'Downloads',
    path: '/downloads',
    icon: Download,
    description: 'Datasheets and software'
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: Mail,
    description: 'Get in touch with us'
  }
];

const helpfulLinks = [
  { name: 'Home Page', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Site Map', path: '/sitemap' },
  { name: 'Product Catalog', path: '/products' },
  { name: 'Request Quote', path: '/contact' }
];

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[20rem] w-[20rem] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl mx-auto text-center">
        {/* 404 Error */}
        <div className="mb-8">
          <div className="relative mb-6">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-br from-cyan-400 to-indigo-400 bg-clip-text sm:text-[12rem]">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-24 w-24 text-white/10 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 sm:text-3xl">
            Page Not Found
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, our security systems are working perfectly – 
            this page just couldn't be located!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGoBack}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link 
            to="/" 
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link 
            to="/sitemap" 
            className="btn-ghost inline-flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Site Map
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">
            Popular Pages
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className="card p-6 hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                      <Icon className="h-6 w-6 text-cyan-300" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {page.name}
                  </h4>
                  <p className="text-sm text-white/70">
                    {page.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Quick Navigation
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {helpfulLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 rounded-lg p-3 text-sm text-white/80 hover:bg-white/5 hover:text-cyan-300 transition-all"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-white/70 mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
            <a 
              href="tel:+94112345678" 
              className="btn-ghost inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </div>
        </div>

        {/* Error Code */}
        <div className="mt-8 text-xs text-white/30">
          Error Code: 404 | iMatrix Solutions | {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}