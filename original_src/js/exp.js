var slider = document.getElementById("mySlider");
var output = document.getElementById("range");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}

var performance_slider = document.getElementById("performance_slider");
var performance_value = document.getElementById("performance_value");
performance_value.innerHTML = performance_slider.value;
performance_slider.oninput = function(){
    performance_value.innerHTML = performance_slider.value;
}

var preference_slider = document.getElementById("preference_slider");
var preference_value = document.getElementById("preference_value");
preference_value.innerHTML = preference_slider.value;
preference_slider.oninput = function(){
    preference_value.innerHTML = preference_slider.value;
}

var monthIndex = 0;
var totalInterval = 12;  // Investment horizon for main experiment
var startY = 2016, startM = 1;
var principle = totalGain = 10000;
var low_mean = -0.03, low_var = 2.661;
var medium_mean = 0.452, medium_var = 2.661;
var high_mean = 1.158, high_var = 2.661;
var base_mean = 0.125;
var rangeLst = []; // store the user selected range value
var robo = [] // the returns from robo-advisor 
var base = get_returns(base_mean, 0) // Fixed: annualized return
var user = [] // the returns for user TODO: fill-in the list
// datapoints
var dps_user = [], dps_base = [], dps_robo = [];

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
        title: "Time Horizon",
    },
    axisY: {
        title: "Net Asset Value",
        includeZero: false
    },
    data: [{
            type: "line",
            showInLegend: true,
            legendText: "Robo-Advisor",
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
            legendText: "Your portfolio",
            dataPoints: dps_user,
            borderWidth: 2
        }
    ]
});
chart.render();

performanceLevelInt = 1
console.log("performance level: " + performanceLevelInt);
switch(parseInt(performanceLevelInt)) {
    case 0 : robo = get_returns(low_mean, low_var); break; 
    case 1 : robo = get_returns(medium_mean, medium_var); break; 
    case 2 : robo = get_returns(high_mean, high_var); break; 
}
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
            var U1 = Math.random();    // TODO SET SEED
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

function get_returns(mean, sd){
    var rnorm = normal_random(n=totalInterval, mean=mean, sd=sd)
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
        document.getElementById("exp").style.display = 'none';
        document.getElementById("final-eval").style.display = 'block';
        return;
    }

    range = slider.value;

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
    monthIndex += 1;
}

function calculatePastReturn(lst, index, num){
    if (index){
        pastReturn = lst[index] - lst[index-num];
        return (pastReturn/lst[index-num]*100).toFixed(3) + "%";
    }
    else {
        pastReturn = lst[index] - principle;
        return (pastReturn/principle*100).toFixed(3) + " %";
    }
}
switch(parseInt(performanceLevelInt)){
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
        performance = get_returns(monthly_return, variance);
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

function save(){
    console.log("manipulation: ", performance_slider.value);
    console.log("perference: ", preference_slider.value);
    // TODO: check page content for storing the corresponding info
    // save the necessary info for later reference
    // jsnObj = {
    //     "manipulation" = performance_slider.value;
    //     "preference" = preference_slider.value;
    //     "performance level":performanceLevelInt,
    //     "robo-advisor monthly gain":roboMonthGainLst,
    //     "bank deposit monthly gain":bankMonthGainLst,
    //     "total gain":totalLst,
    //     "user selected ranges":rangeLst
    // };
    quantile = (totalGain - principle) / principle * 100;
    alert("Thanks a lot for your participation! Your total incentives are: " + compute_incentives(quantile));
}
