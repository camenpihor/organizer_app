#!/usr/bin/env python
"""Creates a command-line utility from which to manage the Django project.

This project's code does not have to be run through `manage.py`, however, `manage.py`
does a few things for the user:

- puts the project's package on `sys.path
- sets an environment variable that is a path to the project's`settings.py` file,
used by the django codebase.

For more information on `manage.py` refer to
https://docs.djangoproject.com/en/2.1/ref/django-admin/.

Examples
--------
`python manage.py runserver` -- runs a server to host the project's applications
`python manage.py test` -- tests the project against a test server and database
`python manage.py migrate` -- migrates the project's models to a database
"""
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "administration.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)
