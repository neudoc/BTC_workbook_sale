// ================================
// GLOBAL VARIABLES
// ================================

var imgOrigArr = [];  // Correct order of image pieces
var imgRandArr = [];  // Shuffled order of image pieces
var width;            // Total image width
var height;           // Total image height
var cellWidth;        // Width of each puzzle piece
var cellHeight;       // Height of each puzzle piece
var moveTime = 400;   // Animation duration in milliseconds

var imgCells = '';    // Puzzle piece DOM elements

var lever = 3;        // Difficulty level (3x3)

var isInGame = false; // Game status
var scroe = 0;        // Move counter

var presentImg;       // Current image in play
var passImg = [];     // Images already completed
var passKnowledge = {};  // Information tied to completed images

var s = 0

// ================================
// INIT GAME FUNCTION
// ================================

function initGame(img, clicktarger) {
    presentImg = img;
    $("#btn").unbind();
    $("#level").unbind();
    $("#game_result span").unbind();
    lever = 3;
    $("#level").text("레벨 1");

    $("#imgArea").fadeIn();
    $("#game_reward").fadeOut();

    $("#game_result span").text("보기");
    s = 0;

    if ($.inArray(img, passImg) != -1){
        $("#gameAnswer").text(passKnowledge[img]);
        $("#game_result span").css('background', '#62baa0');
        $("#game_result span").click(function () {
            if (s == 0){
                showReward(img);
            }else {
                showback();
            }
        });
    }else {
        $("#game_result span").css('background', '#5E5E5E');
    }

    if (isInGame){
            alertBox("이미지 변경", "게임이 진행 중입니다. 이미지를 바꾸고 다시 시작하시겠습니까?", function () {
            removeSclection();
            changeState(clicktarger);

            imgSplit(img);
            $("#btn").text("시작");
            isInGame = false;
            scroe = 0;
            $("#scroe").text("시도 0");
        })
    }else {
        if (clicktarger != undefined){
            removeSclection();
            changeState(clicktarger);
        }
        imgSplit(img);
    }

    bindbtn();
    bindlevel();
}

// ================================
// BIND START/RESET BUTTON
// ================================
function bindbtn() {
    $("#btn").click(function () {
        $("#imgArea").fadeIn();
        $("#game_reward").fadeOut();
        if (isInGame){
             alertBox("이미지 변경", "게임이 진행 중입니다. 이미지를 바꾸고 다시 시작하시겠습니까?", function () {
                imgSplit(presentImg);
                rebackGame();
            })
        }else {
            imgSplit(presentImg);
            randomArr();
            cellOrder(imgRandArr);
            beginGamePc();
            beginGamePhone();
            $("#btn").text("리셋");
            isInGame = true;
            scroe = 0;
            $("#scroe").text("시도 0");
        }
    });
}
function bindlevel() {
    $("#level").click(function () {
        // Update the puzzle level: cycle from 3 to 6
        if (lever < 6) {
            lever += 1;
        } else {
            lever = 3;
        }

        // Determine display level and color
        const displayLevel = lever - 2;
        let color = "#7ED321"; // default green

        switch (lever) {
            case 3: color = "#7ED321"; break; // 레벨 1 – Green
            case 4: color = "#4A90E2"; break; // 레벨 2 – Blue
            case 5: color = "#F8E71C"; break; // 레벨 3 – Yellow
            case 6: color = "#F5A623"; break; // 레벨 4 – Orange
        }

        // Update display and behavior depending on game state
        const updateLevelButton = function () {
            imgSplit(presentImg);
            $("#level")
                .text("레벨 " + displayLevel)
                .css({
                    "background-color": color,
                    "color": lever === 5 ? "black" : "white"  // contrast on yellow
                });
        };

        if (isInGame) {
            alertBox("재시작", "게임이 아직 끝나지 않았습니다. 난이도를 변경하고 다시 시작하시겠습니까?", function () {
                rebackGame();
                updateLevelButton();
            });
        } else {
            updateLevelButton();
        }
    });
}


function rebackGame() {
    imgCells.unbind("mouseover");
    imgCells.unbind("mouseout");
    imgCells.unbind("mousedown");
    imgCells.off("touchstart");
    $("#btn").text("시작");
    isInGame = false;
    scroe = 0;
    $("#scroe").text("시도 0");
}


function imgSplit(img) {
    width = $("#imgArea").width();
    height = $("#imgArea").height();
    cellWidth = width/lever;
    cellHeight = height/lever;

    imgOrigArr = [];
    imgRandArr = [];
    var cell = '';
    $("#imgArea").html("");
    for (var i = 0; i < lever; i++){
        for (var j = 0; j < lever; j++){
            imgOrigArr.push(i*lever+j);
            cell = document.createElement("div");
            cell.className = "imgCell";
            $(cell).css({width: cellWidth - 2, height: cellHeight - 2, left: j * cellWidth, top: i * cellHeight, background: "url('"+ img +"')", backgroundSize: width + 'px ' + height + 'px', backgroundPosition: (-j)*cellWidth + 'px ' + (-i)*cellHeight + 'px'});
            $("#imgArea").append(cell);
        }
    }
    imgCells = $(".imgCell");
    imgCells.css('cursor', 'pointer');
}


