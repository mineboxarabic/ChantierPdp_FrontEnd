// usePdp.ts
import { useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { Pdp } from "../utils/entities/Pdp.ts";
import { PdpDTO } from "../utils/entitiesDTO/PdpDTO.ts";
import ObjectAnswered from "../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../utils/pdp/ObjectAnsweredEntreprises.ts";
import ObjectAnsweredObjects from "../utils/ObjectAnsweredObjects.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";

type PdpResponse = PdpDTO | PdpDTO[] | number | boolean | null;

// Function to save/update a PDP
export const savePdp = async (pdp: PdpDTO, id: number): Promise<ApiResponse<PdpDTO>> => {
    return fetchApi<PdpDTO>(
        `api/pdp/${id}`,
        'PATCH',
        pdp,
        [
            {
                status: 409,
                message: 'SavePdp : Error pdps already exists',
            },
            {
                status: 404,
                message: 'SavePdp : Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'SavePdp : Error while saving pdps',
            }
        ]
    );
};

// Function to get a PDP by ID
export const getPdpById = async (id: number): Promise<ApiResponse<PdpDTO>> => {
    return fetchApi<PdpDTO>(
        `api/pdp/${id}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// Function to get all PDPs
export const getAllPDPs = async (): Promise<ApiResponse<PdpDTO[]>> => {
    return fetchApi<PdpDTO[]>(
        'api/pdp/all',
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// Function to create a new PDP
export const createPdp = async (pdpData: PdpDTO): Promise<ApiResponse<PdpDTO>> => {
    return fetchApi<PdpDTO>(
        'api/pdp/',
        'POST',
        pdpData,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to delete a PDP
export const deletePdp = async (id: number): Promise<ApiResponse<void>> => {
    return fetchApi<void>(
        `api/pdp/${id}`,
        'DELETE',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to get the last PDP ID
export const getLastId = async (): Promise<ApiResponse<number>> => {
    return fetchApi<number>(
        'api/pdp/last',
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting last pdps',
            }
        ]
    );
};

// Function to get recent PDPs
export const getRecentPdps = async (): Promise<ApiResponse<PdpDTO[]>> => {
    return fetchApi<PdpDTO[]>(
        'api/pdp/recent',
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting last pdps',
            }
        ]
    );
};

// Function to link a risk to a PDP
export const linkRisqueToPdp = async (risqueId: number, pdpId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/risque/${risqueId}`,
        'POST',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to link a device to a PDP
export const linkDispositifToPdp = async (dispositifId: number, pdpId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/dispositif/${dispositifId}`,
        'POST',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to link an analysis to a PDP
export const linkAnalyseToPdp = async (analyseId: number, pdpId: number): Promise<ApiResponse<ObjectAnsweredEntreprises>> => {
    return fetchApi<ObjectAnsweredEntreprises>(
        `api/pdp/${pdpId}/analyse/${analyseId}`,
        'POST',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to link a permit to a PDP
export const linkPermitToPdp = async (permitId: number, pdpId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/permit/${permitId}`,
        'POST',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to unlink a permit from a PDP
export const unlinkPermitFromPdp = async (permitId: number, pdpId: number): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/permit/${permitId}`,
        'DELETE',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to unlink an object from a PDP
export const unlinkObjectFromPdp = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnswered>> => {
    console.log('unlinkObjectFromPdp', objectId, pdpId, type);
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/object/${objectId}/type/${type.toString()}`,
        'DELETE',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: 400,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to link an object to a PDP
export const linkObjectToPdp = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnswered>> => {
    return fetchApi<ObjectAnswered>(
        `api/pdp/${pdpId}/object/${objectId}/type/${type.toString()}`,
        'POST',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};

// Function to check if a PDP exists
export const existPdp = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/pdp/exist${id}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// Function to unlink an analysis from a PDP
export const unlinkAnalyseToPdp = async (analyseId: number, pdpId: number): Promise<ApiResponse<ObjectAnsweredEntreprises>> => {
    return fetchApi<ObjectAnsweredEntreprises>(
        `api/pdp/${pdpId}/analyse/${analyseId}`,
        'DELETE',
        null,
        [
            {
                status: 409,
                message: 'Error pdps already exists',
            },
            {
                status: 404,
                message: 'Error pdps or api link not found',
            }
        ]
    );
};


// Function to get objectAnswered for a pdp with a type
export const getObjectAnswered = async (pdpId:number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnswered[]>> => {
    return fetchApi<ObjectAnswered[]>(
        `api/pdp/${pdpId}/objectAnswered/${type.toString()}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'Error pdps not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// React hook that uses the API functions
const usePdp = () => {
    const [response, setResponse] = useState<PdpResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number | null>(null);
    const [pdps, setPdps] = useState<Map<number, PdpDTO>>(new Map<number, PdpDTO>());

    const notifications = useNotifications();

    // Helper function to handle API calls with common error handling
    const executeApiCall = async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        errorMessage: string,
        successAction?: (data: T) => void
    ): 
    
    Promise<T> => {
        setLoading(true);
        try {
            const result = await apiCall();
            if (result.data !== undefined) {
                setResponse(result.data as PdpResponse);
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
    const savePdpHook = async (pdp: PdpDTO, id: number): Promise<PdpDTO> => {
        return executeApiCall(
            () => savePdp(pdp, id),
            "Error while saving PDP"
        );
    };

    const getPlanDePreventionHook = async (id: number): Promise<PdpDTO> => {
        return executeApiCall(
            () => getPdpById(id),
            "Error while getting PDP"
        );
    };

    const getAllPDPsHook = async (): Promise<PdpDTO[]> => {
        return executeApiCall(
            () => getAllPDPs(),
            "Error while getting PDPs",
            (data: PdpDTO[]) => {
                const updatedPdps = new Map<number, PdpDTO>();
                data.forEach(pdp => {
                    if (pdp.id !== undefined) {
                        updatedPdps.set(pdp.id, pdp);
                    }
                });
                setPdps(updatedPdps);
            }
        );
    };

    const createPdpHook = async (pdpData: PdpDTO): Promise<PdpDTO> => {
        return executeApiCall(
            () => createPdp(pdpData),
            "Error while creating PDP"
        );
    };

    const deletePdpHook = async (id: number): Promise<void> => {
        await executeApiCall(
            () => deletePdp(id),
            "Error while deleting PDP"
        );
    };

    const getLastIdHook = async (): Promise<number> => {
        return executeApiCall(
            () => getLastId(),
            "Error while getting last PDP ID"
        );
    };

    const getRecentPdpsHook = async (): Promise<PdpDTO[]> => {
        return executeApiCall(
            () => getRecentPdps(),
            "Error while getting recent PDPs"
        );
    };

    const linkRisqueToPdpHook = async (risqueId: number, pdpId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkRisqueToPdp(risqueId, pdpId),
            "Error while linking risk to PDP"
        );
    };

    const linkDispositifToPdpHook = async (dispositifId: number, pdpId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkDispositifToPdp(dispositifId, pdpId),
            "Error while linking device to PDP"
        );
    };

    const linkAnalyseToPdpHook = async (analyseId: number, pdpId: number): Promise<ObjectAnsweredEntreprises> => {
        return executeApiCall(
            () => linkAnalyseToPdp(analyseId, pdpId),
            "Error while linking analysis to PDP"
        );
    };

    const linkPermitToPdpHook = async (permitId: number, pdpId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkPermitToPdp(permitId, pdpId),
            "Error while linking permit to PDP"
        );
    };

    const unlinkPermitFromPdpHook = async (permitId: number, pdpId: number): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => unlinkPermitFromPdp(permitId, pdpId),
            "Error while unlinking permit from PDP"
        );
    };

    const unlinkObjectFromPdpHook = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => unlinkObjectFromPdp(objectId, pdpId, type),
            "Error while unlinking object from PDP"
        );
    };

    const linkObjectToPdpHook = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnswered> => {
        return executeApiCall(
            () => linkObjectToPdp(objectId, pdpId, type),
            "Error while linking object to PDP"
        );
    };

    const existPdpHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => existPdp(id),
            "Error while checking if PDP exists"
        );
    };

    const unlinkAnalyseToPdpHook = async (analyseId: number, pdpId: number): Promise<ObjectAnsweredEntreprises> => {
        return executeApiCall(
            () => unlinkAnalyseToPdp(analyseId, pdpId),
            "Error while unlinking analysis from PDP"
        );
    };

    const getObjectAnsweredHook = async (pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnswered[]> => {
        return executeApiCall(
            () => getObjectAnswered(pdpId, type),
            "Error while getting object answered"
        );
    };

    return {
        loading,
        error,
        response,
        lastId,
        pdps,
        savePdp: savePdpHook,
        getPlanDePrevention: getPlanDePreventionHook,
        getAllPDPs: getAllPDPsHook,
        createPdp: createPdpHook,
        deletePdp: deletePdpHook,
        getLastId: getLastIdHook,
        getRecentPdps: getRecentPdpsHook,
        linkRisqueToPdp: linkRisqueToPdpHook,
        linkDispositifToPdp: linkDispositifToPdpHook,
        linkAnalyseToPdp: linkAnalyseToPdpHook,
        linkPermitToPdp: linkPermitToPdpHook,
        unlinkPermitFromPdp: unlinkPermitFromPdpHook,
        unlinkObjectFromPdp: unlinkObjectFromPdpHook,
        linkObjectToPdp: linkObjectToPdpHook,
        existPdp: existPdpHook,
        unlinkAnalyseToPdp: unlinkAnalyseToPdpHook,
        getObjectAnswered: getObjectAnsweredHook,
    };
};

export default usePdp;