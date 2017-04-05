var field = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];  //紀錄位置有無球的陣列-初始值-0(沒有球)
var search_field = [];  //搜尋路徑用的陣列
var forRandom = Array();  //亂數用陣列
var selectedBallElementID = null;
var selectedBallElement_X = null;
var selectedBallElement_Y = null;
var selected = null;
var bg = null;
var moving = false;  //預設為false，也就是為0
var removing = false;  //預設為false，也就是為0
var start = null;
var score = 0;
//var record = readCookie("lines-score");
var selection = null;
//onload = init;

//設定TD標籤元件的屬性
function setTdAttr() {
    for (x = 0; x < ROWS; x++) {  //ROW橫欄
        for (y = 0; y < COLS; y++) {  //COL直欄
            var elementID = "#t_" + x + "_" + y;
            //div.path = null;
            //div.move = null;
            //div.removing = 100;
            //div.onclick = cellClick;
            //div.id = "t_" + i + "_" + j;
            $(elementID)
                .attr("y", x)
                .attr("x", y)
                .attr("path", Array())
                .attr("move", null)
                .attr("removing", "100");
        }
    }
}

//初始化div-table_board區域的table
function init_tab() {  //原始版
    var out_tab = "";
    out_tab += "<table id=board><tbody>";
    for (x = 0; x < ROWS; x++) {
        out_tab += "<tr>";
        for (y = 0; y < COLS; y++) {
            out_tab += "<td id=\"t_" + x + "_" + y + "\"></td>";
        }
        out_tab += "</tr>";
    }
    out_tab += "</tbody></table>";
    table_board.innerHTML = out_tab;
    setTdAttr();

    $("#board td").click(cellClick);  //為"#board td"元素註冊click事件

}//initialization table

//初始化info區域
function init_info() {
    info.innerHTML = "只有在路徑通暢的情況下，小球才能移動。<br />先點擊一個小球，然後點擊一個空格，小球就挪動了。<br />當同色的五個或五個以上的小球排成一條直線，或斜線時得分。 <br />[Olga Demina原創 (Winlinez/ Color Linez)]";
}//initialization info

//測試用(回傳ID值)
function td_clickEvent(e) {
    alert("Data(ID) = " + $(this).attr("id"));
}


//載入球的圖檔
for (var i = 0; i < 7; i++) {
    eval('var img' + i + ' = new Image();img' + i + '.src = "img/set01/b' + i + '.png";');
}

//初始化init()
function init() {
    bg = document.getElementById("bg");  //搜尋id=bg的元件
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            forRandom.push({ "x": i, "y": j });  //push給變數資料，令forRandom陣列的x屬性值等於i,y屬性值等於j
            //alert('var forRandom(x,y): ' + forRandom[forRandom.length - 1].x + " , " + forRandom[forRandom.length - 1].y + " , forRandom.length: " + forRandom.length);   //測試用(確認forRandom陣列的內容)

            //var div = document.createElement("div");  //建立div的元素
            //div.style.left = i * 50 + "px";
            //div.style.top = j * 50 + "px";
            //div.x = i;
            //div.y = j;
            //div.path = null;
            //div.move = null;
            //div.removing = 100;
            //div.onclick = cellClick;
            //div.id = "t_" + i + "_" + j;
            //bg.appendChild(div);
        }
    }
    forecast();  //預計(產生下組顆球)
    //if (document.getElementById("record").innerHTML = (record)) { record } else { 0 };  //record最高分的div
    dropBalls();  //落球(出球)
    document.getElementById("forecast").onclick = dropBalls;  //forecast下組顆球的div被按下時(onclick)，做呼叫function dropBalls
    setInterval(Step, 1);  //setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。(與setTimeout作用相同)

    selection = document.getElementById("selection");
    selection.jumpTo = function (x, y) {  //為selection寫入jumpTo方法
        //alert("我是selection.jumpTo()," + x + "," + y);   //測試用(show x , y 值)
        var elementID = "#t_" + y + "_" + x;
        $("td").css("background-color", "transparent");  //設所有TD的background-color為transparent(透明)
        $(elementID).css("background-color", "Red");
        //this.style.top = 50 * y + "px";
        //this.style.left = 50 * x + "px";
        //this.style.display = "block";
    };

    selection.hide = function () {  //為selection寫入hide方法
        $("td").css("background-color", "transparent");  //設所有TD的background-color為transparent(透明)
        //alert("我是selection.hide()");   //測試用
        //this.style.display = "none";
    };
    //setTimeout("window.scrollTo(100, 0)", 15);  //scrollTo() 方法可把内容滚动到指定的坐标。
}

