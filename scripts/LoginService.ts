import MessageService from "./firebase/MessageService"
import Utils from './Utils'
import App from './index'
import { NestedCombinedChat } from "./firebase/interfaces";
   
export default class LoginService{
    private emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    constructor(private app: App){}

     public async login(email?:string,password?:string) {
        try{
            if(!email || !password) {
                [email, password] = Utils.getInput('loginPage-email', 'loginPage-password')
            }
                if(this.emailRegex.test(email)){
                    if(!email || !password){
                        throw "Bad parsing of email and password"
                    }
                    this.app.messageService = await MessageService.signIn(email, password)
            }
            await this.getUserData()
            let out:string[] = []
            for(let combinedChatObject of this.app.userChats) {
                out.push(
                    `<div class="row chat m-2">
                    <div class="col col-centered class-select-item" onclick="app.chatHelper.getNestedFromId(${combinedChatObject.publicChat.id})">
                            <button class="class-select-button">
                                    <h2 class="class-select-large-text">${combinedChatObject.publicChat.Class}</h2>
                                    <p class="class-select-medium-text">${combinedChatObject.publicChat.FullName}</p>
                                    <p class="class-select-small-text">${combinedChatObject.publicChat.Instructor}</p>
                                  </button>    
                        </div>`
                )
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

    public initLogin() {
        this.app.secureStorage.get(
            (email:string) => {
              this.app.secureStorage.get(
                  async (password:string) => {
                      try{
                        await this.login(email,password)
                      } catch(e) {
                        this.transitionStart()
                      }                     
                  },() =>{this.transitionStart()},
                  'password'
              )
            },
            (error:Error) => {this.transitionStart()},
            "email"
          );
    }

    public transitionStart() {
        this.app.transitionService.goTo('welcome-page')
    }
    
    public async getUserData():Promise<void> {
        try{
            this.app.userChats = await this.app.messageService.getUserChats()
            console.log(this.app.userChats)

        } catch(e) {
            return this.getUserData()
        }   
    }

    public goToHomeState() {
        this.app.transitionService.goTo('Threads-Page')
    }


}