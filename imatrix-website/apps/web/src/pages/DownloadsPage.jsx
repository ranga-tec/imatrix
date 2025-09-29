// ===============================
//  DOWNLOADS PAGE COMPONENT - FIXED CATEGORIES
// ===============================
// imatrix-website/apps/web/src/pages/DownloadsPage.jsx 
// Displays a list of downloadable resources with search and filter functionality.

import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { 
  Download, FileText, Image, Video, Package, 
  Search, Filter, Calendar, Eye, ExternalLink,
  Loader2, AlertCircle
} from 'lucide-react';

const FILE_ICONS = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  image: Image,
  video: Video,
  software: Package,
  default: FileText
};

// ✅ FIXED: Categories now match backend exactly (manual, software, report, brochure)
const categories = [
  { id: 'all', name: 'All Downloads' },
  { id: 'manual', name: 'User Manuals' },
  { id: 'software', name: 'Software & Drivers' },
  { id: 'report', name: 'Reports & Datasheets' },
  { id: 'brochure', name: 'Brochures & Marketing' },
];

export default function DownloadsPage() {
  const { api } = useApi();
  const [downloads, setDownloads] = useState([]);
  const [filteredDownloads, setFilteredDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await api.get('/downloads');
        if (response.data.ok) {
          setDownloads(response.data.data);
          setFilteredDownloads(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [api]);

  // Filter downloads based on search and category
  useEffect(() => {
    let filtered = downloads;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(download =>
        download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (download.description && download.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (download.kind && download.kind.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // ✅ FIXED: Filter by exact backend 'kind' field (manual, software, report, brochure)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(download =>
        download.kind === selectedCategory
      );
    }

    setFilteredDownloads(filtered);
  }, [downloads, searchTerm, selectedCategory]);

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || 'default';
    return FILE_ICONS[type] || FILE_ICONS.default;
  };

  const formatFileSize = (size) => {
    // ✅ Display as-is since backend already formats it
    return size || 'Unknown size';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = async (download) => {
    try {
      // Track download (optional analytics)
      // await api.post(`/downloads/${download.id}/track`);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = download.fileUrl;
      link.download = download.fileName || download.title; 
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new window
      window.open(download.fileUrl, '_blank');
    }
  };

  const DownloadCard = ({ download }) => {
    const Icon = getFileIcon(download.fileType);
    
    return (
      <div className="card p-6 hover:border-blue-400/50 transition-all duration-300 group shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 flex-shrink-0">
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {download.title}
            </h3>

            {download.description && (
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {download.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              {download.fileSize && (
                <span>{download.fileSize}</span>
              )}
              {download.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(download.createdAt)}
                </span>
              )}
              {download.kind && (
                <span className="rounded bg-slate-100 px-2 py-1 capitalize text-slate-600">
                  {download.kind}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => handleDownload(download)}
            className="btn-primary flex-1 text-sm inline-flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          
          {download.previewUrl && (
            <button
              onClick={() => window.open(download.previewUrl, '_blank')}
              className="btn-ghost text-sm inline-flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          )}
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="card p-6 animate-pulse shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded mb-3 w-3/4"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 bg-slate-200 rounded flex-1"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[20rem] w-[20rem] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[16rem] w-[16rem] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Downloads & Resources
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Access the latest product datasheets, user manuals, software drivers, 
            and marketing materials. Keep your iMatrix systems up-to-date with 
            our verified downloads.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search downloads..."
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
            <div className="text-sm text-slate-600">
              {loading ? 'Loading...' : `${filteredDownloads.length} files available`}
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Downloads Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredDownloads.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No downloads found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Downloads will appear here once they are added'
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
          <div className="grid gap-6 md:grid-cols-2">
            {filteredDownloads.map((download) => (
              <DownloadCard key={download.id} download={download} />
            ))}
          </div>
        )}

        {/* Featured Downloads Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Popular Downloads</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'TrackZone Complete Manual',
                description: 'Comprehensive guide for TrackZone time attendance system setup and configuration.',
                category: 'User Manual',
                size: '2.4 MB',
                type: 'pdf'
              },
              {
                title: 'Product Catalog 2024',
                description: 'Latest product lineup with specifications and pricing information.',
                category: 'Brochure',
                size: '8.1 MB',
                type: 'pdf'
              },
              {
                title: 'Installation Quick Start',
                description: 'Step-by-step installation guide for common deployment scenarios.',
                category: 'Manual',
                size: '1.2 MB',
                type: 'pdf'
              }
            ].map((item, index) => {
              const Icon = getFileIcon(item.type);
              return (
                <div key={index} className="card p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{item.category}</span>
                    <span>{item.size}</span>
                  </div>
                  <button className="btn-primary w-full text-sm inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Software & Drivers Section */}
        <div className="mt-16 card-gradient p-8 shadow-sm">
          <div className="text-center mb-8">
            <Package className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Software & Drivers</h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Keep your iMatrix devices running smoothly with the latest software updates, 
              device drivers, and utility tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">TrackZone Client</h3>
              <p className="text-sm text-slate-600">
                Desktop application for managing attendance data, generating reports, 
                and configuring system settings.
              </p>
              <div className="flex gap-3">
                <button className="btn-primary text-sm">
                  Download for Windows
                </button>
                <button className="btn-secondary text-sm">
                  Release Notes
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Device Drivers</h3>
              <p className="text-sm text-slate-600">
                Universal drivers package for iMatrix access control devices, 
                biometric readers, and CCTV equipment.
              </p>
              <div className="flex gap-3">
                <button className="btn-primary text-sm">
                  Download Drivers
                </button>
                <button className="btn-secondary text-sm">
                  Installation Guide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Need Additional Resources?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our technical support team can 
            provide custom documentation, older versions, or specialized tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@imatrix.lk" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Contact Support
            </a>
            <a 
              href="tel:+94112345678" 
              className="btn-secondary"
            >
              Call Technical Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}