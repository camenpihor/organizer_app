from rest_framework import serializers

from .models.core import Question, Book, Topic, Fact, Word


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "question", "num_views", "rating", "created_at_utc")


class BookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Book
        fields = ("id", "author", "title", "url", "num_views", "rating", "created_at_utc")


class TopicSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "topic", "num_views", "rating", "created_at_utc")


class FactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Fact
        fields = ("id", "fact", "num_views", "rating", "created_at_utc")


class WordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Word
        fields = ("id", "word", "defintion", "num_views", "rating", "created_at_utc")
