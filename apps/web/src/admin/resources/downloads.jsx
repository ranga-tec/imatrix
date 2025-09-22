import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  BooleanInput, Create, Show, SimpleShowLayout, 
  required
} from 'react-admin';

export const DownloadList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="filename" />
      <TextField source="filesize" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const DownloadEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <TextInput source="filename" validate={[required()]} />
      <TextInput source="url" validate={[required()]} />
    </SimpleForm>
  </Edit>
);

export const DownloadCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <TextInput source="filename" validate={[required()]} />
      <TextInput source="url" validate={[required()]} />
      <TextInput source="filesize" />
    </SimpleForm>
  </Create>
);