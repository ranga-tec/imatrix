import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Cpu, Mail, Phone, ChevronRight } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight">iMatrix</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm md:flex">
            <Link 
              to="/products" 
              className={`hover:text-cyan-300 ${isActive('/products') ? 'text-cyan-300' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/solutions" 
              className={`hover:text-cyan-300 ${isActive('/solutions') ? 'text-cyan-300' : ''}`}
            >
              Solutions
            </Link>
            <Link 
              to="/downloads" 
              className={`hover:text-cyan-300 ${isActive('/downloads') ? 'text-cyan-300' : ''}`}
            >
              Downloads
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-cyan-300 ${isActive('/about') ? 'text-cyan-300' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile menu button - could be expanded later */}
          <div className="md:hidden">
            <Link 
              to="/contact" 
              className="rounded-full bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                <span className="text-lg font-bold tracking-tight">iMatrix</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Integrated security, access control, and attendance solutions tailored for Sri Lankan enterprises.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/solutions" className="hover:text-white">Solutions</Link></li>
                <li><Link to="/downloads" className="hover:text-white">Downloads</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link to="/downloads" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/contact" className="hover:text-white">Support</Link></li>
                <li><Link to="/sitemap" className="hover:text-white">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <a href="mailto:info@imatrix.lk" className="hover:text-white">info@imatrix.lk</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <a href="tel:+94" className="hover:text-white">+94 •••• ••••</a>
                </li>
                <li className="mt-4">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 font-semibold hover:border-cyan-300/60 hover:text-cyan-300"
                  >
                    Request a Demo <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
            <p>© {new Date().getFullYear()} iMatrix Solutions (Pvt) Ltd. All rights reserved.</p>
            <p>No. 217, Galle Road, Colombo, Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
}