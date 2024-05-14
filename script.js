let GAMEDIV = document.querySelector(".GameDiv")
let KILLS = document.querySelector(".kills")

let inter

let rows = 0
let columns = 0

let avalibleLocations = []
let players = []
let mines = []
let blackList = []
let useBlackList = false

function loadMap() {
    rows = document.querySelector('.width').value
    columns = document.querySelector('.height').value

    players = []
    mines = []
    blackList = []
    KILLS.innerHTML = ""

    clearInterval(inter)
    avalibleLocations = []
    while (GAMEDIV.lastChild) {
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
    for (let i = 0; i < columns; i++) {
        let row = document.createElement("div")
        for (let d = 0; d < rows; d++) {
            let element = document.createElement("div")
            element.classList.add("element")
            element.classList.add("c" + i + "r" + d)

            row.appendChild(element)
        }
        GAMEDIV.appendChild(row)
    }
    document.querySelector(".btnIndit").disabled = false;
}

function UpdateSliders() {
    let max = Math.floor(document.querySelector(".height").value * document.querySelector(".width").value / 2)
    document.querySelector(".mine").value = Math.min(document.querySelector(".mine").value, max)
    document.querySelector(".players").value = Math.min(document.querySelector(".players").value, max)
    document.querySelector(".mine").max = max
    document.querySelector(".players").max = max
}


function CreatePlayers() {
    loadMap()

    let mineCount = document.querySelector(".mine").value

    for (let i = 0; i < mineCount; i++) {
        let location = RandomGen()
        let randomRow = location[0]
        let randowColumn = location[1]
        mines.push({
            "row": randomRow,
            "column": randowColumn
        })
        document.querySelector(".c" + randowColumn + "r" + randomRow).classList.add("mine")
    }

    for (let i = 0; i < document.querySelector('.players').value; i++) {
        let location = RandomGen()
        let randomRow = location[0]
        let randowColumn = location[1]

        players.push({
            "id": i + 1,
            "class": "c" + randowColumn + "r" + randomRow,
            "column": randowColumn,
            "row": randomRow,
            "whiteList": []
        })
        let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
        let playerChar = document.createElement("div")
        playerChar.innerText = i + 1
        playerChar.classList.add("player")
        selectedElement.appendChild(playerChar)
    }
    setTimeout(console.log("Started Interval"), 1000)
    inter = setInterval(MovePlayers, 300)

    document.querySelector(".btnIndit").disabled = true;
}
let whitelist = []
function MovePlayers() {
    players.forEach(element => {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                let currentSquare = document.querySelector(".c" + column + "r" + row)
                while (currentSquare.lastChild) {
                    currentSquare.removeChild(currentSquare.lastChild)
                }

            }
        }

        whitelist = element.whiteList
        let moves = GetAllPossibleMoves(element.row, element.column,element.whiteList)
        
        if (moves.length == 0) {
            kill(element, " was squished to death",false)
        }
        else {
            let moveInd = Math.floor(Math.random() * moves.length)
            let whereToMove = moves[moveInd]
            element.row = element.row - whereToMove[0]

            element.column = element.column - whereToMove[1]
            element.class = "c" + element.column + "r" + element.row
        }
        let isOnMine = mines.findIndex(e => e.row === element.row && e.column === element.column)
        if (isOnMine != -1) {
            kill(element, " fell to their demise",true)
        }

        players.forEach(element => {
            let selectedElement = document.querySelector(".c" + element.column + "r" + element.row)
            let playerChar = document.createElement("div")
            playerChar.innerText = element.id
            playerChar.classList.add("player")
            selectedElement.appendChild(playerChar)
        })
    })
}

function GetAllPossibleMoves(row, column, whiteList) {
    let moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    let canMove = []
    moves.forEach(move => {
        let isPlayerThere = players.findIndex(e => e.row === row - move[0] && e.column === column - move[1])
        let wallNotThere = true
        if (row - move[0] > rows - 1 || row - move[0] < 0 || column - move[1] > columns - 1 || column - move[1] < 0) {
            wallNotThere = false
        }
        if (useBlackList) {    
            let isMineThere = blackList.findIndex(e => e.row === row - move[0] && e.column === column - move[1])
            if (isPlayerThere == -1 && isMineThere == -1 && wallNotThere) {
                canMove.push(move)
            }
        }
        else{
            if (isPlayerThere != -1) {
                let otherWhiteList = players[players.findIndex(e => e.row === row - move[0] && e.column === column - move[1])].whiteList
                otherWhiteList.forEach(spot => {
                    let isContained = whitelist.findIndex(e => e === spot)
                    if (isContained == -1) {
                        whitelist.push(spot)
                    }
                })
            }

            let isMineThere = whiteList.findIndex(e => e.row === row - move[0] && e.column === column - move[1])
            if (isPlayerThere == -1 && isMineThere == -1 && wallNotThere) {
                canMove.push(move)
            }
        }
    })
    return canMove
}

function kill(element, deathMessage, didFell) {
    if (useBlackList) {
        if (didFell) {
            blackList.push({
                "row": element.row,
                "column": element.column
            })
        }
    }
    else{
        let moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        moves.forEach(move => {
            let isPlayerThere = players.findIndex(e => e.row === element.row - move[0] && e.column === element.column - move[1])
            
            if (isPlayerThere != -1) {
                let otherWhiteList = players[players.findIndex(e => e.row === element.row - move[0] && e.column === element.column - move[1])].whiteList
                let isContained = whitelist.findIndex(e => e === [element.row - move[0],element.column - move[1]])
                if (isContained == -1) {
                    otherWhiteList.push([element.row - move[0],element.column - move[1]])
                }
                console.log(otherWhiteList)
            }
        })
    }



    let li = document.createElement("li")
    li.innerHTML = "Player " + element.id + deathMessage
    KILLS.appendChild(li)
    let index = players.findIndex(e => e.id === element.id);

    if (index !== -1) {
        players.splice(index, 1)
    }
}

function RandomGen() {
    if (avalibleLocations.length == 0) {
        for (let generatedRows = 0; generatedRows < rows; generatedRows++) {
            for (let generatedColumns = 0; generatedColumns < columns; generatedColumns++) {
                avalibleLocations.push([generatedRows, generatedColumns])
            }
        }
    }
    let generatedNumber = Math.floor(Math.random() * (avalibleLocations.length))
    let genCoords = avalibleLocations[generatedNumber]
    avalibleLocations.splice(generatedNumber, 1)
    return genCoords
}