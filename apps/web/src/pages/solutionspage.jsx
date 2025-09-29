import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { 
  ChevronRight, Clock, Shield, Camera, Fingerprint, 
  Building, Users, Zap, CheckCircle, ArrowRight,
  Loader2
} from 'lucide-react';

const ICONS = {
  clock: Clock,
  shield: Shield,
  camera: Camera,
  fingerprint: Fingerprint,
  building: Building,
  users: Users,
  zap: Zap
};

const benefits = [
  {
    icon: 'shield',
    title: 'Enhanced Security',
    description: 'Multi-layered protection with biometric authentication and real-time monitoring.'
  },
  {
    icon: 'clock',
    title: 'Streamlined Operations',
    description: 'Automate attendance tracking and access control for improved efficiency.'
  },
  {
    icon: 'users',
    title: 'Scalable Solutions',
    description: 'Grow from single-site to enterprise-wide deployments seamlessly.'
  },
  {
    icon: 'zap',
    title: 'Quick Integration',
    description: 'Rapid deployment with existing systems and minimal disruption.'
  }
];

const industries = [
  {
    name: 'Manufacturing',
    description: 'Secure facility access and accurate workforce tracking',
    features: ['Multi-shift tracking', 'Production line access', 'Safety compliance']
  },
  {
    name: 'Healthcare',
    description: 'Patient data security and staff accountability',
    features: ['HIPAA compliance', 'Emergency access', 'Visitor management']
  },
  {
    name: 'Education',
    description: 'Campus safety and attendance management',
    features: ['Student tracking', 'Campus-wide access', 'Parent notifications']
  },
  {
    name: 'Retail',
    description: 'Loss prevention and employee management',
    features: ['POS integration', 'Inventory security', 'Staff scheduling']
  },
  {
    name: 'Corporate',
    description: 'Office security and professional time tracking',
    features: ['Meeting room access', 'Visitor registration', 'Flexible schedules']
  },
  {
    name: 'Government',
    description: 'High-security access and comprehensive audit trails',
    features: ['Clearance levels', 'Audit compliance', 'Incident tracking']
  }
];

export default function SolutionsPage() {
  const { api } = useApi();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await api.get('/solutions');
        if (response.data.ok) {
          setSolutions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [api]);

  const SolutionCard = ({ solution }) => (
    <div className="card overflow-hidden hover:border-cyan-400/30 transition-all duration-300 group">
      {solution.media?.[0] && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={solution.media[0].url} 
            alt={solution.media[0].alt || solution.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {solution.name}
        </h3>
        <p className="mt-3 text-white/70">
          {solution.description}
        </p>
        
        {/* Benefits */}
        {solution.benefits && solution.benefits.length > 0 && (
          <ul className="mt-4 space-y-2">
            {solution.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                <CheckCircle className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6 flex items-center justify-between">
          <Link 
            to={`/solutions/${solution.slug}`}
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-400 font-medium"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/contact"
            className="btn-ghost text-sm"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="card p-6 animate-pulse">
      <div className="h-48 bg-white/10 rounded mb-4"></div>
      <div className="h-6 bg-white/10 rounded mb-3"></div>
      <div className="h-4 bg-white/10 rounded mb-2"></div>
      <div className="h-4 bg-white/10 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-[20rem] w-[20rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            End-to-End Security Solutions
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-white/70 mb-8">
            Comprehensive security ecosystems that integrate access control, 
            time attendance, and video surveillance into unified platforms. 
            Designed specifically for Sri Lankan businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Schedule Consultation
            </Link>
            <Link to="/products" className="btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Why Choose iMatrix Solutions?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = ICONS[benefit.icon] || Shield;
              return (
                <div key={benefit.title} className="card p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-white/70">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Our Solutions</h2>
              <p className="text-white/70 mt-2">
                Complete security ecosystems tailored to your industry needs
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : solutions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-white/30 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No solutions available</h3>
              <p className="text-white/70">
                Solutions will appear here once they are added to the system.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {solutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} />
              ))}
            </div>
          )}
        </div>

        {/* Industry Applications */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Industry-Specific Applications
            </h2>
            <p className="max-w-2xl mx-auto text-white/70">
              Our solutions are proven across diverse industries, 
              each with unique security and operational requirements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div key={industry.name} className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {industry.name}
                </h3>
                <p className="text-white/70 mb-4 text-sm">
                  {industry.description}
                </p>
                <ul className="space-y-1">
                  {industry.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle className="h-3 w-3 text-cyan-300 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Process */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Our Implementation Process
            </h2>
            <p className="max-w-2xl mx-auto text-white/70">
              From initial consultation to ongoing support, we ensure 
              smooth deployment and optimal performance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { 
                step: '01', 
                title: 'Assessment', 
                description: 'Site survey and requirements analysis' 
              },
              { 
                step: '02', 
                title: 'Design', 
                description: 'Custom solution architecture and planning' 
              },
              { 
                step: '03', 
                title: 'Deployment', 
                description: 'Professional installation and configuration' 
              },
              { 
                step: '04', 
                title: 'Support', 
                description: 'Training, maintenance, and ongoing assistance' 
              }
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-500/10">
                  <span className="text-xl font-bold text-cyan-300">{phase.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-white/70">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="card-gradient p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Secure Your Organization?
          </h2>
          <p className="max-w-2xl mx-auto text-white/70 mb-8">
            Let our security experts design a comprehensive solution 
            tailored to your specific needs and budget. Get started 
            with a free consultation and site assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/contact" className="btn-primary">
              Get Free Consultation
            </Link>
            <a 
              href="tel:+94112345678" 
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <span>Call Sales Team</span>
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-center text-sm text-white/70">
            <div>
              <div className="font-semibold text-cyan-300">15+ Years</div>
              <div>Industry Experience</div>
            </div>
            <div>
              <div className="font-semibold text-cyan-300">500+ Sites</div>
              <div>Successfully Deployed</div>
            </div>
            <div>
              <div className="font-semibold text-cyan-300">24/7 Support</div>
              <div>Local Technical Team</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}