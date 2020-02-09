import MessageService from "./firebase/MessageService"
import LoginService from "./LoginService"
import utils from './Utils'
import TransitionService from './TransitionService'

class App{
    public loginService = new LoginService(this)
    public messageService!: MessageService
    public transitionService = new TransitionService()


    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);   
    }

    onDeviceReady():void {
      
    }

}

let app = new App()