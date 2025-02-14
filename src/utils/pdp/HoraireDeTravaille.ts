class HoraireDeTravaille{

     enJournee?: boolean;
     enNuit?: boolean;
    samedi?: boolean;


    public constructor() {
        this.enJournee = false;
        this.enNuit = false;
        this.samedi = false;
    }

}

export default HoraireDeTravaille;