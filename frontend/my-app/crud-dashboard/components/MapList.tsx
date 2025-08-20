import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridEventListener,
  gridClasses,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useDialogs } from "../hooks/useDialogs/useDialogs";
import useNotifications from "../hooks/useNotifications/useNotifications";
// import {
//   deleteOne as deleteMap,
//   getMany as getMaps,
//   type Map,
// } from "../data/Maps";
import {
  getMaps,
  calculateMinFuel,
  getMapById,
  getMapDetails,
  deleteMap,
  type Map,
} from "../data/maps";

import PageContainer from "./PageContainer";
import CalculateIcon from "@mui/icons-material/Calculate";

const INITIAL_PAGE_SIZE = 10;

export default function MapList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [fuel, setFuel] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : INITIAL_PAGE_SIZE,
    });
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(
    searchParams.get("filter")
      ? JSON.parse(searchParams.get("filter") ?? "")
      : { items: [] }
  );
  const [sortModel, setSortModel] = React.useState<GridSortModel>(
    searchParams.get("sort") ? JSON.parse(searchParams.get("sort") ?? "") : []
  );

  const [rowsState, setRowsState] = React.useState<{
    rows: Map[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);

      searchParams.set("page", String(model.page));
      searchParams.set("pageSize", String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`
      );
    },
    [navigate, pathname, searchParams]
  );

  const handleFilterModelChange = React.useCallback(
    (model: GridFilterModel) => {
      setFilterModel(model);

      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set("filter", JSON.stringify(model));
      } else {
        searchParams.delete("filter");
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`
      );
    },
    [navigate, pathname, searchParams]
  );

  const handleSortModelChange = React.useCallback(
    (model: GridSortModel) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set("sort", JSON.stringify(model));
      } else {
        searchParams.delete("sort");
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`
      );
    },
    [navigate, pathname, searchParams]
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      debugger;
      const listData = await getMaps({
        paginationModel,
        sortModel,
        filterModel,
      });

      setRowsState({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback<GridEventListener<"rowClick">>(
    ({ row }) => {
      navigate(`/Maps/${row.id}`);
    },
    [navigate]
  );

  const handleCreateClick = React.useCallback(() => {
    navigate("/Maps/new");
  }, [navigate]);

  const handleRowEdit = React.useCallback(
    (Map: Map) => () => {
      navigate(`/Maps/${Map.id}/edit`);
    },
    [navigate]
  );

  const handleRowCalculateMinFuel = React.useCallback(async (map: Map) => {
    try {
      const response = await calculateMinFuel(map.id); // call API
      setFuel(response.data); // save result
      setOpen(true); // open popup
    } catch (error) {
      console.error("Error calculating fuel:", error);
    }
  }, []);

  const handleRowDelete = React.useCallback(
    (Map: Map) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete ${Map.name}?`,
        {
          title: `Delete Map?`,
          severity: "error",
          okText: "Delete",
          cancelText: "Cancel",
        }
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          const response = await deleteMap(Number(Map.id));

          notifications.show("Map deleted successfully.", {
            severity: "success",
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Failed to delete Map. Reason:' ${(deleteError as Error).message}`,
            {
              severity: "error",
              autoHideDuration: 3000,
            }
          );
        }
        setIsLoading(false);
      }
    },
    [dialogs, notifications, loadData]
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    []
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID" },
      { field: "name", headerName: "Name" },
      { field: "rows", headerName: "n", type: "number" },
      { field: "columns", headerName: "m", type: "number" },
      { field: "boxs", headerName: "p", type: "number" },
      { field: "matrixJson", headerName: "matrix", width: 200 },
      {
        field: "createdDate",
        headerName: "Created date",
        type: "date",
        valueGetter: (value) => value && new Date(value),
        width: 140,
      },
      // {
      //   field: 'role',
      //   headerName: 'Department',
      //   type: 'singleSelect',
      //   valueOptions: ['Market', 'Finance', 'Development'],
      //   width: 160,
      // },
      // { field: 'isFullTime', headerName: 'Full-time', type: 'boolean' },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        align: "right",
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="calculate-fuel"
            icon={<CalculateIcon />}
            label="Calculate min fuel"
            onClick={() => handleRowCalculateMinFuel(row)}
          />,
          // <GridActionsCellItem
          //   key="edit-item"
          //   icon={<EditIcon />}
          //   label="Edit"
          //   onClick={handleRowEdit(row)}
          // />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete, handleRowCalculateMinFuel]
  );

  const pageTitle = "Maps";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton
                size="small"
                aria-label="refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount}
            columns={columns}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: "transparent",
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: "none",
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: "pointer",
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: "circular-progress",
                noRowsVariant: "circular-progress",
              },
              baseIconButton: {
                size: "small",
              },
            }}
          />
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Minimum Fuel</DialogTitle>
        <DialogContent>
          <Typography>
            {fuel !== null
              ? `Minimum fuel required: ${fuel}`
              : "Calculating..."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
