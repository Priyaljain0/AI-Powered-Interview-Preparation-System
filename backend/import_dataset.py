from datasets import load_dataset
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

db = client["interview_prep"]
questions_collection = db["questions"]

print("MongoDB connected successfully")

# Load dataset
dataset = load_dataset("Davichick/InterviewForge_GenDS")
train = dataset["train"]

print("Dataset questions:", len(train))

# Clean and map dataset
cleaned_questions = []

for item in train:
    cleaned_questions.append({
        "question": item["question"],
        "role": item["role"],
        "sector": item["sector"],
        "interview_stage": item["interview_stage"],
        "category": item["question_category"],
        "level": item["question_level"]
    })

print("Questions ready for import:", len(cleaned_questions))

# Insert into MongoDB
result = questions_collection.insert_many(cleaned_questions)

print("Inserted questions:", len(result.inserted_ids))

# Final verification
print(
    "Questions in MongoDB:",
    questions_collection.count_documents({})
)