from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import random

app = Flask(__name__)
CORS(app)

SERVER_IP = '172.16.31.60'
PORT = '1433'
DATABASE = 'AlnabaIT'
USERNAME = 'alnit'
PASSWORD = '!tDBadmin'
DRIVER = '{SQL Server}'

TABLE_NAME = 'Registration'

'''
>> select * from registration;
('ABCD1234  ', 'SampleName', 'SampleCompany', '12345678', 0, 0)
('AH0019    ', 'Tapan Das', 'Al-naba Group LLC', '989898', 0, 0)
('AH0100    ', 'Dhiman Bhattacharya', 'Al-naba Group LLC', '8787656', 0, 0)
>> select column_name from information_schema.columns where table_name = 'Registration';     
('EmpNo',)
('EmpName',)
('EmpCompany',)
('Contact_No',)
('NoOfParticipant',)
('LoctStat',)
'''

def get_db_connection():
    conn_str = (
        f'DRIVER={DRIVER};'
        f'SERVER={SERVER_IP},{PORT};'
        f'DATABASE={DATABASE};'
        f'UID={USERNAME};'
        f'PWD={PASSWORD};'
    )
    return pyodbc.connect(conn_str)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/check-employee', methods=['GET'])
def check_employee():
    emp_id = request.args.get('empId')
    if not emp_id:
        return jsonify({'error': 'EmpID is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = f"SELECT EmpName, EmpCompany, LoctStat, RflDrwNo FROM {TABLE_NAME} WHERE EmpNo = ?"
        cursor.execute(query, (emp_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({'error': 'Employee ID not found'}), 404
        
        emp_name, company_name, lock_stat, rnd = row
        
        if lock_stat == 1:
            return jsonify({
                'empName': emp_name,
                'companyName': company_name,
                'alreadyRegistered': True,
                'rnd': rnd
            })
            
        return jsonify({
            'empName': emp_name,
            'companyName': company_name,
            'alreadyRegistered': False
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    emp_id = data.get('empId')
    phone_number = data.get('phoneNumber')
    participants = data.get('participants')

    if not all([emp_id, phone_number, participants]):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        check_query = f"SELECT LoctStat, RflDrwNo FROM {TABLE_NAME} WHERE EmpNo = ?"
        cursor.execute(check_query, (emp_id,))
        row = cursor.fetchone()
        
        if not row:
             return jsonify({'error': 'Employee ID not found'}), 404
        
        if row[0] == 1:
             return jsonify({'message': 'Already registered', 'rnd': row[1], 'alreadyRegistered': True})

        # Generate 8-digit RND number
        rnd_number = str(random.randint(10000000, 99999999))

        update_query = f"""
            UPDATE {TABLE_NAME} 
            SET Contact_No = ?, NoOfParticipant = ?, LoctStat = 1, RflDrwNo = ?
            WHERE EmpNo = ?
        """
        cursor.execute(update_query, (phone_number, participants, rnd_number, emp_id))
        conn.commit()
        
        return jsonify({'message': 'Registration successful', 'rnd': rnd_number})

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    import socket
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
        print(f" \n *** YOUR API URL IS: http://{local_ip}:8000 *** \n")
    except:
        print("Could not determine local IP")

    # Host 0.0.0.0 allows access from other devices on the network
    app.run(host='0.0.0.0', port=8000, debug=True)