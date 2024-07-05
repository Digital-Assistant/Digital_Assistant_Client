export class AuthData {
    id: string;
    email: string;
    token: string;
    constructor(id: string=null, email: string=null, token: string=null) {
        this.id = id;
        this.email = email;
        this.token = token;
    }
}
