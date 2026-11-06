from datasets import load_dataset

dataset = load_dataset("Davichick/InterviewForge_GenDS")
train = dataset["train"]

print("Total questions:", len(train))
empty_questions = 0

for question in train["question"]:
    if not question or not question.strip():
        empty_questions += 1

print("Empty questions:", empty_questions)
questions = train["question"]

unique_questions = set(questions)

print("Total questions:", len(questions))
print("Unique questions:", len(unique_questions))
print("Duplicate questions:", len(questions) - len(unique_questions))
empty_categories = 0
empty_levels = 0

for category in train["question_category"]:
    if not category or not category.strip():
        empty_categories += 1

for level in train["question_level"]:
    if not level or not level.strip():
        empty_levels += 1

print("Empty categories:", empty_categories)
print("Empty levels:", empty_levels)
print("\nFirst 5 keywords:")

for i in range(5):
    print(i + 1, train[i]["keywords"])

print("\nKeywords data type:")
print(type(train[0]["keywords"]))
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

print("\nFirst cleaned question:")
print(cleaned_questions[0])