import os
import csv


budget_data = []
total = 0
date = []
final_average = 0
total_months = []
new_set = []
month_count = 0
this_month_budget = 0
new_set = []
total_budget = 0
budget_change = 0
last_month_budget = 0
budget_difference = []
month_budget = 0

#path to collect data from resources folder 
budget_csv = os.path.join("..","Resources","budget_data.csv")

#open and read the csv file and remove the header 
with open(budget_csv, 'r') as csvfile:
    csv_reader = csv.reader(csvfile, delimiter=",")

    header = next(csv_reader)

   #loop through the read csv file to gather its data in row 0 and 1 
    for row in csv_reader:
       
        budget_data.append(int(row[1]))
        total += int(row[1])
    
        date.append(row[0])
        months = len(date)
        
        month_count = month_count + 1
        total_months.append(row[0])
        new_set = int(row[1])
        

        if month_count > 1:
            budget_change = new_set - last_month_budget
            budget_difference.append(budget_change)
        last_month_budget = new_set

sum_budget_difference = sum(budget_difference)
final_average = sum_budget_difference / month_count

maximum_change = max(budget_difference)
minimum_change = min(budget_difference)
maximum_month_index = budget_difference.index(maximum_change)
minimum_month_index = budget_difference.index(minimum_change)
maximum_month = total_months[maximum_month_index]
minimum_month = total_months[minimum_month_index]
       
                       
print("Financial Analysis")
print("------------------")
print(f'Total Months: {months}')
print(f'Total: ${total}')
print(f'Average Change: ${final_average}')
print(f'Greatest Increase in Revenue: {maximum_month} (${maximum_change})')
print(f'Greatest Decrease in Revenue: {minimum_month} (${minimum_change})')

#in terminal or gitbash use the command 'python main.py > financial_results.txt' to push output of this code to .txt file