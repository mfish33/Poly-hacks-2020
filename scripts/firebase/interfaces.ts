export interface chat{
    id:string
    Messages:message[],
    Name:string,
    TimeStamp:Date
}
export interface message{
    Type:string,
    Data:string,
    Author:string,
    TimeStamp:Date
}
export interface userDataCache{
    uid:string,
    DisplayName:string,
    Avatar:string,
    TimeStamp:number
}
