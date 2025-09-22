import React, { useState, useEffect } from 'react';
import { Title } from 'react-admin';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    posts: 0,
    products: 0,
    solutions: 0,
    downloads: 0,
    contactMessages: 0,
    users: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch basic counts
        const [postsRes, productsRes, solutionsRes, downloadsRes, contactRes] = await Promise.all([
          fetch(`${API_BASE}/posts`, { headers }),
          fetch(`${API_BASE}/products`, { headers }),
          fetch(`${API_BASE}/solutions`, { headers }),
          fetch(`${API_BASE}/downloads`, { headers }),
          fetch(`${API_BASE}/contact`, { headers })
        ]);

        const [posts, products, solutions, downloads, contact] = await Promise.all([
          postsRes.json(),
          productsRes.json(),
          solutionsRes.json(),
          downloadsRes.json(),
          contactRes.json()
        ]);

        setStats({
          posts: posts.ok ? posts.data.length : 0,
          products: products.ok ? products.data.length : 0,
          solutions: solutions.ok ? solutions.data.length : 0,
          downloads: downloads.ok ? downloads.data.length : 0,
          contactMessages: contact.ok ? contact.data.length : 0,
          users: 0 // Will be fetched separately for admins
        });

        // Fetch recent audit activity if admin
        if (user?.role === 'ADMIN') {
          const auditRes = await fetch(`${API_BASE}/audit?limit=5`, { headers });
          if (auditRes.ok) {
            const auditData = await auditRes.json();
            if (auditData.ok) {
              setRecentActivity(auditData.data);
            }
          }

          // Fetch user count
          const usersRes = await fetch(`${API_BASE}/auth/users`, { headers });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            if (usersData.ok) {
              setStats(prev => ({ ...prev, users: usersData.data.length }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ title, description, buttonText, onClick, bgColor = "bg-blue-500", hoverColor = "hover:bg-blue-600" }) => (
    <div className="bg-white rounded-lg p-6 shadow">
      <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      <button 
        onClick={onClick}
        className={`${bgColor} text-white px-3 py-1 rounded text-xs ${hoverColor} transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <Title title="Dashboard" />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your iMatrix website today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Posts" value={stats.posts} />
        <StatCard title="Products" value={stats.products} />
        <StatCard title="Solutions" value={stats.solutions} />
        <StatCard title="Downloads" value={stats.downloads} />
        <StatCard title="Contact Messages" value={stats.contactMessages} />
        {user?.role === 'ADMIN' && (
          <StatCard title="Users" value={stats.users} />
        )}
      </div>

      {/* Recent Activity - Admin Only */}
      {user?.role === 'ADMIN' && recentActivity.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                    activity.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                    activity.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.action}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">
                    {activity.actorEmail} {activity.action.toLowerCase()}d a {activity.entity.toLowerCase()}
                  </p>
                  <p className="text-gray-500 truncate">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Add New Product"
            description="Create a new product listing"
            buttonText="Create Product"
            onClick={() => window.location.href = '/admin/#/products/create'}
            bgColor="bg-blue-500"
            hoverColor="hover:bg-blue-600"
          />
          
          <ActionCard
            title="Write Blog Post"
            description="Share company news and updates"
            buttonText="Create Post"
            onClick={() => window.location.href = '/admin/#/posts/create'}
            bgColor="bg-green-500"
            hoverColor="hover:bg-green-600"
          />
          
          <ActionCard
            title="Upload Media"
            description="Add images and documents"
            buttonText="Upload Media"
            onClick={() => window.location.href = '/admin/#/media/create'}
            bgColor="bg-purple-500"
            hoverColor="hover:bg-purple-600"
          />
        </div>
      </div>
    </div>
  );
}