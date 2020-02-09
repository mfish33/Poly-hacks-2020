import UserCache from './UserCache'
import {PublicChat,PrivateChat,ParentChat,NestedCombinedChat,message,userDataCache} from './interfaces'

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

export default class MessageService{ private subscribedChat!: PrivateChat | PublicChat | ParentChat;
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

    public getAllPublicChats():Promise<PublicChat[]> {
        return db.collection('PublicChats').get()
        .then(chats => {
            let out = []
            for(let chat of chats.docs) {
                out.push(Object.assign(chat.data(),{id:chat.id, type:'PublicChats'}) as PublicChat)
            }
            return out
        })
        .catch(e => {throw new Error(`Could not receive chats: ${e}`)})
    }

    public async getUserChats():Promise<NestedCombinedChat[]> {
        let promiseArray = [db.collection('PublicChats').where('Users','array-contains',this.user.uid).get(), 
        db.collection('PrivateChats').where('Users','array-contains',this.user.uid).get(),
        db.collection('ParentChats').where('Users','array-contains',this.user.uid).get()]
        let resolvedPromises
        try{
            resolvedPromises = await Promise.all(promiseArray)
        } catch(e) {
            throw e
        } 
        let usersPublicChats = resolvedPromises[0].docs.map(c => Object.assign(c.data(),{id:c.id, type:'PublicChats'}) as PublicChat)
        let usersPrivateChats = resolvedPromises[1].docs.map(c => Object.assign(c.data(),{id:c.id, type:'PrivateChats'}) as PrivateChat)
        let usersParentChats = resolvedPromises[2].docs.map(c => Object.assign(c.data(),{id:c.id, type:'PrivateChats'}) as ParentChat)
        let NestedChats = usersPublicChats.map(c => {
            return {
                publicChat: c,
                parentChat:usersParentChats.filter(p => p.id == c.Parent)[0],
                privateChats: usersPrivateChats.filter(p => p.AssociatedClass == c.id)
            } as NestedCombinedChat
        })
        return NestedChats
    }

    public subscribeToChat(chat:PublicChat | PrivateChat | ParentChat, cb:Function):void {
        this.subscribedChat = chat;
        this.subscribedChatListener = db.collection(chat.type).doc(chat.id).onSnapshot(doc => this.formatNewMessages(doc.data() as PublicChat | PrivateChat,cb))
    }

    public unsubscribeChat():void {
        this.subscribedChat = {} as PrivateChat
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
        return db.collection(this.subscribedChat.type).doc(this.subscribedChat.id).update(
            {Messages: firebase.firestore.FieldValue.arrayUnion(post)}
        )
        .then(() =>  true)
        .catch(e => {throw new Error(e)})
    }

    public async formatNewMessages(chat:PublicChat | PrivateChat,cb:Function):Promise<void> {
        let newMessages = chat.Messages.slice(this.currentMessages.length)
        this.currentMessages = chat.Messages
        for(let message of newMessages) {
            let user = await this.userCache.getUser(message.Author)
            message.Author = user.DisplayName
            message.Avatar = user.Avatar
        }
        return cb(newMessages)
    }

    public async joinPublicChat(chat:PublicChat):Promise<boolean>{
        let promiseArray = [db.collection('PublicChats').doc(chat.id).update(
            {Users: firebase.firestore.FieldValue.arrayUnion(this.user.uid)}
        ),
        db.collection('ParentChats').doc(chat.Parent).update(
            {Users: firebase.firestore.FieldValue.arrayUnion(this.user.uid)}
        )]
        try{
            await Promise.all(promiseArray)
            return true
        } catch(e) {
            throw e
        }        
    }

    public async createPrivateChat(block:NestedCombinedChat,chatName:string,users:userDataCache[]): Promise<boolean> {
        try{
            await db.collection('PrivateChat').add({
                Messages:{
                    Type:'string',
                    Data:'Welcome to your Private Chat',
                    Author:'System',
                    TimeStamp:new Date()
                } as message,
                Name:chatName,
                TimeStamp:new Date(),
                users:[...users.map(user => user.uid),this.user.uid],
                AssociatedClass:block.publicChat.id
            })
            return true
        } catch(e) {
            throw new Error(e)
        }  
    }

    public async addToPrivateChat(chat:PrivateChat) {
        try{
            await db.collection('PrivateChats').doc(chat.id).update({
                Users: firebase.firestore.FieldValue.arrayRemove(this.user.uid)
            })
            return true
        } catch(e) {
            throw new Error(e)
        }
    }


  }