import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, 
  ShowButton, Show, SimpleShowLayout
} from 'react-admin';

export const ContactList = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="subject" />
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
      <TextField source="subject" />
      <TextField source="message" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);