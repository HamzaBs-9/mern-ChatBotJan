import pymongo
import json
from collections import Counter

client = pymongo.MongoClient("********")
db = client["chatbot"]
users_collection = db["users"]
categories = {
    "authentication issue": ["login", "password", "authentication"],
    "compatibility versions": ["version", "compatibility", "update"],
    "server down many times": ["server down", "unavailable", "crash"],
    "404 errors": ["404", "not found"],
    "other errors": ["error", "issue", "problem"],
}
def categorize_message(message):
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword.lower() in message.lower():
                return category
    return "others"
category_counts = Counter()
users = users_collection.find()
for user in users:
    for chat in user.get("chats", []):
        if chat["role"] == "user":  
            category = categorize_message(chat["content"])
            category_counts[category] += 1

category_data = [{"id": category, "label": category, "value": count} for category, count in category_counts.items()]
with open("../frontend/public/issue_statistics.json", "w") as f:
    json.dump(category_data, f, indent=4)

print("Issue statistics have been saved to issue_statistics.json")
