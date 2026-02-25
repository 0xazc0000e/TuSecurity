import sqlite3
import sys

def check_db(db_path):
    print(f"--- {db_path} ---")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, username, email, role FROM users WHERE role='admin'")
        admins = cursor.fetchall()
        print(f"Admins: {admins}")
        
        cursor.execute("SELECT COUNT(*) FROM lessons")
        lessons = cursor.fetchone()[0]
        print(f"Lessons: {lessons}")
        
        cursor.execute("SELECT COUNT(*) FROM club_events")
        events = cursor.fetchone()[0]
        print(f"Events: {events}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

check_db('cyberclub.db')
check_db('cyberclub2.db')
