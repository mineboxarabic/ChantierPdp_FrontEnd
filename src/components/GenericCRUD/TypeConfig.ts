// Base entity interface - all entities should have an optional ID
export interface BaseEntity {
    id?: number;
}

// Entity reference for relationships
export interface EntityRef {
    id: number;
    [key: string]: any; // Additional properties may be present
}

// Image model type
export interface ImageModel {
    imageData: string;
    mimeType: string;
}

// Field types enum
export enum FieldType {
    Text = 'text',
    Number = 'number',
    Boolean = 'boolean',
    Date = 'date',
    Enum = 'enum',
    Image = 'image',
    EntityRef = 'entityRef',
    ArrayOfEntityRefs = 'arrayOfEntityRefs',
    ArrayOfSimpleValues = 'arrayOfSimpleValues',
    Object = 'object',
}

// Field configuration for display and editing
export interface FieldConfig {
    key: string;
    type: FieldType;
    label: string;
    required?: boolean;
    hidden?: boolean;
    readOnly?: boolean;
    order?: number;
    placeholder?: string;
    helperText?: string;
    // Special configurations based on field type
    options?: Array<{ value: any; label: string }>; // For enums
    entityType?: string; // For references, indicates which entity type it refers to
    multiple?: boolean; // For arrays
    valueType?: FieldType; // For arrays, indicates the type of values in the array
    formatter?: (value: any) => string; // Custom formatter
    renderer?: React.FC<{ value: any }>; // Custom renderer
    fieldComponent?: React.FC<{ field: FieldConfig; value: any; onChange: (value: any) => void }>; // Custom editor
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: (value: any) => string | null; // Return error message or null if valid
        patternMessage?: string; // Custom message for pattern validation

    };
    fullWidth?: boolean; // Whether to use full width for text fields
    multiline?: boolean; // Whether to use multiline text fields
    rows?: number; // Number of rows for multiline text fields
    section?: string; // Section name for grouping fields
    itemLabel?: string; // For arrays, indicates the field to use as a label
    reference?:{
        fieldName?: string;
        keyField?: string;
    }
}

// Entity configuration for customizing display and editing
export interface EntityConfig {
    entityType: string;
    displayName: string;
    pluralName: string;
    fields: FieldConfig[];
    defaultSortField?: string;
    keyField?: string; // Field to use as a unique identifier (defaults to 'id')
    displayField?: string; // Field to use for display in references (defaults to 'name' or 'title')
    searchFields?: string[]; // Fields to include in search
    cardComponent?: React.FC<{ entity: any; config: EntityConfig }>; // Custom card component
    formComponent?: React.FC<{ entity: any; config: EntityConfig; onSubmit: (entity: any) => void }>; // Custom form component
    defaultImage?: ImageModel | string// For images, default image to display

}

// Interface for the crud operations provided to the components
export interface CrudOperations<T extends BaseEntity> {
    getAll: () => Promise<T[]>;
    getById: (id: number) => Promise<T>;
    create: (entity: T) => Promise<T>;
    update: (id: number, entity: T) => Promise<T>;
    delete: (id: number) => Promise<void>;
    getReferences?: (entityType: string, query?: string) => Promise<any[]>;
}

// Props for the CardGeneric component
export interface CardGenericProps<T extends BaseEntity> {
    entity: T;
    config: EntityConfig;
    onSelect?: (entity: T) => void;
    onEdit?: (entity: T) => void;
    onDelete?: (entity: T) => void;
    onView?: (entity: T) => void;
    selected?: boolean;
}

// Props for the CardsGeneric component
export interface CardsGenericProps<T extends BaseEntity> {
    entities: T[];
    config: EntityConfig;
    onSelect?: (entity: T) => void;
    onEdit?: (entity: T) => void;
    onDelete?: (entity: T) => void;
    onView?: (entity: T) => void;
    selectedIds?: number[];
    loading?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
}

// Props for the EditGeneric component
export interface EditGenericProps<T extends BaseEntity> {
    entity?: T; // If undefined, it's a create operation
    config: EntityConfig;
    open: boolean;
    onClose: () => void;
    onSubmit: (entity: T) => void;
    crudOperations: CrudOperations<T>;
}

// Props for the ManagerCrud component
export interface ManagerCrudProps<T extends BaseEntity> {
    config: EntityConfig;
    crudOperations: CrudOperations<T>;
    initialFilters?: Record<string, any>;
    pagination?: boolean;
    pageSize?: number;
    toolbar?: React.ReactNode;
    actions?: {
        create?: boolean;
        edit?: boolean;
        delete?: boolean;
        view?: boolean;
        export?: boolean;
        import?: boolean;
        custom?: Array<{
            name: string;
            label: string;
            icon?: React.ReactNode;
            action: (selected: T[]) => void;
            multiple?: boolean; // Whether this action applies to multiple selections
        }>;
    };
}

// Utility types for working with field values
export type FieldValue = string | number | boolean | Date | EntityRef | EntityRef[] | string[] | number[] | boolean[] | ImageModel | Record<string, any>;

// Helper functions for detecting field types
export const detectFieldType = (value: any): FieldType => {
    if (value === null || value === undefined) return FieldType.Text;
    if (typeof value === 'string') return FieldType.Text;
    if (typeof value === 'number') return FieldType.Number;
    if (typeof value === 'boolean') return FieldType.Boolean;
    if (value instanceof Date) return FieldType.Date;
    if (Array.isArray(value)) {
        if (value.length === 0) return FieldType.ArrayOfSimpleValues;
        if (typeof value[0] === 'object' && 'id' in value[0]) return FieldType.ArrayOfEntityRefs;
        return FieldType.ArrayOfSimpleValues;
    }
    if (typeof value === 'object') {
        if ('id' in value) return FieldType.EntityRef;
        if ('imageData' in value && 'mimeType' in value) return FieldType.Image;
        return FieldType.Object;
    }
    return FieldType.Text;
};

// Helper function to generate a field configuration from an entity
export const generateFieldsConfig = <T extends BaseEntity>(
    entity: T,
    customConfig: Partial<EntityConfig> = {}
): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    for (const [key, value] of Object.entries(entity)) {
        // Skip if already configured
        if (customConfig.fields?.some(f => f.key === key)) continue;

        const type = detectFieldType(value);

        fields.push({
            key,
            type,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            required: key === 'id' ? false : true,
            hidden: key === 'id',
        });
    }

    // Apply custom field configs
    return [...fields, ...(customConfig.fields || [])];
};

// Generate entity configuration from sample entity
export const generateEntityConfig = <T extends BaseEntity>(
    entityType: string,
    sampleEntity: T,
    customConfig: Partial<EntityConfig> = {}
): EntityConfig => {
    const displayName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    const pluralName = displayName + 's';

    return {
        entityType,
        displayName,
        pluralName,
        keyField: 'id',
        displayField: sampleEntity.hasOwnProperty('name') ? 'name' :
            sampleEntity.hasOwnProperty('title') ? 'title' : 'id',
        fields: generateFieldsConfig(sampleEntity, customConfig),
        ...customConfig,
    };
};