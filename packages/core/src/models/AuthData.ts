export class AuthData {
    id: string|null;
    email: string|null;
    token: string|null;
    constructor(id: string|null=null, email: string|null=null, token: string|null=null) {
        this.id = id;
        this.email = email;
        this.token = token;
    }
}
