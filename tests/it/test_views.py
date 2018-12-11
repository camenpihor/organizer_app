"""Test views for the organizer application.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from organizer.models.core import CORE_OBJECT_TYPES, Question


class TestApiRoot:
    """Tests for `"organizer:api_root"` URL."""

    client = APIClient()

    def test_get(self):
        """Test GET request."""
        url = reverse("organizer:api-root")
        response = self.client.get(url)
        assert response.status_code == 200


@pytest.mark.django_db
class TestCoreObjectList:
    """Tests for `"organizer:core-list"` URL."""

    client = APIClient()

    @pytest.mark.usefixtures("django_db_setup")
    def test_get(self):
        """Test GET request."""
        for core_object_type in CORE_OBJECT_TYPES:
            url = reverse(
                "organizer:core-list", kwargs={"core_object_type": core_object_type}
            )
            response = self.client.get(url, response_format="json")
            assert response.status_code == 200
            assert response.data is not None

    def test_post(self):
        """Test POST request."""
        question_id = 100
        url = reverse("organizer:core-list", kwargs={"core_object_type": "question"})
        data = {"question": "testing", "id": question_id}

        response = self.client.post(url, data, rsponse_format="json")
        assert response.status_code == 201


@pytest.mark.django_db
class TestCoreObjectDetail:
    """Tests for `"organizer:core-detail"` URL."""

    client = APIClient()

    @pytest.mark.usefixtures("django_db_setup")
    def test_get(self):
        """Test GET request."""
        for core_object_type in CORE_OBJECT_TYPES:
            url = reverse(
                "organizer:core-detail",
                kwargs={"core_object_type": core_object_type, "object_id": 1},
            )
            response = self.client.get(url, response_format="json")
            assert response.status_code == 200
            assert response.data is not None

    def test_put(self):
        """Test PUT request."""
        url = reverse(
            "organizer:core-detail",
            kwargs={"core_object_type": "question", "object_id": 1},
        )
        data = {"question": "testing?", "rating": 10000}
        response = self.client.put(url, data, response_format="json")
        assert response.status_code == 200

    def test_delete(self):
        """Test DELETE request."""
        question_id = 50
        Question.objects.create(question="Testing delete", pk=question_id)
        url = reverse(
            "organizer:core-detail",
            kwargs={"core_object_type": "question", "object_id": question_id},
        )
        response = self.client.delete(url)
        assert response.status_code == 204
