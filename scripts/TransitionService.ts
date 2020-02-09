export default class TransitionService{

    private onLeft:string[] = []
    private current:string = 'welcome-page' //Whatever starting div is


    private pageTransition(off:string, on:string) {
        let onDiv = document.getElementById(on)!.style
        let offDiv = document.getElementById(off)!.style
        if(this.onLeft.includes(on)){ //on left side
            offDiv.transform = 'translate(120vw,-78vh)'
            this.onLeft = this.onLeft.filter(i => i!==on)
        } else {
            offDiv.transform = 'translate(-120vw,-78vh)'
            this.onLeft.push(off)     
        }
        offDiv.transition = '.75s'
        onDiv.transform = 'translate(0vw,-78vh)'
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
            document.getElementById(arg)!.style.transform = 'translate(120vw,0vh)'
        }
    }

    public goTo(on:string) {
        return this.pageTransition(this.current,on)
    }
}