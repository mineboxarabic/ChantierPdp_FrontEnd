// usePdp.ts
import { useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { Pdp } from "../utils/entities/Pdp.ts";
import { PdpDTO } from "../utils/entitiesDTO/PdpDTO.ts";
import ObjectAnsweredDTO from "../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../utils/pdp/ObjectAnsweredEntreprises.ts";
import ObjectAnsweredObjects from "../utils/ObjectAnsweredObjects.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";

type PdpResponse = PdpDTO | PdpDTO[] | number | boolean | null;

// Function to save/update a PDP
export const savePdp = async (pdp: PdpDTO, id: number): Promise<ApiResponse<PdpDTO>> => {
    console.log("Saving PDP with IDxxx:", pdp);
    return fetchApi<PdpDTO>(
        `api/pdp/${id}`,
        'PATCH',
        JSON.stringify(pdp),
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
    console.log("Creating PDP with data:", pdpData);
    return fetchApi<PdpDTO>(
        'api/pdp/',
        'POST',
        JSON.stringify(pdpData),
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


/*    @PostMapping("/{pdpId}/object-answred/type/{objectType}")
    public ResponseEntity<ApiResponse<ObjectAnswered>> addObjectToPdp(@PathVariable Long pdpId, @RequestBody ObjectAnswered objectAnswered, @PathVariable ObjectAnsweredObjects objectType)
    {
        return ResponseEntity.ok(new ApiResponse<>(pdpService.addObjectAnswered(pdpId, objectAnswered,objectType), "Object added to pdp successfully"));
    }

    @DeleteMapping("/{pdpId}/object-answered/{objectId}/type/{objectType}")
    public ResponseEntity<ApiResponse<ObjectAnswered>> removeObjectFromPdp(@PathVariable Long pdpId, @PathVariable Long objectId, @PathVariable ObjectAnsweredObjects objectType)
    {
        return ResponseEntity.ok(new ApiResponse<>(pdpService.removeObjectAnswered(pdpId, objectId,objectType), "Object removed from pdp successfully"));
    }

    @PostMapping("/{pdpId}/object-answered/multiple/type/{objectType}")
    public ResponseEntity<ApiResponse<List<ObjectAnswered>>> addMultipleObjectsToPdp(@PathVariable Long pdpId, @RequestBody List<ObjectAnswered> objectAnswereds, @PathVariable ObjectAnsweredObjects objectType){
        return ResponseEntity.ok(new ApiResponse<List<ObjectAnswered>>(pdpService.addMultipleObjectsToPdp(pdpId, objectAnswereds, objectType), "Multiple objects are linked"));
    }


    //Make a get to get teh risques of a pdp
    @GetMapping("/{pdpId}/object-answered/{objectType}")
    public ResponseEntity<ApiResponse<List<ObjectAnswered>>> getObjectAnsweredByPdpId(@PathVariable Long pdpId, @PathVariable ObjectAnsweredObjects objectType) {
        return ResponseEntity.ok(new ApiResponse<>(pdpService.getObjectAnsweredByPdpId(pdpId, objectType), "items fetched"));
    }

    @PostMapping("/{pdpId}/object-answered/type/{objectType}")
    public ResponseEntity<ApiResponse<List<ObjectAnswered>>> removeMultipleObjectsFromPdp(@PathVariable Long pdpId, @RequestBody List<Long> objectIds, @PathVariable ObjectAnsweredObjects objectType)
    {
        return ResponseEntity.ok(new ApiResponse<>(pdpService.removeMultipleObjectsFromPdp(pdpId, objectIds,objectType), "feij"));
    } */

// Function to link an object to a PDP
export const linkObjectToPdp = async (pdpId: number,objectId: number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/pdp/${pdpId}/object-answered/${objectId}/type/${type.toString()}`,
        'POST',
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// Function to unlink an object from a PDP
export const unlinkObjectFromPdp = async (pdpId: number, objectId: number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnsweredDTO>> => {
    return fetchApi<ObjectAnsweredDTO>(
        `api/pdp/${pdpId}/object-answered/${objectId}/type/${type.toString()}`,
        'DELETE',
        null,
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
}


// Function to link multiple objects to a PDP
export const linkMultipleObjectsToPdp = async (pdpId: number, objectAnswereds: ObjectAnsweredDTO[], type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnsweredDTO[]>> => {
    return fetchApi<ObjectAnsweredDTO[]>(
        `api/pdp/${pdpId}/object-answered/multiple/type/${type.toString()}`,
        'POST',
        objectAnswereds,
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
            }
        ]
    );
};

// Function to unlink multiple objects from a PDP
export const unlinkMultipleObjectsFromPdp = async (pdpId: number, objectIds: number[], type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnsweredDTO[]>> => {
    return fetchApi<ObjectAnsweredDTO[]>(
        `api/pdp/${pdpId}/object-answered/mutiple/type/${type.toString()}`,
        'POST',
        objectIds,
        [
            {
                status: 404,
                message: 'Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'Error while getting pdps',
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



// Function to get objectAnswered for a pdp with a type
export const getObjectAnswereds = async (pdpId:number, type: ObjectAnsweredObjects): Promise<ApiResponse<ObjectAnsweredDTO[]>> => {
    return fetchApi<ObjectAnsweredDTO[]>(
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
                console.log("API call successful:", result.data);
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

    // const unlinkObjectFromPdpHook = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnswered> => {
    //     return executeApiCall(
    //         () => unlinkObjectFromPdp(objectId, pdpId, type),
    //         "Error while unlinking object from PDP"
    //     );
    // };

    // const linkObjectToPdpHook = async (objectId: number, pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnswered> => {
    //     return executeApiCall(
    //         () => linkObjectToPdp(objectId, pdpId, type),
    //         "Error while linking object to PDP"
    //     );
    // };


    const unlinkObjectFromPdpHook = async (pdpId: number, objectId: number, type: ObjectAnsweredObjects): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => unlinkObjectFromPdp(pdpId, objectId, type),
            "Error while unlinking object from PDP"
        );
    };

    const linkObjectToPdpHook = async (pdpId: number, objectId: number, type: ObjectAnsweredObjects): Promise<ObjectAnsweredDTO> => {
        return executeApiCall(
            () => linkObjectToPdp(pdpId, objectId, type),
            "Error while linking object to PDP"
        );
    };

    const linkMultipleObjectsToPdpHook = async (pdpId: number, objectAnswereds: ObjectAnsweredDTO[], type: ObjectAnsweredObjects): Promise<ObjectAnsweredDTO[]> => {
        return executeApiCall(
            () => linkMultipleObjectsToPdp(pdpId, objectAnswereds, type),
            "Error while linking multiple objects to PDP"
        );
    }

    const unlinkMultipleObjectsFromPdpHook = async (pdpId: number, objectIds: number[], type: ObjectAnsweredObjects): Promise<ObjectAnsweredDTO[]> => {
        return executeApiCall(
            () => unlinkMultipleObjectsFromPdp(pdpId, objectIds, type),
            "Error while unlinking multiple objects from PDP"
        );
    };


    const existPdpHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => existPdp(id),
            "Error while checking if PDP exists"
        );
    };

    


    const getObjectAnsweredHook = async (pdpId: number, type: ObjectAnsweredObjects): Promise<ObjectAnsweredDTO[]> => {
        return executeApiCall(
            () => getObjectAnswereds(pdpId, type),
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
        unlinkObjectFromPdp: unlinkObjectFromPdpHook,
        linkObjectToPdp: linkObjectToPdpHook,

        linkMultipleObjectsToPdp: linkMultipleObjectsToPdpHook,
        unlinkMultipleObjectsFromPdp: unlinkMultipleObjectsFromPdpHook,
        
        existPdp: existPdpHook,
        getObjectAnswered: getObjectAnsweredHook,
    };
};

export default usePdp;