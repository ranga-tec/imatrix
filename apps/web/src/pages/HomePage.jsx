// ===============================
//  HOME PAGE COMPONENT
// ===============================
// imatrix-website/apps/web/src/pages/HomePage.jsx 
// Main landing page showcasing products, features, solutions, and company info.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { 
  Cpu, ChevronRight, Mail, Phone, Download, Shield, Clock, 
  Fingerprint, Camera, KeyRound 
} from 'lucide-react';

// Icon mapping
const ICONS = {
  fingerprint: Fingerprint,
  clock: Clock,
  shield: Shield,
  camera: Camera
};

const features = [
  { 
    icon: "fingerprint", 
    title: "Face & Biometric Access", 
    desc: "Fast, accurate recognition with robust anti-spoofing and attendance integration." 
  },
  { 
    icon: "clock", 
    title: "Time & Attendance (TrackZone)", 
    desc: "Shift scheduling, payroll exports, and real-time dashboards for workforce visibility." 
  },
  { 
    icon: "shield", 
    title: "Access Control", 
    desc: "Controllers, readers, and door hardware with role-based permissions and audit trails." 
  },
  { 
    icon: "camera", 
    title: "CCTV & Video", 
    desc: "IP cameras, NVRs, and AI video analytics to protect people, assets, and facilities." 
  }
];

const stats = [
  { k: "15+", v: "Years" },
  { k: "500+", v: "Deployments" },
  { k: "99.9%", v: "Uptime*" },
  { k: "24/7", v: "Support" }
];

const testimonials = [
  {
    quote: "iMatrix streamlined our attendance and access across multiple sites. The rollout was smooth and support is top-notch.",
    name: "Operations Director",
    org: "Manufacturing Group, SL"
  },
  {
    quote: "The TrackZone dashboards let HR and team leads see the same truth. Payroll day is finally predictable!",
    name: "Head of HR",
    org: "Retail Chain, SL"
  }
];

const clientLogos = [
  {
    id: 1,
    name: 'ABC Corporation',
    logo: 'https://via.placeholder.com/120x60/4f46e5/ffffff?text=ABC+Corp',
    featured: true
  },
  {
    id: 2,
    name: 'XYZ Industries',
    logo: 'https://via.placeholder.com/120x60/06b6d4/ffffff?text=XYZ+Industries',
    featured: true
  },
  {
    id: 3,
    name: 'Global Tech',
    logo: 'https://via.placeholder.com/120x60/f472b6/ffffff?text=Global+Tech',
    featured: true
  }
];

const HERO_IMG = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1600&auto=format&fit=crop";
const HERO_ALT = "Access control controller and cabling close-up for enterprise security";

const ListItem = ({ children }) => (
  <li className="flex items-start gap-2 text-sm text-muted-foreground">
    <ChevronRight className="h-4 w-4 mt-1 shrink-0" aria-hidden="true" />
    {children}
  </li>
);

