// False: lab experiment; True: online version
var online_version = false;
var container = $("#chatContainer");
var chosen_options = [];
var roboScriptLst = [];
var responseOptsLst = [];
var convRoundCount = 0;
var userInputs = [];

$(window).on('load', function(){
    convStyle = get_attrs();
    if (convStyle == "dominant")
        file = "scripts/dominant.json"
    else
        file = "scripts/submissive.json"
    $.getJSON(file, "", function(data){
        $.each(data["orientation"], function (infoIndex, info){
            for(i=0; i<info.length; i++){
                conv = info[i];
                roboScriptLst.push(conv[0]);
                responseOptsLst.push(conv[1]);
            }
        })
        oneConvRound(convRoundCount);
    });

});

function get_attrs() {
    convStyle = sessionStorage.getItem("convStyle");
    // change the avatar based on requirements
    if (convStyle == 'dominant'){
        $("#robo-image").attr("src", "images/avatar/D-Robo.png");
        $(".user-description").prepend("<h3>Max</h3>");
    }
    else if (convStyle == 'submissive'){
        $("#robo-image").attr("src", "images/avatar/S-Robo.png");
        $(".user-description").prepend("<h3>Linus</h3>");
    }
    return convStyle;
}

async function oneConvRound(index){
    if (convRoundCount >= roboScriptLst.length)
        return
    robo = roboScriptLst[index];
    for (i=0;i<robo.length;i++) {
        // add delay before wait dots
        await timeout(200);
        // add the wait dots
        wait_box = create_chat_box("left", "");
        create_wait_animation(wait_box.box);
        // remove the wait dots
        await simulate_delay(wait_box);
        // display message
        box = create_chat_box("left", robo[i]);
        add_text(box.box, box.text);
    }
    create_options(responseOptsLst[index]);
    convRoundCount += 1;
}

//Create html chat box
function create_chat_box(side, content) {
    box = document.createElement("div");
    text = document.createElement("div");
    text.innerHTML = content;
    // box.className = "box";
    if (side == "left") { //robot side
        box.className = "msg-row msg-left";
        text.className = "msg msg-bounce-in-left";

    } else {
        box.className = "msg-row msg-right";
        text.className = "msg msg-bounce-in-right";

    }
    container.append(box);
    return { "box": box, "text": text };
}

function add_text(box, text) {
    box.appendChild(text);
}

function create_wait_animation(box) {
    var wait_dots = document.createElement("div");
    wait_dots.className = "msg wait-dots";

    var dots = [];
    for (var i = 0; i < 3; i++) {
        dots[i] = document.createElement("div");
        dots[i].className = "dot";
        wait_dots.appendChild(dots[i]);
    }
    box.appendChild(wait_dots);
}


function remove_wait_animation(box) {
    $(".wait-dots").remove();
}

//Create html element for options
function create_options(content_list) {
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    html_str = "<div class='msg-row msg-right'>";
    for (c in content_list) {
        html_str += "<button class='btn btn-primary option' onclick=chose_opt(this)>" + content_list[c] + "</button>";
    }
    container.append(html_str + "</div>");
}

// Response after user chosing an option
function chose_opt(ele) {
    if (ele.innerText == "I'm ready to proceed!") {
        store_user_input();
        document.location.href = 'stage2.html';
        return
    }
    userInputs.push(ele.innerText);
    $(ele).attr("disabled", "disabled");
    $(ele).siblings().attr("disabled", "disabled");
    $("#options").remove();
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    chosen_options.push(ele.innerText);
    right_chat_box= create_chat_box("right", ele.innerText);
    add_text(right_chat_box.box, right_chat_box.text);

    oneConvRound(convRoundCount);

}

async function simulate_delay(box) {
    await timeout(1000);
   remove_wait_animation(box.box);
   // add_text(box.box, box.text);
}

function timeout (ms) {
    return new Promise(res => setTimeout(res,ms));
}

function store_user_input() {
    if (sessionStorage.getItem('online'))
        studyNum = '';
    else
        studyNum = sessionStorage.getItem('studyNum');
    try {
        $.post('/upload.php', {
            'stage': 'orientation',
            'online': sessionStorage.getItem('online'),
            'matricNum': sessionStorage.getItem('matricNum'),
            'studyNum': studyNum,
            'convStyle': sessionStorage.getItem('convStyle'),
            'userInput': userInputs
        })
    }
    catch(err) {
        alert(err);
    }

}
