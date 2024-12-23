import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    // Path to the CSV file inside the public folder
    const filePath = path.join(process.cwd(), 'world-data-2023.csv');

    // Read the file content
    const file = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV data
    const parsedData = Papa.parse(file, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true, // Skip empty lines
    });

    // Return the parsed data as JSON
    return NextResponse.json(parsedData.data);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Failed to read CSV data' }, { status: 500 });
  }
}
