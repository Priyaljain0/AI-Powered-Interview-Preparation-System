from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from typing import Literal
from bson import ObjectId
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from fastapi.middleware.cors import CORSMiddleware

from llm_service import generate_evaluation


# --------------------------------------------------
# Environment Variables
# --------------------------------------------------

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")


# --------------------------------------------------
# MongoDB Connection
# --------------------------------------------------

client = MongoClient(mongo_uri)

client.admin.command("ping")

db = client["interview_prep"]

questions_collection = db["questions"]
history_collection = db["interview_history"]


# --------------------------------------------------
# MongoDB Indexes
# --------------------------------------------------

questions_collection.create_index("level")

questions_collection.create_index([
    ("category", 1),
    ("level", 1)
])


print("MongoDB connected successfully")
print(questions_collection.index_information())


# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.get("/")
def welcome():
    return "Hello Interview Prep"


# --------------------------------------------------
# Allowed Values
# --------------------------------------------------

Sector = Literal[
    "FoodTech",
    "Drones & Aerial Platforms",
    "Cybersecurity",
    "Logistics & Supply Chain",
    "SaaS & Cloud Platforms",
    "AdTech",
    "AI & Data Platforms",
    "Gaming",
    "FinTech",
    "E-Commerce & Global Trade",
    "HealthTech & BioTech",
    "DefenseTech"
]


Category = Literal[
    "Communication & Soft Skills",
    "Innovation & Emerging Tech",
    "Tools & Frameworks",
    "Debugging & Troubleshooting",
    "Technical Roadmap & Strategy",
    "Prioritization Under Pressure",
    "Coding & Problem Solving",
    "Collaboration & Cross-Team Work",
    "Conflict Resolution",
    "Business Impact & Metrics",
    "Salary & Expectations",
    "Motivation & Career Goals",
    "Incident Response & Ownership",
    "Scalability & Growth Planning",
    "System Design & Architecture",
    "Culture Fit & Values"
]


Level = Literal[
    "Level 1: Foundational",
    "Level 2: Practical",
    "Level 3: Edge Case & Conflict"
]


# --------------------------------------------------
# Pydantic Models
# --------------------------------------------------

class Question(BaseModel):
    question: str
    sector: Sector
    category: Category
    level: Level


class Answer(BaseModel):
    question_id: str
    answer: str


class EvaluationRequest(BaseModel):
    question: str
    answer: str
    category: str

class CriterionEvaluation(BaseModel):
    criterion: str
    status: Literal["addressed", "partial", "missing"]
    score: int
    explanation: str
class EvaluationResult(BaseModel):
    score: int
    criteria_evaluation: list[CriterionEvaluation]
    strengths: list[str]
    missing_concepts: list[str]
    feedback: str
    learning_recommendations: list[str]
    improved_answer: str

# --------------------------------------------------
# LLM EVALUATION ROUTE
# --------------------------------------------------

@app.post("/evaluate", response_model=EvaluationResult)
def evaluate_answer(request: EvaluationRequest):

    criteria = get_evaluation_criteria(
        request.category
    )

    result = generate_evaluation(
        request.question,
        request.answer,
        criteria
    )

    return result

# --------------------------------------------------
# Submit Answer
# --------------------------------------------------

