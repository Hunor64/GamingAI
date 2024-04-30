let GAMEDIV = document.querySelector(".GameDiv")

let play

function ClearDiv(){
    while(GAMEDIV.lastChild){
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
}



function felvesz(m,n){
    ClearDiv()
    for (let i = 0; i < m; i++) {
        let row = document.createElement("div")
        row.classList.add("c"+i)
        for (let d = 0; d < n; d++) {
            let element = document.createElement("div")
            element.classList.add("element")
            element.classList.add("r"+d)

            
            row.appendChild(element)
        }        
        GAMEDIV.appendChild(row)
    }
}

function CreatePlayers(p){

}