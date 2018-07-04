
var monthIndex = 0;
var totalInterval = 24;  // Investment horizon
var startY = 2016, startM = 1;
var principle = totalGain = 10000;
var low_mean = -0.03, low_var = 2.661;
var medium_mean = 0.452, medium_var = 2.661;
var high_mean = 1.158, high_var = 2.661;
var base_mean = 0.125;
var rangeLst = []; // store the user selected range value
var robo = [] // the returns from robo-advisor
var base = get_returns(base_mean, 0, totalInterval) // Fixed: annualized return
var user = [] // the returns for user TODO: fill-in the list
// datapoints
var dps_user = [], dps_base = [], dps_robo = [];
// cap values
var max_bonus = 10, min_bonus = 2;
// bonus convertion ratios
var conver_ratio1 = 1/200, conver_ratio_increase = 1/200, conver_ratio_decrease = 1/600;
// robo message lists

// underperform / balance / outperform
var up, bp, op;

var convStyle = sessionStorage.getItem("convStyle");

// Message Box
var msgContainer = $("#messageContainer");
var confirmCount = 0;
var messages = [];

// performance level: 0 - "low", 1 - "medium", 2 -"high"
if (sessionStorage.getItem("studyNum") == 1){
    var performanceLevelLst = [1,1];
    var conver_ratio = 1/200;
}
else if (sessionStorage.getItem("studyNum") == 2){
    randNum = Math.floor(Math.random() * 2);
    if (randNum == 0){ // deteriorated performance
        var performanceLevelLst = [1,0]
        var conver_ratio = 1/200;
    }
    else  {  // improved performance
        var performanceLevelLst = [1,2]
        var conver_ratio = 1/600;
    }
}
// for online pilot
else {
    var performanceLevelLst = [1,1];
    var conver_ratio = 1/200;
}

sessionStorage.setItem("performanceLevelLst", performanceLevelLst);

// Generate robo-advisor return based on performance
for (index=0; index<2; index++){
    switch(performanceLevelLst[index]) {
        // Low: annualized return = 6% +- 4%
        case 0 : robo = robo.concat(get_returns(low_mean, low_var, totalInterval/2)); break;
        // Medium: annualized return = 10% +- 4%
        case 1 : robo = robo.concat(get_returns(medium_mean, medium_var, totalInterval/2)); break;
        // High: annualized return = 18% +- 4%
        case 2 : robo = robo.concat(get_returns(high_mean, high_var, totalInterval/2)); break;
    }
}

// add slider
$("#slider").roundSlider({
    radius: 85,
    sliderType: "min-range",
    value: 50,
    width: 25,

});

$("#performance-slider").roundSlider({
    min: 0,
    max: 10,
    step: 1,
    value: 5,
    radius: 85,
    width: 25,
    sliderType: "min-range"
});

function read_slider_val(){
    var slider_obj = $("#slider").data("roundSlider");
    return slider_obj.option("value");
}

function read_performance_slider_val(){
    var slider_obj = $("#performance-slider").data("roundSlider");
    return slider_obj.option("value");
}


$(window).on('load', function(){
    get_attrs();
    if (convStyle == "dominant")
        file = "scripts/dominant.json"
    else
        file = "scripts/submissive.json"
    $.getJSON(file, "", function(data){
        $.each(data["experiment"], function (infoIndex, info){
            if (infoIndex == 'underperform')
                up = info[0];
            else if (infoIndex == 'outperform')
                op = info[0];
            else
                bp = info[0];
        })
    });
    $('.rs-tooltip-text').after("<div id='percentageSign'>%</div>");
});

function get_attrs() {
    // change the avatar based on requirements
    if (convStyle == 'dominant') {
        $("#robo-image").attr("src", "images/avatar/D-Robo.png");
        $(".user-description").prepend("<h3>Max</h3>");
    }
    else if (convStyle == 'submissive'){
        $("#robo-image").attr("src", "images/avatar/S-Robo.png");
        $(".user-description").prepend("<h3>Linus</h3>");
    }
}


for (i=0; i<totalInterval; i++){
    if (startM % 12 == 1){
        startY += 1;
        startM = 1;
    }
    dps_user.push({x:new Date(startY, startM-1)});
    dps_base.push({x:new Date(startY, startM-1)});
    dps_robo.push({x:new Date(startY, startM-1)})
    startM += 1;
}