//Click處理事件
function cellClick() {
    console.log('[[[cellClick()被呼叫了]]],moving??  ' + moving + ' ,removing??  ' + removing);
    if (moving || removing) { return; }
    //alert('this.x: ' + $(this).attr("x") + ' ,this.y: ' + $(this).attr("y"));
    if (this.className) {  //有className代表選擇是有球的
        selectedBallElement_X = $(this).attr("x");
        selectedBallElement_Y = $(this).attr("y");
        selectedBallElementID = "#t_" + selectedBallElement_X + "_" + selectedBallElement_Y;
        console.log('this.x :  ' + $(this).attr("x") + 'this.y :  ' + $(this).attr("y"));
        selected = this;  //借用全域變數selected，給它this這個元素
        selected = { "x": $(this).attr("x"), "y": $(this).attr("y"), "path": $(this).attr("path"), "move": $(this).attr("move"), "removing": $(this).attr("removing"), "sleClass": $(this).attr("class") };  //給它this這個元素的屬性
        console.log("[點選Ball的位置]selected(x,y) :  " + selected.x + " , " + selected.y);
        //alert('selectedBallElementID: ' + selectedBallElementID);  //測試用(show出selectedBallElementID值)
        //alert("我是呼叫selection的程式碼," + selectedBallElement_X + "," + selectedBallElement_Y);   //測試用
        selection.jumpTo($(this).attr("x"), $(this).attr("y"));
    } else {
        if (selectedBallElementID) {
            //alert("我是呼叫findPath的程式碼參數: " + selectedBallElement_X + " , " + selectedBallElement_Y + " , " + $(this).attr("x") + " , " + $(this).attr("y"));
            var path = findPath($(selected).attr("x"), $(selected).attr("y"), $(this).attr("x"), $(this).attr("y"));
            console.log('var path: ' + path);   //測試用(顯示findPath()回傳後的path內容)
            if (path) {
                //selectedBallElementID.path = path;
                $(selected).attr("path", path);
                console.log('$(selected).attr("path")後的[selected.path的內容] :  ' + $(selected).attr("path"));   //測試用
                //alert("moving: " + moving);  //測試用(取得moving變動前的資料)
                moving = selected; //moving變數設為selectedBallElementID，之後的「!moving」就會為「false」
                moving = { "x": $(selected).attr("x"), "y": $(selected).attr("y"), "path": $(selected).attr("path"), "move": $(selected).attr("move"), "removing": $(selected).attr("removing"), "movClass": $(selected).attr("sleClass") };
                //alert('selected.sleClass : ' + $(selected).attr("sleClass") + " , moving.class :  " + $(moving).attr("movClass"));
                console.log("【var moving內容】 x : " + moving.x + " ,y : " + moving.y + " , path : " + moving.path + " , move : " + moving.move + " , removing : " + moving.removing + " , movClass : " + moving.movClass);   //測試用
                start = { "x": selected.x, "y": selected.y };
                //alert("start.x :  " + start.x + " ,start.y: " + start.y);   //測試用
                selection.hide();
                selected = null;
                selectedBallElement = null;
                selectedBallElement_X = null;
                selectedBallElement_y = null;
            }
        }
    }
}

