"""Test views for the organizer application.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
from django.urls import reverse
import pytest

from organizer.models.core import CORE_OBJECT_TYPES, Question, Book, Topic, Fact, Word


@pytest.mark.django_db
class BaseViewTest:
    """Tests for `"organizer:base"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        response = client.get(reverse("organizer:base"))
        assert response.status_code in (200, 204)


@pytest.mark.django_db
class HomeViewTest:
    """Tests for `"organizer:home"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        for core_object_type in CORE_OBJECT_TYPES:
            response = client.get(
                reverse("organizer:home", kwargs={"core_object_type": core_object_type})
            )
            assert response.status_code in (200, 204)


@pytest.mark.django_db
class TestArchiveView:
    """Tests for `"organizer:archive"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        for core_object_type in CORE_OBJECT_TYPES:
            response = client.get(
                reverse(
                    "organizer:archive", kwargs={"core_object_type": core_object_type}
                )
            )
            assert response.status_code == 200


class TestStatsView:
    """Tests for `"organizer:stats"` URL."""

    def test_resolution(self, client):
        """Ensure that URL resolves."""
        for core_object_type in CORE_OBJECT_TYPES:
            response = client.get(
                reverse("organizer:stats", kwargs={"core_object_type": core_object_type})
            )
            assert response.status_code == 200


class TestItemView:
    """Tests for `"organizer:item"` URL."""

    @pytest.mark.django_db
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
                    "organizer:item",
                    kwargs={"core_object_type": core_object_type, "object_id": object_id},
                )
            )
            assert response.status_code == 200

    @pytest.mark.django_db
    def test_increment_num_views_on_visit(self, client):
        """Ensure that `num_views` is incremented upon visit."""
        question_id = 2

        question_pre_visit = Question.objects.create(
            question="Testing num_views", pk=question_id
        )
        assert question_pre_visit.num_views == 0
        client.get(
            reverse(
                "organizer:item",
                kwargs={"core_object_type": "question", "object_id": question_id},
            )
        )
        question_post_visit = Question.objects.get(pk=question_id)
        assert question_post_visit.num_views == 1
