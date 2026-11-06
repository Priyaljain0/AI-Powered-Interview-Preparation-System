from dotenv import load_dotenv
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import os


# Load environment variables from .env
load_dotenv()

mongo_uri = os.getenv("MONGO_URI")


# Connect to MongoDB
client = MongoClient(mongo_uri)

db = client["interview_prep"]

collection = db["knowledge_base"]


# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# Get all knowledge documents
documents = collection.find()


for document in documents:

    criterion = document["criterion"]
    knowledge = document["knowledge"]

    # Generate separate embeddings
    criterion_embedding = model.encode(
        criterion
    ).tolist()

    knowledge_embedding = model.encode(
        knowledge
    ).tolist()

    # Update document
    collection.update_one(
        {"_id": document["_id"]},
        {
            "$set": {
                "criterion_embedding": criterion_embedding,
                "knowledge_embedding": knowledge_embedding
            }
        }
    )

    print(
        f"Updated document: {document['_id']}"
    )


print("Embedding generation completed.")

client.close()