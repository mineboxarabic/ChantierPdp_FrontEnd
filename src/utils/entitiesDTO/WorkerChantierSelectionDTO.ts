export interface WorkerChantierSelectionDTO 
{

  id?: number;
  worker?: number;
  chantier?: number;
  selectionDate?: Date;
  isSelected?: boolean;
  selectionNote?: string;
  selectedBy?: number;

}
