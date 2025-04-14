import { useState } from "react";
import useAuditSecu from "../../hooks/useAuditSecu";
import { AuditSecu } from "../../utils/entities/AuditSecu.ts";
import SelectOrCreateObjectAnswered from "./SelectOrCreateObjectAnswered";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";

// You would need to create this component similar to EditRisque
//import EditAuditSecu from "../AuditSecu/EditAuditSecu";

interface SelectOrCreateAuditProps<P> {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentObject: P;
    saveObject: (obj: P) => void;
    setIsChanged: (isChanged: boolean) => void;
    // Function to link an audit to the current object
    linkAuditToObject: (auditId: number, objectId: number) => Promise<any>;
    // Custom handler for when an audit is selected (optional)
    onAuditSelected?: (audit: AuditSecu) => void;
    // Function to get audits from the parent object
    getAudits: (obj: P) => any[] | undefined;
}

function SelectOrCreateAudit<P extends { id?: number }>(props: SelectOrCreateAuditProps<P>) {
    const auditHook = useAuditSecu();
    const [openCreateAudit, setOpenCreateAudit] = useState(false);

    return (
        <SelectOrCreateObjectAnswered<AuditSecu, P>
            open={props.open}
            setOpen={props.setOpen}
            parentObject={props.currentObject}
            saveParentObject={props.saveObject}
            setIsChanged={props.setIsChanged}
            objectType={ObjectAnsweredObjects.AUDIT}
            itemHook={{
                getAllItems: auditHook.getAllAuditSecus
            }}
            linkingHook={{
                linkItem: props.linkAuditToObject
            }}
            getExistingItems={props.getAudits}
            onItemSelected={props.onAuditSelected}
            createComponent={
               /* <EditAuditSecu
                    auditSecu={null}
                    setAuditSecu={() => props.setIsChanged(true)}
                    open={openCreateAudit}
                    setOpen={setOpenCreateAudit}
                    isEdit={false}
                />*/
                <></>
            }
        />
    );
}

export default SelectOrCreateAudit as typeof SelectOrCreateAudit;