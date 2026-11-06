import ollama
import json


def generate_evaluation(question: str, answer: str, criteria: list[str]):

    criteria_text = "\n".join(
        f"{i + 1}. {item}"
        for i, item in enumerate(criteria)
    )

    prompt = f"""
You are evaluating a candidate's interview answer.

Question:
{question}

Candidate Answer:
{answer}

Evaluation Criteria:
{criteria_text}

Evaluate EVERY criterion.

For each criterion, decide:

- addressed = the answer clearly provides evidence
- partial = the answer provides some relevant evidence but lacks details
- missing = the answer provides no evidence

Important rules:

1. Evaluate only the candidate's answer.
2. Never invent experience, knowledge, projects, technologies, or claims.
3. Evaluate every criterion separately.
4. The number of criteria_evaluation items MUST be exactly {len(criteria)}.
5. Keep the same order as the Evaluation Criteria above.
6. Do not add new criteria.
7. Do not combine criteria.
8. Every explanation must contain useful feedback.
9. For missing criteria, explain what evidence was not provided.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "criteria_evaluation": [
        {{
            "status": "addressed",
            "explanation": "The candidate provided evidence..."
        }}
    ],
    "strengths": [],
    "missing_concepts": [],
    "feedback": "",
    "learning_recommendations": [],
    "improved_answer": ""
}}

There must be exactly {len(criteria)} objects inside criteria_evaluation.
"""

    try:
        response = ollama.chat(
            model="qwen3:1.7b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict and objective interview evaluator. "
                        "Return only valid JSON. "
                        "Never invent information."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "temperature": 0.1
            }
        )

        content = response["message"]["content"]

        result = json.loads(content)

        criteria_evaluation = result["criteria_evaluation"]

        # Safety check
        if len(criteria_evaluation) != len(criteria):
            raise RuntimeError(
                f"Expected {len(criteria)} criteria, "
                f"but LLM returned {len(criteria_evaluation)}"
            )

        # Backend controls criterion names
        for i, item in enumerate(criteria_evaluation):

            item["criterion"] = criteria[i]

            if item["status"] not in [
                "addressed",
                "partial",
                "missing"
            ]:
                raise RuntimeError(
                    f"Invalid status returned for criterion {i + 1}"
                )

            if not item.get("explanation"):
                item["explanation"] = (
                    "The candidate did not provide enough evidence "
                    "for this criterion."
                )

            # Backend controls criterion-level score
            if item["status"] == "addressed":
                item["score"] = 1

            else:
                item["score"] = 0

        # Calculate final score ourselves
        total_points = 0

        for item in criteria_evaluation:

            if item["status"] == "addressed":
                total_points += 1

            elif item["status"] == "partial":
                total_points += 0.5

        if len(criteria_evaluation) == 0:
            final_score = 0
        else:
            final_score = round(
                (total_points / len(criteria_evaluation)) * 10
            )

        result["score"] = final_score

        # Clean unsupported importance claims
        feedback = result.get("feedback", "")

        feedback = feedback.replace(
            "critical",
            "relevant"
        )

        feedback = feedback.replace(
            "essential",
            "relevant"
        )

        feedback = feedback.replace(
            "required",
            "relevant"
        )

        result["feedback"] = feedback

        return result

    except json.JSONDecodeError:
        raise RuntimeError(
            "LLM returned invalid JSON"
        )

    except Exception as e:
        raise RuntimeError(
            f"LLM generation failed: {e}"
        )