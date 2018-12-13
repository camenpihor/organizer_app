"""Organize models into multiple files.

For more information refer to
https://docs.djangoproject.com/en/2.1/topics/db/models/#organizing-models-in-a-package.
"""
from .core import Question, Book, Fact, Topic, Word
from .supporting import Answer, Concept, Notebook, Quote, Review, Resource
