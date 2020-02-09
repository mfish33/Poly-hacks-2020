import MessageService from "./firebase/MessageService"
   
export default class LoginService{
    private emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    constructor(private app: any){}

     public async login() {
        try{
            let[email, password] = Utils.getInput('loginPage-email', 'loginPage-password')
                if(this.emailRegex.test(email)){
                    if(!email || !password){
                        throw ""
                    }
                    this.app.messageService = await MessageService.signIn(email, password)
            }
        }catch(e){
            // TODO: Show error
            throw new Error(`Could not sign in ${e}`)
        }
    }
    public async register() {
        try{
            let [email,displayName,password] = Utils.getInput('registerPage-email', 'registerPage-displayName', 'registerPage-password')
                if(this.emailRegex.test(email)){
                    if(!email || !password || !displayName){
                        throw ""
                    }
                    this.app.messageService = await MessageService.register(email, password, displayName)
                }
        }catch(e){
            // TODO: Show error
            throw new Error(`Could not register ${e}`)
        }
        
    }

}