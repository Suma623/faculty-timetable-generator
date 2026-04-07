document.addEventListener('DOMContentLoaded', () => {

    // Dark Mode System
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        if(localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeBtn.innerText = '☀️';
        }
        themeBtn.addEventListener('click', () => {
            if(document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeBtn.innerText = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeBtn.innerText = '☀️';
            }
        });
    }

    const createSubRow = (n='', f='', type='') => `
        <div class="input-row grid-subjects">
            <input type="text" placeholder="Subject Name" class="sub-name" value="${n}" required>
            <input type="text" placeholder="Faculty Name" class="sub-faculty" value="${f}" required>
            <select class="sub-type" required>
                <option value="" disabled hidden ${type===''?'selected':''}>Select Subject Type</option>
                <option value="theory" ${type==='theory'?'selected':''}>Theory</option>
                <option value="lab" ${type==='lab'?'selected':''}>Lab</option>
            </select>
            <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        </div>
    `;

    const createRoomRow = (n='', type='', cap='') => `
        <div class="input-row grid-rooms">
            <input type="text" placeholder="Room Name" class="room-name" value="${n}" required>
            <select class="room-type" required>
                <option value="" disabled hidden ${type===''?'selected':''}>Select Room Type</option>
                <option value="theory" ${type==='theory'?'selected':''}>Theory Room</option>
                <option value="lab" ${type==='lab'?'selected':''}>Lab Room</option>
            </select>
            <input type="number" placeholder="Capacity" class="room-cap" value="${cap}" required>
            <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        </div>
    `;

    const createSlotRow = (d='', t='') => `
        <div class="input-row grid-slots">
            <select class="slot-day" required>
                <option value="" disabled hidden ${d===''?'selected':''}>Select Day</option>
                <option value="Monday" ${d==='Monday'?'selected':''}>Monday</option>
                <option value="Tuesday" ${d==='Tuesday'?'selected':''}>Tuesday</option>
                <option value="Wednesday" ${d==='Wednesday'?'selected':''}>Wednesday</option>
                <option value="Thursday" ${d==='Thursday'?'selected':''}>Thursday</option>
                <option value="Friday" ${d==='Friday'?'selected':''}>Friday</option>
            </select>
            <select class="slot-time" required>
                <option value="" disabled hidden ${t===''?'selected':''}>Select Time Period</option>
                <option value="09:00 AM - 10:00 AM" ${t==='09:00 AM - 10:00 AM'?'selected':''}>09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM" ${t==='10:00 AM - 11:00 AM'?'selected':''}>10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM" ${t==='11:00 AM - 12:00 PM'?'selected':''}>11:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 01:00 PM" ${t==='12:00 PM - 01:00 PM'?'selected':''}>12:00 PM - 01:00 PM</option>
                <option value="01:00 PM - 02:00 PM" ${t==='01:00 PM - 02:00 PM'?'selected':''}>01:00 PM - 02:00 PM</option>
                <option value="02:00 PM - 03:00 PM" ${t==='02:00 PM - 03:00 PM'?'selected':''}>02:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 04:00 PM" ${t==='03:00 PM - 04:00 PM'?'selected':''}>03:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 05:00 PM" ${t==='04:00 PM - 05:00 PM'?'selected':''}>04:00 PM - 05:00 PM</option>
            </select>
            <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
        </div>
    `;

    // Add row listeners
    document.getElementById('add-sub-btn').addEventListener('click', () => {
        document.getElementById('subjects-container').insertAdjacentHTML('beforeend', createSubRow());
    });
    document.getElementById('add-room-btn').addEventListener('click', () => {
        document.getElementById('rooms-container').insertAdjacentHTML('beforeend', createRoomRow());
    });
    document.getElementById('add-slot-btn').addEventListener('click', () => {
        document.getElementById('slots-container').insertAdjacentHTML('beforeend', createSlotRow());
    });

    // Toggle view logic
    const toggleBtn = document.getElementById('toggle-view-btn');
    const tableEl = document.getElementById('schedule-table');
    const calendarEl = document.getElementById('calendar-container');

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if(tableEl.classList.contains('hidden')) {
                tableEl.classList.remove('hidden');
                calendarEl.classList.remove('active');
                toggleBtn.innerText = 'Calendar View';
            } else {
                tableEl.classList.add('hidden');
                calendarEl.classList.add('active');
                toggleBtn.innerText = 'List View';
            }
        });
    }

    // Extract DOM values
    const extractPayload = () => {
        const payload = { subjects: [], rooms: [], slots: [] };
        let hasEmpty = false;

        document.querySelectorAll('#subjects-container .input-row').forEach(row => {
            const n = row.querySelector('.sub-name').value;
            const f = row.querySelector('.sub-faculty').value;
            const t = row.querySelector('.sub-type').value;
            if(!n || !f || !t) hasEmpty = true;
            payload.subjects.push({name:n, faculty:f, type:t});
        });
        document.querySelectorAll('#rooms-container .input-row').forEach(row => {
            const n = row.querySelector('.room-name').value;
            const t = row.querySelector('.room-type').value;
            const c = row.querySelector('.room-cap').value;
            if(!n || !t || !c) hasEmpty = true;
            payload.rooms.push({name:n, type:t, cap:c});
        });
        document.querySelectorAll('#slots-container .input-row').forEach(row => {
            const d = row.querySelector('.slot-day').value;
            const t = row.querySelector('.slot-time').value;
            if(!d || !t) hasEmpty = true;
            payload.slots.push({day: d, time: t});
        });
        return { payload, hasEmpty };
    };

    // Initial Load - Exactly one blank row
    document.getElementById('subjects-container').innerHTML = createSubRow();
    document.getElementById('rooms-container').innerHTML = createRoomRow();
    document.getElementById('slots-container').innerHTML = createSlotRow();

    // CSV Bulk Upload
    const csvInput = document.getElementById('csv-upload');
    const uploadBtn = document.getElementById('upload-csv-btn');
    
    if (uploadBtn && csvInput) {
        uploadBtn.addEventListener('click', () => {
            if(confirm("To bulk-upload, format CSV as:\n[Subject Name], [Faculty Name], [Type]\n\nExample:\nAI, Dr. Smith, Theory\n\nHit OK to select file.")) {
                csvInput.click();
            }
        });
    }

    if (csvInput) {
        csvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const lines = evt.target.result.split('\n');
                let count = 0;
                lines.forEach(line => {
                    const parts = line.split(',');
                    if(parts.length >= 2) {
                        const name = parts[0].trim();
                        const fac = parts[1].trim();
                        const type = (parts[2] || '').trim().toLowerCase().includes('lab') ? 'lab' : 'theory';
                        if(name && fac) {
                            document.getElementById('subjects-container').insertAdjacentHTML('beforeend', createSubRow(name, fac, type));
                            count++;
                        }
                    }
                });
                alert(`Successfully parsed ${count} subjects!`);
            };
            reader.readAsText(file);
            csvInput.value = ''; // reset file input
        });
    }

    // Generator 
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const loading = document.getElementById('loading');
        const outputSection = document.getElementById('output-section');
        const errorSection = document.getElementById('error-message');
        const tbody = document.getElementById('schedule-body');

        const { payload, hasEmpty } = extractPayload();
        
        const strictPayload = {
            subjects: payload.subjects,
            rooms: payload.rooms.map(r => ({name: r.name, type: r.type, capacity: parseInt(r.cap)||0})),
            time_slots: payload.slots.map(s => `${s.day} ${s.time}`)
        };

        if(strictPayload.subjects.length === 0 || strictPayload.rooms.length === 0 || strictPayload.time_slots.length === 0) {
            alert("Please provide at least one subject, room, and time slot."); return;
        }

        if(hasEmpty) {
            alert("Please fill out all visible fields before generating."); return;
        }

        document.getElementById('generate-btn').style.display = 'none';
        loading.classList.remove('hidden');
        outputSection.classList.add('hidden');
        errorSection.classList.add('hidden');

        try {
            const response = await fetch('http://127.0.0.1:5000/generate_schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(strictPayload)
            });
            const result = await response.json();

            loading.classList.add('hidden');
            document.getElementById('generate-btn').style.display = 'inline-block';
            outputSection.classList.remove('hidden');

            if (result.status === 'success') {
                // Populate List View
                tbody.innerHTML = '';
                const sortedSchedule = result.schedule.sort((a,b) => a.time_slot.localeCompare(b.time_slot));

                sortedSchedule.forEach(item => {
                    const badgeClass = item.type === 'lab' ? 'badge-lab' : 'badge-theory';
                    tbody.insertAdjacentHTML('beforeend', `
                        <tr>
                            <td><strong>${item.subject}</strong></td>
                            <td>${item.faculty}</td>
                            <td>${item.time_slot}</td>
                            <td>${item.room}</td>
                            <td><span class="badge ${badgeClass}">${item.type}</span></td>
                        </tr>
                    `);
                });

                // Populate Visual Calendar Grid
                renderCalendarGrid(sortedSchedule);
                
                // Show grid automatically
                tableEl.classList.add('hidden');
                calendarEl.classList.add('active');
                if(toggleBtn) toggleBtn.innerText = 'List View';
                
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                errorSection.innerText = result.message || "Failed to generate schedule.";
                errorSection.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error API:", error);
            loading.classList.add('hidden');
            document.getElementById('generate-btn').style.display = 'inline-block';
            outputSection.classList.remove('hidden');
            errorSection.innerText = "Network error. Make sure the backend Flask server is running at http://127.0.0.1:5000.";
            errorSection.classList.remove('hidden');
        }
    });

    const renderCalendarGrid = (schedule) => {
        const cal = document.getElementById('calendar-container');
        if(!cal) return;
        cal.innerHTML = '';

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        // Extract unique times
        const timesObj = {};
        schedule.forEach(item => {
            const parts = item.time_slot.split(' '); // e.g. "Monday 09:00 AM - 10:00 AM"
            const timeRange = parts.slice(1).join(' '); // "09:00 AM - 10:00 AM"
            timesObj[timeRange] = true;
        });
        const uniqueTimes = Object.keys(timesObj).sort();

        // Build Headers
        cal.insertAdjacentHTML('beforeend', `<div class="cal-header">Time</div>`);
        days.forEach(d => cal.insertAdjacentHTML('beforeend', `<div class="cal-header">${d}</div>`));

        // Build Rows
        uniqueTimes.forEach(time => {
            cal.insertAdjacentHTML('beforeend', `<div class="cal-time">${time}</div>`);
            days.forEach(day => {
                const searchStr = `${day} ${time}`;
                const matchedEvents = schedule.filter(s => s.time_slot === searchStr);
                
                let cellHtml = `<div class="cal-cell">`;
                matchedEvents.forEach(ev => {
                    const cssClass = ev.type === 'lab' ? 'lab' : 'theory';
                    cellHtml += `
                        <div class="cal-event ${cssClass}">
                            <strong>${ev.subject}</strong><br>
                            ${ev.faculty}<br>
                            <small>${ev.room}</small>
                        </div>
                    `;
                });
                cellHtml += `</div>`;
                cal.insertAdjacentHTML('beforeend', cellHtml);
            });
        });
    };

});
