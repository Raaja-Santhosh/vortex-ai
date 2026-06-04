import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, index=True)
    active_contract_value = Column(Float, default=0.0)
    lifetime_value = Column(Float, default=0.0)
    status = Column(String, default="Lead")  # Active, Inactive, Lead
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    invoice_number = Column(String, unique=True, index=True)
    amount = Column(Float)
    due_date = Column(DateTime)
    status = Column(String, default="Pending")  # Paid, Pending, Overdue
    is_recurring = Column(Boolean, default=False)
    billing_frequency = Column(String, default="One-time")  # Monthly, Quarterly, One-time
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    client = relationship("Client", back_populates="invoices")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="Todo")  # Todo, InProgress, Review, Done
    project_name = Column(String, index=True)
    priority = Column(String, default="Medium")  # Low, Medium, High
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TimerLog(Base):
    __tablename__ = "timer_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    duration_seconds = Column(Integer, default=0)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    file_path = Column(String)
    category = Column(String)  # NDA, Tax, Contract, Asset
    size_bytes = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
