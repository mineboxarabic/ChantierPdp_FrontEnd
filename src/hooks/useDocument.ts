

import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import fetchApi, { ApiResponse } from "../api/fetchApi";

export interface SignatureRequestDTO {
  workerId: number;
  documentId: number;
  userId: number;
  name: string;
  lastName: string;
  signatureImage: string; // Base64 encoded image
}

type DocumentResult = string | number | null;

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

  // GET /api/document/{documentId}/signatures
  const getSignaturesByDocumentId = async (documentId: number) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchApi<any[]>(
        `/api/document/${documentId}/signatures`,
        "GET",
        null,
        [
          { status: 500, message: "Internal server error" },
        ]
      );
      console.log('useDocument: Signatures fetched:', res.data);
      setResult(res.data ?? null as any);
      // Don't show success notification for GET requests - too noisy
      return res;
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
    getSignaturesByDocumentId,
  };
};

export default useDocument;