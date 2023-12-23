from pymongo import MongoClient
from faker import Faker
import random
import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['AuthUser']  # Replace 'your_database_name' with your actual database name
collection = db['blogs']

# Create a Faker instance for generating fake data
fake = Faker()

# Function to generate random posts
def generate_random_post():
    title = fake.sentence()
    content = fake.sentence()
    author = fake.name()
    created_at = fake.date_time_this_decade()

    return {
        'title': title,
        'content': content,
        'author': author,
    }

# Populate the database with 10 posts
for _ in range(10):
    post_data = generate_random_post()
    collection.insert_one(post_data)

print("Database populated with 10 example posts.")
