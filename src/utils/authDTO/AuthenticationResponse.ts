import { UserDTO as User } from '../entitiesDTO/UserDTO';

export interface AuthenticationResponse 
{

  token?: string;
  user?: User;

}
