from sqlalchemy import Column, Integer, String, Text, Date, Time
from app.database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255))
    interaction_type = Column(String(100))
    interaction_date = Column(Date)
    interaction_time = Column(Time)
    location = Column(String(255))
    attendees = Column(Text)
    topics = Column(Text)
    sentiment = Column(String(50))
    outcomes = Column(Text)
    follow_up = Column(Text)