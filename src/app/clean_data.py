import pandas as pd

# Define the path to your CSV file
file_path = '/Users/dorislam/climate-dashboard/world-data-2023.csv'

# Load the data
data = pd.read_csv(file_path, header=0)  # Adjust header as necessary for your dataset

# Clean the column names: strip whitespace, remove newlines, and normalize spaces
data.columns = data.columns.str.strip().str.replace('\n', '').str.replace(r'\s+', ' ', regex=True)

# Remove rows with unreadable characters
def contains_unreadable(row):
    return any('�' in str(value) for value in row)

data = data[~data.apply(contains_unreadable, axis=1)]

# Handle missing or non-numeric data
def clean_column(column):
    """Convert column to numeric if possible; otherwise, strip text."""
    if column.dtype == 'object':  # String-like columns
        column = column.str.replace(',', '', regex=False).str.strip()  # Remove commas and trim spaces
        numeric = pd.to_numeric(column, errors='coerce')  # Try converting to numeric
        if numeric.isnull().any():  # If some rows aren't numeric, return mixed type
            return column
        return numeric  # If all are numeric, return as numeric
    return column  # Leave numeric columns unchanged

# Clean each column
for col in data.columns:
    data[col] = clean_column(data[col])

# Save cleaned data to an Excel file
output_file = '/Users/dorislam/climate-dashboard/public/cleaned_world_data.xlsx'
data.to_excel(output_file, index=False, engine='openpyxl')

print(f"Cleaned data saved to '{output_file}'.")