//單步移動Step()
function Step() {
    console.log('[[[Step()被呼叫了]]],moving??  ' + moving + ' ,removing??  ' + removing);
    var step = 10;
    //if (!moving && !removing) return;
    if (moving) {
        console.log('[我是 Step() -- if(moving){} ]__moving(x,y) :  ' + moving.x + ' , ' + moving.y);
        if (moving.move) {
            console.log('[我是 Step() -- if(moving){} -- if (moving.move){} ]');
            if (moving.move == "u") {
                console.log('[我是 Step() -- if(moving){} -- if (moving.move){} -- if (moving.move == "u"){} ]');
                //moving.style.marginTop = (!moving.style.marginTop) ? 0 : (parseInt(moving.style.marginTop) - step + "px");  //marginTop 属性设置元素的上外边距。
                //if (parseInt(moving.style.marginTop) == -50) finish(moving.x, moving.y * 1 - 1);
                finish(parseInt(moving.x), (parseInt(moving.y) * 1 - 1));

            }
            if (moving.move == "d") {
                console.log('[我是 Step() -- if(moving){} -- if (moving.move){} -- if (moving.move == "d"){} ]');
                //moving.style.marginTop = (!moving.style.marginTop) ? 0 : (parseInt(moving.style.marginTop) + step + "px");
                //if (parseInt(moving.style.marginTop) == 50) finish(moving.x, moving.y * 1 + 1);
                finish(parseInt(moving.x), (parseInt(moving.y) * 1 + 1));
            }
            if (moving.move == "l") {
                console.log('[我是 Step() -- if(moving){} -- if (moving.move){} -- if (moving.move == "l"){} ]');
                //moving.style.marginLeft = (!moving.style.marginLeft) ? 0 : (parseInt(moving.style.marginLeft) - step + "px");
                //if (parseInt(moving.style.marginLeft) == -50) finish(moving.x * 1 - 1, moving.y);
                finish((parseInt(moving.x) * 1 - 1), parseInt(moving.y));
            }
            if (moving.move == "r") {
                console.log('[我是 Step() -- if(moving){} -- if (moving.move){} -- if (moving.move == "r"){} ]');
                //moving.style.marginLeft = (!moving.style.marginLeft) ? 0 : (parseInt(moving.style.marginLeft) + step + "px");
                //if (parseInt(moving.style.marginLeft) == 50) finish(moving.x * 1 + 1, moving.y);
                finish((parseInt(moving.x) * 1 + 1), parseInt(moving.y));
            }
        } else {
            console.log('[我是 Step() -- if(moving){} -- else{} ]');
            moving.move = moving.path.pop();  //pop() 方法用于删除并返回数组的最后一个元素。
            console.log('[moving.move = moving.path.pop()]  ' + moving.move);  //測試用
        }
    } else {
        //console.log('[我是 Step() -- else{} ]');
        var removed = false;
        for (var i = 0; i < removing.length; i++) {
            console.log('[我是 Step() -- else{} -- for(){} ]');
            var cell = document.getElementById("t_" + removing[i].x + "_" + removing[i].y);
            console.log("[我是cell測試] : " + "t_" + removing[i].x + "_" + removing[i].y + " , [cell--]  " + cell);
            //var selectedID = "#t_" + y + "_" + x;
            //var next = selectedID;
            //next = { "x": $(selectedID).attr("x"), "y": $(selectedID).attr("y"), "path": $(selectedID).attr("path"), "move": $(selectedID).attr("move"), "removing": $(selectedID).attr("removing"), "nextClass": $(moving).attr("movClass") };
            if (cell) {
                var cellID = "#t_" + removing[i].x + "_" + removing[i].y;
                cellID = { "x": $(cellID).attr("x"), "y": $(cellID).attr("y"), "path": $(cellID).attr("path"), "move": $(cellID).attr("move"), "removing": $(cellID).attr("removing") };
            }
            if (cell.removing == 0) {
                console.log('[我是 Step() -- else{} -- for(){} -- if(){} ]');
                cell.removing = 100;
                cell.className = "";
                field[(removing[i].x)][(removing[i].y)] = 0;  //依照「removing[i]??的座標」,將field相對位置設為0(沒有球)
                forRandom.push({ "x": removing[i].x, "y": removing[i].y });
                removed = true;
            } else {
                console.log('[我是 Step() -- else{} -- for(){} -- else{} ]');
                cell.removing -= 50;
                cell.className = "ball0";
            }
        }
        if (removed) {
            console.log('[我是 Step() -- else{} -- if(removed){} ]');
            score += 10 + 4 * (removing.length - 5);
            document.getElementById("score").innerHTML = score;
            if (score > record) {
                console.log('[我是 Step() -- else{} -- if(removed){} -- if(score > record) ]');
                record = score;
                document.getElementById("record").innerHTML = record;
                createCookie("lines-score", record, 365);
            }
            removing = false;
        }
    }
}

