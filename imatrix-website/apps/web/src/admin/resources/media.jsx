// ===============================
//  ADMIN DOWNLOADS RESOURCE
// ===============================
// imatrix-website/apps/web/src/admin/resources/downloads.jsx 
// Admin interface for managing downloadable resources.

import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  BooleanInput, Create, Show, SimpleShowLayout, 
  RichTextField, Filter, SearchInput, SelectInput,
  required
} from 'react-admin';

export const MediaList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="filename" />
      <TextField source="type" />
      <TextField source="url" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const MediaShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="filename" />
      <TextField source="url" />
      <TextField source="type" />
      <TextField source="alt" />
      <TextField source="caption" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const MediaEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="alt" />
      <TextInput source="caption" multiline rows={2} />
    </SimpleForm>
  </Edit>
);

export const MediaCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="filename" validate={[required()]} />
      <TextInput source="url" validate={[required()]} />
      <TextInput source="type" />
      <TextInput source="alt" />
      <TextInput source="caption" multiline rows={2} />
    </SimpleForm>
  </Create>
);