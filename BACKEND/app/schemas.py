from pydantic import BaseModel

class InteractionCreate(BaseModel):
    hcpName: str
    interactionType: str
    date: str
    time: str
    location: str
    attendees: str
    topics: str
    sentiment: str
    outcomes: str
    followUp: str