//finish()做球的位移(顯示層面)
function finish(x, y) {
    console.log('[我是function finish()的一開始] x :  ' + x + ' , y : ' + y);
    var next = document.getElementById("t_" + y + "_" + x);
    console.log('next--  ' + next);
    if (next) {
        var nextID = "#t_" + y + "_" + x;
        nextID = { "x": $(nextID).attr("x"), "y": $(nextID).attr("y"), "path": $(nextID).attr("path"), "move": $(nextID).attr("move"), "removing": $(nextID).attr("removing"), "nextClass": $(moving).attr("movClass") };
    }
    if (!next) {
        moving = false;
        return;
    }
    if (!next.className) {
        //next.className = moving.className;
        $(next).addClass($(moving).attr("movClass"));  //addClass() 方法向被选元素添加一个或多个类。    该方法不会移除已存在的 class 属性，仅仅添加一个或多个 class 属性。    提示：如需添加多个类，请使用空格分隔类名。
        console.log("[我是驗證] moving.class : " + $(moving).attr("movClass") + " , next( " + next + " ).class :  " + $(next).attr("Class"));
        if (($(next).attr("Class")) == ($(moving).attr("movClass"))) {
            var old = document.getElementById("t_" + parseInt(moving.y) + "_" + parseInt(moving.x));
            $(old).removeClass(); //removeClass() 方法从被选元素移除一个或多个类。   注释：如果没有规定参数，则该方法将从被选元素中删除所有类。
        }
    }
    //moving.style.marginTop = 0;
    //moving.style.marginLeft = 0;
    console.log('[finish()266] moving.path.length :  ' + moving.path.length);
    if (!moving.path.length) {
        console.log('(!moving.path.length)(if)[進入]: (moving-x-y)' + moving.x + "," + moving.y);
        moving.path = null;
        moving.move = null;
        moving = false;
        //replaceRandom(x, y, start.x, start.y);
        field[x][y] = field[(start.x)][(start.y)];  //將「field參考[start]的位置」的相對座標的值，設給「field[x][y]位置」的座標的值
        field[(start.x)][(start.y)] = 0;            //將「field參考[start]的位置」的相對座標的值，設為0(沒有球)
        if (!checktheBall(x, y)) { dropBalls(); }
        console.log('(!moving.path.length)(if)[離開]: (moving-x-y)' + moving.x + "," + moving.y);
    } else {
        console.log('(moving.path.length)(else)[進入]: (moving-x-y)' + moving.x + "," + moving.y);
        console.log("【var moving內容】 x : " + moving.x + " ,y : " + moving.y + " , path : " + moving.path + " , move : " + moving.move + " , removing : " + moving.removing + " , movClass : " + moving.movClass);   //測試用
        nextID.path = moving.path;
        moving.path = null;
        moving.move = null;
        nextID.move = nextID.path.pop();  //pop() 方法用于删除并返回数组的最后一个元素。
        nextID.nextClass = $(moving).attr("movClass");
        moving = { 'x': nextID.x, 'y': nextID.y, 'path': nextID.path, 'move': nextID.move, "movClass": nextID.nextClass };
        //moving = { "x": $(selected).attr("x"), "y": $(selected).attr("y"), "path": $(selected).attr("path"), "move": $(selected).attr("move"), "removing": $(selected).attr("removing"), "movClass": $(selected).attr("sleClass") };
        console.log('(moving.path.length)(else)[離開前]: (moving-x-y)' + moving.x + "," + moving.y);
        //moving = next;
        //console.log("【var next內容】 x : " + $(next).attr("x") + " ,y : " + $(next).attr("y") + " , path : " + $(next).attr("path") + " , move : " + $(next).attr("move") + " , removing : " + $(next).attr("removing") + " , movClass : " + $(next).attr("Class"));   //測試用
        console.log('(moving.path.length)(else)[離開]: (moving-x-y)' + moving.x + "," + moving.y);
    }
    console.log('[我是function finish()的結尾](moving-x-y)  ' + moving.x + "," + moving.y);
}

