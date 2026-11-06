from dotenv import load_dotenv
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import os


# 1. Load environment variables
load_dotenv()

mongo_uri = os.getenv("MONGO_URI")


# 2. Connect to MongoDB
client = MongoClient(mongo_uri)

db = client["interview_prep"]

collection = db["knowledge_base"]


# 3. Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# 4. Our search query
query = "How can MongoDB queries be made faster?"


# 5. Convert query into embedding
query_embedding = model.encode(query).tolist()


# 6. Vector Search pipeline
pipeline = [
    {
        "$vectorSearch": {
            "index": "criterion_vector_index",
            "path": "criterion_embedding",
            "queryVector": query_embedding,
            "numCandidates": 10,
            "limit": 2
        }
    },
    {
        "$project": {
            "_id": 0,
            "topic": 1,
            "category": 1,
            "criterion": 1,
            "knowledge": 1,
            "score": {
                "$meta": "vectorSearchScore"
            }
        }
    }
]


# 7. Execute search
results = collection.aggregate(pipeline)


# 8. Display results
for result in results:
    print(result)


client.close()