import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { 
  ArrowLeft, Download, Mail, Phone, Share2, Star, 
  CheckCircle, Cpu, Camera, Shield, Clock, ExternalLink,
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { api } = useApi();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        if (response.data.ok) {
          setProduct(response.data.data);
          
          // Fetch related products
          const relatedResponse = await api.get(`/products?limit=4&exclude=${response.data.data.id}`);
          if (relatedResponse.data.ok) {
            setRelatedProducts(relatedResponse.data.data.slice(0, 3));
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, api]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-800">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return <Navigate to="/404" replace />;
  }

  const images = product.media?.filter(m => m.type === 'image') || [];
  const currentImage = images[activeImageIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-[24rem] w-[24rem] rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-slate-800">Products</Link>
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </nav>

        {/* Back button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm">
              {currentImage ? (
                <img 
                  src={currentImage.url} 
                  alt={currentImage.alt || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Cpu className="h-24 w-24 text-slate-400" />
                </div>
              )}
              
              {/* Featured badge */}
              {product.featured && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                  <Star className="h-4 w-4" fill="currentColor" />
                  Featured
                </div>
              )}

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(Math.max(0, activeImageIndex - 1))}
                    disabled={activeImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(Math.min(images.length - 1, activeImageIndex + 1))}
                    disabled={activeImageIndex === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`flex-shrink-0 h-16 w-16 overflow-hidden rounded-lg border-2 ${
                      index === activeImageIndex
                        ? 'border-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                {product.summary}
              </p>
            </div>

            {/* Price */}
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
              <div className="text-sm text-slate-600">Price</div>
              <div className="text-xl font-semibold text-blue-600">
                Contact for Quote
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Pricing varies based on configuration and quantity
              </div>
            </div>

            {/* Key Features */}
            {product.specs && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Key Features</h3>
                <div className="grid gap-2">
                  {Object.entries(product.specs).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">
                        <span className="font-medium">{key}:</span> {value}
                      </span>
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
                  Request Quote
                </Link>
                <Link 
                  to="/downloads" 
                  className="btn-secondary flex-1 text-center inline-flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Datasheet
                </Link>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href="tel:+94112345678" 
                  className="flex-1 btn-ghost text-center inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Sales
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

            {/* Stock status */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">In Stock - Ready to Ship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Description</h2>
            <div className="card p-6 shadow-sm">
              <div
                className="prose max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Specifications</h2>
            <div className="card overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-200">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                    <div className="font-medium text-slate-800">{key}</div>
                    <div className="sm:col-span-2 text-slate-600">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Related Products</h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all products
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="card overflow-hidden hover:border-blue-400/50 transition-all duration-300 group shadow-sm"
                >
                  <div className="relative">
                    {relatedProduct.media?.[0] ? (
                      <img
                        src={relatedProduct.media[0].url}
                        alt={relatedProduct.media[0].alt || relatedProduct.name}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Cpu className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {relatedProduct.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}