// ===============================
// FIXED PRODUCTS RESOURCE WITH STANDALONE FILE UPLOAD
// ===============================
// apps/web/src/admin/resources/products.jsx
// Admin interface for managing products with working image upload

import React, { useState } from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, EditButton, ShowButton,
  Edit, SimpleForm, TextInput, BooleanInput, required,
  Create, Show, SimpleShowLayout, RichTextField,
  Filter, SearchInput, ImageField, ReferenceManyField,
  useNotify, useRedirect
} from 'react-admin';
import StandaloneFileUpload from '../components/StandaloneFileUpload';

const ProductFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" placeholder="Search products..." />
    <BooleanInput source="featured" />
  </Filter>
);

export const ProductList = (props) => (
  <List {...props} filters={<ProductFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <BooleanField source="featured" />
      <DateField source="createdAt" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const ProductShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="summary" />
      <RichTextField source="description" />
      <TextField source="price" />
      <BooleanField source="featured" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      
      {/* Show attached media */}
      <ReferenceManyField label="Product Images" reference="media" target="productId">
        <Datagrid>
          <ImageField source="url" />
          <TextField source="alt" />
          <TextField source="type" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

// Standard Edit Form
export const ProductEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="summary" multiline rows={3} />
      <TextInput source="description" multiline rows={5} />
      <TextInput source="price" />
      <BooleanInput source="featured" />
      
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px', 
        marginTop: '16px' 
      }}>
        <h4>Managing Product Images</h4>
        <p>Current images are shown in the "Show" view. To add more images, go to the Media Library and use the attachment feature.</p>
      </div>
    </SimpleForm>
  </Edit>
);

// Custom Create Component with Working Image Upload
const ProductCreateForm = () => {
  const [productImages, setProductImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    price: '',
    featured: false
  });
  const notify = useNotify();
  const redirect = useRedirect();
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      notify('Product name is required', { type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      
      // Step 1: Create the product first
      const productResponse = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          summary: formData.summary,
          description: formData.description,
          price: formData.price,
          featured: formData.featured
        }),
      });
      
      if (!productResponse.ok) {
        throw new Error(`Failed to create product: ${productResponse.status}`);
      }
      
      const productResult = await productResponse.json();
      
      if (!productResult.ok) {
        throw new Error(productResult.error || 'Failed to create product');
      }
      
      const newProduct = productResult.data;
      
      // Step 2: Upload and attach images if any
      if (productImages.length > 0) {
        let successCount = 0;
        
        for (const imageFile of productImages) {
          try {
            // Upload image to media
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('alt', `${newProduct.name} - Product Image`);
            formData.append('type', 'image');
            
            const uploadResponse = await fetch(`${API_BASE}/media/upload`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData,
            });
            
            if (!uploadResponse.ok) {
              console.error(`Failed to upload ${imageFile.name}`);
              continue;
            }
            
            const uploadResult = await uploadResponse.json();
            
            if (!uploadResult.ok) {
              console.error(`Upload error for ${imageFile.name}:`, uploadResult.error);
              continue;
            }
            
            // Attach media to product
            const attachResponse = await fetch(`${API_BASE}/media/attach`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mediaId: uploadResult.data.id,
                resourceType: 'product',
                resourceId: newProduct.id
              }),
            });
            
            if (attachResponse.ok) {
              const attachResult = await attachResponse.json();
              if (attachResult.ok) {
                successCount++;
              }
            }
          } catch (imageError) {
            console.error(`Error processing ${imageFile.name}:`, imageError);
          }
        }
        
        if (successCount > 0) {
          notify(`Product created successfully with ${successCount} image(s)`);
        } else {
          notify('Product created but no images were uploaded');
        }
      } else {
        notify('Product created successfully');
      }
      
      // Redirect to the list
      redirect('list', 'products');
      
    } catch (error) {
      console.error('Product creation error:', error);
      notify(`Error creating product: ${error.message}`, { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleFormSubmit}>
        {/* Product Details Section */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e0e0e0' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Product Details</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Brief product summary"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Detailed product description"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
              Price
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Product price (optional)"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Featured Product</span>
            </label>
          </div>
        </div>

        {/* Image Upload Section */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e2e8f0' 
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Product Images</h3>
          <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>
            Upload images for this product. They will be attached automatically when the product is created.
          </p>
          
          <StandaloneFileUpload
            accept="image/*"
            multiple={true}
            helperText="Upload product images (JPG, PNG, WebP - max 5MB each)"
            maxSize={5 * 1024 * 1024}
            files={productImages}
            onChange={setProductImages}
          />
          
          {productImages.length > 0 && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>
                Ready to upload: {productImages.length} image(s)
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'right' }}>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting || !formData.name.trim() ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting || !formData.name.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ProductCreate = (props) => (
  <Create {...props} component="div">
    <ProductCreateForm />
  </Create>
);