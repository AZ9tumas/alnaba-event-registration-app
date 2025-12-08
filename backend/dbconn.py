import pyodbc

SERVER_IP = '172.16.31.60'
PORT = '1433'
DATABASE = 'AlnabaIT'
USERNAME = 'alnit'
PASSWORD = '!tDBadmin'

# Windows: '{ODBC Driver 17 for SQL Server}' or '{SQL Server}'
# Mac/Linux: '{ODBC Driver 17 for SQL Server}'
DRIVER = '{SQL Server}'

def test_connection():
    print(f"Attempting to connect to {SERVER_IP}...")

    try:
        # Construct the connection string
        # Note: We use the IP address (172.16.31.60) instead of the name (ASSET-BARTENDER)
        # because it is more reliable for network connections.
        conn_str = (
            f'DRIVER={DRIVER};'
            f'SERVER={SERVER_IP},{PORT};'
            f'DATABASE={DATABASE};'
            f'UID={USERNAME};'
            f'PWD={PASSWORD};'
        )
        
        print(conn_str)
        
        conn = pyodbc.connect(conn_str, timeout=5)
        cursor = conn.cursor()
        cursor.execute("SELECT @@VERSION")
        row = cursor.fetchone()
        
        if not row:
            print("Failed to get info.")
            return
        
        print("Connected to SQL Server.")
        print(f"Server Version: {row[0]}")
        
        while True:
            t = input(">> ")
            if t.lower() in ('exit', 'quit'):
                break
                
            try:
                cursor.execute(t)
            except pyodbc.Error as e:
                print("Query failed.")
                print(e)
            for record in cursor.fetchall():
                print(record)
        
        conn.close()

    except pyodbc.Error:
        print("Failed to connect.")

if __name__ == "__main__":
    test_connection()