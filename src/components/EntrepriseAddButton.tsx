import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


interface EntrepriseAddButtonProps {
    openModal: (e: boolean) => void;
}

const EntrepriseAddButton = ({openModal}:EntrepriseAddButtonProps) => {
  return(
   <Button variant="contained" color="primary"
              style={{
                 width: '100%',
                 borderRadius: '20px',
                 backgroundColor: '#d8e0ed',
                 color: '#222222',
                 fontWeight: 'bold',
                 fontSize: '10rem',
                }}

                onClick={() => {
                    openModal(true);
                }
   }
   >+</Button>
  )
};

export default EntrepriseAddButton;