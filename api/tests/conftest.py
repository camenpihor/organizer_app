"""Configurations for `pytest`."""
import pytest
from django.core.management import call_command


@pytest.fixture(scope="session")
def django_db_setup(django_db_setup, django_db_blocker):
    """Fixture which adds populates the test database.

    For more information see
    https://pytest-django.readthedocs.io/en/latest/database.html.
    rst#using-a-template-database-for-tests.

    To get model data in json format run `python manage.py dumpdata > db.json`
    """
    with django_db_blocker.unblock():
        call_command("loaddata", "api/tests/it/resources/test_data.json")
