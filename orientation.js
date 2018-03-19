var container = document.getElementById("chat-container");
var chosen_options = []
var roboName = ""

//Create html chat box
function create_chat_box(side, content){
    box = document.createElement("div");
    text = document.createElement("div");
    box.className = "box";
    if (side == "left") {
        text.className = "left_box";
    } else {
        text.className = "right_box";
    }
    text.innerHTML = content;
    box.appendChild(text);
    container.appendChild(box);
}

//Create html element for options
function create_options(content_list){
    html_str = "<div class='options' id='options'>";
    for (c in content_list){
        html_str += "<button class='btn option' onclick=chose_opt(this)>" + content_list[c] + "</button>";
    };
    container.innerHTML += html_str + "</div>";
}

// Response after user chosing an option
function chose_opt(ele){
    if (ele.innerText == "I'm ready to proceed!"){
        document.location.href = 'demo.html';
        // store the chosen options
        return
    }
    container.removeChild(document.getElementById("options"));
    chosen_options.push(ele.innerText);
    create_chat_box("right", ele.innerText);
    setTimeout(function(){
        res = robo_response(ele.innerText)
        create_chat_box("left", res);
        user_options(res);
    }, 1000)
}

// Logic flow
function robo_response(ans){
    // ans = ans.toLowerCase()
    console.log(ans);
    switch (ans){
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
    switch(res) {
        case "May I get to know a little more about you?":
            html_text = "My name is <input id='user_name' type='text'>, ";
            html_text += "I’m <select id='user_gender'><option value='male'>male</option><option value='female'>female</option></select>.";
            html_text += "I’m <select id='marital_status'><option value='married'>married</option><option value='single'>single</option></select>, "
            html_text += "and have <select id='child_num'><option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='more'>More</option></select> children. ";
            html_text += "My annual income is about <input id='annual_income' type='text'>, ";
            html_text += "and my expectation for you is <input id='user_exp' type='text'> (annualized return: 5, 10, 15%)."
            create_chat_box("right", html_text);
            create_options(["Finish"]);
            break;
        default:
            opt = ["I'm ready to proceed!"];
            create_options(opt);
            break;
    }
    return;
}

function get_attrs(){
    roboName = document.getElementById("name").value;
    gender = document.getElementById("gender");
    gender = gender.options[gender.selectedIndex].value;
    convStyle = document.getElementById("conv-style");
    convStyle = convStyle.options[convStyle.selectedIndex].value;
    // store the info
    sessionStorage.setItem("roboName", roboName);
    sessionStorage.setItem("roboGender", gender);
    sessionStorage.setItem("convStyle", convStyle);

    document.getElementById("attribute-form").style.display = 'none';
    document.getElementById("chat-container").style.display = 'table';
    // TODO change the avatar based on requirements    
    container.innerHTML = '<img src="images/butler_avatar.png" style="display:block; margin:auto">';
    create_chat_box("left", "Hi, my name is " +roboName+ " and I help people manage their portfolio. How are you doing today?");
    create_options(["I’m feeling good", "I’m doing okay"]);
}

function store_user_input(){
    user_name = document.getElementById("user_name").value;
    user_gender = document.getElementById("user_gender");
    user_gender = user_gender.options[user_gender.selectedIndex].value;
    user_marital_status = document.getElementById("marital_status");
    user_marital_status = user_marital_status.options[user_marital_status.selectedIndex].value;
    user_child_num = document.getElementById("child_num");
    user_child_num = user_child_num.options[user_child_num.selectedIndex].value;
    user_annual_income = document.getElementById("annual_income").value;
    user_exp = document.getElementById("user_exp").value;
    console.log(user_marital_status);
    // store the info
}
