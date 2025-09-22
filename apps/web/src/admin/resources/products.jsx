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
