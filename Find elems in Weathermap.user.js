// ==UserScript==
// @name         Find elems in Weathermap
// @namespace    https://github.com/vvkochanov/FindToWeathermap
// @version      0.3
// @description  The script finds elements of Weathermap
// @author       Vavan 2(va)n
// @include     http://*/cacti/plugins/weathermap/*
// @match       http://10.40.254.133/cacti/plugins/weathermap/*
// @match       http://10.40.254.159/cacti/plugins/weathermap/*
// @match       http://10.40.254.154/cacti/plugins/weathermap/*
// @require     https://yastatic.net/jquery/2.2.3/jquery.min.js
// ==/UserScript==

(function(window, undefined) {
    'use strict';
    // проверка на наличие jQuery
    var jQueryVer = "";
    try {
        jQueryVer = $().jquery;
    }
    catch(err) {
        console.log("jQuery not found." + err);
        // add support of jQuery to web-page
        var head = document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= 'http://code.jquery.com/jquery-latest.js';
        head.appendChild(script);
    }
    // Common function that returnes coordinates by text param area.coords
    function getCoord(sType, sCoords){
        var sRes;
        var aRes = sCoords.match(/(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/);
        if (aRes.length != 5) {return -1; }
        switch(sType) {
            case "top":
                sRes = aRes[2];
                break;
            case "left":
                sRes = aRes[1];
                break;
            case "width":
                sRes = aRes[3] - aRes[1];
                break;
            case "height":
                sRes = aRes[4] - aRes[2];
                break;
        }
        return sRes;
    }

try {
//
    var span = document.createElement("span");
    span.id = "usr_span";
    span.innerHTML = "<button id = 'usr_btn'>>";

    var input = document.createElement("input");
    input.id = "usr_findInp";
    input.type = "input";
    input.size = "10";
    input.value = "";

    var selDiv = document.createElement("div");
    var wmImg = document.getElementById("wmapimage");
    var brdr = 5;
    selDiv.id = "selDiv";
    selDiv.style.border = "solid " + brdr.toString() + "px red";
    selDiv.style.position = "absolute";
    //console.log(selDiv);

    var sendBtn = document.createElement("input");
    sendBtn.id = "user_send";
    sendBtn.type = "button";
    sendBtn.value = "Ok";
    sendBtn.addEventListener("click", function() {
        console.log("Нажата Ok");
        console.log(input.value);
        var areas = document.getElementsByTagName("area");
        for (var i = 0; i < areas.length; i++) {
            if (areas[i].getAttribute("href").search(input.value)>-1){
                var el = areas[i].href;
                console.log(el);

                var x = wmImg.getBoundingClientRect().left + Number(getCoord("left", areas[i].coords)) - brdr;
                var y = wmImg.getBoundingClientRect().top + Number(getCoord("top", areas[i].coords)) - brdr;
                selDiv.style.top = y.toString() + "px";
                selDiv.style.left = x.toString() + "px";
                selDiv.style.width = getCoord("width", areas[i].coords) + "px";
                selDiv.style.height = getCoord("height", areas[i].coords) + "px";
                console.log(selDiv);
                wmImg.parentNode.appendChild(selDiv);
                selDiv.focus();
                break;
            }
        }
        // span.removeChild(input);
        // span.removeChild(sendBtn);
        $(span).empty();
    });

    input.addEventListener("keydown", function(e) {
        if (e.which == 13) {//13 - это код клавиши "Enter"
            console.log("Enter key pressed");
            sendBtn.click();
        }
    });

    // var mdiv = document.getElementById("tabs");
    var mdiv = $("#tabs");
    // mdiv.appendChild(span);
    $("#tabs").append(span); // добавление элемента span с помощью jQuery
    var btn = document.getElementById("usr_btn");
    btn.addEventListener("click", function() {
        console.log("Кнопка нажата.");
        try {
            console.log("Found input: " + document.getElementById("usr_findInp"));
            if (document.getElementById("usr_findInp") !== null) {
                span.removeChild(input);
            }
            else {
                span.appendChild(input);
            }
            console.log("Found sendBtn: " + document.getElementById("user_send"));
            if (document.getElementById("user_send") !== null) {
                span.removeChild(sendBtn);
            }
            else {
                span.appendChild(sendBtn);
            }
            console.log(selDiv.style.left);
            wmImg.parentNode.removeChild(selDiv);
        }catch(err) {
            console.log("Error: " + err);
        }
    });
}
    catch(err) {
        console.log("Error: " + err);
    }
})(window);