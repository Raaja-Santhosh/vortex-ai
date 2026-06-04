import os
import re
import json
import random
from typing import List, Dict, Tuple, Optional
import google.generativeai as genai

# Setup Gemini API key if present
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Static Knowledge Base (FAQ) for Vortex Studio
FAQ_DATA = {
    "services": "Vortex Studio specializes in boutique AI automation workflows, high-performance web applications (Next.js/React), UI/UX design systems, and custom LLM integrations.",
    "pricing": "Our pricing model includes client retainers starting at $5,000/month for dedicated design & engineering bandwidth, and custom fixed-scope projects. Our standard hourly billing rate is $150/hour.",
    "timeline": "Typical MVP development is completed in 3-5 weeks. Custom enterprise AI integrations and large-scale redesigns take 2-3 months.",
    "support": "You can contact our support team at support@vortexstudio.ai. For live system queries, our AI chatbot can trigger support tickets directly. Would you like me to route you to a human agent?",
    "location": "Vortex Studio is a fully distributed remote-first agency with hubs in San Francisco, London, and Bangalore, serving clients globally.",
    "clients": "We work with tech startups, scale-ups, and AI companies. Some of our client portfolio includes Apex Corp, Zenith Systems, and Acme Labs."
}

def analyze_intent_rule_based(message: str) -> Tuple[str, str, Optional[dict], bool, Optional[str]]:
    """
    Fallback regex/rule-based intent classifier for Vortex Studio dashboard operations.
    Returns: (response_text, intent, action_data, ticket_created, ticket_id)
    """
    msg_lower = message.lower()
    
    # --- Intent 1: Time Tracker Controls ---
    # Start timer
    start_timer_match = re.search(r"start\s+timer\s+(?:for\s+)?([a-zA-Z0-9\s\-]+)", msg_lower)
    if start_timer_match:
        project_name = start_timer_match.group(1).strip().upper()
        return (
            f"Starting the timer for project '{project_name}'. Let's get to work!",
            "start_timer",
            {"project_name": project_name},
            False,
            None
        )
    if "start timer" in msg_lower or "start tracking" in msg_lower:
        return (
            "Starting timer for default project 'Vortex Internal'.",
            "start_timer",
            {"project_name": "Vortex Internal"},
            False,
            None
        )
    # Stop timer
    if any(keyword in msg_lower for keyword in ["stop timer", "pause timer", "end timer", "stop tracking"]):
        return (
            "Timer stopped and logged successfully.",
            "stop_timer",
            None,
            False,
            None
        )

    # --- Intent 2: Invoicing ---
    # Create Invoice (e.g. "create invoice of 500 for Apex")
    create_invoice_match = re.search(r"(?:create|make|generate)\s+(?:an\s+)?invoice\s+(?:for\s+)?([a-zA-Z0-9\s\-]+)?\s*(?:of\s+)?\$?([0-9]+(?:\.[0-9]+)?)?", msg_lower)
    if create_invoice_match:
        client_name = create_invoice_match.group(1) or "Vortex Client"
        amount = create_invoice_match.group(2) or "1500"
        client_name = client_name.strip().title()
        return (
            f"Opening the Invoice Creation modal for client '{client_name}' with amount ${amount}.",
            "create_invoice",
            {"client_name": client_name, "amount": float(amount)},
            False,
            None
        )

    # --- Intent 3: Dashboard Navigation ---
    # Finance
    if any(keyword in msg_lower for keyword in ["finance", "revenue", "expense", "runway", "financial", "sales", "make money"]):
        return (
            "Navigating to the Financial Command Center. Real-time metrics and cash flow calculations are loaded.",
            "dashboard_nav",
            {"tab": "finance"},
            False,
            None
        )
    # Invoices
    if any(keyword in msg_lower for keyword in ["invoices", "invoice", "billing", "payment", "due"]):
        return (
            "Opening the Invoicing & Billing vault.",
            "dashboard_nav",
            {"tab": "invoices"},
            False,
            None
        )
    # CRM
    if any(keyword in msg_lower for keyword in ["crm", "client", "clients", "customer", "customers", "contract", "ltv"]):
        return (
            "Loading Client CRM directory. View customer histories, lifetime values, and active retainers.",
            "dashboard_nav",
            {"tab": "crm"},
            False,
            None
        )
    # Tasks
    if any(keyword in msg_lower for keyword in ["task", "tasks", "project", "projects", "kanban", "board", "deliverable"]):
        return (
            "Switching to Project & Task Kanban boards.",
            "dashboard_nav",
            {"tab": "tasks"},
            False,
            None
        )
    # Timer
    if any(keyword in msg_lower for keyword in ["timer", "time", "clock"]):
        return (
            "Opening the Time Tracking sheet.",
            "dashboard_nav",
            {"tab": "timer"},
            False,
            None
        )
    # Vault
    if any(keyword in msg_lower for keyword in ["document", "documents", "vault", "nda", "tax", "files"]):
        return (
            "Opening the Document Vault. NDAs, tax forms, and assets are securely loaded.",
            "dashboard_nav",
            {"tab": "vault"},
            False,
            None
        )

    # --- Intent 4: FAQ Responses ---
    if any(keyword in msg_lower for keyword in ["service", "offer", "do you build", "capabilities"]):
        return (FAQ_DATA["services"], "faq", None, False, None)
    if any(keyword in msg_lower for keyword in ["rate", "price", "pricing", "cost", "retainer", "fee"]):
        return (FAQ_DATA["pricing"], "faq", None, False, None)
    if any(keyword in msg_lower for keyword in ["timeline", "how long", "turnaround", "duration"]):
        return (FAQ_DATA["timeline"], "faq", None, False, None)
    if any(keyword in msg_lower for keyword in ["location", "office", "where"]):
        return (FAQ_DATA["location"], "faq", None, False, None)
    if any(keyword in msg_lower for keyword in ["who are your clients", "portfolio", "acme", "apex", "zenith"]):
        return (FAQ_DATA["clients"], "faq", None, False, None)

    # --- Intent 5: Support Ticket Routing ---
    if any(keyword in msg_lower for keyword in ["human", "agent", "support", "contact", "refund", "complain", "broken", "bug", "error"]):
        ticket_id = f"VTX-{random.randint(1000, 9999)}"
        return (
            f"I have classified this issue as high-priority support. Creating support ticket **{ticket_id}** and routing to senior support agent Sarah. We will contact you within 2 hours.",
            "general",
            None,
            True,
            ticket_id
        )

    # --- Default ---
    return (
        "I am your Vortex Studio AI assistant. I can answer FAQs, start timers (e.g., 'start timer for Acme Project'), create invoices, or open dashboard tabs. Try asking 'Show me our CRM' or 'What are Vortex Studio's pricing rates?'.",
        "general",
        None,
        False,
        None
    )

