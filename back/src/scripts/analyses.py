import random
import json

# Define some intents and responses for IT product issues
issues = [
    "authentication issue", 
    "compatibility versions", 
    "server down many times", 
    "404 errors", 
    "other errors"
]

responses = {
    "authentication issue": [
        "Please check if you are using the correct username and password.",
        "Try resetting your password using the 'Forgot Password' option.",
        "Ensure your account is not locked due to multiple failed login attempts."
    ],
    "compatibility versions": [
        "Ensure you are using the latest version of the application.",
        "Check if your operating system meets the minimum requirements.",
        "Try updating your web browser or mobile OS to the latest version."
    ],
    "server down many times": [
        "Our team is aware of the issue and is working on it.",
        "Please try accessing the service after some time.",
        "We recommend clearing your browser cache and cookies and then retrying."
    ],
    "404 errors": [
        "Ensure the URL you are trying to access is correct.",
        "Try refreshing the page or navigating from the homepage.",
        "If the issue persists, please contact our support team."
    ],
    "other errors": [
        "Please provide the exact error message you are seeing.",
        "Try restarting the application and see if the issue persists.",
        "Ensure your internet connection is stable and retry."
    ]
}

# Function to generate synthetic conversations
def generate_conversation():
    issue = random.choice(issues)
    response = random.choice(responses[issue])
    return {"input": f"I have an issue with {issue}", "output": response}

# Generate a synthetic dataset
dataset = [generate_conversation() for _ in range(1000)]

# Optionally, add some manually created data
manual_data = [
    {"input": "I have an authentication issue with my account.", "output": "Please check if you are using the correct username and password."},
    {"input": "I am facing compatibility issues with your web app.", "output": "Ensure you are using the latest version of the application."},
    {"input": "The server is down many times recently.", "output": "Our team is aware of the issue and is working on it."},
    {"input": "I am getting 404 errors on your platform.", "output": "Ensure the URL you are trying to access is correct."},
    {"input": "There are some errors in the mobile app.", "output": "Please provide the exact error message you are seeing."}
]
dataset.extend(manual_data)

# Save the dataset to a JSON file
with open('training_data.json', 'w') as f:
    json.dump(dataset, f, indent=4)

