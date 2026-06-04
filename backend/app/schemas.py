from pydantic import BaseModel
from typing import Optional, List
import datetime

# Client Schemas
class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: str
    active_contract_value: float = 0.0
    lifetime_value: float = 0.0
    status: str = "Lead"
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Invoice Schemas
class InvoiceBase(BaseModel):
    client_id: int
    invoice_number: str
    amount: float
    due_date: datetime.datetime
    status: str = "Pending"
    is_recurring: bool = False
    billing_frequency: str = "One-time"

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: datetime.datetime
    client_name: Optional[str] = None

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "Todo"
    project_name: str
    priority: str = "Medium"
    due_date: Optional[datetime.datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Timer Log Schemas
class TimerLogBase(BaseModel):
    project_name: str
    duration_seconds: int = 0
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None
    is_active: bool = True
    notes: Optional[str] = None

class TimerLogCreate(BaseModel):
    project_name: str
    notes: Optional[str] = None

class TimerLogStop(BaseModel):
    notes: Optional[str] = None

class TimerLogResponse(TimerLogBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Document Schemas
class DocumentBase(BaseModel):
    name: str
    category: str
    size_bytes: int

class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    uploaded_at: datetime.datetime

    class Config:
        from_attributes = True

# Chatbot Schemas
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    intent: str  # dashboard_nav, start_timer, stop_timer, create_invoice, faq, general
    action_data: Optional[dict] = None
    ticket_created: Optional[bool] = False
    ticket_id: Optional[str] = None
