from fastapi import FastAPI, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import models
from database import engine, get_db

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="House of Study API")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/register")
async def register_student(
    request: Request,
    full_name: str = Form(...),
    phone_number: str = Form(...),
    course_interest: str = Form(...),
    notes: str = Form(None),
    db: Session = Depends(get_db)
):
    # Log the registration
    print(f"New Registration: {full_name}, {phone_number}, {course_interest}")
    
    # Save to database
    db_registration = models.Registration(
        full_name=full_name,
        phone_number=phone_number,
        course_interest=course_interest,
        notes=notes
    )
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    
    # Ideally return a JSON or a success template
    # For now we can return a success message or JSON
    return {"status": "success", "message": "Registration received! We will contact you soon."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