function beginGamePc() {

    imgCells.bind("mouseover", function () {
        $(this).addClass("hover");
    });

    imgCells.bind("mouseout", function () {
        $(this).removeClass("hover");
    });

    imgCells.bind("mousedown", function (e) {
        $(this).css('cursor','move');


        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.pageX - $(this).offset().left;
        var cell_mouse_y = e.pageY - $(this).offset().top;


        $(document).bind("mousemove", function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).bind("mouseup", function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.pageX - $("#imgArea").offset().left, e3.pageY - $("#imgArea").offset().top, cellIndex_1);
            //console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }

            $(document).unbind('mousemove').unbind('mouseup');
        })
    });

    imgCells.bind("mouseup", function () {
        $(this).css('cursor','pointer');
    })
}


function beginGamePhone() {
    imgCells.on('touchstart', function (e) {
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.touches[0].pageX - $(this).offset().left;
        var cell_mouse_y = e.touches[0].pageY - $(this).offset().top;
        $(document).on('touchmove', function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.touches[0].pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.touches[0].pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).on('touchend', function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.changedTouches[0].pageX - $("#imgArea").offset().left, e3.changedTouches[0].pageY - $("#imgArea").offset().top, cellIndex_1);
            //console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }

            $(document).off('touchmove').off('touchend');
        })
    });
}


function randomArr() {
    imgRandArr = [].concat(imgOrigArr);
    for (var i = 0; i < imgOrigArr.length; i++){
        imgRandArr.sort(function () {
            return 0.5 - Math.random();
        });
    }
    /*console.log("before:"+imgOrigArr);
    console.log("after:"+imgRandArr);*/
}


function cellOrder(arr) {
    for (var i = 0; i < arr.length; i++){
        imgCells.eq(i).animate({
            left: arr[i] % lever * cellWidth,
            top: Math.floor(arr[i] / lever) * cellHeight     //Math.floor向下取值（1.6为1）
        }, moveTime);
    }
}


function cellChangeIndex(x, y, index1) {
    if (x < 0 || x > width || y < 0 || y > height){
        return index1;
    }
    var row = Math.floor(y / cellHeight);
    var col = Math.floor(x / cellWidth);
    var position = row * lever + col;
    
    var i = 0;
    while ((i < imgRandArr.length) && (imgRandArr[i] != position)){
        i++;
    }
    return i;
}

function cellReturn(index) {
    var row = Math.floor(imgRandArr[index]/lever);
    var col = imgRandArr[index] % lever;

    imgCells.eq(index).animate({
        left: col * cellWidth,
        top: row * cellHeight
    }, moveTime, function () {
        imgCells.eq(index).css('z-index','10');
    })
}

function cellExchange(indexfrom, indexto) {
    var rowform = Math.floor(imgRandArr[indexfrom] / lever);
    var colform = imgRandArr[indexfrom] % lever;
    var rowto = Math.floor(imgRandArr[indexto] / lever);
    var colto = imgRandArr[indexto] % lever;


    imgCells.eq(indexfrom).animate({
        left: colto * cellWidth,
        top: rowto * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexfrom).css('z-index','10');
    });

    imgCells.eq(indexto).css('z-index','30').animate({
        left: colform * cellWidth,
        top: rowform * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexto).css('z-index','10');


        var temp = imgRandArr[indexfrom];
        imgRandArr[indexfrom] = imgRandArr[indexto];
        imgRandArr[indexto] = temp;

        $("#scroe").text("시도 " + (scroe+=1));


        if (checkPass(imgOrigArr, imgRandArr)){
            passGame();
        }
    })
}


function checkPass(rightArr, puzzleArr) {
    if (rightArr.toString() == puzzleArr.toString()){
        return true;
    }
    return false;
}


function passGame() {
    if (typeof window.sendScore === 'function') {
        window.sendScore(4, lever * 10, scroe);
    }
    if ($.inArray(presentImg, passImg) == -1){
        passImg.push(presentImg);

        $("#gameAnswer").html('<span style="color:#e65100; font-weight:bold;">🎉 축하합니다! 성공했습니다! 🎉</span><br>이동 횟수: ' + scroe);
        passKnowledge[presentImg] = ' 완료 ' + scroe;

        rebackGame();

        $("#game_result span").css('background', '#62baa0');
        $("#game_result span").click(function () {
            if (s == 0){
                showReward(presentImg);
            }else {
                showback();
            }
        });
    }else {
        $("#gameAnswer").html('<span style="color:#e65100; font-weight:bold;">🎉 축하합니다! 성공했습니다! 🎉</span><br>이동 횟수: ' + scroe);
        passKnowledge[presentImg] = '완료 ' + scroe;

        rebackGame();

        console.log("info:"+passKnowledge[presentImg]);
        showReward(presentImg);
    }
}


function showReward(img) {
    $("#imgArea").fadeOut();
    $("#game_reward").fadeIn();
    $("#btn").unbind();
    $("#level").unbind();
    $("#game_result span").text("돌아가기");
    $("#game_reward").css({background: 'url('+ img +')', backgroundSize: width + 'px ' + height + 'px'});
    s = 1;
}


function showback() {
    $("#imgArea").fadeIn();
    $("#game_reward").fadeOut();
    bindbtn();
    bindlevel();
    $("#game_result span").text("보기");
    s = 0;
}