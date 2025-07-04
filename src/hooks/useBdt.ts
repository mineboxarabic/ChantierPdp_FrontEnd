// useBdt.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import ObjectAnsweredDTO from "../utils/pdp/ObjectAnswered.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";

// Function to get all BDTs
export const getAllBDTs = async (): Promise<ApiResponse<BdtDTO[]>> => {
    return fetchApi<BdtDTO[]>(
        "api/bdt/all",
        "GET",
        null,
        [
            { status: 404, message: "Error BDTs not found" },
            { status: -1, message: "Error while getting BDTs" }
        ]
    );
};

// Function to save/update a BdtDTO
export const saveBDT = async (bdt: BdtDTO, id: number): Promise<ApiResponse<BdtDTO>> => {
    return fetchApi<BdtDTO>(
        `api/bdt/${id}`,
        "PATCH",
        bdt,
        [
            { status: 409, message: "Error BdtDTO already exists" },
            { status: 404, message: "Error BdtDTO or API link not found" }
        ]
    );
};

// Function to get a BdtDTO by ID
export const getBDTById = async (id: number): Promise<ApiResponse<BdtDTO>> => {
    return fetchApi<BdtDTO>(
        `api/bdt/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "Error BdtDTO not found" },
            { status: -1, message: "Error while getting BdtDTO" }
        ]
    );
};

// Function to create a new BdtDTO
export const createBDT = async (bdtData: BdtDTO): Promise<ApiResponse<BdtDTO>> => {
    return fetchApi<BdtDTO>(
        "api/bdt",
        "POST",
        bdtData,
        [
            { status: 409, message: "Error BdtDTO already exists" },
            { status: 404, message: "Error BdtDTO or API link not found" }
        ]
    );
};

// Function to delete a BdtDTO
export const deleteBDT = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/bdt/${id}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BdtDTO not found" }
        ]
    );
};

// Function to link a risk to a BdtDTO
export const linkRisqueToBDT = async (risqueId: number, bdtId: number): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/bdt/${bdtId}/risque/${risqueId}`,
        "POST",
        null,
        [
            { status: 404, message: "Error BdtDTO or risque not found" }
        ]
    );
};

// Function to link an audit to a BdtDTO
export const linkAuditToBDT = async (bdtId: number, auditId: number): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/bdt/${bdtId}/audit/${auditId}`,
        "POST",
        null,
        [
            { status: 404, message: "Error BdtDTO or audit not found" }
        ]
    );
};

// Function to unlink a risk from a BdtDTO
export const unlinkRisqueToBDT = async (bdtId: number, risqueId: number): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/bdt/${bdtId}/risque/${risqueId}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BdtDTO or risque not found" }
        ]
    );
};

// Function to unlink an audit from a BdtDTO
export const unlinkAuditToBDT = async (bdtId: number, auditId: number): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/bdt/${bdtId}/audit/${auditId}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BdtDTO or audit not found" }
        ]
    );
};

// React hook that uses the API functions
const useBdt = () => {
    const [response, setResponse] = useState<BdtDTO | BdtDTO[] | boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [bdts, setBdts] = useState<Map<number, BdtDTO>>(new Map<number, BdtDTO>());

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
    const getAllBDTsHook = async (): Promise<BdtDTO[]> => {
        return executeApiCall(
            () => getAllBDTs(),
            "Error while getting BDTs",
            (data: BdtDTO[]) => {
                setResponse(data);
                const updatedBdts = new Map<number, BdtDTO>();
                data.forEach((bdt: BdtDTO) => {
                    if (bdt.id !== undefined) {
                        updatedBdts.set(bdt.id, bdt);
                    }
                });
                setBdts(updatedBdts);
            }
        );
    };

    const saveBDTHook = async (bdt: BdtDTO, id: number): Promise<BdtDTO> => {
        return executeApiCall(
            () => saveBDT(bdt, id),
            "Error while saving BdtDTO",
            (data: BdtDTO) => {
                setResponse(data);
            }
        );
    };

    const getBDTHook = async (id: number): Promise<BdtDTO> => {
        return executeApiCall(
            () => getBDTById(id),
            "Error while getting BdtDTO",
            (data: BdtDTO) => {
                setResponse(data);
            }
        );
    };

    const createBDTHook = async (bdtData: BdtDTO): Promise<BdtDTO> => {
        return executeApiCall(
            () => createBDT(bdtData),
            "Error while creating BdtDTO",
            (data: BdtDTO) => {
                setResponse(data);
            }
        );
    };

    const deleteBDTHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteBDT(id),
            "Error while deleting BdtDTO",
            () => {
                // Remove from local state if needed
                if (bdts.has(id)) {
                    const updatedBdts = new Map(bdts);
                    updatedBdts.delete(id);
                    setBdts(updatedBdts);
                }
                return true;
            }
        );
    };

    const linkRisqueToBDTHook = async (risqueId: number, bdtId: number): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => linkRisqueToBDT(risqueId, bdtId),
            "Error while linking risk to BdtDTO"
        );
    };

    const linkAuditToBDTHook = async (bdtId: number, auditId: number): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => linkAuditToBDT(bdtId, auditId),
            "Error while linking audit to BdtDTO"
        );
    };

    const unlinkRisqueToBDTHook = async (bdtId: number, risqueId: number): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => unlinkRisqueToBDT(bdtId, risqueId),
            "Error while unlinking risk from BdtDTO"
        );
    };

    const unlinkAuditToBDTHook = async (bdtId: number, auditId: number): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => unlinkAuditToBDT(bdtId, auditId),
            "Error while unlinking audit from BdtDTO"
        );
    };

    return {
        loading,
        error,
        response,
        bdts,
        getAllBDTs: getAllBDTsHook,
        saveBDT: saveBDTHook,
        getBDT: getBDTHook,
        createBDT: createBDTHook,
        deleteBDT: deleteBDTHook,
        linkRisqueToBDT: linkRisqueToBDTHook,
        linkAuditToBDT: linkAuditToBDTHook,
        unlinkRisqueToBDT: unlinkRisqueToBDTHook,
        unlinkAuditToBDT: unlinkAuditToBDTHook
    };
};

export default useBdt;