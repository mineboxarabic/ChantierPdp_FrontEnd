import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations } from "../../components/GenericCRUD/TypeConfig";
import { UserDTO as User } from "../../utils/entitiesDTO/UserDTO";
import useUser from "../../hooks/useUser";

// Create a theme instance (you can reuse the same theme from your RisqueManager)
const theme = createTheme({
    shape: {
        borderRadius: 8,
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

// UserManager component using the generic CRUD system
const UserManager = () => {
    // Get the hook for User CRUD operations
    const userService = useUser();

    // Define the entity configuration for User
    const userConfig: EntityConfig = {
        entityType: 'user',
        displayName: 'User',
        pluralName: 'Users',
        keyField: 'id',
        displayField: 'name',
        searchFields: ['name', 'username', 'email'],
        defaultSortField: 'name',
        fields: [
            {
                key: 'id',
                type: FieldType.Number,
                label: 'ID',
                hidden: true,
            },
            {
                key: 'name',
                type: FieldType.Text,
                label: 'Name',
                required: false,
                order: 1,
                section: 'Basic Information',
            },
            {
                key: 'username',
                type: FieldType.Text,
                label: 'Username',
                required: true,
                order: 2,
                section: 'Basic Information',
                validation: {
                    pattern: '^[a-zA-Z0-9_]{3,20}$',
                    patternMessage: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
                },
            },
            {
                key: 'email',
                type: FieldType.Text,
                label: 'Email',
                required: true,
                order: 3,
                section: 'Contact Information',
                validation: {
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    patternMessage: 'Please enter a valid email address',
                },
            },
            {
                key: 'notel',
                type: FieldType.Text,
                label: 'Phone Number',
                order: 4,
                section: 'Contact Information',
            },
            {
                key: 'role',
                type: FieldType.Enum,
                label: 'Role',
                required: false,
                order: 5,
                section: 'Work Information',
                options: [
                    { value: 'ADMIN', label: 'Administrator' },
                    { value: 'WORKER', label: 'Worker' },
                    {value: 'REE', label: 'REE'},
                    {value: 'REU', label: 'REU'}

                ],
            },
            {
                key: 'fonction',
                type: FieldType.Text,
                label: 'Job Function',
                order: 6,
                section: 'Work Information',
            },
        ],
    };

    // Create CRUD operations adapter from the user service
    const crudOperations: CrudOperations<User> = {
        getAll: async () => {
            const users = await userService.getUsers();
            return users || [];
        },
        getById: async (id: number) => {
            const user = await userService.getUser(id);
            return user;
        },
        create: async (entity: User) => {
            const newUser = await userService.createUser(entity);
            return newUser;
        },
        update: async (id: number, entity: User) => {
            // Ensure the ID is set correctly
            entity.id = id;
            const updatedUser = await userService.updateUser(entity);
            return updatedUser;
        },
        delete: async (id: number) => {
            await userService.deleteUser(id);
        },
    };

    return (
        <ManagerCRUD
            config={userConfig}
            crudOperations={crudOperations}
            actions={{
                create: true,
                edit: true,
                delete: true,
                view: true,
                export: true,
                import: true,
            }}
        />
    );
};

export default UserManager;