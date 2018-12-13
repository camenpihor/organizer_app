"""Classes representing the models for the project's database.

This file includes models for the project's core objects: Questions, Facts, Topics, Words,
and Books.
"""
from django.db import models

# the __name__ of each core object
CORE_OBJECT_TYPES = ["question", "book", "fact", "word", "topic"]
DEFAULT_CORE_OBJECT_TYPE = "question"


class CoreObject(models.Model):
    """The project's core objects.

    See README.md for more information about the core objects. This class is meant to be
    subclassed by the core object models and provides common attributes and methods.
    Since `abstract = True` in this class' `Meta` inner class, there will be no table
    backing this model in the project's database.

    Parameters
    ----------
    models : django.db.models.Model
        Django's abstraction for a table in the project's database.

    Attributes
    ----------
    created_at_utc : datetime.datetime, optional
        Time the core object was created.
    num_views : int, optional
        Amount of times the core object's item page has been accessed.
    rating : int, optional
        Subjective rating a user has provided to the core object.
    """

    created_at_utc = models.DateTimeField(auto_now_add=True)
    num_views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)

    def increment_num_views(self):
        """Add `1` to number of views."""
        self.num_views += 1
        self.save(update_fields=["num_views"])

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


class Book(CoreObject):
    """Books."""

    author = models.TextField()
    title = models.TextField()
    url = models.URLField(null=True, blank=True)

    class Meta(CoreObject.Meta):
        """Metadata for `Book`."""

        db_table = "core_books"


class Fact(CoreObject):
    """Facts."""

    fact = models.TextField()

    class Meta(CoreObject.Meta):
        """Metadata for `Fact`."""

        db_table = "core_facts"


class Question(CoreObject):
    """Questions."""

    question = models.TextField()

    class Meta(CoreObject.Meta):
        """Metadata for `Question`."""

        db_table = "core_questions"


class Topic(CoreObject):
    """Topics."""

    topic = models.TextField()

    class Meta(CoreObject.Meta):
        """Metadata for `Topic`."""

        db_table = "core_topics"


class Word(CoreObject):
    """Words."""

    word = models.TextField()
    definition = models.TextField()

    class Meta(CoreObject.Meta):
        """Metadata for `WOrd`."""

        db_table = "core_words"

