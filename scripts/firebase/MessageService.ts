import UserCache from './UserCache'
import {chat,message} from './interfaces'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

// Your web app's MessageService configuration
const firebaseConfig = {
apiKey: "AIzaSyC4Feo5EdegevyKE8oWrAijyeKNtf5XUb0",
authDomain: "my-first-test-project-ad1aa.firebaseapp.com",
databaseURL: "https://my-first-test-project-ad1aa.firebaseio.com",
projectId: "my-first-test-project-ad1aa",
storageBucket: "my-first-test-project-ad1aa.appspot.com",
messagingSenderId: "578464683165",
appId: "1:578464683165:web:8eec1281bb985aa4eb7074",
measurementId: "G-XPXNPCLXK4"
};

// Initialize MessageService
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore()

export default class MessageService{
    private subscribedChat!: string;
    private subscribedChatListener!: () => void
    private userCache = new UserCache(db)
    private currentMessages:message[] = []

    constructor(public user:firebase.User){}

    static async signIn(email:string , password:string): Promise<MessageService> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(data => {
            if(data.user) {
                return new MessageService(data.user)
            } else {
                throw new Error('Issue retrieving user: Firebase responded success')
            }        
        })
        .catch(e =>{ throw new Error(e)});
    }

    static async register(email:string , password:string, displayName:string): Promise<MessageService> {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
            let currentUser = firebase.auth().currentUser
            if(!currentUser) {
                throw new Error('Error Updating account: could not find current user')
            }
            return db.collection("UserData").doc(currentUser.uid).set({
                DisplayName:displayName,
                Avatar:"null"
            })
            .then(() => {
                if(!currentUser) {
                    throw new Error('Error Updating account: could not find current user')
                }
                return new MessageService(currentUser)
            })
            .catch(e => {throw new Error(`Error writing to UserData: ${e}`)});
    })
}

    public getAllChats():Promise<chat[]> {
        return db.collection('Chats').get()
        .then(chats => {
            let out = []
            for(let chat of chats.docs) {
                out.push(Object.assign(chat.data(),{id:chat.id}) as chat)
            }
            return out
        })
        .catch(e => {throw new Error(`Could not receive chats: ${e}`)})
    }

    public subscribeToChat(chatId:string, cb:Function):void {
        this.subscribedChat = chatId;
        this.subscribedChatListener = db.collection('Chats').doc(chatId).onSnapshot(doc => this.formatNewMessages(doc.data() as chat,cb))
    }

    public unsubscribeChat():void {
        this.subscribedChat = ''
        this.currentMessages = []
        this.subscribedChatListener()
    }

    public postMessage(data:string):Promise<boolean> {
        let post: message = {
            Type: 'string',
            Data: data,
            Author:this.user.uid,
            TimeStamp:new Date
        }
        return db.collection('Chats').doc(this.subscribedChat).update(
            {Messages: firebase.firestore.FieldValue.arrayUnion(post)}
        )
        .then(() =>  true)
        .catch(e => false)
    }

    public async formatNewMessages(chat:chat,cb:Function):Promise<void> {
        let newMessages = chat.Messages.slice(this.currentMessages.length)
        this.currentMessages = chat.Messages
        for(let message of newMessages) {
            let user = await this.userCache.getUser(message.Author)
            message.Author = user.DisplayName
        }
        return cb(newMessages)
    }
  }
