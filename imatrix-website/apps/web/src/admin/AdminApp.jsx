import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
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
    // This will be handled by our Auth context
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

// Custom data provider with auth headers
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const dataProvider = simpleRestProvider(API_BASE, (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  return { url, options };
});

// Transform the data provider to handle our API format
const transformedDataProvider = {
  ...dataProvider,
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...params.filter,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };

    const url = `${API_BASE}/${resource}?${new URLSearchParams(query)}`;
    const token = localStorage.getItem('auth_token');
    
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
      data: json.data,
      total: json.data.length, // You might want to implement proper pagination
    };
  },

  getOne: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/${resource}/${params.id}`, {
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

    return { data: json.data };
  },

  create: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
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
  },

  update: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
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
  },

  delete: async (resource, params) => {
    const token = localStorage.getItem('auth_token');
    
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
    >
      {/* Main content resources */}
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
        show={PostShow}
        options={{ label: 'Posts/News' }}
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