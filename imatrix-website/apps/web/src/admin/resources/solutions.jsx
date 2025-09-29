// ===============================
//  ADMIN SOLUTIONS RESOURCE
// ===============================
// imatrix-website/apps/web/src/admin/resources/solutions.jsx 
// Admin interface for managing solutions.

import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  BooleanInput, Create, Show, SimpleShowLayout, 
  RichTextField, required
} from 'react-admin';

export const SolutionList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <BooleanField source="featured" />
      <DateField source="createdAt" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const SolutionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="summary" />
      <RichTextField source="description" />
      <BooleanField source="featured" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const SolutionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="summary" multiline rows={3} />
      <TextInput source="description" multiline rows={10} />
      <BooleanInput source="featured" />
    </SimpleForm>
  </Edit>
);

export const SolutionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="summary" multiline rows={3} />
      <TextInput source="description" multiline rows={10} />
      <BooleanInput source="featured" />
    </SimpleForm>
  </Create>
);