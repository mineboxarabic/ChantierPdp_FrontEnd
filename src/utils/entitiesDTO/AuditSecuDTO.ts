import InfoDeBase from "../InfoDeBase.ts";
import AuditType from "../AuditType.ts";

export class AuditSecuDTO extends InfoDeBase{
    typeOfAudit?: AuditType; // Enum to distinguish different types of audits
}