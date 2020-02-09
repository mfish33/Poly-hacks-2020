export default class Utils{

    static getInput(...args:string[]) {
        try{
            return args.map(prop => (<HTMLInputElement>document.getElementById(prop)).value)
        } catch(e) {
            throw new Error('Invalid id names')
        }
    }

    

}