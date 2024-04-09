const initialQuestion = "Are you looking for a service (reply with 's') or a good (reply with 'g')?";
let followUpQuestion = "";
let category = ""; // To hold the user's choice of 'Services' or 'Goods'
let currentQuestion = 0;
let chatData = {};

// Additional service and goods questions
const serviceQuestions = [
    "Please provide service requirement.",
    "Do you require a site meeting?",
    "When would you like the meeting?",
    "If you do not require a site meeting, is there a scope of work available?",
    "What quantity do you require?",
    "Do you have a PR number for this request?",
    "Is the PR number approved?"
];

const goodsQuestions = [
    "What good do you require?",
    "Specific Brand?",
    "Part Number?",
    "Any Additional specifications?",
    "Quantity required?",
    "Do you have a PR number for this request?",
    "Is the PR number approved?"
];

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

function displayMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', className);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function askQuestion(question) {
    displayMessage(question, 'bot-message');
}

function askAdditionalQuestions() {
    let questions = category === "Services" ? serviceQuestions : goodsQuestions;
    if (currentQuestion < questions.length) {
        followUpQuestion = questions[currentQuestion];
        displayMessage(followUpQuestion, 'bot-message');
        currentQuestion++;
    } else {
        displayMessage("Purchasing team will be in touch.", 'user-message');
        sendDataToServer({ category, responses: chatData });
        resetChat();
    }
}

function displayServiceOptions() {
    const serviceOptions = [
        "Plumbing", "Hydraulic", "Electric", "Pneumatic",
        "HVAC", "Facility Management", "IT", "Consultancy",
        "Rental", "Health", "Travel"
    ];

    let selectElement = document.createElement('select');
    selectElement.id = 'serviceSelection';
    serviceOptions.forEach(option => {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });

    chatBox.appendChild(selectElement);

    let confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.onclick = () => {
        let selectedService = document.getElementById('serviceSelection').value;
        chatData["Service Category"] = selectedService; // Saving the selected service category
        displayMessage("Selected service: " + selectedService, 'user-message');
        selectElement.remove(); // Remove the dropdown
        confirmButton.remove(); // Remove the confirm button
        userInput.style.display = 'block'; // Show userInput again for further questions
        askAdditionalQuestions();
    };
    chatBox.appendChild(confirmButton);
    userInput.style.display = 'none'; // Hide userInput while selecting from dropdown
}

function sendDataToServer(data) {
    fetch('http://localhost:3000/submit-chat-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

function resetChat() {
    currentQuestion = 0;
    chatData = {};
    category = "";
    followUpQuestion = "";
    userInput.style.display = 'block'; // Make sure userInput is visible for the next interaction
}

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && userInput.value.trim()) {
        const userResponse = userInput.value.trim();
        displayMessage(userResponse, 'user-message');
        userInput.value = ''; // Clear the input box

        if (category) {
            chatData[followUpQuestion] = userResponse;
            askAdditionalQuestions();
        } else {
            if (userResponse === 's') {
                category = "Services";
                displayServiceOptions(); // Display service options for selection
            } else if (userResponse === 'g') {
                category = "Goods";
                currentQuestion = 0; // Start asking goods-related questions
                askAdditionalQuestions();
            } else {
                displayMessage("Please reply with 's' for service or 'g' for good.", 'bot-message');
            }
        }
    }
});

// Start the interaction with the initial question
setTimeout(() => askQuestion(initialQuestion), 1000);