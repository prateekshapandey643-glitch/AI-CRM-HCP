import os
import json
import re

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from typing import TypedDict

load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY"),
)


class AgentState(TypedDict):
    tool: str
    user_input: str
    result: dict

def extract_interaction(state: AgentState):

    prompt = f"""
You are an AI CRM assistant.

Extract the following fields from the doctor's meeting.

Return ONLY valid JSON. No explanation, no markdown, no code fences, no extra text before or after the JSON.

Rules:
- interaction_date must be in YYYY-MM-DD format. If no date is mentioned, assume today's date.
- interaction_time must be in 24-hour HH:MM format (e.g. "15:00" for 3 PM). If no time is mentioned, leave it as an empty string.
- interaction_type must be exactly one of: Meeting, Call, Email, Conference.
- sentiment must be exactly one of: Positive, Neutral, Negative.

{{
"hcp_name":"",
"interaction_type":"",
"interaction_date":"",
"interaction_time":"",
"location":"",
"attendees":"",
"topics":"",
"sentiment":"",
"outcomes":"",
"follow_up":""
}}

Interaction:

{state["user_input"]}
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    # Strip markdown code fences if the model adds them anyway
    if raw.startswith("```"):
        raw = re.sub(r"^```(json)?", "", raw)
        raw = re.sub(r"```$", "", raw)
        raw = raw.strip()

    try:
        data = json.loads(raw)
    except Exception as e:
        print("JSON PARSE FAILED. Raw LLM output was:")
        print(raw)
        print("Error:", e)
        data = {}

    return {
        "result": data
    }


builder = StateGraph(AgentState)

builder.add_node("extract", extract_interaction)
# builder.add_node("search", search_interaction)
# builder.add_node("edit", edit_interaction)
# builder.add_node("summary", summarize_interaction)
# builder.add_node("followup", followup_recommendation)


# def router(state: AgentState):

    # tool = state["tool"]

    # if tool == "search":
    #     return "search"

    # elif tool == "edit":
    #     return "edit"

    # elif tool == "summary":
    #     return "summary"

    # elif tool == "followup":
    #     return "followup"

    # return "extract"


# builder.set_conditional_entry_point(router)

# builder.add_edge("extract", END)
# builder.add_edge("search", END)
# builder.add_edge("edit", END)
# builder.add_edge("summary", END)
# builder.add_edge("followup", END)
builder = StateGraph(AgentState)

builder.add_node("extract", extract_interaction)

builder.set_entry_point("extract")

builder.add_edge("extract", END)

graph = builder.compile()

# def search_interaction(state: AgentState):

#     return {
#         "result": {
#             "tool": "search",
#             "query": state["user_input"]
#         }
#     }


# def edit_interaction(state: AgentState):

#     return {
#         "result": {
#             "tool": "edit",
#             "instruction": state["user_input"]
#         }
#     }


# def summarize_interaction(state: AgentState):

#     prompt = f"""
# Summarize this doctor interaction in 3-4 concise lines.

# {state["user_input"]}
# """

#     response = llm.invoke(prompt)

#     return {
#         "result": {
#             "summary": response.content
#         }
#     }


# def followup_recommendation(state: AgentState):

#     prompt = f"""
# Based on the following interaction, recommend follow-up actions.

# {state["user_input"]}
# """

#     response = llm.invoke(prompt)

#     return {
#         "result": {
#             "recommendation": response.content
#         }
#     }