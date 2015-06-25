var kBoardWidth = 8;
var kBoardHeight= 8;
var kPieceWidth = 50;
var kPieceHeight= 50;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;
var gDrawingContext;
var gPattern;

var gPieces;
var gNumPieces;

var gBlackCount = 2;
var gWhiteCount = 2;

var CELL_WHITE = 1;
var CELL_BLACK = 2;
var gCurrentColor = CELL_BLACK;

// var gMoveCountElem;
// var gGameInProgress;

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}

function canvasOnClick(e) {
    var cell = getCursorPosition(e);
    
    if (gPieces[cell.row][cell.column] != 0)
        return;// clickOnPiece, do no-op

    //click on empty cell, check and do operation
    clickOnEmptyCell(cell);
}

function changeTurn(){
    if (gCurrentColor == CELL_BLACK) {
        gCurrentColor = CELL_WHITE;
    }else{
        gCurrentColor = CELL_BLACK;
    }
}

function directionIsAvaible(cellCount , cell , nextCell){
	// console.log("[%d,%d]",cell.row,cell.column);
	// console.log("next [%d,%d]",nextCell.row,nextCell.column);
		
	//error
	if(cellCount > 8){
		return false;
	}

	cellCount++;
	// console.log(cellCount);
	if(nextCell.row > kBoardHeight-1 || nextCell.column >kBoardWidth - 1 || nextCell.column < 0 || nextCell.row < 0){
		return false;
	}else if(gPieces[nextCell.row][nextCell.column] == 0){
		return false;
	}else if(gPieces[nextCell.row][nextCell.column] == gCurrentColor){
		// console.log("count = %d ",cellCount);
		if(cellCount > 1){//next cell not the neighbor of original cell
			return true;
		}else{
			return false;
		};
	}else{
		var tempCell = new Cell(cell.row,cell.column);
		// console.log("tempCell [%d,%d]",tempCell.row,tempCell.column);
		cell = new Cell(nextCell.row,nextCell.column);
		nextCell.row = nextCell.row + nextCell.row - tempCell.row;
		nextCell.column = nextCell.column + nextCell.column - tempCell.column;
		// console.log("send cell [%d,%d] send next cell [%d,%d]",cell.row,cell.column,nextCell.row,nextCell.column);
		return directionIsAvaible(cellCount, cell, nextCell);
	}
}

function changeColor(aRow,aColumn,cell){
	//for current color, it will increase one chess
	//for another color, we will minus one more chess because using while loop
	//so we add 1 to both whit and black in here
	
	var row = cell.row + aRow;
	var column = cell.column + aColumn;
	//reset cell which user click on
	while(gPieces[row][column] != gCurrentColor){
		if (gCurrentColor == CELL_BLACK) {
			gBlackCount++;
			gWhiteCount--;
		}else{
			gBlackCount--;
			gWhiteCount++;
		}
		gPieces[row][column] = gCurrentColor;
		row += aRow;
		column += aColumn;
	}

}

function cellIsAvailable(cell){

	var isAvailable = false;
	

	//check 8 directions
	for(i = -1 ; i <= 1 ; i++){
		for(j = -1 ; j <= 1 ; j++){
			console.log("%d,%d",i,j);
			if(directionIsAvaible(0 , cell , new Cell(cell.row + i, cell.column + j))){
    			changeColor(i, j, cell);
    			isAvailable = true;
    		}
		}
	}		    

	console.log(isAvailable);
    return isAvailable;
}

function clickOnEmptyCell(cell) {
    if(cellIsAvailable(cell)){
    	if(gCurrentColor == CELL_BLACK){
    		gBlackCount++;
    	}else{
    		gWhiteCount++;
    	}
    	gPieces[cell.row][cell.column]=gCurrentColor;
    	document.getElementById("blackcount").innerHTML= gBlackCount;
    	document.getElementById("whitecount").innerHTML= gWhiteCount;
        drawBoard();
        changeTurn();
    }
}



function drawBoard() {
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
    gDrawingContext.beginPath();
    
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
        gDrawingContext.moveTo(0.5 + x, 0);
        gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
        gDrawingContext.moveTo(0, 0.5 + y);
        gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    // draw chess 
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
    for (var i = 0; i < kBoardHeight; i++) {
        for(var j =0; j < kBoardWidth; j++){
            if (gPieces[i][j] != 0){
                drawPiece(i,j,gPieces[i][j]);
            }
        }
    }
}

function drawPiece(row,column,color) {
    // var column = p.column;
    // var row = p.row;
    // var color = p.color;
    var x = (column * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    if (color == CELL_BLACK) {
    gDrawingContext.fillStyle = "#000";
    gDrawingContext.fill();
    }
}


function newGame() {
	
	gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", canvasOnClick, false);
   
    gDrawingContext = gCanvasElement.getContext("2d");
    //use 2D array to store the board
    gPieces = [];
    for(var i = 0; i < kBoardHeight; i++){
        gPieces[i]=[];
        for(var j = 0; j < kBoardWidth; j++){
            gPieces[i][j] = 0;
        }
    }

    // initial chess
    var hCenter = Math.floor((kBoardHeight-1)/2);
    var wCenter = Math.floor((kBoardWidth-1)/2);
    gPieces[hCenter][wCenter] = CELL_BLACK;
    gPieces[hCenter + 1][wCenter + 1] = CELL_BLACK;
    gPieces[hCenter][wCenter + 1] = CELL_WHITE;
    gPieces[hCenter + 1][wCenter] = CELL_WHITE;

    gBlackCount = 2;
    gWhiteCount = 2;
    document.getElementById("blackcount").innerHTML= gBlackCount;
    document.getElementById("whitecount").innerHTML= gWhiteCount;

    drawBoard();
}

// function endGame() {
//     gSelectedPieceIndex = -1;
//     gGameInProgress = false;
// }

function initGame() {
    // if (!canvasElement) {
    canvasElement = document.createElement("canvas");
    canvasElement.id = "halma_canvas";
    document.body.appendChild(canvasElement);
    
    
    // document.getElementById("replay").onclick = newGame();
    

   
    newGame();
}