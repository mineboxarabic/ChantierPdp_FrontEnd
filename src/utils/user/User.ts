class User{
    id?: number;
    name?: string;
    role?: string;
    fonction?: string;
    notel?: string;
    email?: string;
    constructor() {
        this.name = "";
        this.role = "";
        this.fonction = "";
        this.notel = "";
        this.email = "";
    }
}
export default User;