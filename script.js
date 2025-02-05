function getRandomNumbers() {
  const ranges = [
    { min: 1, max: 25 },
    { min: 26, max: 50 },
    { min: 51, max: 75 },
    { min: 76, max: 100 },
    { min: 101, max: 125 }
  ];

  const result = [];

  // Helper function to generate random numbers within a range
  function getRandomInRange(min, max, count) {
    const numbers = new Set();  // Use a Set to ensure uniqueness
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
    }
    return Array.from(numbers);
  }

  // For each range, generate 5 unique random numbers
  ranges.forEach(range => {
    const randomNumbers = getRandomInRange(range.min, range.max, 6);
    result.push(...randomNumbers);
  });

  return result;
}

const randomNumbers = getRandomNumbers();

const GIFS = randomNumbers.map(number => `gifs/${number}.gif`);

// Fisher-Yates shuffle to randomize the order of the GIFS array
for (let i = GIFS.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [GIFS[i], GIFS[j]] = [GIFS[j], GIFS[i]];  // Swap the elements
}

async function loadGIFs() {
  const pollContainer = document.getElementById('poll-container');

  // Display GIFs in the container
  GIFS.forEach(filename => {
    const div = document.createElement('div');
    div.classList.add('poll-item');

    const img = document.createElement('img');
    img.src = filename;
    img.alt = filename;

    const select = document.createElement('select');
    select.name = filename;

    ["joy", "sad", "anger", "fear", "disgust"].forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });

    div.appendChild(img);
    div.appendChild(select);
    pollContainer.appendChild(div);
  });
}

async function submitPoll() {
  const selects = document.querySelectorAll('select');
  const pollData = Array.from(selects).map(select => ({
    filename: select.name,
    description: select.value
  }));

  // Format poll data into a readable message
  const pollMessage = pollData
    .map(item => `${item.filename} | ${item.description}`)
    .join('\n');

  // Send the email using EmailJS
  emailjs.send("service_8bn207k", "template_osbqps5", {
    message: pollMessage,
    from_name: "MDB POLL",
    to_email: "alvin.kz18@gmail.com"
  })
  .then(response => {
    alert('Poll submitted successfully!');
    console.log('SUCCESS!', response.status, response.text);
  })
  .catch(error => {
    console.error('FAILED...', error);
  });
}

loadGIFs();