# Robo-advisor project plan

## To-do list (for week3)

### Content development
- Conversational scripts (✓)
- Scripts during orientation  (✓)
	- Scripts during main experiment 1 + 2 (✓)
	- Scripts during main experiment 3 + 4 

- (Stella) Consistent UI design 

- (Stella) The design of chatbot can be adopted from 
[zhangwanli](zhangwenli.com), following this [repo address](https://github.com/Ovilia/ovilia.github.io)


### Structure design 

- (wanlu) Randomisation design
- (Stella) Add the animation effect of the unfolding of x-axis. 
- (Stella) Add a transition prompt after each section ends

### Debugging


### Feature refinement (ranked by priority)


- Demo showcase & main experiment
	- (Stella) Replace the slider with a pie chart to make it more intuitive to understand (illustrated in ppt, feature refinement section)  

### Timeline


## Have-done list
- (wanlu) At the end of the experiment, display the overall incentives that participants earn. The algorithms and data are elaborated in file \performance_parameters.R, section 9  (✓)
- (Wanlu) Revise the content of chart & summary sheet of robo-advisor's past performance. (✓)
- (Wanlu) Incentives are always 5 no matter how the performance is, please fix this issue. (✓)
- (Wanlu) The condition assignment needs to be consistent, e.g. those randomly assigned to high performance during demo stage shall also be assigned to high performance during main experiment (✓)
- (Wanlu) During the trial and main experiment stages, there's no December (Nov immediately leaps to Jan, skipping Dec). (✓)
- (wanlu) Revise the formula to calculate past performance (✓)
	- The "past 1 month" is defined as:
	$\frac{return_t - return_{t-1}}{return_{t-1}}$
	- The "past 3 month" is defined as:
	$\frac{return_t - return_{t-3}}{return_{t-3}}$,
	where t changes dynamically within investment period
- (Stella) Design several styles of avatar for robo-advisor  (✓)
- (Wanlu) The conversation of robo-advisor needs to be accompanied with the corresponding avatar, add placeholder  (✓)
- (Stell) Design the template & front-end part of avatar & conversational bubbles  (✓)
- (wanlu) Google cloud set up (or x10host)  (✓)
- (Wanlu) Introduce a "crisis" option to the main experiment [can be turned on or off by the experimenter during the randomisation stage] (cancelled)
	- During the normal period (12 months), the robo-advisor's performance is the same as the demo period 
	- After the 12 months, there's a crisis (lasts for 3 months), where the performance dropped 10% in the 13th month, and then performance resumes normal during the 14th and 15th month.

-  (✓) (Wanlu) Orientation 
	- Input style
		- Name: it's a choice, not fill_in_the_blank
		- Avatar of robots: using three sample avatars (under /images folder) instead of uploading

-  (✓) (Wanlu) Revise the parameters of robo-advisor's past performance based on Yihan's simulation of historical results (refer to the file performance_parameters.R, section 8) 
- Chart 

|Table1 | content | presentation  |
|---|---|---|
| x-axis | time-horizon | gradually unfolds as time passes, so that the x-axis ends with the current month|
|  y-axis |  title: "Net Asset Value" | line-charts, holding the upper and lower limit constant. Upper: 1.5 times the deposit, Lower limit: 0.9 times the deposit |
|  y-1 | legend: Your portfolio | line-chart (color C, bold) |
|  y-2 | legend:  100% invested in robo-advisor| line-chart (color A) |
|  y-3 | legend: 100% invested in savings account | line-chart (color B) |

- Summary sheet <br> 
Deposit : $ deposit <br>
Net Asset Value: $ cumulative_returns
  
| Net Asset Value | past 1 month |past 3 months|past 6 months|
|---|---|---|---|
| Your portfolio | $X [^1] | X | X|
| 100% invested in robo-advisor | X | X | X|
| 100% invested in savings account | X | X | X|

[^1]: dynamically calculated/updated by the programmed formula

- (Yihan) Draft the conceptual algorithm for incentive calculator, which calculates participants' pay based on their performance during the main experiment (✓)

- Re-classify robo-advisor's financial performance based on S&P 500 or other widely recognised benchmarks (Yihan) (✓)

- To add two sub-stages (Wanlu) (✓)

		1. Manipulation check stage (✓)

The purpose of manipulation check is to validate that participants can correctly evaluate robo-advisor's financial performance

		2. Final evaluation stage (✓)
	
The purpose of final evaluation is to solicit participants' opinions of robo-advisor after substantial interaction

- To make a mock-up version with all stages (Wanlu) (✓)

- Manipulation check and final evaluation (Yihan)
	- Survey question for manipulation (✓)
	- Survey question for final evaluation(✓)

![overview](/images/overview.png)

