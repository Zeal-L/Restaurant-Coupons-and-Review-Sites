import psycopg2
from .. import config
import os
from psycopg2.extras import DictCursor

import csv
import random
import requests
from faker import Faker
from faker_food import FoodProvider
from werkzeug.security import generate_password_hash
from tqdm import tqdm


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

            # Create fake users
            # self.__fake_users()

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

    def __fake_users(self):
        fake = Faker()
        fake.add_provider(FoodProvider)

        # Open the CSV file for writing
        with open("backend/users.csv", "w", newline="", encoding="utf-8") as csvfile:
            # Create a CSV writer object
            writer = csv.writer(csvfile)

            # Write the header row
            writer.writerow(["Name", "Email", "Password"])
            print("Generating fake users...")
            for _ in tqdm(range(100)):
                name = fake.name()
                gender = random.choice(["male", "female", "other"])
                photo = people_url = requests.get(
                    "https://loremflickr.com/500/500/people", allow_redirects=True
                ).url
                email = fake.email()
                password = fake.password()
                password_hash = generate_password_hash(password)

                self.execute_alter(
                    f"INSERT INTO Users (name, gender, photo, email, password_hash) VALUES ('{name}', '{gender}', '{photo}', '{email}', '{password_hash}');"
                )

                # Write the data rows
                writer.writerow([name, email, password])



db = Database()
