import os
import csv

total = 0
candidate = ""
candidate_votes = {}
percentages ={}
winner_votes = 0
winner = ""


election_data = os.path.join("..", "Resources", "election_data.csv")
with open(election_data,'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

    next(csvreader)

    #count the votes
    for row in csvreader:
        total = total + 1
        candidate = row[2]
        if candidate in candidate_votes:
            candidate_votes[candidate] = candidate_votes[candidate] + 1
        else:
            candidate_votes[candidate] = 1

#find the vote percentages and the winner of the election
for nominee, counter in candidate_votes.items():
    percentages[nominee] = '{0:.0%}'.format(counter / total)
    if counter > winner_votes:
        winner_votes = counter
        winner = nominee


print("Election Results")
print("------------------")
print(f"Total Votes: {total}")
print("------------------")

for person, counter in candidate_votes.items():
    print(f"{person}: {percentages[nominee]} ({counter})")
print("------------------")
print(f"Winner: {winner}")
print("------------------")

#use command in terminal to push output of program to text file 'python main.py > election_results.txt'