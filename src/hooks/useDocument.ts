

import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import fetchApi from "../api/fetchApi";
import { ImageModel } from "../utils/image/ImageModel";

export interface SignatureRequestDTO {
  workerId: number | null;
  documentId: number;
  userId: number | null; // Null if signed by worker
  prenom: string;
  nom: string;
  signatureImage: string; // Base64 encoded image
}

export interface SignatureResponseDTO {
  id: number;
  workerId: number | null; // Null if signed by user
  userId: number | null; // Null if signed by worker
  documentId: number;
  prenom: string;
  nom: string;
  signatureImage: ImageModel; // Base64 encoded image
  signatureDate: Date;
}

type DocumentResult = string | number | null | SignatureResponseDTO[] | SignatureResponseDTO;

const useDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentResult>(null);
  const notifications = useNotifications();

  // POST /api/document/worker/sign
  const signDocumentByWorker = async (signatureRequest: SignatureRequestDTO) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    console.log('useDocument: Sending signature request to API:', signatureRequest);
    
    try {
      const res = await fetchApi<number>(
        "/api/document/worker/sign",
        "POST",
        signatureRequest,
        [
          { status: 400, message: "Bad request - Please check the data format" },
          { status: 404, message: "Worker or document not found" },
          { status: 500, message: "Internal server error" },
        ]
      );
      console.log('useDocument: API response:', res);
      setResult(res.data ?? null);
      notifications.show(res.message || "Document signed by worker successfully", { severity: "success" });
      return res;
    } catch (e: any) {
      console.error('useDocument: API error details:', e);
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // POST /api/document/user/sign
  const signDocumentByUser = async (signatureRequest: SignatureRequestDTO) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<number>(
        "/api/document/user/sign",
        "POST",
        signatureRequest,
        [
          { status: 400, message: "Bad request" },
          { status: 500, message: "Internal server error" },
        ]
      );
      setResult(res.data ?? null);
      notifications.show(res.message || "Document signed by user successfully", { severity: "success" });
      return res;
    } catch (e: any) {
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };


  // DELETE /api/document/user/{userId}/unsign/{signatureId}
  const unsignDocumentByUser = async (userId: number, signatureId: number) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<string>(
        `/api/document/user/${userId}/unsign/${signatureId}`,
        "DELETE",
        null,
        [
          { status: 400, message: "Bad request" },
          { status: 500, message: "Internal server error" },
        ]
      );
      setResult(res.data ?? null);
      notifications.show(res.message || "Document unsigned by user successfully", { severity: "success" });
      return res;
    } catch (e: any) {
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };


    // DELETE /api/document/user/{userId}/unsign/{signatureId}
  const unsignDocumentByWorker = async (workerId: number, signatureId: number) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<string>(
        `/api/document/worker/${workerId}/unsign/${signatureId}`,
        "DELETE",
        null,
        [
          { status: 400, message: "Bad request" },
          { status: 500, message: "Internal server error" },
        ]
      );
      setResult(res.data ?? null);
      notifications.show(res.message || "Document unsigned by worker successfully", { severity: "success" });
      return res;
    } catch (e: any) {
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };


  // GET /api/document/{documentId}/signatures
  const getSignaturesByDocumentId = async (documentId: number):Promise<SignatureResponseDTO[]> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<SignatureResponseDTO[]>(
        `/api/document/${documentId}/signatures`,
        "GET",
        null,
        [
          { status: 500, message: "Internal server error" },
        ]
      );
      console.log('useDocument: Signatures fetched:', res.data);
      console.log('useDocument: Individual signature objects:', res.data?.map((sig, index) => ({ 
        index, 
        signature: sig, 
        keys: Object.keys(sig || {}),
        fullObject: JSON.stringify(sig, null, 2)
      })));
      setResult(res.data as SignatureResponseDTO[]);
      // Don't show success notification for GET requests - too noisy
      return res.data as SignatureResponseDTO[];
    } catch (e: any) {
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // POST /api/document/{documentId}/duplicate
  const duplicateDocument = async (documentId: number) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<any>(
        `/api/document/${documentId}/duplicate`,
        "POST",
        null,
        [
          { status: 400, message: "Document cannot be duplicated" },
          { status: 404, message: "Document not found" },
          { status: 500, message: "Internal server error" },
        ]
      );
      setResult(res.data);
      notifications.show(res.message || "Document duplicated successfully", { severity: "success" });
      return res.data;
    } catch (e: any) {
      setError(e.message);
      notifications.show(e.message, { severity: "error" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    result,
    signDocumentByWorker,
    signDocumentByUser,
    unsignDocumentByUser,
    unsignDocumentByWorker,
    getSignaturesByDocumentId,
    duplicateDocument
  };
};

export default useDocument;