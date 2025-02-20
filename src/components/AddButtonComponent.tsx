import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface EntrepriseAddButtonProps {
    openModal: (e: boolean) => void;
    style?:  React.CSSProperties | undefined;
    text?: string;
}

const AddButtonComponent = ({style, openModal,text}:EntrepriseAddButtonProps) => {
  return(
   <Button color="primary"

           sx={{
               ...style,
               margin: '10px',
               marginTop: 2,
               width: style?.width || '100%',
               height: style?.height || '100%',
               borderRadius: style?.borderRadius || 4,
               borderColor: '#b3b3b3',
               borderWidth: 2,
               borderStyle: 'solid'
           }}
                onClick={() => {
                    openModal(true);
                }
   }
           startIcon={<AddCircleIcon/>}
   >
       {text || 'Ajoutez'}
   </Button>
  )
};

export default AddButtonComponent;