//findPath()尋找路徑
function findPath(x1, y1, x2, y2) {
    //steps是個計步陣列物件
    var steps = Array();
    //alert("findPathData: x1= " + x1 + " ,y1= " + y1 + " ,x2= " + x2 + " ,y2= " + y2);   //測試用(findPathData收到的資料)
    search_field = Array(Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1),
				Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1),
				Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1), Array(-1, -1, -1, -1, -1, -1, -1, -1, -1));  //紀錄搜尋位置有無球的陣列-初始值-(-1，不為0，代表可移動)
    for (var i = 0; i < 9; i++) {  //Y軸0-8
        for (var j = 0; j < 9; j++) {  //X軸0-8
            //alert('field[('+i+')][('+j+')]: ' + field[(i)][(j)]);  //show出field[i][j]的數值
            if (field[(i)][(j)] != 0) {  //不等於0，表示有球
                search_field[(i)][(j)] = -2;  //設為-2代表真的有球
            }
        }
    }
    search_field[(x1)][(y1)] = 0;  //依據「選到的球的座標」將search_field相對位置設為0
    steps.push({ "x": x1, "y": y1, "step": 0 });  //給計步陣列一組資料{x屬性為球的起始x值(x1),y屬性為球的起始y值(y1),step屬性為步數起始-0-值}
    //alert('var steps(x,y,step): ' + steps[steps.length - 1].x + " , " + steps[steps.length - 1].y + " , " + steps[steps.length - 1].step + ",steps.length: " + steps.length);   //測試用(顯示steps陣列內容)
    var i = 0;  //i為findPath()尋路器計數變數
    while (true) {
        i++;
        console.log('[line315]i= ' + i);
        if (!steps.length) {  //如果steps陣列長度為0,表示該變數不是個陣列
            i = 85; console.log('[steps.length=0] i=85 : ' + steps.length);  //將i設為81  //除錯用為console.log
            break;  //返回父層並直接離開結束父層的{}區域
        }
        //cell是個變數物件
        var cell = steps.shift();  //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
        //alert('var cell(x,y,step): ' + cell.x + " , " + cell.y + " , " + cell.step);   //測試用(顯示cell變數內容)
        //alert("cell.x :  " + cell.x + " , cell.y:  " + cell.y);
        //alert("alert_Line_280<br>  " + "cell.y(!= 0): " + cell.y + " , " + " search_field[" + parseInt(cell.x) + "][" + (parseInt(cell.y) - 1) + "]: " + search_field[parseInt(cell.x)][(parseInt(cell.y) - 1)]);
        if ((cell.y != 0) && (search_field[parseInt(cell.x)][(parseInt(cell.y) - 1)] == -1)) {
            steps.push({ "x": parseInt(cell.x), "y": (parseInt(cell.y) - 1), "step": (parseInt(cell.step) + 1) });
            search_field[parseInt(cell.x)][(parseInt(cell.y) - 1)] = (parseInt(cell.step) + 1);
            console.log('run_line280');
        }
        //alert("alert_Line_285<br>  " + "cell.y(!= 8): " + cell.y + " , " + " search_field[" + parseInt(cell.x) + "][" + (parseInt(cell.y) + 1) + "]: " + search_field[parseInt(cell.x)][(parseInt(cell.y) + 1)]);
        if ((cell.y != 8) && (search_field[parseInt(cell.x)][(parseInt(cell.y) + 1)] == -1)) {
            steps.push({ "x": parseInt(cell.x), "y": (parseInt(cell.y) + 1), "step": (parseInt(cell.step) + 1) });
            search_field[parseInt(cell.x)][(parseInt(cell.y) + 1)] = (parseInt(cell.step) + 1);
            console.log('run_line285');
        }
        //alert("alert_Line_290<br>  " + "cell.x(!= 0): " + cell.x + " , " + " search_field[" + (parseInt(cell.x) - 1) + "][" + parseInt(cell.y) + "]: " + search_field[(parseInt(cell.x) - 1)][parseInt(cell.y)]);
        if ((cell.x != 0) && (search_field[(parseInt(cell.x) - 1)][parseInt(cell.y)] == -1)) {
            steps.push({ "x": (parseInt(cell.x) - 1), "y": parseInt(cell.y), "step": (parseInt(cell.step) + 1) });
            search_field[(parseInt(cell.x) - 1)][parseInt(cell.y)] = (parseInt(cell.step) + 1);
            console.log('run_line290');
        }
        //alert("alert_Line_295<br>  " + "cell.x(!= 8): " + cell.x + " , " + " search_field[" + (parseInt(cell.x) + 1) + "][" + (cell.y) + "]: " + search_field[(parseInt(cell.x) + 1)][(cell.y)]);
        if ((cell.x != 8) && (search_field[(parseInt(cell.x) + 1)][parseInt(cell.y)] == -1)) {
            steps.push({ "x": (parseInt(cell.x) + 1), "y": parseInt(cell.y), "step": (parseInt(cell.step) + 1) });
            search_field[(parseInt(cell.x) + 1)][parseInt(cell.y)] = (parseInt(cell.step) + 1);
            console.log('run_line295');
        }

        if ((cell.x == x2 && cell.y - 1 == y2) || (cell.x == x2 && cell.y + 1 == y2) ||
			(cell.x - 1 == x2 && cell.y == y2) || (cell.x + 1 == x2 && cell.y == y2)) {
            break;
        }
        if (i > 81) {
            console.log('line353: i > 81'); break;  //除錯用為console.log
        }
    }
    if (i > 81) { console.log('line356: i > 81 , return null'); return null; }  //除錯用為console.log

    var length = cell.step + 1;
    cell = { x: x2, y: y2, step: length };
    //console.log('var cell(x,y,step)[NEW]: ' + cell.x + " , " + cell.y + " , " + cell.step);   //測試用(顯示cell內容)
    steps = Array();  //初始化steps陣列
    while ((cell.x != x1) || (cell.y != y1)) {
        if ((cell.y != 0) && (search_field[parseInt(cell.x)][(parseInt(cell.y) - 1)] == (parseInt(cell.step) - 1))) {
            cell = { x: parseInt(cell.x), y: (parseInt(cell.y) - 1), step: (parseInt(cell.step) - 1) };
            steps.push("d");  //d=向下
        } else
            if ((cell.y != 8) && (search_field[parseInt(cell.x)][(parseInt(cell.y) + 1)] == (parseInt(cell.step) - 1))) {
                cell = { x: parseInt(cell.x), y: (parseInt(cell.y) + 1), step: (parseInt(cell.step) - 1) };
                steps.push("u");  //u=向上
            } else
                if ((cell.x != 0) && (search_field[(parseInt(cell.x) - 1)][parseInt(cell.y)] == (parseInt(cell.step) - 1))) {
                    cell = { x: (parseInt(cell.x) - 1), y: parseInt(cell.y), step: (parseInt(cell.step) - 1) };
                    steps.push("r");  //r=向右
                } else
                    if ((cell.x != 8) && (search_field[(parseInt(cell.x) + 1)][parseInt(cell.y)] == (parseInt(cell.step) - 1))) {
                        cell = { x: (parseInt(cell.x) + 1), y: parseInt(cell.y), step: (parseInt(cell.step) - 1) };
                        steps.push("l");  //l=向左
                    }
    }
    console.log('我是return的steps內容 :   ' + steps);
    return steps;
}

