import type { ImageModel } from '../image/ImageModel'; // CHECK THIS FUCKING PATH


export interface DocumentSignatureDTO 
{

  documentId?: number; // ID of the Document (Pdp, Bdt, etc.)
  workerId?: number; // ID of the Worker who signed
  workerName?: string; // Optional: For display purposes on the frontend
  signatureVisual?: ImageModel; // The visual signature data
  signerRole?: string; // Optional: Role during signing (e.g., "ChargeDeTravail")
  active?: boolean; // Status of the signature

}
