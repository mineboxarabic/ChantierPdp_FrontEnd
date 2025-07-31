# Recommended API Architecture Refactor

## Current Problems
- 20+ hook files for API calls
- Duplicate API layers (useAxios + fetchApi)
- Inconsistent patterns
- Hard for AI to understand and help with

## Recommended Structure

### 1. Single API Client (`src/api/client.ts`)
```typescript
// One centralized, well-configured axios instance
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true
});

// Add interceptors for auth, errors, etc.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Service Layer (`src/api/services/`)
Instead of 20+ hook files, create service files:

```
src/api/services/
├── chantier.service.ts
├── user.service.ts  
├── notification.service.ts
├── document.service.ts
└── index.ts (export all)
```

Example `chantier.service.ts`:
```typescript
import { apiClient } from '../client';
import { ChantierDTO } from '../../types/dto';

export const chantierService = {
  getAll: () => apiClient.get<ChantierDTO[]>('/api/chantier/all'),
  getById: (id: number) => apiClient.get<ChantierDTO>(`/api/chantier/${id}`),
  create: (data: ChantierDTO) => apiClient.post<ChantierDTO>('/api/chantier', data),
  update: (id: number, data: ChantierDTO) => apiClient.patch<ChantierDTO>(`/api/chantier/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/chantier/${id}`),
  getRecent: () => apiClient.get<ChantierDTO[]>('/api/chantier/recent')
};
```

### 3. React Query Hooks (`src/hooks/api/`)
Create focused hooks using React Query:

```
src/hooks/api/
├── useChantier.ts
├── useUser.ts
├── useNotifications.ts
└── index.ts
```

Example `useChantier.ts`:
```typescript
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { chantierService } from '../../api/services';

export const useChantiers = () => {
  return useQuery('chantiers', () => chantierService.getAll());
};

export const useChantier = (id: number) => {
  return useQuery(['chantier', id], () => chantierService.getById(id));
};

export const useCreateChantier = () => {
  const queryClient = useQueryClient();
  return useMutation(chantierService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('chantiers');
    }
  });
};
```

### 4. Simplified File Structure
```
src/
├── api/
│   ├── client.ts          (single axios instance)
│   └── services/          (4-6 service files)
├── hooks/
│   ├── api/              (4-6 React Query hooks)
│   └── other/            (non-API hooks)
├── types/
│   └── dto/              (all DTOs in one place)
└── utils/
    └── mappers/          (data transformations)
```

## Benefits of This Architecture

### ✅ AI-Friendly
- Fewer files to understand
- Clear separation of concerns
- Consistent patterns
- Easier to find relevant code

### ✅ Developer-Friendly  
- Single source of truth for API calls
- React Query handles caching, loading, errors
- Easy to test individual services
- Clear data flow

### ✅ Maintainable
- Add new endpoints easily
- Consistent error handling
- Type-safe throughout
- Less code duplication

## Migration Strategy

1. **Phase 1**: Create new `api/client.ts` and first service
2. **Phase 2**: Migrate one entity at a time
3. **Phase 3**: Remove old hooks gradually
4. **Phase 4**: Clean up unused files

## Example Usage in Components

Instead of this (current):
```typescript
const { getAllChantiers } = useChantier();
const [chantiers, setChantiers] = useState([]);

useEffect(() => {
  getAllChantiers().then(setChantiers);
}, []);
```

You get this (new):
```typescript
const { data: chantiers, isLoading, error } = useChantiers();
```

Much cleaner and more powerful!
