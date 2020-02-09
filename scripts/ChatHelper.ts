import MessageService from "./firebase/MessageService"
import Utils from './Utils'
import App from './index'
import { NestedCombinedChat, PublicChat, ParentChat, PrivateChat } from "./firebase/interfaces";
   
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
    public getChatFromId(chatId:string):PublicChat | ParentChat | PrivateChat{
        let {publicChat, parentChat, privateChats} = this.app.currentNested
        let chats
        if(publicChat.id == chatId){
            let chats = publicChat
        }else if(parentChat.id == chatId){
            let chats = parentChat
        }else{
            let chats = privateChats.filter(chat => chat.id == chatId)[0]
        }
        if(chats){
            return chats
        }else{
            throw new Error("No Chat Of That Id")
        }
    }

        

}