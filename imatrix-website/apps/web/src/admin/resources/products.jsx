// ===============================
// PRODUCTS RESOURCE (resources/products.jsx)
// ===============================
import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, EditButton, ShowButton,
  Edit, SimpleForm, TextInput, BooleanInput, required,
  Create, Show, SimpleShowLayout, RichTextField,
  Filter, SearchInput, SelectInput, ImageField, ReferenceManyField
} from 'react-admin';

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
      <ReferenceManyField label="Media" reference="media" target="productId">
        <Datagrid>
          <ImageField source="url" />
          <TextField source="alt" />
          <TextField source="type" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const ProductEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="summary" multiline rows={3} />
      <TextInput source="description" multiline rows={5} />
      <TextInput source="price" />
      <BooleanInput source="featured" />
    </SimpleForm>
  </Edit>
);

export const ProductCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="summary" multiline rows={3} />
      <TextInput source="description" multiline rows={5} />
      <TextInput source="price" />
      <BooleanInput source="featured" />
    </SimpleForm>
  </Create>
);

// ===============================
// SOLUTIONS RESOURCE (resources/solutions.jsx)
// ===============================
export const SolutionList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <DateField source="createdAt" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const SolutionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <RichTextField source="description" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <ReferenceManyField label="Media" reference="media" target="solutionId">
        <Datagrid>
          <ImageField source="url" />
          <TextField source="alt" />
          <TextField source="type" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const SolutionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={5} />
    </SimpleForm>
  </Edit>
);

export const SolutionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={5} />
    </SimpleForm>
  </Create>
);

// ===============================
// POSTS RESOURCE (resources/posts.jsx)
// ===============================
export const PostList = (props) => (
  <List {...props} filters={<PostFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <BooleanField source="published" />
      <DateField source="createdAt" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

const PostFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" placeholder="Search posts..." />
    <BooleanInput source="published" />
  </Filter>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="excerpt" />
      <RichTextField source="body" />
      <BooleanField source="published" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="excerpt" multiline rows={2} />
      <TextInput source="body" multiline rows={10} />
      <BooleanInput source="published" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="excerpt" multiline rows={2} />
      <TextInput source="body" multiline rows={10} />
      <BooleanInput source="published" />
    </SimpleForm>
  </Create>
);

// ===============================
// CATEGORIES RESOURCE (resources/categories.jsx)
// ===============================
export const CategoryList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CategoryEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>
  </Create>
);

// ===============================
// DOWNLOADS RESOURCE (resources/downloads.jsx)
// ===============================
export const DownloadList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="kind" />
      <TextField source="fileName" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const DownloadEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="fileUrl" validate={[required()]} />
      <TextInput source="fileName" />
      <TextInput source="fileSize" />
      <SelectInput 
        source="kind" 
        choices={[
          { id: 'manual', name: 'Manual' },
          { id: 'software', name: 'Software' },
          { id: 'report', name: 'Report' },
          { id: 'brochure', name: 'Brochure' }
        ]} 
        validate={[required()]} 
      />
    </SimpleForm>
  </Edit>
);

export const DownloadCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="fileUrl" validate={[required()]} />
      <TextInput source="fileName" />
      <TextInput source="fileSize" />
      <SelectInput 
        source="kind" 
        choices={[
          { id: 'manual', name: 'Manual' },
          { id: 'software', name: 'Software' },
          { id: 'report', name: 'Report' },
          { id: 'brochure', name: 'Brochure' }
        ]} 
        validate={[required()]} 
      />
    </SimpleForm>
  </Create>
);

// ===============================
// MEDIA RESOURCE (resources/media.jsx)
// ===============================
export const MediaList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ImageField source="url" />
      <TextField source="fileName" />
      <TextField source="type" />
      <TextField source="alt" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const MediaEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="alt" />
      <TextInput source="caption" multiline rows={2} />
      <SelectInput 
        source="type" 
        choices={[
          { id: 'image', name: 'Image' },
          { id: 'video', name: 'Video' },
          { id: 'file', name: 'File' }
        ]} 
      />
    </SimpleForm>
  </Edit>
);

export const MediaCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="url" validate={[required()]} />
      <TextInput source="fileName" />
      <TextInput source="alt" />
      <TextInput source="caption" multiline rows={2} />
      <SelectInput 
        source="type" 
        choices={[
          { id: 'image', name: 'Image' },
          { id: 'video', name: 'Video' },
          { id: 'file', name: 'File' }
        ]} 
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);

// ===============================
// USERS RESOURCE (resources/users.jsx)
// ===============================
export const UserList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="role" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="email" validate={[required()]} />
      <SelectInput 
        source="role" 
        choices={[
          { id: 'ADMIN', name: 'Admin' },
          { id: 'EDITOR', name: 'Editor' },
          { id: 'VIEWER', name: 'Viewer' }
        ]} 
        validate={[required()]} 
      />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" validate={[required()]} />
      <TextInput source="password" type="password" validate={[required()]} />
      <SelectInput 
        source="role" 
        choices={[
          { id: 'ADMIN', name: 'Admin' },
          { id: 'EDITOR', name: 'Editor' },
          { id: 'VIEWER', name: 'Viewer' }
        ]} 
        validate={[required()]} 
      />
    </SimpleForm>
  </Create>
);

// ===============================
// AUDIT RESOURCE (resources/audit.jsx)
// ===============================
export const AuditList = (props) => (
  <List {...props} perPage={50} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="actorEmail" />
      <TextField source="action" />
      <TextField source="entity" />
      <TextField source="entityId" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

// ===============================
// CONTACT RESOURCE (resources/contact.jsx)
// ===============================
export const ContactList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="company" />
      <DateField source="createdAt" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ContactShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="company" />
      <TextField source="message" />
      <DateField source="createdAt" showTime />
    </SimpleShowLayout>
  </Show>
);