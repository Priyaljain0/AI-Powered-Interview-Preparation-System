from datasets import load_dataset

dataset = load_dataset("Davichick/InterviewForge_GenDS")
'''
print(dataset)
train = dataset["train"]

print("\nColumns:")
print(train.column_names)

print("\nFirst question:")
print(train[0])

print("\nQuestion categories:")
print(train.features["question_category"])

print("\nQuestion levels:")
print(train.features["question_level"])
train = dataset["train"]

print("\nAll categories:")
print(train.unique("question_category"))

print("\nAll levels:")
print(train.unique("question_level"))'''
from collections import Counter
train = dataset["train"]

categories = Counter(train["question_category"])
levels = Counter(train["question_level"])

print("\nCategory distribution:")
for category, count in categories.items():
    print(category, ":", count)

print("\nLevel distribution:")
for level, count in levels.items():
    print(level, ":", count)
from collections import Counter

sectors = dataset["train"]["sector"]

sector_counts = Counter(sectors)

print("Total sectors:", len(sector_counts))

for sector, count in sector_counts.items():
    print(sector, ":", count)
