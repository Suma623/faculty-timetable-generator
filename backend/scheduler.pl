% dynamic facts provided by Python
:- dynamic subject/3.       
:- dynamic room/2.          
:- dynamic time_slot/1.     

% entry point to fetch ONE full valid schedule for ALL subjects
solve_schedule(Schedule) :-
    findall(subject(N, F, T), subject(N, F, T), Subjects),
    assign_subjects(Subjects, [], Schedule).

% Base case: no more subjects to assign
assign_subjects([], CurrentSchedule, CurrentSchedule).

% Recursive case: pick a subject, pick valid room/time, add to schedule, constrain
assign_subjects([subject(SubjName, Fac, SubjType) | Rest], CurrentSchedule, FinalSchedule) :-
    time_slot(Time),
    room(RoomName, RoomType),
    
    % rules
    valid_room_type(SubjType, RoomType),
    \+ faculty_conflict(CurrentSchedule, Fac, Time),
    \+ room_conflict(CurrentSchedule, RoomName, Time),
    
    % assign and recurse
    NewAssignment = [SubjName, Fac, SubjType, Time, RoomName],
    assign_subjects(Rest, [NewAssignment | CurrentSchedule], FinalSchedule).

% Rule: Match Type
valid_room_type(lab, lab).
valid_room_type(theory, theory).

% Faculty cannot teach two subjects at the exact same time
faculty_conflict(CurrentSchedule, Faculty, Time) :-
    member([_, Faculty, _, Time, _], CurrentSchedule).

% Room cannot hold two subjects at the exact same time
room_conflict(CurrentSchedule, RoomName, Time) :-
    member([_, _, _, Time, RoomName], CurrentSchedule).
