import App from './index'
import { message } from './firebase/interfaces';

export default class ChatHelper{
    
    constructor(private app: App){}

    
    public getNestedFromId(publicChatId:string):void{
        console.log(this.app.userChats)
        let chats =  this.app.userChats.filter(chat => chat.publicChat.id == publicChatId)[0]
        if(chats){
            this.app.currentNested = chats
            this.pushChatsToFrontEnd()
            console.log('Pushed to front end')
            this.app.transitionService.goTo("unread-threads-page")
        }else{
            throw new Error("No Public Chat Of That Id")
        }
    }

    public getChatFromId(chatId:string):void{
        let {publicChat, parentChat, privateChats} = this.app.currentNested
        let chat
        if(publicChat.id == chatId){
            chat = publicChat
        }else if(parentChat.id == chatId){
            chat = parentChat
        }else{
            chat = privateChats.filter(chat => chat.id == chatId)[0]
        }
        if(chat){
            console.log(chat)
            this.app.messageService.subscribeToChat(chat,this.pushToFrontEnd.bind(this))
            document.getElementById('chat-container')!.innerHTML = '';
            
        }else{
            throw new Error("No Chat Of That Id")
        }
    }

    private pushChatsToFrontEnd(){
        let out:string[] = []
        let {publicChat, parentChat, privateChats} = this.app.currentNested
        out.push(`<div class="row chat m-2 ">
        <div class="col col-centered class-select-item">
                <button class="class-select-button" onclick="app.chatHelper.getChatFromId('${publicChat.id}')">
                        <h2 class="class-select-large-text">${publicChat.Class}</h2>
                        <p class="class-select-medium-text">${publicChat.FullName}</p>
                      </button>    
            </div>
      
</div>`)
        out.push(`<div class="row chat m-2 ">
<div class="col col-centered class-select-item">
        <button class="class-select-button" onclick="app.chatHelper.getChatFromId('${parentChat.id}')">
                <h2 class="class-select-large-text">Section Chat</h2>
                <p class="class-select-medium-text">${publicChat.FullName}</p>
              </button>    
    </div>

</div>`)
    for(let chat of privateChats){
        out.push(`<div class="row chat m-2 ">
<div class="col col-centered class-select-item">
        <button class="class-select-button" onclick="app.chatHelper.getChatFromId('${chat.id}')">
                <h2 class="class-select-large-text">${chat.Name}</h2>
                <p class="class-select-medium-text">${publicChat.FullName}</p>
              </button>    
    </div>

</div>`)
    }
    console.log(out,document.getElementById('unread-threads-container'))
    document.getElementById('unread-threads-container')!.innerHTML = out.join('')
}

    private pushToFrontEnd(newMessages:message[]) {
        let out:string[] = []
        for(let message of newMessages) {
            if (message.uid == this.app.messageService.user.uid) {
                out.push(
                `<div class="row chat m-2">
                <div class="col-2">
                      <img src="${message.Avatar && message.Avatar != 'null' ? message.Avatar :'./img/img-avatar.png'}" class ='chat-avatar'alt="Avatar">
                  </div>
                <div class="col message-out">
                  <p>${message.Author}: ${message.Data}</p>
                </div>
                
          </div>`)
            } else {
                out.push(
                `<div class="row chat m-2">
                <div class="col message-in">
                  <p>${message.Author}: ${message.Data}</p>
                </div>
                <div class="col-2">
                      <img src="${message.Avatar && message.Avatar != 'null' ? message.Avatar :'./img/img-avatar.png'}" class ='chat-avatar'alt="Avatar">
                  </div>
          </div>`)
            }
        }
        document.getElementById('chat-container')!.innerHTML += out.join('')
        if(this.app.transitionService.current != 'chat-page') {
            this.app.transitionService.goTo('chat-page');
        }
    }

    sendMessage() {
        let inputBox = <HTMLInputElement>document.getElementById('chat-input')
        let message = inputBox.value
        if(message) {
            this.app.messageService.postMessage(message)
            inputBox.value = ''
        }
        
    }

    exitChat() {
        this.app.messageService.unsubscribeChat()
        this.app.transitionService.goBack()
    }

        

}