def handle_chat_request(message: str, history: List[dict] = None) -> Dict:
    """
    Main entry point for chat message processing. Integrates Gemini API if config is present,
    otherwise uses the robust rule-based model.
    """
    if GEMINI_API_KEY:
        try:
            # Construct a structured prompt for Gemini to return JSON conforming to the schema.
            # We provide the model context of Vortex Studio + FAQs.
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            system_prompt = f"""
            You are "Vortex AI", the intelligent system assistant for "Vortex Studio", a boutique AI & web agency.
            You assist the agency owner with managing their dashboard (navigating sections, controlling timers, generating invoices) AND answer client inquiries.
            
            Our FAQs/Knowledge Base:
            - Services: {FAQ_DATA['services']}
            - Pricing: {FAQ_DATA['pricing']}
            - Timelines: {FAQ_DATA['timeline']}
            - Support: {FAQ_DATA['support']}
            - Location: {FAQ_DATA['location']}
            - Clients: {FAQ_DATA['clients']}
            
            Based on the user's input, classify their intent and trigger appropriate dashboard controls if needed.
            You MUST return a JSON object with this exact structure:
            {{
                "response": "Your conversational answer to the user",
                "intent": "dashboard_nav" | "start_timer" | "stop_timer" | "create_invoice" | "faq" | "general",
                "action_data": null | {{ "tab": "finance"|"invoices"|"tasks"|"timer"|"crm"|"vault" }} | {{ "project_name": "string" }} | {{ "client_name": "string", "amount": 1000 }},
                "ticket_created": true | false,
                "ticket_id": null | "VTX-XXXX"
            }}
            
            Examples:
            - "Show me our CRM table" -> intent="dashboard_nav", action_data={{"tab": "crm"}}
            - "start timer for apex automation" -> intent="start_timer", action_data={{"project_name": "Apex Automation"}}
            - "what are your hourly rates?" -> intent="faq", response="Pricing is..."
            - "I want to speak with a human support agent" -> intent="general", ticket_created=true, ticket_id="VTX-1234"
            """
            
            chat = model.start_chat(history=[])
            prompt_content = f"{system_prompt}\n\nUser message: {message}"
            response = chat.send_message(prompt_content)
            
            # Extract JSON from response text
            text = response.text.strip()
            # Clean up markdown codeblocks if returned
            if text.startswith("```"):
                text = re.sub(r"^```(?:json)?\n", "", text)
                text = re.sub(r"\n```$", "", text)
                text = text.strip()
                
            data = json.loads(text)
            return data
        except Exception as e:
            # Log error and fallback
            print(f"Error calling Gemini: {e}")
            pass

    # Fallback to rule-based intent engine
    response_text, intent, action_data, ticket_created, ticket_id = analyze_intent_rule_based(message)
    return {
        "response": response_text,
        "intent": intent,
        "action_data": action_data,
        "ticket_created": ticket_created,
        "ticket_id": ticket_id
    }
