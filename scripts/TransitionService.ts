export default class TransitionService{

    private onLeft:string[] = []
    public current:string = 'welcome-page' //Whatever starting div is


    private pageTransition(off:string, on:string) {
        let onDiv = document.getElementById(on)!.style
        let offDiv = document.getElementById(off)!.style
        if(this.onLeft.includes(on)){ //on left side
            offDiv.display = 'none'
            this.onLeft = this.onLeft.filter(i => i!==on)
        } else {
            offDiv.display = 'none'
            this.onLeft.push(off)     
        }
        offDiv.transition = '.75s'
        onDiv.display = 'block'
        onDiv.transition = '.75s'    
        this.current = on
    }

    public goBack() {
        if(this.onLeft.length) {
            this.pageTransition(this.current,this.onLeft[this.onLeft.length - 1])
        }
    }

    static offScreen(...args:string[]){
        for(let arg of args) {
            document.getElementById(arg)!.style.display = 'none'
        }
    }

    public goTo(on:string) {
        return this.pageTransition(this.current,on)
    }
}