// This is a one-time script to convert airportlist.txt to a usable JS object

const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '..', 'airportlist.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Process the content
const lines = fileContent.split('\n').slice(1); // Skip header line
const airports = [];

lines.forEach(line => {
  if (!line.trim()) return;
  
  const parts = line.split('\t').filter(part => part.trim());
  if (parts.length >= 3) {
    airports.push({
      city: parts[0].trim(),
      country: parts[1].trim(),
      code: parts[2].trim()
    });
  }
});

// Write to a JS file
const outputPath = path.join(__dirname, '..', 'lib', 'airportData.js');
const output = `
// Auto-generated from airportlist.txt
export const airports = ${JSON.stringify(airports, null, 2)};

// Search airports based on query
export function searchAirports(query) {
  if (!query || query.length < 2) return [];
  
  query = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.city.toLowerCase().includes(query) || 
    airport.country.toLowerCase().includes(query) ||
    airport.code.toLowerCase().includes(query)
  ).slice(0, 10); // Limit to 10 results for performance
}

// Get airport details by code
export function getAirportByCode(code) {
  return airports.find(airport => airport.code === code);
}

// Get formatted display name
export function getAirportDisplayName(airport) {
  return \`\${airport.city} (\${airport.code})\`;
}
`;

fs.writeFileSync(outputPath, output);
console.log(`Generated airport data file at ${outputPath}`);