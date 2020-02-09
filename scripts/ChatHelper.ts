import App from './index'
import { message } from './firebase/interfaces';

   
export default class ChatHelper{
    
    constructor(private app: App){}

    
    public getNestedFromId(publicChatId:string):void{
        let chats =  this.app.userChats.filter(chat => chat.publicChat.id == publicChatId)[0]
        if(chats){
            this.app.currentNested = chats
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