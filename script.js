let GAMEDIV = document.querySelector(".GameDiv")

let players = [

]

function ClearDiv() {
    while (GAMEDIV.lastChild) {
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
}
let rows = 0
let columns = 0

felvesz(6, 7)

function felvesz(m, n) {
    ClearDiv()
    rows = n
    columns = m
    for (let i = 0; i < m; i++) {
        let row = document.createElement("div")
        for (let d = 0; d < n; d++) {
            let element = document.createElement("div")
            element.classList.add("element")
            element.classList.add("c" + i + "r" + d)

            row.appendChild(element)
        }
        GAMEDIV.appendChild(row)
    }
    console.log(rows)
    document.querySelector(".btnIndit").disabled = false;
    players = []
}

function CreatePlayers(p) {
    for (let i = 0; i < p; i++) {
        let randomRow = RandomGen(0, rows, true)
        let randowColumn = RandomGen(0, columns, false)
        players.push({
            "id": i,
            "row": randomRow,
            "column": randowColumn
        })
        let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
        let playerChar = document.createElement("div")
        playerChar.classList.add("player")
        selectedElement.appendChild(playerChar)
    }
    document.querySelector(".btnIndit").disabled = true;
}
function RandomGen(min, max, isRow) {
    while (true) {
        let rnd = Math.floor(Math.random() * (max - min)) + min;
        if (isRow) {
            const i = players.findIndex(e => e.row === rnd);
            if (i == -1) {
                return rnd
            }
        }
        else{
            const i = players.findIndex(e => e.column === rnd);
            if (i == -1) {
                return rnd
            }
        }
        if(players.length == rows*columns){
            return 0
        }
    }
}
