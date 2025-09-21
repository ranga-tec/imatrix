import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Package, Settings, Download, Info, 
  Mail, Shield, ExternalLink, ArrowRight 
} from 'lucide-react';

const siteMap = [
  {
    title: 'Main Pages',
    icon: Home,
    pages: [
      { name: 'Home', path: '/', description: 'Main landing page with company overview and featured products' },
      { name: 'About Us', path: '/about', description: 'Company history, mission, values, and team information' },
      { name: 'Contact', path: '/contact', description: 'Get in touch with our sales and support teams' },
      { name: 'Site Map', path: '/sitemap', description: 'Complete navigation guide for our website' }
    ]
  },
  {
    title: 'Products',
    icon: Package,
    pages: [
      { name: 'All Products', path: '/products', description: 'Browse our complete catalog of security solutions' },
      { name: 'Access Control Systems', path: '/products?category=access-control', description: 'Door controllers, card readers, and access management' },
      { name: 'Biometric Devices', path: '/products?category=biometric', description: 'Fingerprint and facial recognition systems' },
      { name: 'Time Attendance', path: '/products?category=time-attendance', description: 'Workforce tracking and attendance management' },
      { name: 'CCTV & Video', path: '/products?category=cctv', description: 'Surveillance cameras and video management systems' }
    ]
  },
  {
    title: 'Solutions',
    icon: Settings,
    pages: [
      { name: 'All Solutions', path: '/solutions', description: 'Comprehensive security solutions for various industries' },
      { name: 'TrackZone Attendance', path: '/solutions?category=attendance', description: 'Complete time and attendance management platform' },
      { name: 'Access Control', path: '/solutions?category=access', description: 'Integrated access control and security management' },
      { name: 'Video Surveillance', path: '/solutions?category=video', description: 'AI-powered video analytics and monitoring' }
    ]
  },
  {
    title: 'Resources',
    icon: Download,
    pages: [
      { name: 'Downloads Center', path: '/downloads', description: 'Product datasheets, manuals, and software downloads' },
      { name: 'Product Datasheets', path: '/downloads?category=datasheets', description: 'Technical specifications and product information' },
      { name: 'User Manuals', path: '/downloads?category=manuals', description: 'Installation and operation guides' },
      { name: 'Software & Drivers', path: '/downloads?category=software', description: 'Latest software updates and device drivers' }
    ]
  }
];

const quickLinks = [
  { name: 'Request Quote', path: '/contact', description: 'Get custom pricing for your requirements' },
  { name: 'Technical Support', path: '/contact?type=support', description: 'Get help with existing systems' },
  { name: 'Product Catalog', path: '/downloads?category=brochures', description: 'Download our complete product catalog' },
  { name: 'Schedule Demo', path: '/contact?type=demo', description: 'See our solutions in action' }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-[16rem] w-[16rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            Site Map
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-white/70">
            Navigate through our complete website structure to find exactly 
            what you're looking for. From products to solutions, everything 
            is organized for easy access.
          </p>
        </div>

        {/* Main Site Sections */}
        <div className="space-y-12">
          {siteMap.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.pages.map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-cyan-300 flex-shrink-0 transition-colors" />
                      </div>
                      <p className="text-sm text-white/70">
                        {page.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <p className="max-w-2xl mx-auto text-white/70">
              Common tasks and frequently accessed pages for your convenience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="card p-6 text-center hover:border-cyan-400/30 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {link.name}
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  {link.description}
                </p>
                <div className="inline-flex items-center gap-1 text-cyan-300 text-sm font-medium">
                  Get Started <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 card-gradient p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="max-w-2xl mx-auto text-white/70 mb-6">
            Our team is here to help you find the right information or 
            direct you to the appropriate resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
            <a 
              href="tel:+94112345678" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Call Sales Team
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center text-sm text-white/50">
          <p>
            This sitemap is updated automatically as new content is added to our website. 
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}