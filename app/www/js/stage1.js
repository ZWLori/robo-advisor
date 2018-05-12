// False: lab experiment; True: online version
var online_version = false;
var container = $("#chatContainer");
var chosen_options = []
var roboName = ""
// Generate random user id, a 6-digit value
var user_id = Math.floor(Math.random() * 900000) + 100000;
sessionStorage.setItem('user_id', user_id);

$(window).on('load', function () {
    if (online_version) {
        $("#expIndex").css('display', 'none');
        rand_int = Math.random() > 0.5 ? 1 : 0;
        if (rand_int)
            var convStyle = 'submissive';
        else
            var convStyle = 'dominant';
    }
})

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
    return {
        "box":
        box,
        "text":
        text
    }
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
    html_str = "<div class='msg-row msg-right'>";
    for (c in content_list) {
        html_str += "<button class='btn btn-primary option' onclick=chose_opt(this)>" + content_list[c] + "</button>";
    }
    ;
    container.append(html_str + "</div>");
}

// Response after user chosing an option
function chose_opt(ele) {
    if (ele.innerText == "I'm ready to proceed!") {
        document.location.href = 'demo.html';
        // store the chosen options
        return
    }
    $("#options").remove();
    chosen_options.push(ele.innerText);
    right_chat_box= create_chat_box("right", ele.innerText);
    add_text(right_chat_box.box, right_chat_box.text);

    res = robo_response(ele.innerText);
    left_chat_box= create_chat_box("left", res);
    create_wait_animation(left_chat_box.box);
    simulate_delay(left_chat_box).then(()=>
        user_options(res));
}

async function simulate_delay(box) {
    await timeout(1000);
   remove_wait_animation(box.box);
   add_text(box.box, box.text);
}

function timeout (ms) {
    return new Promise(res => setTimeout(res,ms));
}

// Logic flow
function robo_response(ans) {
    // ans = ans.toLowerCase()
    console.log(ans);
    switch (ans) {
        case "I’m feeling good":
        case "I’m doing okay":
            res = "May I get to know a little more about you?";
            break;
        case "Finish":
            res = "Thank you very much! Now I’ll work out a wealth management plan for you!"
            store_user_input();
            break;
        default:
            res = "Finish?";
            break;
    }
    return res;
}

function user_options(res) {
    // res = res.toLowerCase();
    switch (res) {
        case "May I get to know a little more about you?":
            html_text = "My name is <input id='user_name' type='text'>, ";
            html_text += "I’m <select id='user_gender'><option value='male'>male</option><option value='female'>female</option></select>.";
            html_text += "I’m <select id='marital_status'><option value='married'>married</option><option value='single'>single</option></select>, "
            html_text += "and have <select id='child_num'><option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='more'>More</option></select> children. ";
            html_text += "My annual income is about <input id='annual_income' type='text'>, ";
            html_text += "and my expectation for you is <input id='user_exp' type='text'> (annualized return: 5, 10, 15%)."
            box=create_chat_box("right", html_text);
            add_text(box.box, box.text);
            create_options(["Finish"]);
            break;
        default:
            opt = ["I'm ready to proceed!"];
            create_options(opt);
            break;
    }
    return;
}

function get_attrs() {
    roboName = document.getElementById("name").value;
    gender = document.getElementById("gender");
    gender = gender.options[gender.selectedIndex].value;

    // store the info
    sessionStorage.setItem("roboName", roboName);
    sessionStorage.setItem("roboGender", gender);

    if (!online_version) {
        convStyle = document.getElementById("convStyle");
        convStyle = convStyle.options[convStyle.selectedIndex].value;
        sessionStorage.setItem("convStyle", convStyle);
    }

    document.getElementById("attrForm").style.display = 'none';
    document.getElementById("chatContainer").style.display = 'table';
    // change the avatar based on requirements   
    if (convStyle == 'dominant')
        container.prepend('<img src="images/avatar/(YH)RoboAdvisor_dominant.gif" class="robo-img">');
    else if (convStyle == 'submissive')
        container.prepend('<img src="images/avatar/(YH)RoboAdvisor_submissive.gif" class="robo-img">');
    response_box = create_chat_box("left", "Hi, my name is " + roboName + " and I help people manage their portfolio. How are you doing today?");

    create_wait_animation(response_box.box);
    simulate_delay(response_box).then(()=>
    create_options(["I’m feeling good", "I’m doing okay"]));

}

function store_user_input() {
    try {
        $.post('/upload.php', {
            'stage': 'orientation',
            'id': user_id,
            'name': $("#user_name").val(),
            'gender': $('#user_gender').find(':selected').text(),
            'marital_status': $('#marital_status').find(':selected').text(),
            'child_num': $('#child_num').find(':selected').text(),
            'annual_income': $('#annual_income').val(),
            'expectation': $('#user_exp').val()
        })
    }
    catch(err) {
    }

}
