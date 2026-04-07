# Faculty Timetable Generator

The Faculty Timetable Generator is an intelligent scheduling system designed to automatically generate faculty timetables without conflicts. The system uses Prolog for implementing constraint-based scheduling logic and Python Flask as the backend to integrate the logic with a web interface.

## Features
- Automatic faculty timetable generation
- Constraint-based scheduling using Prolog
- Conflict-free timetable creation
- Simple and interactive web interface
- Efficient allocation of subjects, faculty, and time slots

## Technologies Used
- Prolog (SWI-Prolog) – Scheduling logic
- Python Flask – Backend server
- HTML, CSS, JavaScript – Frontend interface
- GitHub – Version control

## Project Structure
AI_Faculty_Timetable
│
├── backend
│   ├── app.py
│   └── scheduler.pl
│
├── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css

## How It Works
1. The user interacts with the web interface.
2. The Python Flask backend receives the request.
3. The backend calls the Prolog scheduler logic.
4. Prolog processes scheduling constraints and generates a timetable.
5. The generated timetable is returned and displayed on the web interface.

## Future Improvements
- Faculty availability management
- Drag-and-drop timetable editing
- Export timetable as PDF
- Database integration for persistent storage
