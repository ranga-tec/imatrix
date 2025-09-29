import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { 
  Search, Filter, Cpu, Star, ChevronRight, 
  ExternalLink, Download, Loader2 
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'access-control', name: 'Access Control' },
  { id: 'biometric', name: 'Biometric Readers' },
  { id: 'time-attendance', name: 'Time Attendance' },
  { id: 'cctv', name: 'CCTV & Video' },
  { id: 'software', name: 'Software' },
];

export default function ProductsPage() {
  const { api } = useApi();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data.ok) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [api]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category?.slug === selectedCategory ||
        product.name.toLowerCase().includes(selectedCategory.replace('-', ' '))
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const ProductCard = ({ product }) => (
    <div className="group card overflow-hidden hover:border-cyan-400/30 transition-all duration-300">
      <div className="relative">
        {product.media?.[0] ? (
          <img 
            src={product.media[0].url} 
            alt={product.media[0].alt || product.name} 
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
            <Cpu className="h-12 w-12 text-white/30" />
          </div>
        )}
        
        {/* Featured badge */}
        {product.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-1 text-xs font-medium text-slate-950">
            <Star className="h-3 w-3" fill="currentColor" />
            Featured
          </div>
        )}
        
        {/* Stock status */}
        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white/80">
          In Stock
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-white/70 line-clamp-2">
          {product.summary}
        </p>
        
        {/* Price */}
        {product.price && (
          <div className="mt-3 text-cyan-300 font-semibold">
            Contact for pricing
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <Link 
            to={`/products/${product.slug}`} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-400"
          >
            Learn More <ChevronRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/downloads" 
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Datasheet
          </Link>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="card p-6 animate-pulse">
      <div className="h-48 bg-white/10 rounded mb-4"></div>
      <div className="h-6 bg-white/10 rounded mb-2"></div>
      <div className="h-4 bg-white/10 rounded mb-1"></div>
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="mt-4 flex justify-between">
        <div className="h-4 bg-white/10 rounded w-20"></div>
        <div className="h-4 bg-white/10 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[20rem] w-[20rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-3/4 right-1/4 h-[16rem] w-[16rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Enterprise Security Products
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">
            Professional-grade access control, biometric, and surveillance solutions 
            designed for Sri Lankan businesses. From single-door installations to 
            enterprise-wide deployments.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Filter toggle for mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost sm:hidden flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Results count */}
            <div className="text-sm text-white/70">
              {loading ? 'Loading...' : `${filteredProducts.length} products`}
            </div>
          </div>

          {/* Category filters */}
          <div className={`space-y-2 sm:space-y-0 ${showFilters ? 'block' : 'hidden sm:block'}`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Cpu className="mx-auto h-12 w-12 text-white/30 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
            <p className="text-white/70 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Products will appear here once they are added'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="btn-secondary"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 card-gradient p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help Choosing the Right Solution?
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the perfect products for your 
            specific requirements. Get expert guidance and custom quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Schedule Consultation
            </Link>
            <Link to="/solutions" className="btn-secondary">
              View Solutions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}