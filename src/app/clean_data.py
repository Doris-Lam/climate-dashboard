import pandas as pd

# Load the data from your CSV file
# Replace 'your_data.csv' with the actual file path
df = pd.read_csv('world-data-2023.csv', header=None)

# Print out the current column names to see what you have
print(df.columns)

# Assign new column names based on the structure of the data
df.columns = [
    "Country", 
    "Density(P/Km2)", 
    "Abbreviation", 
    "Agricultural Land(%)", 
    "Land Area(Km2)", 
    "Armed Forces size", 
    "Birth Rate", 
    "Calling Code", 
    "Capital/Major City", 
    "Co2-Emissions"
]

# If there are extra columns beyond the ones we want, we can drop them
df = df.iloc[:, :10]  # Keep only the first 10 columns (adjust if needed)

# Clean up any unwanted characters or unwanted whitespace in columns
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Convert numeric columns to proper types, handling any conversion errors (non-numeric data will be turned into NaN)
numeric_columns = [
    "Density(P/Km2)", 
    "Agricultural Land(%)", 
    "Land Area(Km2)", 
    "Armed Forces size", 
    "Birth Rate", 
    "Co2-Emissions"
]

for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Drop rows with NaN values after conversion (optional)
df = df.dropna()

# Optional: Save the cleaned data back to a new CSV file
df.to_csv('cleaned_data.csv', index=False)

# Display the cleaned dataframe
print(df.head())  # Print first 5 rows to check your data
