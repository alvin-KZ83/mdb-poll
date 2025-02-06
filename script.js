function getRandomNumbers() {
  const ranges = [
    { min: 1, max: 20 },
    { min: 21, max: 40 },
    { min: 41, max: 60 },
    { min: 61, max: 80 },
    { min: 81, max: 100 },
  ];

  const result = [];

  // Helper function to generate random numbers within a range
  function getRandomInRange(min, max, count) {
    const numbers = new Set(); // Use a Set to ensure uniqueness
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
    }
    return Array.from(numbers);
  }

  // For each range, generate 6 unique random numbers
  ranges.forEach((range) => {
    const randomNumbers = getRandomInRange(range.min, range.max, 6);
    result.push(...randomNumbers);
  });

  return result;
}

const randomNumbers = getRandomNumbers();

const GIFS = randomNumbers.map((number) => `${number}`);

// Fisher-Yates shuffle to randomize the order of the GIFS array
for (let i = GIFS.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [GIFS[i], GIFS[j]] = [GIFS[j], GIFS[i]]; // Swap the elements
}

let currentIndex = 0;
const userSelections = {};

function showGIF(index) {
  const pollContainer = document.getElementById("poll-container");
  pollContainer.innerHTML = ""; // Clear previous content

  if (index < GIFS.length) {
    const div = document.createElement("div");
    div.classList.add("poll-item");

    const img = document.createElement("img");
    img.src = 'gifs/' + GIFS[index] + '.gif';
    img.alt = GIFS[index];

    const select = document.createElement("select");
    select.name = GIFS[index];

    ["Joy", "Sad", "Anger", "Fear", "Disgust", "None of the above"].forEach(
      (optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      }
    );

    // Pre-select the saved value if it exists
    if (userSelections[GIFS[index]]) {
      select.value = userSelections[GIFS[index]];
    }

    div.appendChild(img);
    div.appendChild(select);
    pollContainer.appendChild(div);

    // Show the "Next" button unless it's the last GIF
    if (index < GIFS.length - 1) {
      showNextButton(select);
    } else {
      showSubmitButton();
    }

    updateProgress(index + 1, GIFS.length); // Update the progress counter
  }
}

function showNextButton(selectElement) {
  let nextButton = document.getElementById("next-button");
  if (!nextButton) {
    nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      // Save current selection before moving to the next GIF
      userSelections[GIFS[currentIndex]] = selectElement.value;
      currentIndex++;
      showGIF(currentIndex);
    });
    document.body.appendChild(nextButton);
  }
  nextButton.style.display = "block";
}

function showSubmitButton() {
  const submitButton = document.querySelector('button[onclick="submitPoll()"]');
  submitButton.style.display = "block";

  const nextButton = document.getElementById("next-button");
  if (nextButton) {
    nextButton.style.display = "none";
  }
}

async function submitPoll() {
  // Convert userSelections to an array of poll data
  const pollData = Object.keys(userSelections).map((filename) => ({
    filename: filename,
    description: userSelections[filename],
  }));

  // Format poll data into a readable message
  const pollMessage = pollData
    .map((item) => `${item.filename},${item.description}`)
    .join("\n");

  // Send the email using EmailJS
  emailjs
    .send("service_8bn207k", "template_osbqps5", {
      message: pollMessage,
      from_name: "MDB POLL",
      to_email: "alvin.kz18@gmail.com",
    })
    .then((response) => {
      alert("Poll submitted successfully!");
      console.log("SUCCESS!", response.status, response.text);
    })
    .catch((error) => {
      console.error("FAILED...", error);
    });
}

function loadFirstGIF() {
  const submitButton = document.querySelector('button[onclick="submitPoll()"]');
  submitButton.style.display = "none"; // Hide submit button initially
  showGIF(currentIndex);
}

function updateProgress(current, total) {
  const progressElement = document.getElementById("progress-counter");
  if (!progressElement) {
    const progressContainer = document.createElement("div");
    progressContainer.id = "progress-container";
    progressElement = document.createElement("span");
    progressElement.id = "progress-counter";
    progressContainer.appendChild(progressElement);
    document.body.appendChild(progressContainer);
  }
  progressElement.textContent = `${current} / ${total}`;
}

loadFirstGIF();
