"""Test views for the organizer application.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
from django.urls import reverse
import pytest

from organizer.models.core import CORE_OBJECT_TYPES, Question, Book, Topic, Fact, Word


class ApiRootTest:
    """Tests for `"organizer:api_root"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        response = client.get(reverse("organizer:api_root"))
        assert response.status_code == 200


@pytest.mark.django_db
class CoreObjectListTest:
    """Tests for `"organizer:core-list"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        for core_object_type in CORE_OBJECT_TYPES:
            response = client.get(
                reverse(
                    "organizer:core-list", kwargs={"core_object_type": core_object_type}
                )
            )
            assert response.status_code == 200


@pytest.mark.django_db
class CoreObjectDetailTest:
    """Tests for `"organizer:item"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        object_id = 1

        Question.objects.create(question="This is a test", pk=object_id)
        Book.objects.create(author="test", title="test", pk=object_id)
        Topic.objects.create(topic="This is a test", pk=object_id)
        Fact.objects.create(fact="This is a test", pk=object_id)
        Word.objects.create(word="This is a test", pk=object_id)

        for core_object_type in CORE_OBJECT_TYPES:
            response = client.get(
                reverse(
                    "organizer:core-detail",
                    kwargs={"core_object_type": core_object_type, "object_id": object_id},
                )
            )
            assert response.status_code == 200
