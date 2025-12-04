// src/components/shared/forms/FormContainer.jsx
import React from 'react';
import { Formik, Form } from 'formik';

const FormContainer = ({ 
  initialValues, 
  validationSchema, 
  onSubmit, 
  children 
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    <Form>{children}</Form>
  </Formik>
);

export default FormContainer;