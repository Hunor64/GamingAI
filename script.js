let GAMEDIV = document.querySelector(".GameDiv")
let KILLS = document.querySelector(".kills")

let inter
let avalibleLocations = []
let players = []
let mines = []
let blackList = []

function ClearDiv() {
    while (GAMEDIV.lastChild) {
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
}



let rows = 0
let columns = 0


function felvesz(m, n) {
    clearInterval(inter)
    avalibleLocations = []
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

function UpdateSliders() {
    let max = Math.floor(document.querySelector(".height").value*document.querySelector(".width").value/2)
    document.querySelector(".mine").value = Math.min(document.querySelector(".mine").value, max)
    document.querySelector(".players").value = Math.min(document.querySelector(".players").value, max)
    document.querySelector(".mine").max = max
    document.querySelector(".players").max = max
}


function CreatePlayers(p) {
    felvesz(document.querySelector('.height').value,document.querySelector('.width').value)
    SpawnMines(document.querySelector(".mine").value)

    for (let i = 0; i < p; i++) {
        let isDed = false
        let location = RandomGen()
        console.log(location[0])
        let randomRow = location[0] 
        let randowColumn = location[1]

        if (!isDed) {
            players.push({
                "id": i + 1,
                "class": "c" + randowColumn + "r" + randomRow,
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
    setTimeout(console.log("Started Interval"), 1000)
    //inter = setInterval(MovePlayers, 1000)

    document.querySelector(".btnIndit").disabled = true;
}

function SpawnMines(n) {
    for (let i = 0; i < n; i++) {
        let location = RandomGen(0, rows, true, false)
        let randomRow = location[0] 
        let randowColumn = location[1]
        mines.push({
            "row": randomRow,
            "column": randowColumn
        })
        let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
        selectedElement.classList.add("mine")
    }
}
function PutAllPlayersOn() {
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

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                let currentSquare = document.querySelector(".c" + column + "r" + row)
                while (currentSquare.lastChild) {
                    currentSquare.removeChild(currentSquare.lastChild)
                }

            }
        }
        selectedElement.innerHTML = ""


        let moveDir = Math.floor(Math.random() * (4 - 1)) + 1
        let moves = GetAllPossibleMoves(element.row,element.column)
        console.log("Possible moves",moves)

        

        if (moves.length == 0) {
            kill(element)
        }
        PutAllPlayersOn()

    })
}
function GetAllPossibleMoves(row,column){
    let moves = [[1,0],[-1,0],[0,1],[0,-1]]
    let canMove = []
    moves.forEach(move =>{
        let isPlayerThere = players.findIndex(e => e.row === row-move[0] && e.column === column-move[1])
        let isMineThere = blackList.findIndex(e => e.row === row-move[0] && e.column === column-move[1])
        let wallNotThere = true
        if (row-move[0]>rows-1||row-move[0]<0||column-move[1]>columns-1||column-move[1]<0) {
            wallNotThere = false
        }
        if (isPlayerThere == -1 && isMineThere == -1 &&wallNotThere) {
            canMove.push(move)
        }
        console.log(isPlayerThere)
    })
    return canMove
}

function kill(element,deathMSG) {
    let li = document.createElement("li")
    li.innerHTML = "Player " + element.id + " was kiled"
    console.log("Player " + element.id + " was kiled")
    KILLS.appendChild(li)
    let index = players.findIndex(e => e.id === element.id);
    blackList.push({
        "row": element.row,
        "column": element.column
    })
    if (index !== -1) {
        players.splice(index, 1)
    }
    console.log(blackList)
}

function RandomGen() {
    if(avalibleLocations.length == 0){
        for (let generatedRows = 0; generatedRows < rows; generatedRows++) {
            for (let generatedColumns = 0; generatedColumns < columns; generatedColumns++) {
                avalibleLocations.push([generatedRows,generatedColumns])
            }                        
        }
        console.log("Generated new locations")
    }
    let generatedNumber = Math.floor(Math.random() * (avalibleLocations.length) )
    let genCoords = avalibleLocations[generatedNumber]
    console.log(genCoords)
    avalibleLocations.splice(generatedNumber,1)
    console.log(avalibleLocations)
    return genCoords
}