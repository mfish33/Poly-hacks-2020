import MessageService from "./firebase/MessageService"
import LoginService from "./LoginService"
import utils from './Utils'
import TransitionService from './TransitionService'
import { NestedCombinedChat } from "./firebase/interfaces";

export default class App{
    public loginService = new LoginService(this)
    public messageService!: MessageService
    public transitionService = new TransitionService()
    public secureStorage = new cordova.plugins.SecureStorage(()=>{},()=>{},"my_app");
    public userChats!:NestedCombinedChat[]



    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);   
    }

    onDeviceReady():void {
      this.loginService.initLogin()
    }
    

}

let app = new App()