const fs = require('fs');
const path = require('path');

// Define the path to the poll results file
const pollResultsFile = path.join(__dirname, 'poll_results.json');

// Function to append poll data
function appendPollData(pollData) {
  // Read the existing poll results
  fs.readFile(pollResultsFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse existing data or start with an empty array if file is empty
    let results = [];
    if (data) {
      try {
        results = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing JSON data:", e);
      }
    }

    // Append the new poll data
    results.push(...pollData);

    // Write the updated data back to the file
    fs.writeFile(pollResultsFile, JSON.stringify(results, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Poll data successfully saved!");
      }
    });
  });
}

// Example: Usage of the function with some poll data
const pollData = [
  { filename: 'gifs/1.gif', description: 'joy' },
  { filename: 'gifs/2.gif', description: 'anger' }
];

// Call the function to append data
appendPollData(pollData);
