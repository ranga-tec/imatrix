// ===============================
// FIXED ADMIN APP COMPONENT (AdminApp.jsx)
// ===============================
import React from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { useAuth } from '../contexts/AuthContext';

// Import resource components
import { ProductList, ProductEdit, ProductCreate, ProductShow } from './resources/products';
import { SolutionList, SolutionEdit, SolutionCreate, SolutionShow } from './resources/solutions';
import { PostList, PostEdit, PostCreate, PostShow } from './resources/posts';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { DownloadList, DownloadEdit, DownloadCreate } from './resources/downloads';
import { MediaList, MediaEdit, MediaCreate } from './resources/media';
import { UserList, UserEdit, UserCreate } from './resources/users';
import { AuditList } from './resources/audit';
import { ContactList, ContactShow } from './resources/contact';
import Dashboard from './Dashboard';

// Custom auth provider
const authProvider = {
  login: () => Promise.resolve(),
  logout: () => {
    return Promise.resolve();
  },
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  getIdentity: () => Promise.resolve({
    id: 'admin',
    fullName: 'Admin User',
  }),
  getPermissions: () => Promise.resolve('admin'),
};

// API configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Enhanced data provider with better error handling
// Complete transformed data provider with all required methods
const transformedDataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = new URLSearchParams({
      ...params.filter,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    });

    const url = `${API_BASE}/${resource}?${query}`;
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return {
        data: json.data || [],
        total: json.total || json.data?.length || 0,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
  try {
    const url = `${API_BASE}/${resource}/id/${params.id}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || 'Failed to fetch');
    
    return { data: result.data };
  } catch (error) {
    console.error(`Error fetching ${resource}/${params.id}:`, error);
    throw error;
  }
},

  getMany: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    const query = new URLSearchParams();
    params.ids.forEach(id => query.append('id', id));
    
    try {
      const response = await fetch(`${API_BASE}/${resource}?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return { data: json.data || [] };
    } catch (error) {
      console.error(`Error fetching many ${resource}:`, error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    const { target, id } = params;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = new URLSearchParams({
      [target]: id,
      ...params.filter,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    });

    const url = `${API_BASE}/${resource}?${query}`;
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return {
        data: json.data || [],
        total: json.total || json.data?.length || 0,
      };
    } catch (error) {
      console.error(`Error fetching ${resource} reference:`, error);
      throw error;
    }
  },

  create: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE}/${resource}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return { data: json.data };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },

  update: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE}/${resource}/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return { data: json.data };
    } catch (error) {
      console.error(`Error updating ${resource}/${params.id}:`, error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    const results = [];
    
    try {
      for (const id of params.ids) {
        const response = await fetch(`${API_BASE}/${resource}/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params.data),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.ok) {
            results.push(id);
          }
        }
      }
      
      return { data: results };
    } catch (error) {
      console.error(`Error updating many ${resource}:`, error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE}/${resource}/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.ok) {
        throw new Error(json.error || 'API error');
      }

      return { data: { id: params.id } };
    } catch (error) {
      console.error(`Error deleting ${resource}/${params.id}:`, error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    const results = [];
    
    try {
      for (const id of params.ids) {
        const response = await fetch(`${API_BASE}/${resource}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const json = await response.json();
          if (json.ok) {
            results.push(id);
          }
        }
      }
      
      return { data: results };
    } catch (error) {
      console.error(`Error deleting many ${resource}:`, error);
      throw error;
    }
  },
};

export default function AdminApp() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Admin
      dataProvider={transformedDataProvider}
      authProvider={{
        ...authProvider,
        logout: handleLogout,
        getIdentity: () => Promise.resolve({
          id: user?.id,
          fullName: user?.email,
          avatar: undefined,
        }),
      }}
      dashboard={Dashboard}
      title="iMatrix Admin"
      basename="/admin"
    >
      {/* Main content resources */}
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
        show={PostShow}
        options={{ label: 'News/Posts' }}
      />
      <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
        options={{ label: 'Categories' }}
      />
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        show={ProductShow}
        options={{ label: 'Products' }}
      />
      <Resource
        name="solutions"
        list={SolutionList}
        edit={SolutionEdit}
        create={SolutionCreate}
        show={SolutionShow}
        options={{ label: 'Solutions' }}
      />
      <Resource
        name="downloads"
        list={DownloadList}
        edit={DownloadEdit}
        create={DownloadCreate}
        options={{ label: 'Downloads' }}
      />
      <Resource
        name="media"
        list={MediaList}
        edit={MediaEdit}
        create={MediaCreate}
        options={{ label: 'Media Library' }}
      />
      
      {/* Admin only resources */}
      {user?.role === 'ADMIN' && (
        <>
          <Resource
            name="users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            options={{ label: 'Users & Roles' }}
          />
          <Resource
            name="audit"
            list={AuditList}
            options={{ label: 'Audit Log' }}
          />
        </>
      )}
      
      {/* Contact messages */}
      <Resource
        name="contact"
        list={ContactList}
        show={ContactShow}
        options={{ label: 'Contact Messages' }}
      />
    </Admin>
  );
}