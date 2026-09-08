#!/bin/sh
set -e

echo "Applying database migrations..."
python manage.py migrate --noinput

if [ "$DJANGO_DEBUG" = "True" ]; then
    echo "Starting Django development server..."
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
    echo "Starting Gunicorn..."
    exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
