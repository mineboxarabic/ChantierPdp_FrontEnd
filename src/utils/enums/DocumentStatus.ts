export enum DocumentStatus {
    DRAFT = "DRAFT", // If the document does not have a chantier.
    ACTIVE = "ACTIVE", // Currently valid and fully signed (if required) and has chantier + Chantier is not canceled or completed + no permits are needed
    COMPLETED = "COMPLETED", // The associated work/chantier is completed
    EXPIRED = "EXPIRED", // If it's been over a year since the creation //TODO: Work on expired
    CANCELED = "CANCELED", // If the chantier is canceled
    NEEDS_ACTION = "NEEDS_ACTION", // Requires signatures or other validation
}