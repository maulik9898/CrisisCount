-- Drop the existing tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS location;


-- Create the calculate_total_employees function
CREATE OR REPLACE FUNCTION calculate_total_employees()
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total FROM employees;
  RETURN total;
END;
$$ LANGUAGE plpgsql;


-- Create the Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_time TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    total INTEGER DEFAULT calculate_total_employees() NOT NULL
);


-- Create a partial unique index to enforce only one active event at a time
CREATE UNIQUE INDEX unique_active_event ON events (is_active) WHERE (is_active);

-- Create the Employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL ,
    employee_type CITEXT NOT NULL DEFAULT 'INTERNAL'::CITEXT,
    CONSTRAINT check_employee_type CHECK (employee_type IN ('CONTRACTOR'::CITEXT, 'INTERNAL'::CITEXT))
);

-- Create the Location table
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create the Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    employee_id INTEGER,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location_id INTEGER ,
    CONSTRAINT unique_attendance_event_employee UNIQUE (event_id, employee_id),
    constraint attendance_employee_id_fkey foreign key (employee_id) references employees (id) on delete set null,
    constraint attendance_event_id_fkey foreign key (event_id) references events (id) on delete cascade,
    constraint attendance_location_id_fkey foreign key (location_id) references location (id) on delete set null
);


