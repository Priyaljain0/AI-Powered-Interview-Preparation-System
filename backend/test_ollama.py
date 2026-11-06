from llm_service import generate_response


answer = generate_response(
    "Explain what an API is in simple terms."
)

print(answer)