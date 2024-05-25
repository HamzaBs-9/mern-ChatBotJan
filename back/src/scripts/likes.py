from pymongo import MongoClient
import json

def fetch_data():
    # Connect to MongoDB 
    client = MongoClient('mongodb+srv://hamza:hbs_10.compass@compass.kdvmuiv.mongodb.net/')
    db = client['chatbot']  
    collection = db['users']  

    # Fetching data from MongoDB
    data = collection.find({})

    # Analyzing data
    results = {'likes': 0, 'dislikes': 0, 'no_reaction': 0}
    for item in data:
        # Assuming 'liked' field is within a 'chats' sub-document
        for chat in item.get('chats', []):  
            liked_status = chat.get('liked')  
            if liked_status is True:
                results['likes'] += 1
            elif liked_status is False:
                results['dislikes'] += 1
            elif liked_status is None:
                results['no_reaction'] += 1

    return results

def write_json(data):
    # Writing results to a JSON file
    with open('results.json', 'w') as f:
        json.dump(data, f, indent=4)

def main():
    results = fetch_data()
    write_json(results)
    print("Data has been analyzed and written to results.json")

if __name__ == "__main__":
    main()