//getRandom()取亂數，回傳一組陣列有3筆資料，forecast()使用此function
function getRandom() {
    var res = Array();
    if (forRandom.length > 0) {
        for (var i = 0; i < 3 && forRandom.length; i++) {
            var num = Math.round(Math.random() * (forRandom.length - 1));
            res.push(forRandom[num]);
            for (var j = num; j < forRandom.length - 1; j++) {
                forRandom[j] = forRandom[j + 1];
            }
            forRandom.pop();  //pop() 方法用于删除并返回数组的最后一个元素。
        }
    }
    return res;
}

//forecast()產生下組顆球
function forecast() {
    var maxNum = 6;
    var minNum = 0;
    for (var i = 1; i < 4; i++) {
        var num = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        document.getElementById("ball-" + i).className = "ball" + num;
    }
}

//replaceRandom()隨機替換
function replaceRandom(oldx, oldy, newx, newy) {
    for (var j = 0; j < forRandom.length; j++) {
        alert('forRandom.length :  ' + forRandom.length + " , forRandom[j].x" + forRandom[j].x + " , forRandom[j].y" + forRandom[j].y);
        if (forRandom[j].x == oldx && forRandom[j].y == oldy) {
            forRandom[j].x = newx;
            forRandom[j].y = newy;
            return true;
        }
    }
}

