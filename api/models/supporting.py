"""Classes representing the models for the project's database.

This file includes models for the project's supporting objects: Notebooks, Thoughts,
Answers, Concepts, Reviews, Resources, and Quotes.
"""
from django.db import models

from .core import Question, Topic, Book, Word, Fact


class SupportingObject(models.Model):
    """The project's supporting objects.

    See README.md for more information about the supporting objects. This class is meatn
    to be subclassed by the supportig object models and provides common attributes and
    methods. Since `abstract = True` in this class' `Meta` inner class, there will be no
    table backing this model in the project's database.

    Parameters
    ----------
    models : django.db.models.Model
        Django's abstraction for a table in the project's database.

    Attributes
    ----------
    created_at_utc : datetime.datetime, optional
        Time the supporting object was created.
    """

    created_at_utc = models.DateTimeField(auto_now_add=True)

    class Meta:
        """Class container with metadata attached to the model.

        Useful attributes are `db_table`, `abstract`, `ordering`, `indexes`,
        `unique_together`, `index_together`, `constraints`.

        For subclasses of `CoreObject` the subclasses' `Meta` inner class must subclass
        this subclass by calling `class Meta(CoreObject.Meta)`.

        Attributes
        ----------
        abstract : boolean
            Informs django if this class should be backed by a table in a database.
            `True` means that it should *not* be backed by a table.
        """

        abstract = True


class Answer(SupportingObject):
    """Answers."""

    answer = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Answer`."""

        db_table = "supporting_answers"


class Concept(SupportingObject):
    """Concepts."""

    concept = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Concept`."""

        db_table = "supporting_concepts"


class Notebook(SupportingObject):
    """Nootebooks."""

    notebook = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Notebook`."""

        db_table = "supporting_notebooks"


class Quote(SupportingObject):
    """Quotes."""

    quote = models.TextField()
    location = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Quote`."""

        db_table = "supporting_quotes"


class Review(SupportingObject):
    """Reviews."""

    review = models.TextField()
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Review`."""

        db_table = "supporting_reviews"


class Resource(SupportingObject):
    """Resources."""

    resource = models.TextField()
    notes = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE)

    class Meta(SupportingObject.Meta):
        """Metadata for `Resource`."""

        db_table = "supporting_resources"
