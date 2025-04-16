// useBdt.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { BDT } from "../utils/entities/BDT.ts";
import ObjectAnswered from "../utils/pdp/ObjectAnswered.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";

// Function to get all BDTs
export const getAllBDTs = async (): Promise<ApiResponse<BDT[]>> => {
    return fetchApi<BDT[]>(
        "api/bdt/all",
        "GET",
        null,
        [
            { status: 404, message: "Error BDTs not found" },
            { status: -1, message: "Error while getting BDTs" }
        ]
    );
};

// Function to save/update a BDT
export const saveBDT = async (bdt: BDT, id: number): Promise<ApiResponse<BDT>> => {
    return fetchApi<BDT>(
        `api/bdt/${id}`,
        "PATCH",
        bdt,
        [
            { status: 409, message: "Error BDT already exists" },
            { status: 404, message: "Error BDT or API link not found" }
        ]
    );
};

// Function to get a BDT by ID
export const getBDTById = async (id: number): Promise<ApiResponse<BDT>> => {
    return fetchApi<BDT>(
        `api/bdt/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "Error BDT not found" },
            { status: -1, message: "Error while getting BDT" }
        ]
    );
};

// Function to create a new BDT
export const createBDT = async (bdtData: BDT): Promise<ApiResponse<BDT>> => {
    return fetchApi<BDT>(
        "api/bdt/",
        "POST",
        bdtData,
        [
            { status: 409, message: "Error BDT already exists" },
            { status: 404, message: "Error BDT or API link not found" }
        ]
    );
};

// Function to delete a BDT
export const deleteBDT = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/bdt/${id}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BDT not found" }
        ]
    );
};

// Function to link a risk to a BDT
export const linkRisqueToBDT = async (risqueId: number, bdtId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/bdt/${bdtId}/risque/${risqueId}`,
        "POST",
        null,
        [
            { status: 404, message: "Error BDT or risque not found" }
        ]
    );
};

// Function to link an audit to a BDT
export const linkAuditToBDT = async (bdtId: number, auditId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/bdt/${bdtId}/audit/${auditId}`,
        "POST",
        null,
        [
            { status: 404, message: "Error BDT or audit not found" }
        ]
    );
};

// Function to unlink a risk from a BDT
export const unlinkRisqueToBDT = async (bdtId: number, risqueId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/bdt/${bdtId}/risque/${risqueId}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BDT or risque not found" }
        ]
    );
};

// Function to unlink an audit from a BDT
export const unlinkAuditToBDT = async (bdtId: number, auditId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/bdt/${bdtId}/audit/${auditId}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Error BDT or audit not found" }
        ]
    );
};

// React hook that uses the API functions
const useBdt = () => {
    const [response, setResponse] = useState<BDT | BDT[] | boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [bdts, setBdts] = useState<Map<number, BDT>>(new Map<number, BDT>());

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
    const getAllBDTsHook = async (): Promise<BDT[]> => {
        return executeApiCall(
            () => getAllBDTs(),
            "Error while getting BDTs",
            (data: BDT[]) => {
                setResponse(data);
                const updatedBdts = new Map<number, BDT>();
                data.forEach((bdt: BDT) => {
                    if (bdt.id !== undefined) {
                        updatedBdts.set(bdt.id, bdt);
                    }
                });
                setBdts(updatedBdts);
            }
        );
    };

    const saveBDTHook = async (bdt: BDT, id: number): Promise<BDT> => {
        return executeApiCall(
            () => saveBDT(bdt, id),
            "Error while saving BDT",
            (data: BDT) => {
                setResponse(data);
            }
        );
    };

    const getBDTHook = async (id: number): Promise<BDT> => {
        return executeApiCall(
            () => getBDTById(id),
            "Error while getting BDT",
            (data: BDT) => {
                setResponse(data);
            }
        );
    };

    const createBDTHook = async (bdtData: BDT): Promise<BDT> => {
        return executeApiCall(
            () => createBDT(bdtData),
            "Error while creating BDT",
            (data: BDT) => {
                setResponse(data);
            }
        );
    };

    const deleteBDTHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteBDT(id),
            "Error while deleting BDT",
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

    const linkRisqueToBDTHook = async (risqueId: number, bdtId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkRisqueToBDT(risqueId, bdtId),
            "Error while linking risk to BDT"
        );
    };

    const linkAuditToBDTHook = async (bdtId: number, auditId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkAuditToBDT(bdtId, auditId),
            "Error while linking audit to BDT"
        );
    };

    const unlinkRisqueToBDTHook = async (bdtId: number, risqueId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => unlinkRisqueToBDT(bdtId, risqueId),
            "Error while unlinking risk from BDT"
        );
    };

    const unlinkAuditToBDTHook = async (bdtId: number, auditId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => unlinkAuditToBDT(bdtId, auditId),
            "Error while unlinking audit from BDT"
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