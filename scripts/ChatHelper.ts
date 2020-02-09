import App from './index'
import { message } from './firebase/interfaces';

   
export default class ChatHelper{
    
    constructor(private app: App){}

    
    public getNestedFromId(publicChatId:string):void{
        let chats =  this.app.userChats.filter(chat => chat.publicChat.id == publicChatId)[0]
        if(chats){
            this.app.currentNested = chats
            this.pushChatsToFrontEnd()
            this.app.transitionService.goTo("unreadthread-page")
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
            this.app.messageService.subscribeToChat(chat,this.pushToFrontEnd)
        }else{
            throw new Error("No Chat Of That Id")
        }
    }

    private pushChatsToFrontEnd(){
        let out:string[] = []
        let {publicChat, parentChat, privateChats} = this.app.currentNested
        out.push(`<div class="row chat m-2 ">
        <div class="col col-centered class-select-item" onclick="app.chatHelper.getChatFromId(${publicChat.id})">
                <button class="class-select-button">
                        <h2 class="class-select-large-text">${publicChat.Class}</h2>
                        <p class="class-select-medium-text">${publicChat.FullName}</p>
                      </button>    
            </div>
      
</div>`)
        out.push(`<div class="row chat m-2 ">
<div class="col col-centered class-select-item" onclick="app.chatHelper.getChatFromId(${parentChat.id})">
        <button class="class-select-button">
                <h2 class="class-select-large-text">Section Chat</h2>
                <p class="class-select-medium-text">${publicChat.FullName}</p>
              </button>    
    </div>

</div>`)
    for(let chat of privateChats){
        out.push(`<div class="row chat m-2 ">
<div class="col col-centered class-select-item" onclick="app.chatHelper.getChatFromId(${chat.id})">
        <button class="class-select-button" >
                <h2 class="class-select-large-text">${chat.Name}</h2>
                <p class="class-select-medium-text">${publicChat.FullName}</p>
              </button>    
    </div>

</div>`)
    }
    document.getElementById('unread-thread-container')!.innerHTML = out.join('')
}

    private pushToFrontEnd(newMessages:message[]) {
        let out:string[] = []
        for(let message of newMessages) {
            if (message.Author == this.app.messageService.user.displayName) {
                out.push(
                `<div class="row chat m-2">
                <div class="col-2">
                      <img src="${message.Avatar && message.Avatar == 'null' ? message.Avatar :'./img/img-avatar.png'}" class ='chat-avatar'alt="Avatar">
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
                      <img src="${message.Avatar && message.Avatar == 'null' ? message.Avatar :'./img/img-avatar.png'}" class ='chat-avatar'alt="Avatar">
                  </div>
          </div>`)
            }
        }
        document.getElementById('chat-container')!.innerHTML = out.join('')
    }

        

}