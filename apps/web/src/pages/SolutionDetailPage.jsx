import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { 
  ArrowLeft, CheckCircle, Star, Users, Building, Clock,
  Shield, Camera, Zap, Download, Phone, Mail, Share2,
  ChevronLeft, ChevronRight, Loader2, ExternalLink
} from 'lucide-react';

const FEATURE_ICONS = {
  security: Shield,
  time: Clock,
  video: Camera,
  access: Building,
  users: Users,
  automation: Zap
};

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const { api } = useApi();
  const [solution, setSolution] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await api.get(`/solutions/${slug}`);
        if (response.data.ok) {
          setSolution(response.data.data);
          
          // Fetch related products
          const productsResponse = await api.get('/products?featured=true&limit=6');
          if (productsResponse.data.ok) {
            setRelatedProducts(productsResponse.data.data.slice(0, 4));
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch solution:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSolution();
    }
  }, [slug, api]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: solution.name,
          text: solution.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading solution...</span>
        </div>
      </div>
    );
  }

  if (notFound || !solution) {
    return <Navigate to="/404" replace />;
  }

  const images = solution.media?.filter(m => m.type === 'image') || [];
  const currentImage = images[activeImageIndex];

  // Parse features to extract icons and organize them
  const organizedFeatures = solution.features ? solution.features.map(feature => {
    const lowerFeature = feature.toLowerCase();
    let icon = 'shield'; // default
    
    if (lowerFeature.includes('time') || lowerFeature.includes('attendance')) icon = 'time';
    else if (lowerFeature.includes('video') || lowerFeature.includes('camera') || lowerFeature.includes('cctv')) icon = 'video';
    else if (lowerFeature.includes('access') || lowerFeature.includes('door') || lowerFeature.includes('entry')) icon = 'access';
    else if (lowerFeature.includes('user') || lowerFeature.includes('employee') || lowerFeature.includes('staff')) icon = 'users';
    else if (lowerFeature.includes('auto') || lowerFeature.includes('integration') || lowerFeature.includes('workflow')) icon = 'automation';
    
    return { text: feature, icon };
  }) : [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/solutions" className="hover:text-white">Solutions</Link>
          <span>/</span>
          <span className="text-white">{solution.name}</span>
        </nav>

        {/* Back button */}
        <Link 
          to="/solutions" 
          className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-400 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Solutions
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-700">
              {currentImage ? (
                <img 
                  src={currentImage.url} 
                  alt={currentImage.alt || solution.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Shield className="h-24 w-24 text-white/30" />
                </div>
              )}
              
              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(Math.max(0, activeImageIndex - 1))}
                    disabled={activeImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(Math.min(images.length - 1, activeImageIndex + 1))}
                    disabled={activeImageIndex === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 h-16 w-24 overflow-hidden rounded-lg border-2 ${
                      index === activeImageIndex 
                        ? 'border-cyan-400' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Solution Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {solution.name}
              </h1>
              <p className="mt-4 text-lg text-white/70">
                {solution.description}
              </p>
            </div>

            {/* Key Benefits */}
            {solution.benefits && solution.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Key Benefits</h3>
                <div className="space-y-2">
                  {solution.benefits.slice(0, 5).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                      <span className="text-sm text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/contact" 
                  className="btn-primary flex-1 text-center"
                >
                  Get Custom Quote
                </Link>
                <Link 
                  to="/downloads" 
                  className="btn-secondary flex-1 text-center inline-flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Resources
                </Link>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href="tel:+94112345678" 
                  className="flex-1 btn-ghost text-center inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Expert
                </a>
                <button 
                  onClick={handleShare}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {organizedFeatures.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Solution Features</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizedFeatures.map((feature, index) => {
                const Icon = FEATURE_ICONS[feature.icon] || Shield;
                return (
                  <div key={index} className="card p-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 flex-shrink-0">
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <span className="text-white/90 text-sm">{feature.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Implementation Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Implementation Process</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { 
                step: '1', 
                title: 'Site Assessment', 
                description: 'Comprehensive evaluation of your security needs and infrastructure requirements.',
                duration: '1-2 days'
              },
              { 
                step: '2', 
                title: 'Custom Design', 
                description: 'Tailored solution architecture with detailed specifications and timeline.',
                duration: '3-5 days'
              },
              { 
                step: '3', 
                title: 'Installation', 
                description: 'Professional deployment with minimal disruption to operations.',
                duration: '1-3 weeks'
              },
              { 
                step: '4', 
                title: 'Training & Support', 
                description: 'Comprehensive training and ongoing technical support.',
                duration: 'Ongoing'
              }
            ].map((phase) => (
              <div key={phase.step} className="card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-bold mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-white/70 mb-3">
                  {phase.description}
                </p>
                <div className="text-xs text-cyan-300 font-medium">
                  Timeline: {phase.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Related Products</h2>
              <Link 
                to="/products" 
                className="text-cyan-300 hover:text-cyan-400 text-sm font-medium inline-flex items-center gap-1"
              >
                View all <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="card overflow-hidden hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="relative">
                    {product.media?.[0] ? (
                      <img 
                        src={product.media[0].url} 
                        alt={product.media[0].alt || product.name}
                        className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                      />
                    ) : (
                      <div className="h-32 w-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white/30" />
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-cyan-500 px-1.5 py-0.5 text-xs font-medium text-slate-950">
                        <Star className="h-3 w-3" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors text-sm">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/70 line-clamp-2">
                      {product.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="card-gradient p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Security?
          </h2>
          <p className="max-w-2xl mx-auto text-white/70 mb-6">
            Our solution specialists will work with you to design and implement 
            the perfect security ecosystem for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Request Detailed Proposal
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn About iMatrix
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}