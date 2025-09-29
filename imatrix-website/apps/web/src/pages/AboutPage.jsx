import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Clock, Award, MapPin, Phone, Mail,
  CheckCircle, Target, Eye, Heart, Zap, Building,
  Calendar, Trophy, Globe, ArrowRight
} from 'lucide-react';

const stats = [
  { icon: Calendar, label: 'Years in Business', value: '15+' },
  { icon: Building, label: 'Sites Deployed', value: '500+' },
  { icon: Users, label: 'Satisfied Clients', value: '200+' },
  { icon: Trophy, label: 'Uptime SLA', value: '99.9%' }
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize the highest levels of security in every solution we deliver, ensuring your assets and data remain protected.'
  },
  {
    icon: Users,
    title: 'Client Success',
    description: 'Your success is our success. We work closely with each client to understand their unique needs and deliver tailored solutions.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay at the forefront of security technology, continuously improving our products and services.'
  },
  {
    icon: Heart,
    title: 'Local Expertise',
    description: 'Deep understanding of Sri Lankan business needs with the backing of international best practices.'
  }
];

const team = [
  {
    name: 'Rajesh Fernando',
    role: 'Chief Executive Officer',
    bio: '15+ years in enterprise security solutions with expertise in business development and strategic partnerships.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Priya Jayawardena',
    role: 'Chief Technology Officer',
    bio: 'Former systems architect with deep expertise in access control systems and biometric technologies.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Nuwan Silva',
    role: 'Head of Engineering',
    bio: 'Leads our technical team with 12+ years in security system integration and software development.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Chamindi Perera',
    role: 'Customer Success Manager',
    bio: 'Ensures client satisfaction through comprehensive support and successful project implementations.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
  }
];

const milestones = [
  {
    year: '2009',
    title: 'Company Founded',
    description: 'iMatrix Solutions established with a vision to transform security in Sri Lanka.'
  },
  {
    year: '2012',
    title: 'First Major Deployment',
    description: 'Successfully deployed enterprise-wide access control for leading manufacturing group.'
  },
  {
    year: '2016',
    title: 'TrackZone Launch',
    description: 'Introduced our flagship time attendance solution, revolutionizing workforce management.'
  },
  {
    year: '2019',
    title: '500+ Sites Milestone',
    description: 'Reached 500 successful deployments across diverse industries island-wide.'
  },
  {
    year: '2022',
    title: 'AI Integration',
    description: 'Integrated advanced AI capabilities for enhanced video analytics and threat detection.'
  },
  {
    year: '2024',
    title: 'Next Generation',
    description: 'Launched cloud-enabled solutions and mobile applications for modern workplaces.'
  }
];

const certifications = [
  'ISO 27001 Information Security Management',
  'CE Marking for European Conformity',
  'FCC Certification for Electronic Devices',
  'Sri Lanka Standards Institution Certification'
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-[24rem] w-[24rem] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl mb-6">
            About iMatrix Solutions
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 mb-8">
            For over 15 years, we've been Sri Lanka's trusted partner in enterprise 
            security solutions. From biometric access control to comprehensive surveillance 
            systems, we secure what matters most to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Partner With Us
            </Link>
            <Link to="/solutions" className="btn-secondary">
              Our Solutions
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="card p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              To empower Sri Lankan businesses with world-class security solutions 
              that protect people, assets, and operations while enabling growth and 
              efficiency. We believe security should enhance, not hinder, business operations.
            </p>
          </div>

          <div className="card p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              To be the leading security solutions provider in Sri Lanka, known for 
              innovation, reliability, and exceptional customer service. We envision 
              a future where advanced security technology is accessible to all businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Core Values</h2>
          <p className="max-w-2xl mx-auto text-slate-600">
            These principles guide everything we do, from product development 
            to customer service.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Journey</h2>
          <p className="max-w-2xl mx-auto text-slate-600">
            From humble beginnings to industry leadership, here are the key 
            milestones that shaped iMatrix Solutions.
          </p>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {index + 1}
                </div>
                {index !== milestones.length - 1 && (
                  <div className="mt-4 h-16 w-0.5 bg-slate-200"></div>
                )}
              </div>
              <div className="card p-6 flex-1 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-600 font-bold">{milestone.year}</span>
                  <h3 className="text-lg font-semibold text-slate-800">{milestone.title}</h3>
                </div>
                <p className="text-slate-600">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Leadership Team</h2>
          <p className="max-w-2xl mx-auto text-slate-600">
            Meet the experienced professionals who lead iMatrix Solutions 
            and drive our commitment to excellence.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="card overflow-hidden shadow-sm">
              <img
                src={member.image}
                alt={member.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                <p className="text-xs text-slate-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="card-gradient p-8">
          <div className="text-center mb-8">
            <Award className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Certifications & Standards
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Our commitment to quality is backed by international certifications 
              and compliance with industry standards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-3 bg-slate-100 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Get In Touch</h2>
          <p className="max-w-2xl mx-auto text-slate-600 mb-8">
            Ready to discuss your security needs? Our team is here to help you 
            find the perfect solution for your organization.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card p-6 text-center shadow-sm">
            <Phone className="mx-auto h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Call Us</h3>
            <p className="text-slate-600 mb-3">Speak with our sales team</p>
            <a
              href="tel:+94112345678"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              +94 11 234 5678
            </a>
          </div>

          <div className="card p-6 text-center shadow-sm">
            <Mail className="mx-auto h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Email Us</h3>
            <p className="text-slate-600 mb-3">Get detailed information</p>
            <a
              href="mailto:info@imatrix.lk"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              info@imatrix.lk
            </a>
          </div>

          <div className="card p-6 text-center shadow-sm">
            <MapPin className="mx-auto h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Visit Us</h3>
            <p className="text-slate-600 mb-3">Schedule an appointment</p>
            <p className="text-blue-600 font-medium">Colombo, Sri Lanka</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/contact" 
            className="btn-primary inline-flex items-center gap-2"
          >
            Start Your Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}