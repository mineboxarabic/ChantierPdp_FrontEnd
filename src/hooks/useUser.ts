// useUser.ts
import { useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { RegisterUserData } from "../utils/user/RegisterUserData.ts";
import { UserDTO } from "../utils/entitiesDTO/UserDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type UserResponse = UserDTO  | UserDTO[] | number | null;

// Function to register a user
export const registerUser = async (registerData: RegisterUserData): Promise<ApiResponse<UserDTO>> => {
    return fetchApi<UserDTO>(
        'api/user/register',
        'POST',
        registerData,
        [
            {
                status: 409,
                message: 'Error user already exists',
            },
            {
                status: 500,
                message: 'Error while registering user register',
            },
            {
                status: -1,
                message: 'Error while registering user register -1',
            }
        ]
    );
};

// Function to login a user
export const loginUser = async (loginData: RegisterUserData): Promise<ApiResponse<UserDTO>> => {
    return fetchApi<UserDTO>(
        'api/user/login',
        'POST',
        loginData,
        [
            {
                status: 409,
                message: 'Error logining user login (Worng password)',
            },
            {
                status: 404,
                message: 'Error logining user login (User not found)',
            },
            {
                status: 500,
                message: 'Error logining user login',
            },
            {
                status: -1,
                message: 'Error logining user login -1',
            }
        ]
    );
};

// Function to create a user
export const createUser = async (user: UserDTO): Promise<ApiResponse<UserDTO>> => {
    return fetchApi<UserDTO>(
        'api/user',
        'POST',
        user,
        [
            {
                status: 500,
                message: 'Error while creating user',
            },
            {
                status: -1,
                message: 'Error while creating user -1',
            }
        ]
    );
};

// Function to get all users
export const getUsers = async (): Promise<ApiResponse<UserDTO[]>> => {
    return fetchApi<UserDTO[]>(
        `api/user`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error users not found',
            },
            {
                status: -1,
                message: 'Error while getting users',
            }
        ]
    );
};

// Function to get a user by ID
export const getUserById = async (id: number): Promise<ApiResponse<UserDTO>> => {

    if(id <= 0) {
        throw new Error("Invalid user ID");
    }

    return fetchApi<UserDTO>(
        'api/user/' + id,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error user not found',
            },
            {
                status: 403,
                message: 'Error not authorized',
            },
            {
                status: -1,
                message: 'Error while getting user',
            }
        ]
    );
};

// Function to update a user
export const updateUser = async (user: UserDTO): Promise<ApiResponse<UserDTO>> => {
    return fetchApi<UserDTO>(
        'api/user/' + user.id,
        'PUT',
        user,
        [
            {
                status: 404,
                message: 'Error user not found',
            },
            {
                status: 500,
                message: 'Error while updating user',
            },
            {
                status: -1,
                message: 'Error while updating user -1',
            }
        ]
    );
};

// Function to delete a user
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
    return fetchApi<void>(
        'api/user/' + id,
        'DELETE',
        null,
        [
            {
                status: 404,
                message: 'Error user not found',
            },
            {
                status: 500,
                message: 'Error while deleting user',
            },
            {
                status: -1,
                message: 'Error while deleting user -1',
            }
        ]
    );
};

// Function to get the current user from localStorage
export const getCurrentUser = (): string | null => {
    return localStorage.getItem("user");
};

// React hook that uses the API functions
const useUser = () => {
    const [response, setResponse] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [users, setUsers] = useState<Map<number, UserDTO>>(new Map());

    const notifications = useNotifications();

    const registerUserHook = async (registerData: RegisterUserData): Promise<void> => {
        setLoading(true);
        try {
            await registerUser(registerData);
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const loginUserHook = async (loginData: RegisterUserData): Promise<void> => {
        if (localStorage.getItem("user")) {
            notifications.show("UserDTO already logged in");
            return;
        }

        setLoading(true);
        try {
            const result = await loginUser(loginData);
            if (result.data) {
                localStorage.setItem("user", JSON.stringify(result.data));
                notifications.show('Successfully logged in', { severity: 'success' });
            }
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const createUserHook = async (user: UserDTO): Promise<UserDTO> => {
        setLoading(true);
        try {
            const result = await createUser(user);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to create user");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getUsersHook = async (): Promise<UserDTO[]> => {
        setLoading(true);
        try {
            const result = await getUsers();
            if (result.data) {
                setResponse(result.data);
                setUsers(new Map(result.data.filter((user) => user.id !== undefined).map((user) => [user.id as number, user])));
                return result.data;
            }
            throw new Error(result.message || "Failed to get users");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getUserHook = async (id: number): Promise<UserDTO> => {
        setLoading(true);
        try {
            const result = await getUserById(id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to get user");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateUserHook = async (user: UserDTO): Promise<UserDTO> => {
        setLoading(true);
        try {
            const result = await updateUser(user);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to update user");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteUserHook = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await deleteUser(id);
            setResponse(null);
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return {
        response,
        error,
        loading,
        users,
        registerUser: registerUserHook,
        loginUser: loginUserHook,
        createUser: createUserHook,
        getCurrentUser,
        getUsers: getUsersHook,
        getUser: getUserHook,
        updateUser: updateUserHook,
        deleteUser: deleteUserHook
    };
};

export default useUser;