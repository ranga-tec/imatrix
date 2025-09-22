import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  EditButton, ShowButton, Edit, SimpleForm, TextInput, 
  BooleanInput, Create, Show, SimpleShowLayout, 
  RichTextField, Filter, SearchInput, SelectInput,
  required
} from 'react-admin';

export const PostList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <BooleanField source="published" />
      <DateField source="createdAt" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
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
      <TextInput source="excerpt" multiline rows={3} />
      <TextInput source="body" multiline rows={10} />
      <BooleanInput source="published" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="excerpt" multiline rows={3} />
      <TextInput source="body" multiline rows={10} />
      <BooleanInput source="published" />
    </SimpleForm>
  </Create>
);