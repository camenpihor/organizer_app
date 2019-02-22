# pylint: disable=unused-argument, no-self-use
"""Backend for the API."""
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .view_utils import validate_and_get_object_info, check_object_type
from .serializers import NotebookSerializer
from .models.supporting import Notebook


class ObjectList(APIView):
    """List all model objects of a single type, or create new object instance."""

    def get(self, request, object_type, response_format=None):
        """List all model objects of a single type."""
        object_info = validate_and_get_object_info(object_type)

        object_all = object_info.model.objects.all()
        serializer = object_info.serializer(object_all, many=True)
        return Response(serializer.data)

    def post(self, request, object_type, response_format=None):
        """Create new core object instance."""
        object_info = validate_and_get_object_info(object_type)

        serializer = object_info.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObjectDetail(APIView):
    """Retrieve, update or delete a model object instance."""

    @staticmethod
    def get_object(model, object_id):
        """Get an object instance and validate."""
        try:
            return model.objects.get(pk=object_id)
        except model.DoesNotExist:
            raise Http404

    def get(self, request, object_type, object_id, response_format=None):
        """Get a model object instance."""
        object_info = validate_and_get_object_info(object_type)

        object_model = self.get_object(object_info.model, object_id)
        object_model.increment_num_views()
        serializer = object_info.serializer(object_model)
        return Response(serializer.data)

    def put(self, request, object_type, object_id, response_format=None):
        """Update a model object instance."""
        object_info = validate_and_get_object_info(object_type)

        object_model = self.get_object(object_info.model, object_id)
        serializer = object_info.serializer(object_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, object_type, object_id, response_format=None):
        """Delete a model object instance."""
        object_info = validate_and_get_object_info(object_type)

        object_model = self.get_object(object_info.model, object_id)
        object_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CoreObjectNotebook(APIView):
    """Handle a core object's notebook."""

    def get(self, request, core_object_type, response_format=None):
        """Get a model's notebook."""
        check_object_type(core_object_type)

        obj = get_object_or_404(Notebook, model_type=core_object_type)
        serializer = NotebookSerializer(obj)
        return Response(serializer.data)

    def put(self, request, core_object_type, response_format=None):
        """Update a notebook."""
        check_object_type(core_object_type)

        obj = get_object_or_404(Notebook, model_type=core_object_type)
        serializer = NotebookSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, core_object_type, response_format=None):
        """Create new notebook."""
        check_object_type(core_object_type)

        serializer = NotebookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
