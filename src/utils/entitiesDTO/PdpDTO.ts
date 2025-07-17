import HoraireDeTravaille from '../pdp/HoraireDeTravaille';
import MiseEnDisposition from '../pdp/MiseEnDisposition';
import type { DocumentDTO } from './DocumentDTO'; // CHECK THIS FUCKING PATH


export interface PdpDTO 
extends DocumentDTO 

/*   private Date dateInspection;
    private Date icpdate;
    private Date datePrevenirCSSCT; // ✅ Notification date for CSSCT (if required)
    private Date datePrev; // ✅ Planned date for something (depends on business rules)

    private String horairesDetails;
    private Long entrepriseDInspection;

    private HoraireDeTravaille horaireDeTravail;
    private MisesEnDisposition misesEnDisposition; */
{

  dateInspection?: Date; // ✅ Date of inspection
  icpdate?: Date; // ✅ Date of ICP (Intervention Control Plan)
  datePrevenirCSSCT?: Date; // ✅ Notification date for CSSCT (if required)
  datePrev?: Date; // ✅ Planned date for something (depends on business rules)
  horairesDetails?: string; // ✅ Details about working hours
  entrepriseDInspection?: number; // ✅ ID of the inspection company
  horaireDeTravail?: HoraireDeTravaille; // ✅ ID of the working hours
  misesEnDisposition?: MiseEnDisposition; // ✅ ID of the provisions made
    
}
