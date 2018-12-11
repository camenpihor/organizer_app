"""Backend for pages of the website.

The website is organized into five (5) core objects: Questions, Books, Facts, Words,
and Topics.

Each core object above has four (4) pages: Home, Archive, Stats, and Item.

This module contains the backends for the four (4) pages of the five (5) core objects,
which have been factored to contain similar information so that the pages of each core
object can be served by the same functions.
"""
from django.shortcuts import get_object_or_404, render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import numpy as np

from .models.core import DEFAULT_CORE_OBJECT_TYPE
from .view_utils import (
    check_core_object_type,
    get_core_object_from_string,
    get_serializer_from_model,
)

HOME_PAGE_OBJECTS = 5


@api_view(["GET"])
def base(request, response_format=None):
    """Redirects URL "/" to the `DEFAULT_CORE_OBJECT_TYPE`'s home page.

    Parameters
    ----------
    request : HttpRequest
        Metadata about the request.

    Returns
    -------
    HttpResponse
        The home page of the `DEFAULT_CORE_OBJECT_TYPE`.
    """
    return home(
        request,
        core_object_type=DEFAULT_CORE_OBJECT_TYPE,
        response_format=response_format,
    )


@api_view(["GET"])
def home(request, core_object_type, response_format=None):
    """Serve the home page of the organizer.

    Parameters
    ----------
    request : HttpRequest
        Metadata about the request.
    core_object_type : str
        Must be one of `CORE_OBJECT_TYPES`.

    Returns
    -------
    HttpResponse
        Metadata aboue the response.
    """
    check_core_object_type(core_object_type)
    core_object_class = get_core_object_from_string(core_object_type)
    core_object_serializer = get_serializer_from_model(core_object_class)

    core_object_all = core_object_class.objects.all()
    if core_object_all:
        num_to_take = np.min([len(core_object_all), HOME_PAGE_OBJECTS])
        data = np.random.choice(core_object_all, size=num_to_take, replace=False)
        serializer = core_object_serializer(data, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def archive(request, core_object_type):
    """Serve the archive page of the organizer.

    Parameters
    ----------
    request : HttpRequest
        Metadata about `the request.
    core_object_type : str
        Must be one of `CORE_OBJECT_TYPES`.

    Returns
    -------
    HttpResponse
        Metadata about the response.
    """
    check_core_object_type(core_object_type)
    core_object_class = get_core_object_from_string(core_object_type)
    core_object_serializer = get_serializer_from_model(core_object_class)

    core_object_all = core_object_class.objects.all()
    serializer = core_object_serializer(core_object_all, many=True)
    return Response(serializer.data)


def stats(request, core_object_type):
    """Serve the stats page of the organizer.

    Parameters
    ----------
    request : HttpRequest
        Metadata about the request.
    core_object_type : str
        Must be one of `CORE_OBJECT_TYPES`.

    Returns
    -------
    HttpResponse
        Metadata about the response.
    """
    check_core_object_type(core_object_type)
    context = {"page_name": "Stats", "core_object_type": core_object_type.capitalize()}

    return render(request, template_name="stats.html", context=context)


def item(request, core_object_type, object_id):
    """Serve the item page of the organizer.

    Parameters
    ----------
    request : HttpRequest
        Metadata about the request.
    core_object_type : str
        Must be one of `CORE_OBJECT_TYPES`.
    object_id : int
        ID for object to retrieve and display.

    Returns
    -------
    HttpResponse
        Metadata about the response.
    """
    check_core_object_type(core_object_type)
    context = {"page_name": "Item", "core_object_type": core_object_type.capitalize()}

    core_object_class = get_core_object_from_string(core_object_type)
    core_object = get_object_or_404(core_object_class, pk=object_id)
    core_object.increment_num_views()
    context["core_object"] = core_object

    return render(request, template_name="item.html", context=context)
