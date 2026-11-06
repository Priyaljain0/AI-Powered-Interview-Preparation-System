from sentence_transformers import SentenceTransformer
import numpy as np


# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# Knowledge base
documents = [
    {
        "topic": "MongoDB",
        "criterion": "Explain MongoDB indexing",
        "knowledge": "Indexes improve database query performance."
    },
    {
        "topic": "Python",
        "criterion": "Explain exception handling",
        "knowledge": "Python uses try and except blocks to handle exceptions."
    },
    {
        "topic": "REST API",
        "criterion": "Explain HTTP methods",
        "knowledge": "REST APIs commonly use HTTP methods such as GET, POST, PUT and DELETE."
    }
]


# User's interview question
query = "How can MongoDB queries be made faster?"


# Create separate text lists
criterion_texts = [
    document["criterion"]
    for document in documents
]

knowledge_texts = [
    document["knowledge"]
    for document in documents
]


# Create separate embeddings
criterion_embeddings = model.encode(criterion_texts)

knowledge_embeddings = model.encode(knowledge_texts)

query_embedding = model.encode(query)


# Cosine similarity
def cosine_similarity(a, b):

    return np.dot(a, b) / (
        np.linalg.norm(a) * np.linalg.norm(b)
    )


# Calculate similarities
results = []

for document, criterion_embedding, knowledge_embedding in zip(
    documents,
    criterion_embeddings,
    knowledge_embeddings
):

    criterion_similarity = cosine_similarity(
        query_embedding,
        criterion_embedding
    )

    knowledge_similarity = cosine_similarity(
        query_embedding,
        knowledge_embedding
    )

    results.append(
        {
            "document": document,
            "criterion_similarity": float(criterion_similarity),
            "knowledge_similarity": float(knowledge_similarity)
        }
    )


# Sort using criterion similarity
results.sort(
    key=lambda x: x["criterion_similarity"],
    reverse=True
)


# Top-K
top_k = 2


# Display results
for result in results[:top_k]:

    print("\nTopic:", result["document"]["topic"])

    print(
        "Criterion:",
        result["document"]["criterion"]
    )

    print(
        "Knowledge:",
        result["document"]["knowledge"]
    )

    print(
        "Criterion similarity:",
        result["criterion_similarity"]
    )

    print(
        "Knowledge similarity:",
        result["knowledge_similarity"]
    )
print("\nCriterion embedding shape:")
print(criterion_embeddings.shape)

print("\nKnowledge embedding shape:")
print(knowledge_embeddings.shape)

print("\nQuery embedding shape:")
print(query_embedding.shape)