export default function HomePage() {
  const { api } = useApi();
  const [products, setProducts] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, solutionsRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/solutions?limit=2')
        ]);

        if (productsRes.data.ok) {
          setProducts(productsRes.data.data);
        }
        if (solutionsRes.data.ok) {
          setSolutions(solutionsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);


  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Decorative gradient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-[28rem] w-[28rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* HERO */}
      <section id="home" className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:pt-16 md:pb-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <Shield className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              Enterprise Security & Time Attendance
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Intelligent Security Solutions for Modern Workplaces
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
              From biometric access to TrackZone attendance and AI-enabled CCTV, iMatrix unifies your people, places, and processes—securely.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link 
                to="/contact" 
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Request a Demo
              </Link>
              <Link 
                to="/products" 
                className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:border-cyan-300/60 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Explore Products
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center" data-testid={`stat-${s.v}`}>
                  <div className="text-2xl font-bold text-white">{s.k}</div>
                  <div className="text-xs text-white/70">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-indigo-400/40 to-fuchsia-400/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                <img src={HERO_IMG} alt={HERO_ALT} className="h-80 w-full object-cover object-center md:h-[28rem]" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Camera className="h-4 w-4" aria-hidden="true" /> AI Video + 
                    <Fingerprint className="h-4 w-4" aria-hidden="true" /> Biometric + 
                    <KeyRound className="h-4 w-4" aria-hidden="true" /> Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {features.map((f) => {
            const Icon = ICONS[f.icon] || Cpu;
            return (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-5" data-testid={`feature-${f.title}`}>
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-white/70">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-7xl px-4 pb-8 pt-4 md:pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Flagship Products</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Enterprise-grade hardware and software built for Sri Lankan businesses—scalable, secure, and easy to use.
            </p>
          </div>
          <Link 
            to="/contact" 
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm hover:border-cyan-300/60 hover:text-cyan-300 md:inline-flex"
          >
            Talk to Sales
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse">
                <div className="h-44 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded mb-1"></div>
                <div className="h-3 bg-white/10 rounded"></div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5" data-testid={`product-${product.name}`}>
                <div className="relative">
                  {product.media?.[0] ? (
                    <img 
                      src={product.media[0].url} 
                      alt={product.media[0].alt || product.name} 
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" 
                    />
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                      <Cpu className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white/80">
                    In Stock
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold">{product.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{product.summary}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link 
                      to={`/products/${product.slug}`} 
                      className="text-sm font-semibold text-cyan-300 hover:underline"
                    >
                      Learn More
                    </Link>
                    <Link 
                      to="/downloads" 
                      className="text-sm text-white/70 hover:text-white/90"
                    >
                      Datasheet
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">End-to-End Solutions</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Secure access, track time, and monitor operations with a unified platform that scales from a single site to nationwide rollouts.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded mb-1"></div>
              </div>
            ))
          ) : (
            solutions.map((solution) => (
              <div key={solution.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{solution.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{solution.description}</p>
                  {solution.benefits && (
                    <ul className="mt-3 space-y-1">
                      {solution.benefits.slice(0, 3).map((benefit, i) => (
                        <ListItem key={i}>{benefit}</ListItem>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4">
                    <Link 
                      to={`/solutions/${solution.slug}`} 
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
                    >
                      Learn more <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                {solution.media?.[0] && (
                  <img 
                    src={solution.media[0].url} 
                    alt={solution.media[0].alt || solution.name} 
                    className="h-48 w-full object-cover" 
                  />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* DOWNLOADS CTA */}
      <section id="downloads" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid items-center gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold">Brochures & Software</h3>
            <p className="mt-2 text-sm text-white/70">
              Download the latest datasheets, user manuals, and TrackZone client tools. Keep devices up to date with our verified packages.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                to="/downloads" 
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Get Downloads
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 font-semibold hover:border-cyan-300/60 hover:text-cyan-300"
              >
                View Company Info
              </Link>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" 
            alt="Downloads" 
            className="h-56 w-full rounded-2xl object-cover" 
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Trusted by Leading Teams</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6" data-testid={`testimonial-${i}`}>
              <p className="text-white/90">"{t.quote}"</p>
              <div className="mt-4 text-sm text-white/70">— {t.name}, {t.org}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT CTA */}
      <section id="about" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid items-center gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold">Why iMatrix?</h3>
            <ul className="mt-3 space-y-2">
              <ListItem>Local expertise with enterprise best practices</ListItem>
              <ListItem>Rapid deployment, on-site training, and support</ListItem>
              <ListItem>Future-ready platform with open integrations</ListItem>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link 
                to="/contact" 
                className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Get a Quote
              </Link>
              <Link 
                to="/products" 
                className="rounded-xl border border-white/15 px-4 py-2 font-semibold hover:border-cyan-300/60 hover:text-cyan-300"
              >
                See Products
              </Link>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1527443224154-c4f2a9bfe2ef?q=80&w=1600&auto=format&fit=crop" 
            alt="Team at work" 
            className="h-56 w-full rounded-2xl object-cover" 
          />
        </div>
      </section>
      {/* TEAM SECTION */}
<section className="mx-auto max-w-7xl px-4 pb-16">
  <div className="text-center mb-12">
    <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">Our Expert Team</h2>
    <p className="max-w-2xl mx-auto text-white/70">
      Meet the security professionals who make iMatrix Solutions the trusted choice 
      for enterprise security across Sri Lanka.
    </p>
  </div>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {[
      {
        name: 'Rajesh Fernando',
        role: 'Chief Executive Officer',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        bio: '15+ years leading enterprise security solutions across diverse industries.'
      },
      {
        name: 'Priya Jayawardena', 
        role: 'Chief Technology Officer',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=300&h=300&fit=crop&crop=face',
        bio: 'Expert in biometric technologies and system architecture design.'
      },
      {
        name: 'Nuwan Silva',
        role: 'Head of Engineering', 
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        bio: 'Leads technical implementation and integration across all deployments.'
      },
      {
        name: 'Chamindi Perera',
        role: 'Customer Success Manager',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', 
        bio: 'Ensures seamless project delivery and ongoing client satisfaction.'
      }
    ].map((member, index) => (
      <div key={index} className="group">
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-cyan-400/30 transition-all duration-300">
          <div className="relative">
            <img 
              src={member.image} 
              alt={member.name}
              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              {member.name}
            </h3>
            <p className="text-cyan-300 text-sm mb-3 font-medium">{member.role}</p>
            <p className="text-xs text-white/70 leading-relaxed">{member.bio}</p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Team CTA */}
  <div className="text-center mt-12">
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        Want to Join Our Team?
      </h3>
      <p className="text-white/70 mb-6 max-w-2xl mx-auto">
        We're always looking for talented security professionals to join our growing team. 
        Help us shape the future of enterprise security in Sri Lanka.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/contact" 
          className="btn-primary"
        >
          View Open Positions
        </Link>
        <a 
          href="mailto:careers@imatrix.lk" 
          className="btn-secondary"
        >
          Send Your Resume
        </a>
      </div>
    </div>
  </div>
</section>
    </div>
    
  );
}