import json

file_path = r"C:\Users\SS\Downloads\archive (1)\data\train.jsonl"

with open(file_path, "r", encoding="utf-8") as file:
    questions = []

    for line in file:
        data = json.loads(line)
        questions.append(data)

print("Total questions:", len(questions))

print("\nFirst question:")
print(questions[0]["question"])

print("\nFirst answer:")
print(questions[0]["answer"])
print("\nSample questions:")

fields = set()

for q in questions:
    fields.update(q.keys())

print("\nAll fields:")
print(fields)