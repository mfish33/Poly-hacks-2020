import MessageService from "./firebase/MessageService"
   
export default class LoginService{
    private emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    constructor(private app: any){}

     public async login() {
        let email = (<HTMLInputElement>document.getElementById('loginPage-email')).value
        let password = (<HTMLInputElement>document.getElementById('loginPage-password')).value
        if(this.emailRegex.test(email)){
            try{
                if(!email || !password){
                    throw ""
                }
                this.app.messageService = await MessageService.signIn(email, password)
            }catch(e){
                // TODO: Show error
                throw new Error(`Could not sign in ${e}`)
            }
        }else{

        }
    }
    public async register() {
        let email = (<HTMLInputElement>document.getElementById('registerPage-email')).value
        let password = (<HTMLInputElement>document.getElementById('registerPage-password')).value
        let displayName = (<HTMLInputElement>document.getElementById('registerPage-displayName')).value
         let avatarLocation = (<HTMLInputElement>document.getElementById('registerPage-avatar')).value
         let avatar = avatarLocation ? avatarLocation : "null"
        if(this.emailRegex.test(email)){
            try{
                if(!email || !password || !displayName){
                    throw ""
                }
                 this.app.messageService = await MessageService.register(email, password, displayName)
            }catch(e){
                // TODO: Show error
                throw new Error(`Could not register ${e}`)
            }
        }
    }

}