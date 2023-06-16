import psycopg2
from . import config
import os
from psycopg2.extras import DictCursor

class Database:
    def __init__(self):
        self.conn = None
        self.cur = None
        self.connect()

    ############################################################

    def create_database(self):
        try:
            # Create a new database
            self.conn = psycopg2.connect(
                host=config.host,
                database="postgres",
                user=config.user,
                password=config.password,
            )
            self.conn.autocommit = True
            self.cur = self.conn.cursor()
            self.cur.execute(f"CREATE DATABASE {config.database};")
            self.cur.close()
            self.conn.close()

            # Connect to the new database
            self.conn = psycopg2.connect(
                host=config.host,
                database=config.database,
                user=config.user,
                password=config.password,
            )
            self.cur = self.conn.cursor()

            # Create tables
            with open(
                os.path.join(os.path.dirname(__file__), "../database/tables.sql"),
                "r",
                encoding="utf-8",
            ) as f:
                self.cur.execute(f.read())
            self.conn.commit()
            self.cur.close()

        except psycopg2.Error as e:
            print(
                "Unable to create database. Please check your connection information."
            )
            raise e

    ############################################################

    def connect(self):
        # Connect to the database
        try:
            self.conn = psycopg2.connect(f"dbname={config.database}")
        except psycopg2.Error:
            self.create_database()

    ############################################################

    def execute_fetchall(self, query):
        """
        Executes a query and fetches all rows of the result set as a list of dictionaries.

        Args:
            query (str): The SQL query to execute.

        Returns:
            list: All rows of the result set as a list of dictionaries, or an empty list if the result set is empty.
        """
        try:
            self.cur = self.conn.cursor(cursor_factory=DictCursor)

            # Execute a query
            self.cur.execute(query)

            # Fetch the query result
            res = [dict(row) for row in self.cur.fetchall()]

            # Close the cursor
            self.cur.close()
            return res

        except psycopg2.Error as e:
            print("Unable to execute query.")
            raise e

    #################################e###########################

    def execute_fetchone(self, query):
        """
        Executes a query and fetches the first row of the result set as a dictionary.

        Args:
            query (str): The SQL query to execute.

        Returns:
            dict: The first row of the result set as a dictionary, or None if the result set is empty.
        """
        try:
            self.cur = self.conn.cursor(cursor_factory=DictCursor)

            # Execute a query
            self.cur.execute(query)

            # Fetch the query result
            res = dict(self.cur.fetchone()) if self.cur.rowcount > 0 else None

            # Close the cursor
            self.cur.close()
            return res

        except psycopg2.Error as e:
            print("Unable to execute query.")
            raise e

    ############################################################

    def execute_alter(self, query):
        """
        Executes an insert query.

        Args:
            query (str): The SQL insert query to execute.

        Raises:
            DatabaseError: If the query execution fails.

        """
        try:
            self.cur = self.conn.cursor()

            # Execute a query
            self.cur.execute(query)

            # Fetch the query result
            self.conn.commit()

            # Close the cursor
            self.cur.close()

        except psycopg2.Error as e:
            print("Unable to execute query.")
            raise e

    ############################################################

    def close(self):
        """
        Closes the cursor and connection to the database.
        """
        self.cur.close()
        self.conn.close()

db = Database()
# db.execute_insert('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

# for _ in range(100):
#     db.execute_insert("""INSERT INTO Users (name, gender, photo, email, password_hash)
# SELECT
#     CONCAT(first_name, ' ', last_name) AS name,
#     CASE WHEN RANDOM() < 0.5 THEN 'male' ELSE 'female' END AS gender,
#     CONCAT('https://randomuser.me/api/portraits/', CASE WHEN RANDOM() < 0.5 THEN 'men/' ELSE 'women/' END, FLOOR(RANDOM() * 99), '.jpg') AS photo,
#     (SELECT CONCAT(REPLACE(CONCAT(first_name, last_name, FLOOR(RANDOM() * 100), FLOOR(RANDOM() * 100))::text, ' ', ''), '@example.com')) AS email,
#     'pbkdf2:sha256:600000$7dnk51qYZiEYws3h$d437d95b82fd519cf1b8ac73885516bfa9ad9eef8fb307fd4341fbd362b67a38' AS password_hash
# FROM
#     (SELECT first_name FROM (VALUES ('John'), ('Jane'), ('Bob'), ('Alice'), ('David'), ('Mary'), ('Tom'), ('Sara'), ('Peter'), ('Emily')) AS first_names (first_name) ORDER BY RANDOM() LIMIT 1) AS fn,
#     (SELECT last_name FROM (VALUES ('Doe'), ('Smith'), ('Johnson'), ('Williams'), ('Brown'), ('Lee'), ('Wilson'), ('Taylor'), ('Anderson'), ('Clark')) AS last_names (last_name) ORDER BY RANDOM() LIMIT 1) AS ln
# LIMIT 1;""")

