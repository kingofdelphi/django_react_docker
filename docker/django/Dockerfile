# Dockerfile

# Pull base image
FROM python:3.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
RUN pip install pipenv
COPY django/Pipfile django/Pipfile.lock ./
RUN pipenv install --system

# Copy project
COPY django/backend /code/

ENTRYPOINT sh -c "python manage.py runserver 0.0.0.0:8000"
