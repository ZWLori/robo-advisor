# Robo-advisor project plan

## To-do list (for week1~2)

### Content development
- (Yihan + Cuimin) Conversational scripts 
	- Scripts during orientation
	- Scripts during main experiment

- (Yihan) Draft the conceptual algorithm for incentive calculator, which calculates participants' pay based on their performance during the main experiment 

- (Stella) Consistent UI design 


### Structure design 
- (wanlu) Google cloud set up (or x10host)
- (Wanlu) Orientation 
	- Input style
		- Name: it's a choice, not fill_in_the_blank
		- Avatar of robots: using three sample avatars (under /images folder) instead of uploading
- (Wanlu) Revise the parameters of robo-advisor's past performance based on Yihan's simulation of historical results (refer to the file performance_parameters.R, section 8) 
- (Wanlu) Introduce a "crisis" to the main experiment 
	- During the normal period (12 months), the robo-advisor's performance is the same as the demo period (✓)
	- After the 12 months, there's a crisis (lasts for 3 months), where the performance dropped 10% in the 13th month, and then performance resumes normal during the 14th and 15th month.

### Debugging
- (Wanlu) The condition assignment needs to be consistent, e.g. those randomly assigned to high performance during demo stage shall also be assigned to high performance during main experiment 


### Feature refinement (ranked by priority)
- (Stella) Design several styles of avatar for robo-advisor  

- (Stella) The conversation of robo-advisor needs to be accompanied with the corresponding avatar 

- Demo showcase & main experiment
	- (Stella) Replace the slider with a pie chart to make it more intuitive to understand (illustrated in ppt, feature refinement section)  

### Timeline

![timeline](/images/timeline.png)

## Have-done list
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