var chart = new CanvasJS.Chart("chartContainer", {
    title :{
        text: "Investment returns over time"
    },
    axisX: {
        title: "Time",
    },
    axisY: {
        title: "Net Asset Value",
        includeZero: false
    },
    data: [{
        type: "line",
        showInLegend: true,
        legendText: "Robo Advisor",
        dataPoints: dps_robo
    },
        {
            type: "line",
            showInLegend: true,
            legendText: "Bank Deposit",
            dataPoints: dps_base
        },
        {
            type: "line",
            showInLegend: true,
            legendText: "Your Potfolio",
            dataPoints: dps_user,
            borderWidth: 2
        }
    ]
});
chart.render();

// update the chart with corresponding return values
function updateChart(index) {
    dps_robo[index]["y"] = robo[index];
    dps_base[index]["y"] = base[index];
    dps_user[index]["y"] = user[index];
    chart.render();
};

function normal_random(n, mean, variance) {
    if (mean == undefined)
        mean = 0.0;
    if (variance == undefined)
        variance = 1.0;
    var V1, V2, S;

    result = [];
    for(i=0; i<n; i++) {
        do {
            var U1 = Math.random();
            var U2 = Math.random();
            V1 = 2 * U1 - 1;
            V2 = 2 * U2 - 1;
            S = V1 * V1 + V2 * V2;
        } while (S > 1);

        X = Math.sqrt(-2 * Math.log(S) / S) * V1;
        //  Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
        X = mean + Math.sqrt(variance) * X;
        //  Y = mean + Math.sqrt(variance) * Y ;
        result.push(X);
    }

    return result;
}

function get_returns(mean, sd, n){
    var rnorm = normal_random(n=n, mean=mean, sd=sd)
    var cumsum = [];
    rnorm.reduce(function(a,b,i) { return cumsum[i] = a+b; },0);
    cumsum.forEach(function(element, index) {
        // cumsum[index] = element + 10000;
        cumsum[index] = (element + 100) * 0.01 * principle;
    })
    return cumsum;
}

