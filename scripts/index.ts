import LoginService from "./LoginService"

class App{
    public loginService = new LoginService(this)


    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    onDeviceReady():void {
       
    }

}

let app = new App()