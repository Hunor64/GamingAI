let GAMEDIV = document.querySelector(".GameDiv")
let KILLS = document.querySelector(".kills")

let players = []
let mines = []

function ClearDiv() {
    while (GAMEDIV.lastChild) {
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
}



let rows = 7
let columns = 6

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
    mines = []
    document.querySelector(".kills").innerHTML = ""
}




function CreatePlayers(p) {
    SpawnMines(0)

    for (let i = 0; i < p; i++) {
        let isDed = false
        let randomRow = RandomGen(0, rows, true, false)
        let randowColumn = RandomGen(0, columns, false, false)
        mines.forEach(element => {
            if (randomRow == element.row && randowColumn == element.column) {
                isDed = true
            }
        })
        if (!isDed) {
            players.push({
                "id": i+1,
                "class":"c" + randowColumn + "r" + randomRow,
                "row": randomRow,
                "column": randowColumn
            })
            let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
            let playerChar = document.createElement("div")
            playerChar.innerText = i + 1
            playerChar.classList.add("player")
            selectedElement.appendChild(playerChar)
        }
        else {
            let li = document.createElement("li")
            li.innerHTML = "Player " + i + " was born dead"
            KILLS.appendChild(li)
        }
    }
    setTimeout(console.log("d"), 1000)
    setInterval(MovePlayers, 1000)


    document.querySelector(".btnIndit").disabled = true;
}

function SpawnMines(n) {
    for (let i = 0; i < n; i++) {
        let randomRow = RandomGen(0, rows, true, true)
        let randowColumn = RandomGen(0, columns, false, true)
        mines.push({
            "row": randomRow,
            "column": randowColumn
        })
        let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
        selectedElement.classList.add("mine")
    }
}
function PutAllPlayersOn(){
    players.forEach(element => {
        let selectedElement = document.querySelector(".c" + element.column + "r" + element.row)
        let playerChar = document.createElement("div")
        playerChar.innerText = element.id
        playerChar.classList.add("player")
        selectedElement.appendChild(playerChar)
    })
}

function MovePlayers() {
    players.forEach(element => {
        let selectedElement = document.querySelector(".c" + element.column + "r" + element.row)
        for (let i = 0; i < GAMEDIV.children.length; i++) {
            while (GAMEDIV.children[i].firstChild && GAMEDIV.children[i].firstChild.firstChild) {
                GAMEDIV.children[i].firstChild.removeChild(GAMEDIV.children[i].firstChild.firstChild);
            }
    }

        selectedElement.innerHTML = ""
        let moveDir = Math.floor(Math.random() * (4 - 1)) + 1
        let moved = false
        let whileCount = 0
        while(!moved || whileCount < 2){
            whileCount++
            if(moveDir == 1){
                if(element.row > 0){
                    element.row--
                    moved = true
                    break
                }
                else{
                    moveDir = 2
                }
            }
            if(moveDir == 2){
                if(element.row < rows - 1){
                    element.row++
                    moved = true
                    break
                }
                else{
                    moveDir = 3
                }
            }
            if(moveDir == 3){
                if(element.column > 0){
                    element.column--
                    moved = true
                    break
                }
                else{
                    moveDir = 4
                }
            }
            if(moveDir == 4){
                if(element.column < columns - 1){
                    element.column++
                    moved = true
                    break
                }
                else{
                    moveDir = 1
                }
            }
        }
        if (moved) {   
            let playerChar = document.createElement("div")
            playerChar.classList.add("c" + element.column + "r" + element.row)
            playerChar.innerHTML = element.id
            playerChar.classList.add("player")
            selectedElement.appendChild(playerChar)
        }
        else {
            kill(element)
        }
    })
}

function kill(element) {
    let li = document.createElement("li")
    li.innerHTML = "Player " + element.id + " was kiled by deadly red goo"
    KILLS.appendChild(li)
    let index = players.findIndex(e => e.id === element.id);
    if (index !== -1) {
        players.splice(index, 1);
    }
}

function RandomGen(min, max, isRow, isMine) {
    let ran = 0
    while (ran != 500) {
        let rnd = Math.floor(Math.random() * (max - min)) + min;
        let i
        if (isRow) {
            if (!isMine) {
                i = players.findIndex(e => e.row === rnd);
                console.log("player 1")

            }
            else {
                i = mines.findIndex(e => e.row === rnd);
                console.log("mine 1")
            }
        }
        else {
            if (!isMine) {
                i = players.findIndex(e => e.column === rnd);
                console.log("player 2")

            }
            else {
                i = mines.findIndex(e => e.column == rnd);
                console.log("mine 2")

            }
        }
        if (i == -1) {
            return rnd
        }
        ran++
        if (players.length == rows * columns) {
            return 0
        }
    }
    return 0
}
