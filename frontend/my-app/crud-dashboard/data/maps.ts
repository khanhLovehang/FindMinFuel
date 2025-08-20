import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import axios from "axios"; 
import MapCreateRequest from './MapForm';
// types.ts
export interface Map {
  id: number;
  name: string;
  rows: number;
  columns: number;
  boxs: number;
  matrixJson: string;
  createdDate: string;
  modifiedDate?: string;
}

export interface MapDetail {
  id: number;
  mapId: number;
  minFuel: number;
  createdDate: string;
  modifiedDate?: string;
}

const API_BASE_URL = "https://localhost:7083/api/v1"; // replace with your ASP.NET API URL

// export async function getMaps(): Promise<Map[]> {
//   const response = await axios.get<Map[]>(`${API_BASE_URL}/maps`);
//   return response.data;
// }

export async function getMaps({
  paginationModel,
  filterModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: Map[]; itemCount: number }> {
  const response = await axios.get<Map[]>(`${API_BASE_URL}/maps?page=${1}&size=${1000}`);
debugger
  let filteredMaps = [...response.data.data];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredMaps = filteredMaps.filter((map) => {
        const mapValue = map[field as keyof Map];

        switch (operator) {
          case 'contains':
            return String(mapValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return mapValue === value;
          case 'startsWith':
            return String(mapValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(mapValue).toLowerCase().endsWith(String(value).toLowerCase());
          case '>':
            return mapValue > value;
          case '<':
            return mapValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredMaps.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field as keyof Map] < b[field as keyof Map]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field as keyof Map] > b[field as keyof Map]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedMaps = filteredMaps.slice(start, end);

  return {
    items: paginatedMaps,
    itemCount: filteredMaps.length,
  };
}

export async function getMapById(id: number): Promise<Map> {
  const response = await axios.get<Map>(`${API_BASE_URL}/maps/${id}`);
  return response.data;
}

export async function getMapDetails(id: number): Promise<MapDetail[]> {
  const response = await axios.get<MapDetail[]>(`${API_BASE_URL}/maps/${id}/details`);
  return response.data;
}

export async function createMap(map: MapCreateRequest) {
  debugger
  const response = await axios.post(`${API_BASE_URL}/maps`, map);
  return response.data;
}
// export async function updateMap(mapId: number, data: Partial<Omit<Map, 'id'>>) {
//   const maps = getMaps();

//   let updatedMap: Map | null = null;

//   setMaps(
//     maps.map((map) => {
//       if (map.id === mapId) {
//         updatedMap = { ...map, ...data };
//         return updatedMap;
//       }
//       return map;
//     }),
//   );

//   if (!updatedMap) {
//     throw new Error('Map not found');
//   }
//   return updatedMap;
// }

export async function deleteMap(mapId: number) {
  const response = await axios.delete<Map>(`${API_BASE_URL}/maps/${mapId}`);
  return response.data;
}

export async function calculateMinFuel(map: Map) {
  debugger
  const response = await axios.post(`${API_BASE_URL}/maps/calculateMinFuel?mapId=${map}`);
  return response.data;
}

type ValidationResult = { issues: { message: string; path: (keyof Map)[] }[] };

export function validateMap(map: Partial<MapCreateRequest>): ValidationResult {
  let issues: ValidationResult['issues'] = [];

  if (!map.name) {
    issues = [...issues, { message: 'Name is required', path: ['name'] }];
  }

  if (!map.n) {
    issues = [...issues, { message: 'Rows is required', path: ['n'] }];
  } else if (map.n < 1) {
    issues = [...issues, { message: 'Rows must be at larger than 1', path: ['n'] }];
  }

  if (!map.m) {
    issues = [...issues, { message: 'Columns is required', path: ['m'] }];
  } else if (map.m > 500) {
    issues = [...issues, { message: 'Columns must be less than 500', path: ['m'] }];
  }

    if (!map.p) {
    issues = [...issues, { message: 'Boxs is required', path: ['p'] }];
  } else if (map.p < 1 && map.p >= (map.n * map.m) ) {
    issues = [...issues, { message: 'Boxs must be between n vs m', path: ['p'] }];
  }

  return { issues };
}