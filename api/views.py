"""Backend for the API."""
from django.http import Http404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from .view_utils import validate_and_get_core_object_info


@api_view(["GET"])
def api_root(request, response_format=None):
    """Entry-point for the API."""
    return Response(
        {
            "questions": reverse(
                "api:core-list",
                kwargs={"core_object_type": "question"},
                request=request,
                format=response_format,
            ),
            "books": reverse(
                "api:core-list",
                kwargs={"core_object_type": "book"},
                request=request,
                format=response_format,
            ),
            "topics": reverse(
                "api:core-list",
                kwargs={"core_object_type": "topic"},
                request=request,
                format=response_format,
            ),
            "facts": reverse(
                "api:core-list",
                kwargs={"core_object_type": "fact"},
                request=request,
                format=response_format,
            ),
            "words": reverse(
                "api:core-list",
                kwargs={"core_object_type": "word"},
                request=request,
                format=response_format,
            ),
        }
    )


class CoreObjectList(APIView):
    """List all core objects of a single type, or create new core object instance."""

    def get(self, request, core_object_type, response_format=None):
        """List all core objects of a single type."""
        core_object_info = validate_and_get_core_object_info(core_object_type)

        core_object_all = core_object_info.model.objects.order_by('-created_at_utc')
        serializer = core_object_info.serializer(core_object_all, many=True)
        return Response(serializer.data)

    def post(self, request, core_object_type, response_format=None):
        """Create new core object instance."""
        core_object_info = validate_and_get_core_object_info(core_object_type)

        serializer = core_object_info.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CoreObjectDetail(APIView):
    """Retrieve, update or delete a core object instance."""

    @staticmethod
    def get_object(model, object_id):
        """Get a core object instance and validate."""
        try:
            return model.objects.get(pk=object_id)
        except model.DoesNotExist:
            raise Http404

    def get(self, request, core_object_type, object_id, response_format=None):
        """Get a core object instance."""
        core_object_info = validate_and_get_core_object_info(core_object_type)

        core_object = self.get_object(core_object_info.model, object_id)
        serializer = core_object_info.serializer(core_object)
        return Response(serializer.data)

    def put(self, request, core_object_type, object_id, response_format=None):
        """Update a core object instance."""
        core_object_info = validate_and_get_core_object_info(core_object_type)

        core_object = self.get_object(core_object_info.model, object_id)
        serializer = core_object_info.serializer(core_object, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, core_object_type, object_id, response_format=None):
        """Delete a core object instance."""
        core_object_info = validate_and_get_core_object_info(core_object_type)

        core_object = self.get_object(core_object_info.model, object_id)
        core_object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
