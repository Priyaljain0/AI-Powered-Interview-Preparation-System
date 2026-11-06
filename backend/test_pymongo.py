from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://interview_user:Idontlikecake123@cluster0.pijh1zw.mongodb.net/?appName=Cluster0"

client = MongoClient(
    uri,
    server_api=ServerApi("1"),
    serverSelectionTimeoutMS=10000
)

try:
    client.admin.command("ping")
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:")
    print(e)
finally:
    client.close()