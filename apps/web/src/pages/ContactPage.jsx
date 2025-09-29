import React, { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  AlertCircle, Loader2, Building, Users, Calendar,
  MessageSquare, ArrowRight
} from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    description: 'Speak with our sales team',
    value: '+94 11 234 5678',
    action: 'tel:+94112345678',
    available: 'Mon-Fri 8:30 AM - 5:30 PM'
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Get detailed information',
    value: 'info@imatrix.lk',
    action: 'mailto:info@imatrix.lk',
    available: 'Response within 24 hours'
  },
  {
    icon: MapPin,
    title: 'Office',
    description: 'Visit our headquarters',
    value: 'Colombo, Sri Lanka',
    action: null,
    available: 'By appointment only'
  }
];

const inquiryTypes = [
  'General Inquiry',
  'Product Information',
  'Quote Request',
  'Technical Support',
  'Partnership Opportunity',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees'
];

export default function ContactPage() {
  const { api } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    companySize: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/contact', formData);
      if (response.data.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          companySize: '',
          inquiryType: '',
          subject: '',
          message: ''
        });
      } else {
        setError(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Failed to send message. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Message Sent!</h1>
            <p className="text-white/70 mb-6">
              Thank you for contacting iMatrix Solutions. We'll get back to you 
              within 24 hours with the information you requested.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="btn-primary w-full"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-[20rem] w-[20rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            Get In Touch
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-white/70">
            Ready to enhance your organization's security? Our team of experts 
            is here to understand your needs and recommend the perfect solution.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Send Us a Message</h2>
              <p className="text-white/70">
                Fill out the form below and we'll get back to you with detailed 
                information and pricing for your specific requirements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Your company"
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select inquiry type</option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="form-label">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="form-textarea"
                  placeholder="Tell us about your security requirements, current challenges, or any specific questions you have..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>
              
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.title} className="card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-white/70 mb-2">
                          {method.description}
                        </p>
                        {method.action ? (
                          <a 
                            href={method.action}
                            className="text-cyan-300 hover:text-cyan-400 font-medium"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <span className="text-cyan-300 font-medium">
                            {method.value}
                          </span>
                        )}
                        <div className="text-xs text-white/50 mt-1">
                          {method.available}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Business Hours */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex justify-between gap-4">
                      <span>Monday - Friday:</span>
                      <span className="text-cyan-300">8:30 AM - 5:30 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Saturday:</span>
                      <span className="text-cyan-300">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Sunday:</span>
                      <span className="text-white/50">Closed</span>
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                      Emergency support available 24/7 for existing clients
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              
              <div className="space-y-3">
                <a 
                  href="tel:+94112345678"
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Sales Team
                </a>
                
                <a 
                  href="mailto:info@imatrix.lk?subject=Product Inquiry"
                  className="btn-ghost w-full inline-flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Product Inquiry
                </a>
                
                <button 
                  onClick={() => {
                    const calendlyUrl = 'https://calendly.com/imatrix-sales';
                    window.open(calendlyUrl, '_blank');
                  }}
                  className="btn-ghost w-full inline-flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto text-white/70">
              Common questions about our products, services, and implementation process.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "How long does a typical installation take?",
                a: "Installation time varies based on system complexity. Small setups take 1-3 days, while enterprise deployments may take 1-3 weeks. We provide detailed timelines during the planning phase."
              },
              {
                q: "Do you provide training for our staff?",
                a: "Yes, comprehensive training is included with every installation. We train your administrators, security personnel, and end users to ensure smooth operation."
              },
              {
                q: "What kind of support do you offer?",
                a: "We provide 24/7 emergency support for critical issues, regular maintenance, software updates, and ongoing technical assistance throughout the system lifecycle."
              },
              {
                q: "Can your solutions integrate with existing systems?",
                a: "Absolutely. Our solutions are designed to integrate with existing access control, HR systems, payroll software, and other business applications through standard APIs."
              }
            ].map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-sm text-white/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}