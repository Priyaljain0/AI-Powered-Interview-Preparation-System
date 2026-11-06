from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

db = client["interview_prep"]
questions_collection = db["questions"]

print("Before cleanup:", questions_collection.count_documents({}))

pipeline = [
    {
        "$group": {
            "_id": "$question",
            "ids": {"$push": "$_id"},
            "count": {"$sum": 1}
        }
    },
    {
        "$match": {
            "count": {"$gt": 1}
        }
    }
]

duplicates = list(questions_collection.aggregate(pipeline))

print("Duplicate question groups:", len(duplicates))

ids_to_delete = []

for group in duplicates:
    ids_to_delete.extend(group["ids"][1:])

print("IDs to delete:", len(ids_to_delete))

result = questions_collection.delete_many(
    {"_id": {"$in": ids_to_delete}}
)

print("Deleted duplicates:", result.deleted_count)
print("After cleanup:", questions_collection.count_documents({}))