import os
import sys

# Windows PySWIP DLL discovery fix
swi_paths = [
    r"C:\Program Files\swipl\bin",
    r"C:\Program Files (x86)\swipl\bin",
    r"D:\Program Files\swipl\bin",
    r"D:\Program Files (x86)\swipl\bin"
]
for p in swi_paths:
    if os.path.exists(p) and p not in os.environ.get('PATH', ''):
        os.environ['PATH'] = p + os.pathsep + os.environ['PATH']
        if hasattr(os, 'add_dll_directory'):
            os.add_dll_directory(p)
        break

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pyswip import Prolog

# Tell Flask to look one directory up for templates and static files
app = Flask(__name__, template_folder='../templates', static_folder='../static')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_schedule', methods=['POST'])
def generate_schedule():
    data = request.json
    subjects = data.get('subjects', [])
    rooms = data.get('rooms', [])
    slots = data.get('time_slots', [])
    
    # ---------------------------------------------
    # AI INTELLIGENT BOTTLENECK HEURISTICS
    # ---------------------------------------------
    num_lab_subjects = sum(1 for s in subjects if s.get('type') == 'lab')
    num_theory_subjects = sum(1 for s in subjects if s.get('type') != 'lab')
    
    num_lab_rooms = sum(1 for r in rooms if r.get('type') == 'lab')
    num_theory_rooms = sum(1 for r in rooms if r.get('type') != 'lab')
    num_slots = len(slots)
    
    if num_lab_subjects > (num_lab_rooms * num_slots):
        return jsonify({'status': 'error', 'message': f'AI Bottleneck Detected: You have scheduled {num_lab_subjects} Lab subjects, but only have physical capacity for {num_lab_rooms * num_slots} lab sessions across the week. Please add more Lab Rooms or Time Slots.'})
        
    if num_theory_subjects > (num_theory_rooms * num_slots):
        return jsonify({'status': 'error', 'message': f'AI Bottleneck Detected: You have scheduled {num_theory_subjects} Theory subjects, but only have physical capacity for {num_theory_rooms * num_slots} sessions. Please add more Theory Rooms or Time Slots.'})
    # ---------------------------------------------

    prolog = Prolog()
    
    # 1. Clear previous facts
    prolog.retractall('subject(_,_,_)')
    prolog.retractall('room(_,_)')
    prolog.retractall('time_slot(_)')
    
    # 2. Consult logic file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    scheduler_path = os.path.join(script_dir, "scheduler.pl").replace("\\", "/")
    
    try:
        list(prolog.query(f"consult('{scheduler_path}')"))
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to load Prolog logic: {str(e)}'})

    # 3. Assert new dynamic facts safely
    def safe_str(val):
        return str(val).replace("'", "\\'")

    for sub in subjects:
        prolog.assertz(f"subject('{safe_str(sub['name'])}', '{safe_str(sub['faculty'])}', '{safe_str(sub['type'])}')")
        
    for room in rooms:
        prolog.assertz(f"room('{safe_str(room['name'])}', '{safe_str(room['type'])}')")
        
    for time in slots:
        prolog.assertz(f"time_slot('{safe_str(time)}')")
        
    # 4. Query the solver
    try:
        result_iter = list(prolog.query("solve_schedule(Schedule)", maxresult=1))
        
        if not result_iter:
            return jsonify({'status': 'error', 'message': 'No valid schedule could be found by Prolog that satisfies all complex constraints. Try relaxing conditions.'})
            
        schedule_list = result_iter[0]['Schedule']
        
        formatted_schedule = []
        for item in schedule_list:
            formatted_schedule.append({
                'subject': item[0].decode('utf-8') if isinstance(item[0], bytes) else str(item[0]),
                'faculty': item[1].decode('utf-8') if isinstance(item[1], bytes) else str(item[1]),
                'type': item[2].decode('utf-8') if isinstance(item[2], bytes) else str(item[2]),
                'time_slot': item[3].decode('utf-8') if isinstance(item[3], bytes) else str(item[3]),
                'room': item[4].decode('utf-8') if isinstance(item[4], bytes) else str(item[4])
            })
            
        return jsonify({'status': 'success', 'schedule': formatted_schedule})
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Prolog execution error: {str(e)}'})

if __name__ == '__main__':
    # use_reloader=False prevents PySWIP C-library crashes during auto-reloads
    app.run(debug=True, use_reloader=False, port=5000)
