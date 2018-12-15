"""Configurations for how to format the API return objects.

For more information on Django REST Framework serializers see
https://www.django-rest-framework.org/api-guide/serializers/.

Useful attributes for the `Meta` inner class include `model`, `fields`, and
`read_only_fields`.
"""
from rest_framework import serializers

from .models.core import Question, Book, Topic, Fact, Word


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for `models.core.Question`."""

    class Meta:
        """Additional information for the serializer."""

        model = Question
        fields = ("id", "question", "num_views", "rating", "created_at_utc")


class BookSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for `models.core.Book`."""

    class Meta:
        """Additional information for the serializer."""

        model = Book
        fields = ("id", "author", "title", "url", "num_views", "rating", "created_at_utc")


class TopicSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for `models.core.Topic`."""

    class Meta:
        """Additional information for the serializer."""

        model = Topic
        fields = ("id", "topic", "num_views", "rating", "created_at_utc")


class FactSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for `models.core.Fact`."""

    class Meta:
        """Additional information for the serializer."""

        model = Fact
        fields = ("id", "fact", "num_views", "rating", "created_at_utc")


class WordSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for `models.core.Word`."""

    class Meta:
        """Additional information for the serializer."""

        model = Word
        fields = ("id", "word", "definition", "num_views", "rating", "created_at_utc")
