import React from 'react';
import { 
  List, 
  Datagrid, 
  TextField, 
  DateField,
  Show,
  SimpleShowLayout
} from 'react-admin';

// ===============================
// AUDIT RESOURCE (resources/audit.jsx)
// ===============================

export const AuditList = (props) => (
  <List {...props} perPage={50} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="actorEmail" />
      <TextField source="action" />
      <TextField source="entity" />
      <TextField source="entityId" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export const AuditShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="actorEmail" />
      <TextField source="action" />
      <TextField source="entity" />
      <TextField source="entityId" />
      <TextField source="details" />
      <DateField source="createdAt" showTime />
    </SimpleShowLayout>
  </Show>
);

// Audit logs are read-only, so Edit/Create redirect to list
export const AuditEdit = () => {
  window.location.href = '#/audit';
  return null;
};

export const AuditCreate = () => {
  window.location.href = '#/audit';
  return null;
};