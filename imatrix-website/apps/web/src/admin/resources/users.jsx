import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  BooleanInput, Create, Show, SimpleShowLayout, 
  SelectInput, required
} from 'react-admin';

export const UserList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="name" />
      <TextField source="role" />
      <BooleanField source="verified" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required()]} />
      <SelectInput source="role" choices={[
        { id: 'USER', name: 'User' },
        { id: 'EDITOR', name: 'Editor' },
        { id: 'ADMIN', name: 'Admin' }
      ]} />
      <BooleanInput source="verified" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required()]} />
      <TextInput source="password" type="password" validate={[required()]} />
      <SelectInput source="role" choices={[
        { id: 'USER', name: 'User' },
        { id: 'EDITOR', name: 'Editor' },
        { id: 'ADMIN', name: 'Admin' }
      ]} />
      <BooleanInput source="verified" />
    </SimpleForm>
  </Create>
);