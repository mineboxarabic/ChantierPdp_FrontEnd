import type { EntrepriseType } from '../enums/EntrepriseType.ts'; // CHECK THIS FUCKING PATH
import type { ImageModel } from '../image/ImageModel'; // CHECK THIS FUCKING PATH


export interface EntrepriseDTO 
{
  id?: number; // ✅ Unique identifier for the entreprise
  type?: EntrepriseType; // ✅ Defines if it's EU or EE
  nom?: string; // ✅ Name of the company
  image?: ImageModel; // ✅ For storing binary data (e.g., logos)
  pdps?: number[]; // ✅ If this entreprise is an EE, it has PDPs
  bdts?: number[]; // ✅ If this entreprise is an EE, it has BDTs
  workers?: number[]; // ✅ Workers employed by this entreprise
  raisonSociale?: string; // ✅ Legal name of the company
  numTel?: string; // ✅ SIRET number for identification
  address?: string; // ✅ New field for company address
  responsableChantier?: number; // ✅ User ID of the responsible person
}