//落球(出球)
function dropBalls() {
    console.log('[dropBalls()]被呼叫了');
    var nums = getRandom();  //getRandom()回傳一組陣列有3筆資料
    var loosed = true;
    for (var i = 0; i < nums.length; i++) {

        field[(nums[i].x)][(nums[i].y)] = document.getElementById("ball-" + (i + 1)).className.substring(4) * 1;
        //alert("Data = " + ballClassName);  //測試用
        //document.getElementById("t_" + nums[i].x + "_" + nums[i].y).className = document.getElementById("ball-" + (i + 1)).className;
        var ballClassName = document.getElementById("ball-" + (i + 1)).className;   //從forecast中的ball-(i + 1)取得className
        var elementID = "#t_" + nums[i].x + "_" + nums[i].y;
        $(elementID).addClass(ballClassName); //將elementID所指的TD元素，使用addClass()增加Class，增加Class值為ballClassName的值
        //$("t_" + nums[i].x + "_" + nums[i].y).attr('className', $("ball-" + (i + 1)).attr('className'));
        if (checktheBall(nums[i].x, nums[i].y)) { loosed = false; }
    }
    if (!forRandom.length && loosed) { loose(); }
    forecast();    //產生(下組顆球)
}

//loose失敗(遊戲結束)
function loose() {
    alert("Game over");
    // for (var i = 0; i < 9; i++) {
    // 	for (var j = 0; j < 9; j++) {
    // 		field[i][j] = 0;
    // 		var cell = document.getElementById("t_" + i + "_" + j);
    // 		cell.className = "";
    // 	}
    // }
    // search_field = [];
    // forRandom = [];
    //selectedBallElement = null;
    // moving = false;
    // removing = false;
    // start = null;
    // score = 0;
}


