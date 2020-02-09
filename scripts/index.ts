import MessageService from "./firebase/MessageService"
import LoginService from "./LoginService"
import utils from './Utils'
import TransitionService from './TransitionService'
import { NestedCombinedChat } from "./firebase/interfaces";

export default class App{
    public loginService = new LoginService(this)
    public messageService!: MessageService
    public transitionService = new TransitionService()
    public secureStorage!:any
    public userChats!:NestedCombinedChat[]
    public currentNested!:NestedCombinedChat


    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);  
        TransitionService.offScreen('chat-page','threads-page','add-chat-page','unread-threads-page') 
    }

    onDeviceReady():void {
      //this.secureStorage = new cordova.plugins.SecureStorage(()=>{this.loginService.initLogin()},()=>{},"my_app");
    }
    

}
//@ts-ignore
window.app = new App()