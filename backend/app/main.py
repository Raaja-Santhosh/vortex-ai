import os
import datetime
import shutil
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base, SessionLocal
from .models import Client, Invoice, Task, TimerLog, Document
from .schemas import (
    ClientCreate, ClientResponse,
    InvoiceCreate, InvoiceResponse,
    TaskCreate, TaskResponse,
    TimerLogCreate, TimerLogStop, TimerLogResponse,
    DocumentResponse,
    ChatRequest, ChatResponse
)
from .chatbot import handle_chat_request

# Initialize DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vortex Studio Business OS API", version="1.0.0")

# Setup CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory setup
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper function to seed database if empty
def seed_db(db: Session):
    if db.query(Client).count() == 0:
        print("Seeding database with Vortex Studio default records...")
        
        # 1. Clients
        acme = Client(
            name="Sarah Jenkins",
            email="sarah@acmelabs.ai",
            phone="+1 (555) 234-5678",
            company="Acme Labs",
            active_contract_value=8000.0,
            lifetime_value=48000.0,
            status="Active",
            notes="Requires weekly engineering updates. Focused on custom LLM agents."
        )
        apex = Client(
            name="Marcus Vance",
            email="marcus@apexcorp.com",
            phone="+1 (555) 987-6543",
            company="Apex Corp",
            active_contract_value=12000.0,
            lifetime_value=96000.0,
            status="Active",
            notes="Next.js portal redesign. Prefers Slack communication."
        )
        zenith = Client(
            name="Dr. Elena Rostova",
            email="elena@zenithsystems.io",
            phone="+1 (555) 456-7890",
            company="Zenith Systems",
            active_contract_value=5000.0,
            lifetime_value=25000.0,
            status="Active",
            notes="Client-facing dashboard. Retainer billing."
        )
        chrono = Client(
            name="James Thorne",
            email="james@chrono.ai",
            phone=None,
            company="Chrono AI",
            active_contract_value=0.0,
            lifetime_value=0.0,
            status="Lead",
            notes="Spoke at AI summit. Wants SOW for Autonomous CRM agents in Q3."
        )
        
        db.add_all([acme, apex, zenith, chrono])
        db.commit() # Commit to get Client IDs for invoices
        
        # 2. Invoices
        inv1 = Invoice(
            client_id=apex.id,
            invoice_number="INV-2026-001",
            amount=12000.0,
            due_date=datetime.datetime.utcnow() - datetime.timedelta(days=30),
            status="Paid",
            is_recurring=True,
            billing_frequency="Monthly"
        )
        inv2 = Invoice(
            client_id=acme.id,
            invoice_number="INV-2026-002",
            amount=8000.0,
            due_date=datetime.datetime.utcnow() - datetime.timedelta(days=15),
            status="Paid",
            is_recurring=True,
            billing_frequency="Monthly"
        )
        inv3 = Invoice(
            client_id=zenith.id,
            invoice_number="INV-2026-003",
            amount=5000.0,
            due_date=datetime.datetime.utcnow() + datetime.timedelta(days=10),
            status="Pending",
            is_recurring=True,
            billing_frequency="Monthly"
        )
        inv4 = Invoice(
            client_id=apex.id,
            invoice_number="INV-2026-004",
            amount=12000.0,
            due_date=datetime.datetime.utcnow() - datetime.timedelta(days=5),
            status="Overdue",
            is_recurring=True,
            billing_frequency="Monthly"
        )
        
        db.add_all([inv1, inv2, inv3, inv4])
        
        # 3. Tasks
        t1 = Task(
            title="Design typography and monochromatic styling guidelines",
            description="Establish the CSS layout rules using strictly deep black #0C0C0C and pure white.",
            status="Done",
            project_name="Vortex Brand",
            priority="Medium",
            due_date=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        )
        t2 = Task(
            title="Build intent classifier model for chatbot",
            description="Setup regex parser and mock weights for quick AI-driven action mappings.",
            status="Done",
            project_name="Vortex Internal",
            priority="High",
            due_date=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        )
        t3 = Task(
            title="Implement Cmd+K command navigation menu",
            description="Create search utility filtering views, CRM clients, and invoice states.",
            status="InProgress",
            project_name="Vortex Internal",
            priority="High",
            due_date=datetime.datetime.utcnow() + datetime.timedelta(days=1)
        )
        t4 = Task(
            title="Integrate Stripe billing webhooks & payments API",
            description="Connect webhook events to toggle invoice status dynamically.",
            status="Todo",
            project_name="Apex Platform",
            priority="Medium",
            due_date=datetime.datetime.utcnow() + datetime.timedelta(days=7)
        )
        t5 = Task(
            title="Audit Q2 Tax Statements",
            description="Retrieve NDA filings and consolidate overhead invoices.",
            status="Todo",
            project_name="Vortex Admin",
            priority="Low",
            due_date=datetime.datetime.utcnow() + datetime.timedelta(days=14)
        )
        
        db.add_all([t1, t2, t3, t4, t5])
        
        # 4. Timer logs
        timer1 = TimerLog(
            project_name="Vortex Brand",
            duration_seconds=3600,
            start_time=datetime.datetime.utcnow() - datetime.timedelta(hours=4),
            end_time=datetime.datetime.utcnow() - datetime.timedelta(hours=3),
            is_active=False,
            notes="Initial design token definitions"
        )
        timer2 = TimerLog(
            project_name="Acme Labs AI",
            duration_seconds=7200,
            start_time=datetime.datetime.utcnow() - datetime.timedelta(hours=2),
            end_time=datetime.datetime.utcnow(),
            is_active=False,
            notes="Setup FastAPI database engines and model routes"
        )
        
        db.add_all([timer1, timer2])
        
        # 5. Documents
        doc1 = Document(
            name="Vortex_NDA_Template.pdf",
            file_path=os.path.join(UPLOAD_DIR, "Vortex_NDA_Template.pdf"),
            category="NDA",
            size_bytes=120400
        )
        doc2 = Document(
            name="2025_Tax_Form_1099.pdf",
            file_path=os.path.join(UPLOAD_DIR, "2025_Tax_Form_1099.pdf"),
            category="Tax",
            size_bytes=450200
        )
        doc3 = Document(
            name="Apex_SOW_Phase_1.pdf",
            file_path=os.path.join(UPLOAD_DIR, "Apex_SOW_Phase_1.pdf"),
            category="Contract",
            size_bytes=2100500
        )
        
        # Create empty dummy files to satisfy path resolution
        for doc in [doc1, doc2, doc3]:
            with open(doc.file_path, "wb") as f:
                f.write(os.urandom(min(doc.size_bytes, 1024))) # seed small bytes to simulate PDF
            db.add(doc)
            
        db.commit()
        print("Database seeded successfully.")

