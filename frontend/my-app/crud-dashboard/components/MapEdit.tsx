import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  getMapDetails,
  validateMap,
  type Map,
} from '../data/maps';
import MapForm, {
  type FormFieldValue,
  type MapFormState,
} from './MapForm';
import PageContainer from './PageContainer';
import MapEditRequest from './MapForm';

function MapEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<MapFormState['values']>;
  onSubmit: (formValues: Partial<MapFormState['values']>) => Promise<void>;
}) {
  const { mapId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<MapFormState>(() => ({
    values: initialValues,
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
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateMap(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Map edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/maps');
    } catch (editError) {
      notifications.show(
        `Failed to edit map. Reason: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <MapForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/maps/${mapId}`}
    />
  );
}

export default function MapEdit() {
  const { mapId } = useParams();

  const [map, setMap] = React.useState<Map | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getMap(Number(mapId));

      setMap(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [mapId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues: Partial<MapFormState['values']>) => {
      const updatedData = await updateMap(Number(mapId), formValues);
      setMap(updatedData);
    },
    [mapId],
  );

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return map ? (
      <MapEditForm initialValues={map} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, map, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Map ${mapId}`}
      breadcrumbs={[
        { title: 'Maps', path: '/maps' },
        { title: `Map ${mapId}`, path: `/maps/${mapId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
