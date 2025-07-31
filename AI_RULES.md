# AI Rules for ChantierPdp Frontend

## Project Overview

**ChantierPdp** is a React TypeScript construction safety management system for Danone. It manages construction sites (Chantiers), Prevention Plans (PDP), Work Orders (BDT), risk assessments, permits, and worker management.

## Core Architecture

### Technology Stack
- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 
- **UI Framework**: Material-UI (MUI) v6
- **State Management**: Custom hooks + React Query
- **Date Handling**: Day.js
- **PDF Generation**: @react-pdf/renderer
- **Testing**: Vitest + React Testing Library

### Project Structure
```
src/
├── api/               # API client and services
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks for data fetching
├── pages/             # Page-level components
├── utils/             # Utilities, DTOs, entities, enums
├── styles/            # SCSS styles
├── PDF/               # PDF generation components
└── layout/            # Layout components
```

## Data Architecture

### Entity Inheritance Pattern
```typescript
// Base Document interface
interface DocumentDTO {
  id?: number;
  chantier?: number;              // Construction site ID
  entrepriseExterieure?: number;  // External company ID
  donneurDOrdre?: number;         // Order giver ID
  status?: DocumentStatus;        // DRAFT, SIGNED, VALIDATED, etc.
  actionType?: ActionType;        // Document action type
  date?: Date;
  signatures?: number[];          // Worker signatures
  relations?: ObjectAnsweredDTO[]; // Related risks, devices, permits
  creationDate?: Date;
}

// PDP extends Document
interface PdpDTO extends DocumentDTO {
  dateInspection?: Date;
  icpdate?: Date;
  datePrevenirCSSCT?: Date;
  datePrev?: Date;
  horairesDetails?: string;
  entrepriseDInspection?: number;
  horaireDeTravail?: HoraireDeTravaille;
  misesEnDisposition?: MiseEnDisposition;
}

// BDT extends Document  
interface BdtDTO extends DocumentDTO {
  nom?: string;
  complementOuRappels?: ComplementOuRappel[];
}
```

### Key Entities
- **ChantierDTO**: Construction sites
- **PdpDTO**: Prevention Plans (safety documents)
- **BdtDTO**: Work Orders (Bon de Travail)
- **RisqueDTO**: Risk assessments
- **DispositifDTO**: Safety devices/equipment
- **PermitDTO**: Work permits
- **EntrepriseDTO**: Companies
- **WorkerDTO**: Workers/employees
- **UserDTO**: System users

## Component Patterns

### 1. Manager Components (CRUD Operations)
Located in `pages/*/ManagerName.tsx`, these use generic CRUD system:

```typescript
// Example: WorkerManager.tsx
const WorkerManager = () => {
  const workerService = useWorker();
  
  const workerConfig: EntityConfig = {
    entityType: 'worker',
    displayName: 'Worker',
    keyField: 'id',
    displayField: 'nom',
    fields: [/* field definitions */]
  };

  const crudOperations: CrudOperations = {
    getAll: async () => workerService.getAllWorkers(),
    create: async (entity) => workerService.createWorker(entity),
    // ... other operations
  };

  return (
    <ManagerCRUD 
      config={workerConfig}
      operations={crudOperations}
    />
  );
};
```

### 2. Edit/Create Components
Follow the pattern `EditCreate[EntityName].tsx` using tab-based forms:

```typescript
// Example: EditCreateBdt.tsx
const EditCreateBdt = () => {
  const [formData, setFormData] = useState<BdtDTO>({});
  
  const tabs: TabConfig[] = [
    {
      icon: <BusinessIcon />,
      label: "Infos Générales",
      component: <BdtTabGeneralInfo /* props */ />
    },
    {
      icon: <WarningIcon />,
      label: "Risques & Audits", 
      component: <DocumentTabRelations /* props */ />
    }
    // ... more tabs
  ];

  return (
    <BaseDocumentEditCreate
      title={title}
      formData={formData}
      tabs={tabs}
      onSave={handleSave}
    />
  );
};
```

### 3. View Components
Pattern: `View[EntityName].tsx` for displaying entity details with related data.

## Naming Conventions

### Files & Components
- **Components**: PascalCase (`WorkerManager.tsx`)
- **Hooks**: camelCase starting with 'use' (`useChantier.ts`)
- **DTOs**: PascalCase ending with 'DTO' (`ChantierDTO.ts`)
- **Services**: camelCase ending with 'Service' (`chantierService.ts`)

### Variables & Functions
- **State**: camelCase (`formData`, `isLoading`)
- **Functions**: camelCase with descriptive verbs (`handleSave`, `fetchWorkers`)
- **Constants**: UPPER_SNAKE_CASE (`DOCUMENT_STATUS`)

## Hooks Pattern

Each entity has a corresponding hook in `hooks/use[EntityName].ts`:

```typescript
// hooks/useChantier.ts
const useChantier = () => {
  const [loading, setLoading] = useState(false);
  const [chantiers, setChantiers] = useState<Map<number, ChantierDTO>>(new Map());
  
  const getAllChantiers = useCallback(async () => {
    // API call logic
  }, []);

  return {
    loading,
    chantiers,
    getAllChantiers,
    createChantier,
    updateChantier,
    deleteChantier
  };
};
```

## Form Handling Patterns

### State Management
```typescript
const [formData, setFormData] = useState<EntityDTO>({});
const [errors, setErrors] = useState<Record<string, string>>({});
const [isLoading, setIsLoading] = useState(false);
```

