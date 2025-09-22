import React from 'react';
import {
  List, Datagrid, TextField, DateField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  Create, Show, SimpleShowLayout, required
} from 'react-admin';

export const CategoryList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CategoryEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
    </SimpleForm>
  </Create>
);