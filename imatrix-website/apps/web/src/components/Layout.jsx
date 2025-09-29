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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight">iMatrix</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm md:flex">
            <Link
              to="/products"
              className={`hover:text-blue-600 ${isActive('/products') ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Products
            </Link>
            <Link
              to="/solutions"
              className={`hover:text-blue-600 ${isActive('/solutions') ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Solutions
            </Link>
            <Link
              to="/downloads"
              className={`hover:text-blue-600 ${isActive('/downloads') ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Downloads
            </Link>
            <Link
              to="/about"
              className={`hover:text-blue-600 ${isActive('/about') ? 'text-blue-600' : 'text-slate-600'}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile menu button - could be expanded later */}
          <div className="md:hidden">
            <Link
              to="/contact"
              className="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <span className="text-lg font-bold tracking-tight">iMatrix</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Integrated security, access control, and attendance solutions tailored for Sri Lankan enterprises.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link to="/about" className="hover:text-slate-800">About</Link></li>
                <li><Link to="/products" className="hover:text-slate-800">Products</Link></li>
                <li><Link to="/solutions" className="hover:text-slate-800">Solutions</Link></li>
                <li><Link to="/downloads" className="hover:text-slate-800">Downloads</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link to="/downloads" className="hover:text-slate-800">Documentation</Link></li>
                <li><Link to="/contact" className="hover:text-slate-800">Support</Link></li>
                <li><Link to="/sitemap" className="hover:text-slate-800">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <a href="mailto:info@imatrix.lk" className="hover:text-slate-800">info@imatrix.lk</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <a href="tel:+94" className="hover:text-slate-800">+94 •••• ••••</a>
                </li>
                <li className="mt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600"
                  >
                    Request a Demo <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} iMatrix Solutions (Pvt) Ltd. All rights reserved.</p>
            <p>No. 217, Galle Road, Colombo, Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
}