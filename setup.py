#!/usr/bin/env python
from os.path import realpath, dirname, join
from setuptools import setup, find_packages

DISTNAME = "organizer_app"
DESCRIPTION = "Personal Organizer of Life's Questions and Pursuits"
AUTHOR = "Camen Piho"
AUTHOR_EMAIL = "camen.piho.r@gmail.com"
URL = "http://github.com/camenpihor/organizer"

PROJECT_ROOT = dirname(realpath(__file__))
REQUIREMENTS_FILE = join(PROJECT_ROOT, "requirements.txt")
README_FILE = join(PROJECT_ROOT, "README.md")
VERSION_FILE = join(PROJECT_ROOT, "VERSION")

# Get the long description from the README file
with open(README_FILE) as f:
    long_description = f.read()

with open(REQUIREMENTS_FILE) as f:
    install_reqs = f.read().splitlines()

test_reqs = ["pytest", "pytest-cov"]

with open(VERSION_FILE) as f:
    version = f.read()


if __name__ == "__main__":
    setup(
        name=DISTNAME,
        version=version,
        maintainer=AUTHOR,
        maintainer_email=AUTHOR_EMAIL,
        description=DESCRIPTION,
        url=URL,
        long_description=long_description,
        packages=find_packages(),
        install_requires=install_reqs,
        tests_require=test_reqs,
    )
