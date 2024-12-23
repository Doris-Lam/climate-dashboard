import pandas as pd

# Load the data from your CSV file
file_path = '/Users/dorislam/climate-dashboard/world-data-2023.csv'
df = pd.read_csv(file_path, header=None)

# Print actual columns to debug
print("Actual columns in the DataFrame:")
print(df.columns)

# Set column headers
df.columns = [
    "Country", "Density(P/Km2)", "Abbreviation", "Agricultural Land(%)", "Land Area(Km2)", 
    "Armed Forces size", "Birth Rate", "Calling Code", "Capital/Major City", "Co2-Emissions", 
    "CPI", "CPI Change (%)", "Currency-Code", "Fertility Rate", "Forested Area (%)", 
    "Gasoline Price", "GDP", "Gross primary education enrollment (%)", 
    "Gross tertiary education enrollment (%)", "Infant mortality", "Largest city", 
    "Life expectancy", "Maternal mortality ratio", "Minimum wage", "Official language", 
    "Out of pocket health expenditure", "Physicians per thousand", "Population", 
    "Population: Labor force participation (%)", "Tax revenue (%)", "Total tax rate", 
    "Unemployment rate", "Urban_population", "Latitude", "Longitude"
]

# Clean up any unwanted characters or whitespace in columns
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Convert numeric columns to proper types, handling missing columns gracefully
numeric_columns = [
    "Population", "GDP", "Urban_population", "Density(P/Km2)", "CPI", 
    "Birth Rate", "Co2-Emissions", "CPI Change (%)", "Fertility Rate", "Gasoline Price", 
    "Life expectancy", "Maternal mortality ratio", "Out of pocket health expenditure", 
    "Physicians per thousand", "Tax revenue (%)", "Total tax rate", "Unemployment rate"
]

for col in numeric_columns:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    else:
        print(f"Warning: Column '{col}' not found in DataFrame.")

# Drop columns that have all NaN values
df = df.dropna(axis=1, how='all')

# Save the cleaned data to a new CSV file
output_file = '/Users/dorislam/climate-dashboard/src/app/cleaned_data.csv'
df.to_csv(output_file, index=False)

# Display first few rows of the cleaned DataFrame
print("Cleaned DataFrame:")
print(df.head())
