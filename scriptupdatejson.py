import json
from datetime import datetime


# Load the original JSON file
with open('places.json', 'r') as f:
    data = json.load(f)

# Loop through the array and update the date format for each entry
for entry in data:
    # Extract the original date string
    original_date = entry['startdate']
    
    # Convert the date string to the new format
    new_date = datetime.strptime(entry['startdate'], '%d.%m.%y').strftime('%m.%Y')
    
    # Update the entry with the new date format
    entry['startdate'] = new_date

# Write the updated JSON data to a new file
with open('places.json', 'w') as f:
    json.dump(data, f, indent=2)