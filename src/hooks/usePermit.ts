// usePermit.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import Permit from "../utils/entities/Permit.ts";
import PermitDTO from "../utils/entitiesDTO/PermitDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type PermitResponse = Permit | Permit[] | PermitDTO | PermitDTO[] | boolean | null;

// Utility function to convert Permit to PermitDTO
const convertPermitToDTO = (permit: Permit): PermitDTO => {
    const permitDTO = new PermitDTO(permit.id || 0, permit.title, permit.description, permit.logo);
    permitDTO.type = permit.type;
    permitDTO.pdfData = permit.pdfData;
    return permitDTO;
};

// Function to get a permit by ID
export const getPermitById = async (id: number): Promise<ApiResponse<PermitDTO>> => {
    return fetchApi<PermitDTO>(
        `api/permit/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "GetPermit: Error permit not found" },
            { status: -1, message: "GetPermit: Error while getting permit" }
        ]
    );
};

// Function to get all permits
export const getAllPermits = async (): Promise<ApiResponse<Permit[]>> => {
    return fetchApi<Permit[]>(
        "api/permit",
        "GET",
        null,
        [
            { status: 404, message: "GetAllPermits: Error permits not found" },
            { status: -1, message: "GetAllPermits: Error while getting permits" }
        ]
    );
};

// Function to update a permit
export const updatePermit = async (permit: Permit, id: number): Promise<ApiResponse<Permit>> => {
    return fetchApi<Permit>(
        `api/permit/${id}`,
        "PATCH",
        permit,
        [
            { status: 409, message: "UpdatePermit: Error permit already exists" },
            { status: 404, message: "UpdatePermit: Error permit or API link not found" },
            { status: -1, message: "UpdatePermit: Error while updating permit" }
        ]
    );
};

// Function to delete a permit
export const deletePermit = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/permit/${id}`,
        "DELETE",
        null,
        [
            { status: 409, message: "DeletePermit: Error permit already exists" },
            { status: 404, message: "DeletePermit: Error permit or API link not found" },
            { status: 405, message: "DeletePermit: Error permit not deletable" },
            { status: -1, message: "DeletePermit: Error while deleting permit" }
        ]
    );
};

// Function to create a permit
export const createPermit = async (permit: Permit): Promise<ApiResponse<Permit>> => {
    return fetchApi<Permit>(
        "api/permit",
        "POST",
        permit,
        [
            { status: 409, message: "CreatePermit: Error permit already exists" },
            { status: 404, message: "CreatePermit: Error permit or API link not found" },
            { status: -1, message: "CreatePermit: Error while creating permit" }
        ]
    );
};


// Function to create a risque
export const getPermitsByIds = async (ids:number[]): Promise<ApiResponse<PermitDTO[]>> => {
    return fetchApi<PermitDTO[]>(
        "api/permit/list",
        "POST",
        ids,
        [
            { status: 409, message: "Createpermit: Error permit already exists" },
            { status: 404, message: "Createpermit: Error permit or API link not found" },
            { status: -1, message: "Createpermit: Error while creating permit" }
        ]
    );
};

// React hook that uses the API functions
const usePermit = () => {
    const [response, setResponse] = useState<PermitResponse>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [permits, setPermits] = useState<Map<number, PermitDTO>>(new Map<number, PermitDTO>());

    const notifications = useNotifications();

    // Helper function for handling API calls
    const executeApiCall = async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        errorMessage: string,
        successAction?: (data: T) => void
    ): Promise<T> => {
        setLoading(true);
        try {
            const result = await apiCall();
            if (result.data !== undefined) {
                setResponse(result.data as PermitResponse);
                if (successAction) {
                    successAction(result.data);
                }
                return result.data;
            }
            throw new Error(result.message || errorMessage);
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // Hook methods that wrap the API functions
    const getPermitHook = async (id: number): Promise<PermitDTO> => {
        return executeApiCall(
            () => getPermitById(id),
            "Error while getting permit"
        );
    };

    const getAllPermitsHook = async (): Promise<Permit[]> => {
        return executeApiCall(
            () => getAllPermits(),
            "Error while getting all permits",
            (data: Permit[]) => {
                const updatedPermits = new Map<number, PermitDTO>();
                data.forEach(permit => {
                    if (permit.id !== undefined) {
                        const permitDTO = convertPermitToDTO(permit);
                        updatedPermits.set(permit.id, permitDTO);
                    }
                });
                setPermits(updatedPermits);
            }
        );
    };

    const updatePermitHook = async (permit: Permit, id: number): Promise<Permit> => {
        return executeApiCall(
            () => updatePermit(permit, id),
            "Error while updating permit"
        );
    };

    const deletePermitHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deletePermit(id),
            "Error while deleting permit",
            () => {
                // Remove from local state if needed
                if (permits.has(id)) {
                    const updatedPermits = new Map(permits);
                    updatedPermits.delete(id);
                    setPermits(updatedPermits);
                }
            }
        );
    };

    const createPermitHook = async (permit: Permit): Promise<Permit> => {
        return executeApiCall(
            () => createPermit(permit),
            "Error while creating permit"
        );
    };

    const getPermitsByIdsHook = async (ids: number[]): Promise<PermitDTO[]> => {
        return executeApiCall(
            () => getPermitsByIds(ids),
            "Error while getting permits by ids"
        );
    };

    return {
        loading,
        error,
        response,
        permits,
        getPermit: getPermitHook,
        getAllPermits: getAllPermitsHook,
        updatePermit: updatePermitHook,
        deletePermit: deletePermitHook,
        createPermit: createPermitHook,
        getPermitsByIds: getPermitsByIdsHook,
    };
};

export default usePermit;