# Startup seed trigger
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()

# --- API ENDPOINTS ---

# 1. CLIENTS (CRM)
@app.get("/api/clients", response_model=List[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@app.post("/api/clients", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.delete("/api/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"detail": "Client deleted successfully"}

# 2. INVOICES
@app.get("/api/invoices", response_model=List[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).all()
    # Populate client_name for convenience in frontend
    res = []
    for inv in invoices:
        client = db.query(Client).filter(Client.id == inv.client_id).first()
        client_name = client.company if client else "Unknown Client"
        
        # Auto-update overdue status if past due date and not paid
        status_val = inv.status
        if status_val == "Pending" and inv.due_date < datetime.datetime.utcnow():
            inv.status = "Overdue"
            db.commit()
            db.refresh(inv)
            status_val = "Overdue"
            
        res.append(InvoiceResponse(
            id=inv.id,
            client_id=inv.client_id,
            invoice_number=inv.invoice_number,
            amount=inv.amount,
            due_date=inv.due_date,
            status=status_val,
            is_recurring=inv.is_recurring,
            billing_frequency=inv.billing_frequency,
            created_at=inv.created_at,
            client_name=client_name
        ))
    return res

@app.post("/api/invoices", response_model=InvoiceResponse)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    # Return with client name
    client = db.query(Client).filter(Client.id == db_invoice.client_id).first()
    client_name = client.company if client else "Unknown Client"
    
    return InvoiceResponse(
        id=db_invoice.id,
        client_id=db_invoice.client_id,
        invoice_number=db_invoice.invoice_number,
        amount=db_invoice.amount,
        due_date=db_invoice.due_date,
        status=db_invoice.status,
        is_recurring=db_invoice.is_recurring,
        billing_frequency=db_invoice.billing_frequency,
        created_at=db_invoice.created_at,
        client_name=client_name
    )

@app.patch("/api/invoices/{invoice_id}/status")
def update_invoice_status(invoice_id: int, status_update: dict, db: Session = Depends(get_db)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    new_status = status_update.get("status")
    if new_status not in ["Paid", "Pending", "Overdue"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    inv.status = new_status
    db.commit()
    return {"detail": f"Invoice updated to {new_status}"}

# 3. TASKS
@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.post("/api/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/api/tasks/{task_id}/status")
def update_task_status(task_id: int, status_update: dict, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    new_status = status_update.get("status")
    if new_status not in ["Todo", "InProgress", "Review", "Done"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    task.status = new_status
    db.commit()
    return {"detail": f"Task updated to {new_status}"}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}

# 4. TIME TRACKER
@app.get("/api/timer", response_model=Optional[TimerLogResponse])
def get_active_timer(db: Session = Depends(get_db)):
    return db.query(TimerLog).filter(TimerLog.is_active == True).first()

@app.get("/api/timer/logs", response_model=List[TimerLogResponse])
def get_timer_logs(db: Session = Depends(get_db)):
    return db.query(TimerLog).filter(TimerLog.is_active == False).order_by(TimerLog.created_at.desc()).all()

@app.post("/api/timer/start", response_model=TimerLogResponse)
def start_timer(timer_create: TimerLogCreate, db: Session = Depends(get_db)):
    # Stop any existing active timers first
    active_timer = db.query(TimerLog).filter(TimerLog.is_active == True).first()
    if active_timer:
        active_timer.is_active = False
        active_timer.end_time = datetime.datetime.utcnow()
        delta = active_timer.end_time - active_timer.start_time
        active_timer.duration_seconds = int(delta.total_seconds())
        db.commit()

    db_timer = TimerLog(
        project_name=timer_create.project_name,
        notes=timer_create.notes,
        is_active=True,
        start_time=datetime.datetime.utcnow()
    )
    db.add(db_timer)
    db.commit()
    db.refresh(db_timer)
    return db_timer

@app.post("/api/timer/stop", response_model=TimerLogResponse)
def stop_timer(stop_data: TimerLogStop, db: Session = Depends(get_db)):
    active_timer = db.query(TimerLog).filter(TimerLog.is_active == True).first()
    if not active_timer:
        raise HTTPException(status_code=400, detail="No active timer running")
        
    active_timer.is_active = False
    active_timer.end_time = datetime.datetime.utcnow()
    delta = active_timer.end_time - active_timer.start_time
    active_timer.duration_seconds = int(delta.total_seconds())
    if stop_data.notes:
        active_timer.notes = stop_data.notes
        
    db.commit()
    db.refresh(active_timer)
    return active_timer

# 5. DOCUMENTS (VAULT)
@app.get("/api/documents", response_model=List[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    return db.query(Document).all()

@app.post("/api/documents", response_model=DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    category: str = Form(...),
    db: Session = Depends(get_db)
):
    # Sanitize category
    if category not in ["NDA", "Tax", "Contract", "Asset"]:
        raise HTTPException(status_code=400, detail="Invalid category")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    # Save the file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file_stream if hasattr(file, "file_stream") else file.file, buffer)
        
    db_doc = Document(
        name=file.filename,
        file_path=file_path,
        category=category,
        size_bytes=os.path.getsize(file_path)
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete from filesystem if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception as e:
            print(f"Error deleting file from disk: {e}")
            
    db.delete(doc)
    db.commit()
    return {"detail": "Document deleted successfully"}

# 6. SYSTEM METRICS (FINANCIALS)
@app.get("/api/metrics")
def get_financial_metrics(db: Session = Depends(get_db)):
    # Revenue (total contract value of Active clients)
    active_clients = db.query(Client).filter(Client.status == "Active").all()
    monthly_recurring_revenue = sum(c.active_contract_value for c in active_clients)
    
    # Lifetime Value (total LTV across all clients)
    total_ltv = sum(c.lifetime_value for c in db.query(Client).all())
    
    # Invoices summary
    all_invoices = db.query(Invoice).all()
    total_paid = sum(i.amount for i in all_invoices if i.status == "Paid")
    total_pending = sum(i.amount for i in all_invoices if i.status == "Pending")
    total_overdue = sum(i.amount for i in all_invoices if i.status == "Overdue")
    
    # Monthly Expenses (Simulated Vortex Studio overheads: software retainers, hosting, contractors)
    monthly_expenses = 14500.0  # Simulated default fixed overheads
    
    # Runway Calculation (Cash runway in months)
    # Let's say our active cash balance is total_paid - monthly_expenses + some initial capital of $85,000
    current_cash_reserve = 85000.0 + total_paid - total_pending - monthly_expenses
    runway_months = round(current_cash_reserve / monthly_expenses, 1) if monthly_expenses > 0 else 99
    
    # Chart coordinates (6 months of simulated cash flow: revenue vs expenses)
    chart_data = [
        {"month": "Jan", "revenue": 18000, "expenses": 12000},
        {"month": "Feb", "revenue": 22000, "expenses": 13500},
        {"month": "Mar", "revenue": 25000, "expenses": 14000},
        {"month": "Apr", "revenue": monthly_recurring_revenue * 0.85, "expenses": monthly_expenses * 0.9},
        {"month": "May", "revenue": monthly_recurring_revenue, "expenses": monthly_expenses},
        {"month": "Jun", "revenue": monthly_recurring_revenue * 1.1, "expenses": monthly_expenses * 1.05},
    ]

    return {
        "monthly_recurring_revenue": monthly_recurring_revenue,
        "total_ltv": total_ltv,
        "total_paid": total_paid,
        "total_pending": total_pending,
        "total_overdue": total_overdue,
        "monthly_expenses": monthly_expenses,
        "cash_reserve": current_cash_reserve,
        "runway_months": runway_months,
        "chart_data": chart_data
    }

# 7. AI CHATBOT
@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    result = handle_chat_request(request.message, request.history)
    return ChatResponse(**result)
