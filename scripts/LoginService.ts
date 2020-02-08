export default class LoginService{

    constructor(private app: any){}

    public async login() {
        let email = (<HTMLInputElement>document.getElementById('loginPage-email')).value
        let password = (<HTMLInputElement>document.getElementById('loginPage-password')).value
        

    }
    public async register() {
        let email = (<HTMLInputElement>document.getElementById('registerPage-email')).value
        let password = (<HTMLInputElement>document.getElementById('registerPage-password')).value
        let displayName = (<HTMLInputElement>document.getElementById('registerPage-displayName')).value
        let avatar = (<HTMLInputElement>document.getElementById('registerPage-avatar')).value
    }

}