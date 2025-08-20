import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import type { Map } from '../data/maps';

export interface MapFormState {
  values: Partial<Omit<MapCreateRequest, 'id'>>;
  errors: Partial<Record<keyof MapFormState['values'], string>>;
}

export interface MapCreateRequest {
  name: string;
  n: number;
  m: number;
  p: number;
  matrixJson: string;
}

export interface MapEditRequest {
  name: string;
  n: number;
  m: number;
  p: number;
  matrixJson: string;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface MapFormProps {
  formState: MapFormState;
  onFieldChange: (
    name: keyof MapFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<MapFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<MapFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function MapForm(props: MapFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof MapFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof MapFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof MapFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof MapFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
    },
    [formValues, onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof MapFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/maps');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.name ?? ''}
              onChange={handleTextFieldChange}
              name="name"
              label="Name"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.n ?? ''}
              onChange={handleNumberFieldChange}
              name="n"
              label="Rows"
              error={!!formErrors.n}
              helperText={formErrors.n ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.m ?? ''}
              onChange={handleNumberFieldChange}
              name="m"
              label="Columns"
              error={!!formErrors.m}
              helperText={formErrors.m ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.p ?? ''}
              onChange={handleNumberFieldChange}
              name="p"
              label="Boxs"
              error={!!formErrors.p}
              helperText={formErrors.p ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="string"
              value={formValues.matrixJson ?? ''}
              onChange={handleTextFieldChange}
              name="matrixJson"
              label="Matrix"
              placeholder='[[3, 2, 2],[2, 2, 2],[2, 2, 1]]'
              error={!!formErrors.matrixJson}
              helperText={formErrors.matrixJson ?? ' '}
              fullWidth
            />
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.createdDate ? dayjs(formValues.createdDate) : null}
                onChange={handleDateFieldChange('createdDate')}
                name="createdDate"
                label="Created date"
                slotProps={{
                  textField: {
                    error: !!formErrors.createdDate,
                    helperText: formErrors.createdDate ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid> */}
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.role} fullWidth>
              <InputLabel id="map-role-label">Department</InputLabel>
              <Select
                value={formValues.role ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="map-role-label"
                name="role"
                label="Department"
                defaultValue=""
                fullWidth
              >
                <MenuItem value="Market">Market</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
              </Select>
              <FormHelperText>{formErrors.role ?? ' '}</FormHelperText>
            </FormControl>
          </Grid> */}
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="isFullTime"
                control={
                  <Checkbox
                    size="large"
                    checked={formValues.isFullTime ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Full-time"
              />
              <FormHelperText error={!!formErrors.isFullTime}>
                {formErrors.isFullTime ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid> */}
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