function confirm(){
    if (monthIndex >= totalInterval) {
        save()
    }

    // range = slider.value;
    range = read_slider_val();

    // gain = corrsponding percentage * previous totalGain * gainRatio
    // monthly gain earned by robo & bank respectively
    if (monthIndex == 0) {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / principle - 1) ;
        bMGain = range * 0.01 * totalGain * (base[monthIndex] / principle - 1);
    } else {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / robo[monthIndex-1] - 1);
        bMGain = (1 - range * 0.01)  * totalGain * (base[monthIndex] / base[monthIndex-1] - 1);
    }

    totalGain = totalGain + rMGain + bMGain;
    margin = totalGain - principle;
    document.getElementById("total-return").innerHTML = Math.round(totalGain*100)/100;

    user.push(totalGain);
    rangeLst.push(range);
    updateChart(monthIndex);

    document.getElementById("1m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 1);
    document.getElementById("1m-base").innerHTML = calculatePastReturn(base, monthIndex, 1);
    document.getElementById("1m-user").innerHTML = calculatePastReturn(user, monthIndex, 1);

    if(monthIndex >= 2){
        document.getElementById("3m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 2);
        document.getElementById("3m-base").innerHTML = calculatePastReturn(base, monthIndex, 2);
        document.getElementById("3m-user").innerHTML = calculatePastReturn(user, monthIndex, 2);
    }

    if(monthIndex >= 5){
        document.getElementById("6m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 5);
        document.getElementById("6m-base").innerHTML = calculatePastReturn(base, monthIndex, 5);
        document.getElementById("6m-user").innerHTML = calculatePastReturn(user, monthIndex, 5);
    }
    // update messages
    if ($("#1m-user").text() > 0)
        messages.push(op[monthIndex]);
    else if ($("#1m-user").text() < 0)
        messages.push(up[monthIndex]);
    else
        messages.push(bp[monthIndex]);

    // Insert the new message into the bubble conversation list
    if (messages[confirmCount])
        insertMessage(messages[confirmCount]);
    confirmCount += 1;
    monthIndex += 1;
}

// Create HTML message bubble
function create_msg_bubble(side, content) {
    box = document.createElement("div");
    text = document.createElement("div");
    text.innerHTML = content;
    box.className = "msg-row msg-left";
    text.className = "msg msg-bounce-in-left";
    msgContainer.append(box);
    return {
        "box": box,
        "text": text
    };
}

// Insert message bubble into chatbox
function insertMessage(message) {
    box = create_msg_bubble("left", message);
    box.box.appendChild(box.text);
    $('.robot-content-top').stop().animate({scrollTop: msgContainer.height()}, 'slow');
}

function calculatePastReturn(lst, index, num){
    if (index){
        pastReturn = lst[index] - lst[index-num];
        val =  (pastReturn/lst[index-num]*100).toFixed(3);
    }
    else {
        pastReturn = lst[index] - principle;
        val = (pastReturn/principle*100).toFixed(3);
    }
    if (val < 0)
        return "<p style='color:#d40f00'>" + val + "</p>"
    else
        return "<p style='color:#63a863'>" + val + "</p>"

}

// TODO: change the cutoffs
switch(parseInt(performanceLevelLst[0])){
    // TODO: compute the cutoffs at the backend
    case 0:
        cutoffs = [-5.5467974, -2.5195815, -0.6626316, 0.6107510, 1.5078318, 2.0771923, 2.8745512, 4.3143522, 7.0121577]
        break;
    case 1:
        cutoffs = [-1.912314, 0.442828, 1.622759, 2.202695, 2.947375, 3.982879, 5.399530, 7.411935, 10.713197]
        break;
    case 2:
        cutoffs = [2.059108, 2.885755, 3.906269, 5.115775, 6.518824, 8.189085, 10.246733, 12.942468, 17.007296]
        break;
}
// Incentives schemes for participants
function compute_incentives(quantile){
    for (index in cutoffs){
        cutoff = cutoffs[index]
        if (cutoff >= quantile) {
            percentage_range = cutoffs.indexOf(cutoff) + 1;
            break;
        }
    }
    // Incentive criteria (rounded to integer)
    base = 5
    if (percentage_range <= 1)
	    return base
    // When performance quantile is between 10 - 60%:
    if (percentage_range <= 6)
        return base * (1 + percentage_range * 0.1).toFixed(1)
		// # 10 - 20% percentile: base*1.2
		// # 20 - 30% percentile: base*1.3

    // When performance quantile is between 60 - 95%:
    if (percentage_range < 10)
        return base * Math.pow((1+ percentage_range * 0.1), 2).toFixed(1)

    // When performance quantile is between 95 - 100%:
    return base * Math.pow((1+ percentage_range * 0.1), 3).toFixed(1)
}

//  Simulated returns of robo-advisors by past performance
// This function calculates the simulated returns for different scenarios
function simulate_performance(monthly_return, variance, n) {
	// simulating robo-advisor's performance, n denotes No. of simulations
	robo_simulations = []; // initiate empty vector
	for(i=0; i<n; i++) {
        performance = get_returns(monthly_return, variance, totalInterval);
        cum_performance = performance[totalInterval]; // overall performance by the final period
        robo_simulations.push(cum_performance);
	}
	// return robo_simulations; // return vector values

	// simulating weight-adjusted performance between robo and saving account
	weight = 100; // the weight varies from 1% to 100%
	total_simulations = [];

	for (i =0; i<100; i++){
	  total_simulations[i] = robo_simulations*i/100 + saving_returns*(100-i)/100;
	}
	return total_simulations;
}

function compute_bonus() {
    earn = totalGain - principle;
    bonus = Math.round(conver_ratio * earn);
    if (bonus < min_bonus)
        return min_bonus
    else if (bonus > max_bonus)
        return max_bonus
    return bonus
}

function save(){
    // quantile = (totalGain - principle) / principle * 100;
    // totalIncentives = compute_incentives(quantile);
    bonus = compute_bonus();
    sessionStorage.setItem('bonus', bonus);
    // TODO: check page content for storing the corresponding info
    // save the necessary info for later reference
    $.post('/upload.php', {
        'stage':'exp',
        'matric_number':sessionStorage.getItem('matricNum'),
        'user_gain_list':user,
        'performance': performanceLevelLst,
    })
    document.location.href = './stage3.html';
};
