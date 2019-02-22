"""Test views for the API.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from api.models.core import CORE_OBJECT_TYPES, Question


@pytest.mark.django_db
class TestObjectList:
    """Tests for `"api:model-list"` URL."""

    client = APIClient()

    @pytest.mark.usefixtures("django_db_setup")
    def test_get(self):
        """Test GET request."""
        self.client.login(username="test", password="test")

        for core_object_type in CORE_OBJECT_TYPES:
            url = reverse(
                "api:model-list", kwargs={"object_type": core_object_type}
            )
            response = self.client.get(url, response_format="json")
            assert response.status_code == 200
            assert response.data is not None

    def test_post(self):
        """Test POST request."""
        self.client.login(username="test", password="test")

        question_id = 100
        url = reverse("api:model-list", kwargs={"object_type": "question"})
        data = {"question": "testing", "id": question_id}

        response = self.client.post(url, data, rsponse_format="json")
        assert response.status_code == 201


@pytest.mark.django_db
class TestCoreObjectNotebook:
    """Tests for `"api:core-notebook` URL."""

    client = APIClient()

    @pytest.mark.usefixtures("django_db_setup")
    def test_get(self):
        """Test GET request."""
        self.client.login(username="test", password="test")

        url = reverse("api:core-notebook", kwargs={"core_object_type": "question"})
        response = self.client.get(url, response_format="json")
        assert response.status_code == 200
        assert response.data is not None

    def test_put(self):
        """Test PUT request."""
        self.client.login(username="test", password="test")

        url = reverse("api:core-notebook", kwargs={"core_object_type": "question"})
        data = {"pk": 1, "markdown": "new value", "model_type": "question"}
        response = self.client.put(url, data, response_format="json")
        assert response.status_code == 200

    def test_post(self):
        """Test POST request."""
        self.client.login(username="test", password="test")
        core_object_type = "book"  # must not already exist in test_data.json
        url = reverse(
            "api:core-notebook", kwargs={"core_object_type": core_object_type}
        )
        data = {"markdown": "new value", "model_type": core_object_type}
        response = self.client.post(url, data, response_format="json")
        assert response.status_code == 200


@pytest.mark.django_db
class TestObjectDetail:
    """Tests for `"api:model-detail"` URL."""

    client = APIClient()

    @pytest.mark.usefixtures("django_db_setup")
    def test_get(self):
        """Test GET request."""
        self.client.login(username="test", password="test")

        for core_object_type in CORE_OBJECT_TYPES:
            url = reverse(
                "api:model-detail",
                kwargs={"object_type": core_object_type, "object_id": 1},
            )
            response = self.client.get(url, response_format="json")
            assert response.status_code == 200
            assert response.data is not None

    def test_put(self):
        """Test PUT request."""
        self.client.login(username="test", password="test")

        url = reverse(
            "api:model-detail", kwargs={"object_type": "question", "object_id": 1}
        )
        data = {"question": "testing?", "rating": 10000}
        response = self.client.put(url, data, response_format="json")
        assert response.status_code == 200

    def test_delete(self):
        """Test DELETE request."""
        self.client.login(username="test", password="test")

        question_id = 50
        Question.objects.create(question="Testing delete", pk=question_id)
        url = reverse(
            "api:model-detail",
            kwargs={"object_type": "question", "object_id": question_id},
        )
        response = self.client.delete(url)
        assert response.status_code == 204
