export enum ChantierStatus {
    PENDING_PDP = "PENDING_PDP", // If no Active PDP is linked to the chantier
    PENDING_BDT = "PENDING_BDT", // If PDP is not required and BDT is not present
    ACTIVE = "ACTIVE", // No PDP required Or PDP is active and BDT present and signed (Completed)
    COMPLETED = "COMPLETED", // This completed is for the chantier (So that we know the chantier of this is completed)
    CANCELED = "CANCELED", // If the chantier is canceled
    INACTIVE_TODAY = "INACTIVE_TODAY", // BDT is not present or not signed

    // Might Add in the future
    // EXPIRED = "EXPIRED", // If the chantier is expired
    // SUSPENDED = "SUSPENDED", // If the chantier is suspended
}