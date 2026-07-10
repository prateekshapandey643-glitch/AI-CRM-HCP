from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from app.langgraph_agent import llm
from app.database import SessionLocal
from app.models import Interaction
from app.schemas import InteractionCreate
from app.langgraph_agent import graph

router = APIRouter()


# -----------------------------
# Database Session
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# AI Request Model
# -----------------------------
class AIRequest(BaseModel):
    text: str


# -----------------------------
# AI Generate Form
# -----------------------------
@router.post("/api/generate-form")
def generate_form(request: AIRequest):

    result = graph.invoke({
        "tool": "extract",
        "user_input": request.text,
        "result": {}
    })

    return result["result"]


# -----------------------------
# Save Interaction
# -----------------------------
@router.post("/api/interactions")
def save_interaction(
    data: InteractionCreate,
    db: Session = Depends(get_db)
):

    interaction = Interaction(
        hcp_name=data.hcpName,
        interaction_type=data.interactionType,
        interaction_date=datetime.strptime(data.date, "%Y-%m-%d").date(),
        interaction_time=datetime.strptime(data.time, "%H:%M").time(),
        location=data.location,
        attendees=data.attendees,
        topics=data.topics,
        sentiment=data.sentiment,
        outcomes=data.outcomes,
        follow_up=data.followUp,
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return {
        "success": True,
        "message": "Interaction Saved Successfully",
        "id": interaction.id,
    }
@router.get("/api/interactions/search")
def search_interaction(name: str, db: Session = Depends(get_db)):
    interactions = (
        db.query(Interaction)
        .filter(Interaction.hcp_name.ilike(f"%{name}%"))
        .all()
    )

    return interactions
class UpdateInteraction(BaseModel):
    location: str
    outcomes: str
    followUp: str


@router.put("/api/interactions/{interaction_id}")
def edit_interaction(
    interaction_id: int,
    data: UpdateInteraction,
    db: Session = Depends(get_db),
):

    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        return {"message": "Interaction not found"}

    interaction.location = data.location
    interaction.outcomes = data.outcomes
    interaction.follow_up = data.followUp

    db.commit()

    return {"message": "Updated Successfully"}
@router.get("/api/interactions/{interaction_id}/summary")
def summarize(interaction_id: int, db: Session = Depends(get_db)):

    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        return {"message": "Not Found"}

    prompt = f"""
Summarize this doctor interaction in 3-4 lines.

Topics:
{interaction.topics}

Outcome:
{interaction.outcomes}
"""

    response = llm.invoke(prompt)

    return {"summary": response.content}

@router.get("/api/interactions/{interaction_id}/followup")
def followup(interaction_id: int, db: Session = Depends(get_db)):

    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        return {"message": "Not Found"}

    prompt = f"""
Suggest follow-up actions.

Topics:
{interaction.topics}

Outcome:
{interaction.outcomes}
"""

    response = llm.invoke(prompt)

    return {"recommendation": response.content}