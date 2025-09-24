// ===============================
//  ENHANCED DOWNLOADS ADMIN RESOURCE WITH FILE UPLOAD
// ===============================
// apps/web/src/admin/resources/downloads.jsx 
// Admin interface for managing downloadable resources with file upload support

import React from 'react';
import {
  List, Datagrid, TextField, DateField, EditButton, ShowButton,
  Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout,
  SelectInput, required, useNotify, useRedirect, Filter, SearchInput
} from 'react-admin';
import FileUploadField from '../components/FileUploadField';

const DownloadFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" placeholder="Search downloads..." />
    <SelectInput source="kind" choices={[
      { id: 'manual', name: 'Manual' },
      { id: 'software', name: 'Software' },
      { id: 'report', name: 'Report' },
      { id: 'brochure', name: 'Brochure' }
    ]} />
  </Filter>
);

export const DownloadList = (props) => (
  <List {...props} filters={<DownloadFilter />} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="fileName" />
      <TextField source="fileSize" />
      <TextField source="kind" />
      <DateField source="createdAt" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const DownloadShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="fileName" />
      <TextField source="fileUrl" />
      <TextField source="fileSize" />
      <TextField source="kind" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const DownloadEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <SelectInput source="kind" choices={[
        { id: 'manual', name: 'Manual' },
        { id: 'software', name: 'Software' },
        { id: 'report', name: 'Report' },
        { id: 'brochure', name: 'Brochure' }
      ]} />
      
      {/* Display current file info - read only in edit mode */}
      <TextInput source="fileName" disabled label="Current File" />
      <TextInput source="fileSize" disabled />
      
      {/* Option to replace file would require additional backend work */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px', 
        marginTop: '16px' 
      }}>
        <p><strong>Note:</strong> To replace the file, delete this download and create a new one.</p>
      </div>
    </SimpleForm>
  </Edit>
);

const DownloadCreateForm = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  
  const handleSubmit = async (data) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (data.file) {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.kind) formData.append('kind', data.kind);
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/downloads/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.ok) {
          throw new Error(result.error || 'Upload failed');
        }
        
        notify('Download uploaded successfully');
        redirect('list', 'downloads');
        return result.data;
      } else if (data.fileUrl) {
        // Handle URL-based download (fallback)
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/downloads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.ok) {
          throw new Error(result.error || 'Creation failed');
        }
        
        notify('Download created successfully');
        redirect('list', 'downloads');
        return result.data;
      } else {
        throw new Error('Either file upload or file URL is required');
      }
    } catch (error) {
      console.error('Download creation error:', error);
      notify(`Error: ${error.message}`, { type: 'error' });
      throw error;
    }
  };
  
  return (
    <SimpleForm onSubmit={handleSubmit}>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <SelectInput source="kind" choices={[
        { id: 'manual', name: 'Manual' },
        { id: 'software', name: 'Software' },
        { id: 'report', name: 'Report' },
        { id: 'brochure', name: 'Brochure' }
      ]} defaultValue="manual" />
      
      {/* File Upload Field */}
      <FileUploadField
        source="file"
        label="Upload File"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
        helperText="Upload PDF, Word, Excel, or ZIP files (max 50MB)"
        maxSize={50 * 1024 * 1024} // 50MB
      />
      
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px', 
        marginTop: '16px' 
      }}>
        <p><strong>Alternative:</strong> If you need to link to an external file, leave the upload empty and use the URL field below:</p>
      </div>
      
      {/* Fallback URL input */}
      <TextInput 
        source="fileUrl" 
        label="External File URL (optional)"
        helperText="Only use this if not uploading a file above"
      />
    </SimpleForm>
  );
};

export const DownloadCreate = (props) => (
  <Create {...props}>
    <DownloadCreateForm />
  </Create>
);