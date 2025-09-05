#!/bin/bash

# Set up venv
python -m venv venv
source venv/bin/activate

# Install dependencies
python -m pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate