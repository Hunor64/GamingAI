let GAMEDIV = document.querySelector(".GameDiv")
let KILLS = document.querySelector(".kills")

let inter

let rows = 0
let columns = 0

let avalibleLocations = []
let players = []
let mines = []
let blackList = []

function loadMap(m, n) {
    players = []
    mines = []
    KILLS.innerHTML = ""

    clearInterval(inter)
    avalibleLocations = []
    while (GAMEDIV.lastChild) {
        GAMEDIV.removeChild(GAMEDIV.lastChild)
    }
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
    document.querySelector(".btnIndit").disabled = false;
}

function UpdateSliders() {
    let max = Math.floor(document.querySelector(".height").value * document.querySelector(".width").value / 2)
    document.querySelector(".mine").value = Math.min(document.querySelector(".mine").value, max)
    document.querySelector(".players").value = Math.min(document.querySelector(".players").value, max)
    document.querySelector(".mine").max = max
    document.querySelector(".players").max = max
}


function CreatePlayers(p) {
    loadMap(document.querySelector('.height').value, document.querySelector('.width').value)

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

    for (let i = 0; i < p; i++) {
        let location = RandomGen()
        let randomRow = location[0]
        let randowColumn = location[1]

        players.push({
            "id": i + 1,
            "class": "c" + randowColumn + "r" + randomRow,
            "column": randowColumn,
            "row": randomRow
        })
        let selectedElement = document.querySelector(".c" + randowColumn + "r" + randomRow)
        let playerChar = document.createElement("div")
        playerChar.innerText = i + 1
        playerChar.classList.add("player")
        selectedElement.appendChild(playerChar)
    }
    setTimeout(console.log("Started Interval"), 1000)
    inter = setInterval(MovePlayers, 1000)

    document.querySelector(".btnIndit").disabled = true;
}

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

        let moves = GetAllPossibleMoves(element.row, element.column)
        if (moves.length == 0) {
            kill(element, " was squished to death")
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
            kill(element, " fell to their demise")
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

function GetAllPossibleMoves(row, column) {
    let moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    let canMove = []
    moves.forEach(move => {
        let isPlayerThere = players.findIndex(e => e.row === row - move[0] && e.column === column - move[1])
        let isMineThere = blackList.findIndex(e => e.row === row - move[0] && e.column === column - move[1])
        let wallNotThere = true
        if (row - move[0] > rows - 1 || row - move[0] < 0 || column - move[1] > columns - 1 || column - move[1] < 0) {
            wallNotThere = false
        }
        if (isPlayerThere == -1 && isMineThere == -1 && wallNotThere) {
            canMove.push(move)
        }
    })
    return canMove
}

function kill(element, deathMessage) {
    let li = document.createElement("li")
    li.innerHTML = "Player " + element.id + deathMessage
    KILLS.appendChild(li)
    let index = players.findIndex(e => e.id === element.id);
    blackList.push({
        "row": element.row,
        "column": element.column
    })
    console.log(blackList)

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