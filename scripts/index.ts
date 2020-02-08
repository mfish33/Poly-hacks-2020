class App{

    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    onDeviceReady():void {
        this.receivedEvent('deviceready');
    }

    receivedEvent(id:string):void {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement!.querySelector('.listening')!;
        var receivedElement = parentElement!.querySelector('.received')!;

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

}

let app = new App()