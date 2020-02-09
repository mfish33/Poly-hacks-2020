import {userDataCache} from './interfaces'

export default class UserCache{

    private cache:userDataCache[] = [{
        uid:'System',
        DisplayName:'System',
        Avatar: 'null',
        TimeStamp: -Infinity
    }]
    private cacheTimeout = 600  //seconds
    private missingUser = {
        DisplayName:'Unknown User',
        Avatar: 'null',
        TimeStamp: -Infinity
    }


    constructor(private db:firebase.firestore.Firestore) {}

    public async getUser(uid:string) :Promise<userDataCache>{
        this.clean() 
        let user = this.cache.filter(u => u.uid == uid)[0]
        if(user) {
            return user
        } 
        try {
            let doc = await this.db.collection('UserData').doc(uid).get()
            let userData = Object.assign(doc.data(),{uid:uid,TimeStamp:Date.now()/1000}) as userDataCache
            this.cache.push(userData)
            return userData
        } catch(e) {
            return Object.assign(this.missingUser,{uid:uid})
        }   
    }

    private clean() {
        this.cache = this.cache.filter(u => u.TimeStamp + this.cacheTimeout > Date.now() / 1000)
    }
      
  }
