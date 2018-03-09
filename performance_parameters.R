# Categorizing performance based on historical index performance

## 1. Select indexes and bonds

### Select several global indexes that have an established history
### Select US Treasury bills as the risk-free benchmark
### Major indexes: U.S. market: SP500; Russel 2000; Nasdaq index
### European market: UK'S FTSE100 AND Germany's GDAXI;
### Asian market: Japan's Nikkei 225 and Singapore's STI;
### Risk-free benchmark: US 10-YR Treasury bills
###

## 2. Load libraries, acquire the datasets, determine the time horizon

library(quantmod)
library(PortfolioAnalytics)
library(xts)

### Symbols of the above indexes and benchmark:
### SP500: ^GSPC; Russel 2000: ^RUT ; Nasdaq: ^IXIC
### FTSE100: ^FTSE; GDAXI: ^GDAXI; Nikkei 225: ^N225; STI: ^STI; US bonds: ^TNX

### Define time horizon: starting date, ending date, and total years
start_date = "1997-01-01"
end_date = "2017-12-31" # 20 years in total


## 3. Write functions for data cleaning

load_Data = function(symbol,type = "index"){
    # this function returns the monthly log return, the default type is "index"
	if (type == "bond"){ # for bond, there is no need to calculate log return
		data = quantmod::getSymbols(symbol,auto.assign = FALSE,from = start_date, to = end_date)
		data_return = data[,6] # adjusted for dividend and share split
		data_return = na.omit(data_return)
		data_return_m = xts::apply.monthly(data_return,mean)
		data_return_m = data_return_m/12 # to convert annualized bond return to monthly return
		# return the value
	} else if (type == "index"){
		data = quantmod::getSymbols(symbol,auto.assign = FALSE,from = start_date, to = end_date)
		data_adjusted = data[,6] # adjusted for dividend and share split
		data_return = diff(log(data_adjusted)) # daily log return
		data_return = data_return[-1] # delete the first NA row
		data_return = na.omit(data_return) # remove NAs, if any
		data_return_m = xts::apply.monthly(data_return,sum) # calculate monthly log return
		data_return_m = data_return_m*100 # convert the nominal value to percentage
		}
	data_return_m # return the value
}

### mean monthly return
mean()

### mean volatility
sd()


## 4. Do descriptive statistics for the monthly returns and volatility
### Major indexes
sp500 = load_Data("^GSPC")
sp500_mr = mean(sp500) # mean return
sp500_vl = sd(sp500) # volatility

nasdaq = load_Data("^IXIC")
nasdaq_mr = mean(nasdaq)
nasdaq_vl = sd(nasdaq)

rus2000 = load_Data("^RUT")
rus2000_mr = mean(rus2000)
rus2000_vl = mean(rus2000)

ftse100 = load_Data("^FTSE")
ftse100_mr = mean(ftse100)
ftse100_vl = sd(ftse100)

gadxi = load_Data("^GDAXI")
gadxi_mr = mean(gadxi)
gadxi_vl = sd(gadxi)

n225 = load_Data("^N225")
n225_mr = mean(n225)
n225_vl = sd(n225)

sti = load_Data("^STI")
sti_mr = mean(sti)
sti_vl = sd(sti)

tnx = load_Data("^TNX", type = "bond")
tnx_mr = mean(tnx)
tnx_vl = sd(tnx)

# To list all the above returns
sp500_mr
sp500_vl

nasdaq_mr
nasdaq_vl

rus2000_mr
rus2000_vl

ftse100_mr
ftse100_vl

gadxi_mr
gadxi_vl

n225_mr
n225_vl

sti_mr
sti_vl

tnx_mr
tnx_vl

## 5. Run several scenarios, with different weights of index and bonds
### Suppose the portfolio is made up only US markets,
### and the weights for index and bond are 50:50

weight_index =c(1/3,1/3,1/3) # equal weight of three U.S. indexes
weight_portfolio = c(1/2,1/2) # equal weight of equity and bond

index_return = cbind(sp500, nasdaq, rus2000)

weighted_index_return = rowSums(index_return*weight_index) # average index return
mean_index_mr = mean(weighted_index_return)
mean_index_vl = sd(weighted_index_return) # average index return


portfolio_return = cbind(weighted_index_return, tnx) # 50% equity & 50% bond
weighted_portfolio_return = rowSums(portfolio_return*weight_portfolio)
mean_portfolio_mr = mean(weighted_portfolio_return)
mean_portfolio_vl = sd(weighted_portfolio_return)

mean_portfolio_mr
mean_portfolio_vl


## 6. Summarize the mean monthly return and mean volatility based on historical data
### During the past 20 years, given a 50% vs. 50% allocation of U.S. equities and bonds,

### The mean monthly return is :
mean_portfolio_mr # value = 0.4526403

### The mean monthly volatility (risk) is :
mean_portfolio_vl # value =  2.661148

### Quantile the weighted_index_return
quantile(weighted_portfolio_return, c(.1, .2, .3, .4, .5, .6, .7, .8, .9))


## 7. Simulate performance, then decide the cut-off points based on simulations

investment_period = 24
simulations = 0

set.seed(123456)
for(i in 1:10000) {
  performance = cumsum(rnorm(n=investment_period, mean=mean_portfolio_mr, sd=mean_portfolio_vl))
  cum_performance = performance[investment_period] # overall performance by the final period
  simulations[i] <- cum_performance
}

quantile(simulations, c(.1, .2, .3, .4, .5, .6, .7, .8, .9))

# High perfomance is defined as 90% percentile of the cumulative return during the given period
high_performance = quantile(simulations, 0.9)
high_mean = high_performance/24 # to calculate the monthly return
high_mean # 1.158315

# Medium performance is defined as 50% percentile of the cumulative return during the given period
medium_performance = quantile(simulations, 0.5)
medium_mean = medium_performance/24
medium_mean # 0.4517913

# Low performance is defined as 20% percentile of the the cumulative return during the given period
low_performance = quantile(simulations, 0.2)
low_mean = low_performance/24
low_mean # -0.003010246

# Base rate: Federal funds rate
base_mean = 0.125 # the annualized rate is 1.5, divided by 12

# Volatility, for the moment, it's the same for high, medium, and low condition, which is mean_portfolio_vl
var = mean_portfolio_vl #2.661148

# 8. Summarizing the variable values for demo and main experiments

high_mean = 1.158
medium_mean = 0.452
low_mean = -0.003
base_mean = 0.125
high_var = 2.661
medium_var = 2.661
low_var = 2.661



