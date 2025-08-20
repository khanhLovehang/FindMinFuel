import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createMap ,
 validateMap ,
  type Map,
} from '../data/maps';
import MapForm, {
  type FormFieldValue,
  type MapFormState,
} from './MapForm';
import PageContainer from './PageContainer';

import MapCreateRequest from './MapForm';

const INITIAL_FORM_VALUES: Partial<MapFormState['values']> = {

};



export default function MapCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<MapFormState>(() => ({
    values: INITIAL_FORM_VALUES,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<MapFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<MapFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof MapFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<MapFormState['values']>) => {
        const { issues } = validateMap(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    debugger
    const { issues } = validateMap(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
    debugger
      await createMap(formValues as Omit<MapCreateRequest, 'name'>);
      notifications.show('Map created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/maps');
    } catch (createError) {
      notifications.show(
        `Failed to create map. Reason: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Map"
      breadcrumbs={[{ title: 'Maps', path: '/maps' }, { title: 'New' }]}
    >
      <MapForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