function checktheBall(x, y) {
    console.log('[checktheBall()]被呼叫了--(x, y)'+x+" , "+ y);
    var v = Array();
    var h = Array();
    var y1 = Array();
    var y2 = Array();
    var t1 = true;
    var t2 = true;
    var t3 = true;
    var t4 = true;
    var t5 = true;
    var t6 = true;
    var t7 = true;
    var t8 = true;
    var cur = field[x][y]; console.log('cur ' + cur);
    if (cur == 0) return false;
    var i = parseInt(0);
    while (t1 || t2 || t3 || t4 || t5 || t6 || t7 || t8) {
        i++; console.log('[while] 482(if)' + ((parseInt(x) - i) >= 0 && (parseInt(y) - i) >= 0 && field[(parseInt(x) - i)][(parseInt(y) - i)] == cur && t1));
        if ((parseInt(x) - i) >= 0 && (parseInt(y) - i) >= 0 && field[(parseInt(x) - i)][(parseInt(y) - i)] == cur && t1) {
            console.log('[checktheBall()]482(if)'); y2.push({ "x": (parseInt(x) - i), "y": (parseInt(y) - i) });
        } else {
            console.log('[checktheBall()]485(else)'); t1 = false;
        }
        console.log('[while] 488(if)' + ((parseInt(y) - i) >= 0 && field[parseInt(x)][(parseInt(y) - i)] == (cur && t2)));
        if ((parseInt(y) - i) >= 0 && field[parseInt(x)][(parseInt(y) - i)] == (cur && t2)) {
            console.log('[checktheBall()]489(if)'); v.push({ "x": parseInt(x), "y": (parseInt(y) - i) });
        } else {
            console.log('[checktheBall()]491(else)'); t2 = false;
        }
        console.log('[while] 494(if)' + ((parseInt(x) + i) < 9 && (parseInt(y) - i) >= 0 && field[(parseInt(x) + i)][(parseInt(y) - i)] == cur && t3));
        if ((parseInt(x) + i) < 9 && (parseInt(y) - i) >= 0 && field[(parseInt(x) + i)][(parseInt(y) - i)] == cur && t3) {
            console.log('[checktheBall()]495(if)'); y1.push({ "x": (parseInt(x) + i), "y": (parseInt(y) - i) });
        } else {
            console.log('[checktheBall()]497(else)'); t3 = false;
        }
        console.log('[while] 500(if)' + ((parseInt(x) - i) >= 0 && (parseInt(y) + i) < 9 && field[(parseInt(x) - i)][(parseInt(y) + i)] == cur && t4));
        if ((parseInt(x) - i) >= 0 && (parseInt(y) + i) < 9 && field[(parseInt(x) - i)][(parseInt(y) + i)] == cur && t4) {
            console.log('[checktheBall()]501(if)'); y1.push({ "x": (parseInt(x) - i), "y": (parseInt(y) + i) });
        } else {
            console.log('[checktheBall()]503(else)'); t4 = false;
        }
        console.log('[while] 506(if)' + ((parseInt(y) + i) < 9 && field[parseInt(x)][(parseInt(y) + i)] == cur && t5));
        if ((parseInt(y) + i) < 9 && field[parseInt(x)][(parseInt(y) + i)] == cur && t5) {
            console.log('[checktheBall()]507(if)'); v.push({ "x": parseInt(x), "y": (parseInt(y) + i) });
        } else {
            console.log('[checktheBall()]509(else)'); t5 = false;
        }
        console.log('[while] 512(if)' + ((parseInt(x) + i) < 9 && (parseInt(y) + i) >= 0 && field[(parseInt(x) + i)][(parseInt(y) + i)] == cur && t6));
        if ((parseInt(x) + i) < 9 && (parseInt(y) + i) >= 0 && field[(parseInt(x) + i)][(parseInt(y) + i)] == cur && t6) {
            console.log('[checktheBall()]513(if)'); y2.push({ "x": (parseInt(x) + i), "y": (parseInt(y) + i) });
        } else {
            console.log('[checktheBall()]515(else)'); t6 = false;
        }
        console.log('[while] 518(if)' + ((parseInt(x) - i) >= 0 && field[(parseInt(x) - i)][parseInt(y)] == cur && t7));
        if ((parseInt(x) - i) >= 0 && field[(parseInt(x) - i)][parseInt(y)] == cur && t7) {
            console.log('[checktheBall()]519(if)'); h.push({ "x": (parseInt(x) - i), "y": parseInt(y) });
        } else {
            console.log('[checktheBall()]521(else)'); t7 = false;
        }
        console.log('[while] 524(if)' + ((parseInt(x) + i) < 9 && field[(parseInt(x) + i)][parseInt(y)] == cur && t8));
        if ((parseInt(x) + i) < 9 && field[(parseInt(x) + i)][parseInt(y)] == cur && t8) {
            console.log('[checktheBall()]525(if)'); h.push({ "x": (parseInt(x) + i), "y": parseInt(y) });
        } else {
            console.log('[checktheBall()]527(else)'); t8 = false;
        }
    }
    var res = false; console.log('[res=false] 530'); console.log('531(if)' + (v.length > 3 || h.length > 3 || y1.length > 3 || y2.length > 3));
    if (v.length > 3 || h.length > 3 || y1.length > 3 || y2.length > 3) {
        console.log('[checktheBall()]532'); removing = Array({ "x": parseInt(x), "y": parseInt(y) }); console.log('[checktheBall()]532完, removing=Array(),內容: [length] ' + removing.length);
        console.log('[checktheBall()]533 [res=ture]'); res = true;
    } console.log('535(if)' + (v.length > 3));
    if (v.length > 3) {
        for (i = 0; i < v.length; i++) {
            console.log('[checktheBall()]537 v[' + i + ']  ' + v[i]); removing.push(v[i]);
        }
    } console.log('539(if)' + (h.length > 3));
    if (h.length > 3) {
        for (i = 0; i < h.length; i++) {
            console.log('[checktheBall()]541 h[' + i + ']  ' + h[i]); removing.push(h[i]);
        }
    } console.log('544(if)' + (y1.length > 3));
    if (y1.length > 3) {
        for (i = 0; i < y1.length; i++) {
            console.log('[checktheBall()]547 y1[' + i + ']  ' + y1[i]); removing.push(y1[i]);
        }
    } console.log('549(if)' + (y2.length > 3));
    if (y2.length > 3) {
        for (i = 0; i < y2.length; i++) {
            console.log('[checktheBall()]553 y2[' + i + ']  ' + y2[i]); removing.push(y2[i]);
        }
    }
    console.log('[checktheBall()]555  \"return res\"  ' + res); return res;
}


//function createCookie(name, value, days) {
//    if (days) {
//        var date = new Date();
//        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//        var expires = "; expires=" + date.toGMTString();
//    }
//    else expires = "";
//    document.cookie = name + "=" + value + expires + "; path=/";
//}


//function readCookie(name) {
//    var nameEQ = name + "=";
//    var ca = document.cookie.split(';');
//    for (var i = 0; i < ca.length; i++) {
//        var c = ca[i];
//        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
//        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//    }
//    return null;
//}