@app.post("/answers")
def submit_answer(
    answer: Answer,
    user_id: str
):

    # Validate question ID
    if not ObjectId.is_valid(answer.question_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid question ID"
        )

    # Validate answer
    if not answer.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    question_id = ObjectId(answer.question_id)

    # Update existing interview history
    result = history_collection.update_one(
        {
            "user_id": user_id,
            "question_id": question_id
        },
        {
            "$set": {
                "answer": answer.answer,
                "submitted_at": datetime.now()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Question history not found"
        )

    return {
        "message": "Answer submitted successfully"
    }


# --------------------------------------------------
# Add Question
# --------------------------------------------------

@app.post("/questions", status_code=201)
def add_question(question: Question):

    result = questions_collection.insert_one(
        question.model_dump()
    )

    return {
        "message": "Question added successfully",
        "id": str(result.inserted_id)
    }


# --------------------------------------------------
# Get Questions
# --------------------------------------------------

@app.get("/questions")
def get_questions(
    category: str | None = None,
    level: Literal[
        "Level 1: Foundational",
        "Level 2: Practical",
        "Level 3: Edge Case & Conflict"
    ] | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):

    if category is not None and level is not None:

        questions = list(
            questions_collection
            .find({
                "category": category,
                "level": level
            })
            .skip(skip)
            .limit(limit)
        )

    elif category is not None:

        questions = list(
            questions_collection
            .find({
                "category": category
            })
            .skip(skip)
            .limit(limit)
        )

    elif level is not None:

        questions = list(
            questions_collection
            .find({
                "level": level
            })
            .skip(skip)
            .limit(limit)
        )

    else:

        questions = list(
            questions_collection
            .find()
            .skip(skip)
            .limit(limit)
        )

    # Convert ObjectId to string
    for question in questions:
        question["_id"] = str(question["_id"])

    return {
        "count": len(questions),
        "questions": questions
    }
def get_evaluation_criteria(category: str):

    criteria_map = {

        "Communication & Soft Skills": [
            "Clearly identifies the main problem and priorities",
            "Explains communication with stakeholders and team members",
            "Identifies risks and proposes a realistic solution",
            "Considers business deadlines and project impact",
            "Maintains relevant compliance or quality requirements"
        ],

        "Python": [
            "Correctly explains the Python concept",
            "Uses technically accurate terminology",
            "Explains the reasoning clearly",
            "Provides a relevant example when appropriate"
        ],

        "Database": [
            "Correctly explains the database concept",
            "Uses technically accurate terminology",
            "Explains the relevant database operation or design",
            "Considers performance or data consistency when relevant"
        ]
    }

    return criteria_map.get(
        category,
        [
            "Provides a technically accurate answer",
            "Explains the relevant concepts clearly",
            "Provides appropriate reasoning",
            "Addresses the main requirements of the question"
        ]
    )

# --------------------------------------------------
# Get Random Question
# --------------------------------------------------

@app.get("/random-question")
def get_random_question(
    user_id: str,
    sector: Sector,
    category: Category,
    level: Level
):

    now = datetime.now()

    # Start of today
    start_of_day = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    # Start of tomorrow
    end_of_day = start_of_day + timedelta(days=1)

    # Get today's interview history
    history = history_collection.find({
        "user_id": user_id,
        "asked_at": {
            "$gte": start_of_day,
            "$lt": end_of_day
        }
    })

    # Extract question IDs already asked today
    asked_question_ids = [
        item["question_id"]
        for item in history
    ]

    # Find a random question
    random_question = list(
        questions_collection.aggregate([
            {
                "$match": {
                    "sector": sector,
                    "category": category,
                    "level": level,
                    "_id": {
                        "$nin": asked_question_ids
                    }
                }
            },
            {
                "$sample": {
                    "size": 1
                }
            }
        ])
    )

    # No question available
    if not random_question:
        raise HTTPException(
            status_code=404,
            detail="No new questions available for today"
        )

    question = random_question[0]

    # Save interview history
    history_collection.insert_one({
        "user_id": user_id,
        "question_id": question["_id"],
        "asked_at": now
    })

    # Convert ObjectId to string
    question["_id"] = str(question["_id"])

    return question


# --------------------------------------------------
# Update Question
# --------------------------------------------------

@app.put("/questions/{id}")
def update_question(
    id: str,
    question: Question
):

    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=400,
            detail="Invalid question ID"
        )

    result = questions_collection.update_one(
        {
            "_id": ObjectId(id)
        },
        {
            "$set": question.model_dump()
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {
        "message": "Question updated successfully",
        "id": id
    }


# --------------------------------------------------
# Delete Question
# --------------------------------------------------

@app.delete("/questions/{id}")
def delete_question(id: str):

    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=400,
            detail="Invalid question ID"
        )

    result = questions_collection.delete_one(
        {
            "_id": ObjectId(id)
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {
        "message": "Question deleted successfully",
        "id": id
    }