### Input Handlers
```typescript
const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, checked, type } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
}, []);

const handleAutocompleteChange = useCallback((name: keyof EntityDTO, value: unknown) => {
  setFormData(prev => ({ ...prev, [name]: value }));
}, []);
```

## Relation Management

The system uses a complex relation system where documents can be linked to:
- Risks (ObjectAnsweredObjects.RISQUE)
- Safety devices (ObjectAnsweredObjects.DISPOSITIF) 
- Permits (ObjectAnsweredObjects.PERMIT)
- Risk analyses (ObjectAnsweredObjects.ANALYSE_DE_RISQUE)
- Security audits (ObjectAnsweredObjects.AUDIT)

```typescript
const addRelation = useCallback(async (objectType: ObjectAnsweredObjects, selectedItem: { id?: number }) => {
  const newRelation = {
    objectId: selectedItem.id,
    objectType: objectType,
    answer: true,
  };
  
  setFormData(prev => ({
    ...prev,
    relations: [...(prev.relations || []), newRelation]
  }));
}, []);
```

## Validation Patterns

### Form Validation
```typescript
const validateForm = useCallback((currentData: EntityDTO): { 
  isValid: boolean; 
  hasWarnings: boolean; 
  firstErrorTabIndex: number 
} => {
  const newErrors: Record<string, string> = {};
  
  // Critical validations
  if (!currentData.nom?.trim()) {
    newErrors.nom = "Le nom est requis";
  }
  
  setErrors(newErrors);
  return {
    isValid: Object.keys(newErrors).length === 0,
    hasWarnings: false,
    firstErrorTabIndex: -1
  };
}, []);
```

## API Integration

### Error Handling
Always handle API errors gracefully:

```typescript
try {
  const result = await apiCall();
  notifications.show("Succès", { severity: "success" });
  return result;
} catch (error) {
  console.error("Error:", error);
  notifications.show("Erreur lors de l'opération", { severity: "error" });
  throw error;
}
```

### Loading States
Always show loading states for better UX:

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleOperation = async () => {
  setIsLoading(true);
  try {
    await operation();
  } finally {
    setIsLoading(false);
  }
};
```

## Material-UI Usage

### Theme Integration
The project uses a custom MUI theme with:
- Primary color: `#1976d2`
- Secondary color: `#dc004e`
- Border radius: `8px`

### Common Components
- **Dialog**: For modals and confirmations
- **Tabs**: For multi-section forms
- **DataGrid**: For tabular data display
- **Autocomplete**: For entity selection
- **DatePicker**: From `@mui/x-date-pickers`

## Testing Guidelines

### File Structure
- Test files: `*.test.tsx` or `*.spec.tsx`
- Setup: `src/setupTests.ts`
- Config: `vitest.config.ts`

### Testing Patterns
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

## Common Anti-Patterns to Avoid

1. **Don't** create direct API calls in components - use hooks
2. **Don't** mutate state directly - always use setState with new objects
3. **Don't** forget error boundaries for component error handling
4. **Don't** skip loading states in async operations
5. **Don't** hardcode strings - use constants or i18n
6. **Don't** forget to cleanup useEffect dependencies

## Security Considerations

1. **Authentication**: JWT tokens stored in localStorage
2. **API Security**: All requests include auth headers
3. **Input Validation**: Client-side validation + server validation
4. **XSS Prevention**: Use React's built-in sanitization
5. **Route Protection**: Protected routes require authentication

## Performance Guidelines

1. **Lazy Loading**: Use React.lazy() for code splitting
2. **Memoization**: Use useMemo/useCallback for expensive operations
3. **Virtual Scrolling**: For large data lists
4. **Image Optimization**: Optimize images and use appropriate formats
5. **Bundle Analysis**: Regular bundle size monitoring

## Accessibility (A11y)

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add aria-labels for screen readers
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Color Contrast**: Follow WCAG guidelines
5. **Focus Management**: Proper focus handling in modals

## Internationalization

The system is primarily in French but should be prepared for multi-language:
- Use consistent French terminology
- Prepare string externalization structure
- Date/time formatting with proper locale

## Documentation Standards

1. **JSDoc**: Document complex functions and components
2. **README**: Keep README files updated
3. **Architecture Docs**: Document major architectural decisions
4. **API Documentation**: Maintain API endpoint documentation

## AI Assistant Guidelines

When helping with this codebase:

1. **Follow established patterns** - Don't introduce new patterns without justification
2. **Maintain type safety** - Always use proper TypeScript types
3. **Consider the French context** - Use appropriate French labels and terminology
4. **Respect the DTO pattern** - Work with the established DTO inheritance
5. **Use the hook system** - Don't bypass the custom hook architecture
6. **Follow MUI conventions** - Use Material-UI components consistently
7. **Maintain accessibility** - Include proper ARIA labels and semantic markup
8. **Handle errors gracefully** - Always include proper error handling
9. **Consider mobile responsiveness** - Use responsive design patterns
10. **Test your suggestions** - Ensure code changes don't break existing functionality

## Dependencies Management

### Core Dependencies
- Keep React and TypeScript versions updated
- MUI should remain on v6+ for consistency
- Vite for build performance
- Day.js for date operations (lighter than moment.js)

### Development Dependencies
- ESLint for code quality
- Prettier for code formatting
- Vitest for testing
- React Testing Library for component testing

Remember: This is a safety-critical application for construction site management. Code quality, reliability, and user safety should always be prioritized over rapid development.
