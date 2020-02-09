export interface PublicChat{
    type:'PublicChat',
    id:string
    Messages:message[],
    Subject:string,
    Class:string,
    TimeStamp:Date,
    users:string[],
    Parent:string,
    FullName:string,
    Instructor:string
}

export interface PrivateChat{
    type:'PrivateChat',
    id:string,
    Messages:message[],
    Name:string,
    TimeStamp:Date,
    Users:string[],
    AssociatedClass:string
}

export interface ParentChat{
    type:'ParentChat',
    id:string
    Messages:message[],
    Name:string,
    TimeStamp:Date,
    users:string[]
}

export interface message{
    Type:string,
    Data:string,
    Author:string,
    TimeStamp:Date,
    Avatar?:string
}
export interface userDataCache{
    uid:string,
    DisplayName:string,
    Avatar:string,
    TimeStamp:number
}

export interface NestedCombinedChat{
    publicChat:PublicChat,
    parentChat:ParentChat,
    privateChats:PrivateChat[]
}