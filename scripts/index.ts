import MessageService from "./firebase/MessageService"
import LoginService from "./LoginService"

class App{
    public loginService = new LoginService(this)
    public messageService!: MessageService


    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    onDeviceReady():void {
       
    }

}

let app = new App()