import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const EntrepriseAddButton = () => {
  return(
   <Button variant="contained" color="primary"
              style={{
                 width: '100%',
                 borderRadius: '20px',
                 backgroundColor: '#d8e0ed',
                 color: '#222222',
                 fontWeight: 'bold',
                 fontSize: '15rem',
                 padding: '10px',
                 marginTop: '10px'
                }}
   >+</Button>
  )
};

export default EntrepriseAddButton;