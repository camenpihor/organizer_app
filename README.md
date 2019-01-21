# Organizer Web Application

To organize my questioning and answering

## Idea

The primary object of this organizer is a `Question`. I find that questions are the
instinctual guiding component of my life and so I want to reflect that in my life's
organization. My questions are most prevalent in life's domains that are common to all --
social life, relationships, carrer, etc -- in essence, the domains of life that we are
steeped in since birth, those that everyone has opinions on. Likewise, after reaching some
sort of compentence in fields of study, questions begin to frame my advancement.

Other core objects that I have found to be important to me are: `Books`, `Facts`,
`Topics`, and `Words`. These are all secondary to questions and tend to have some circular
relationship to the other core objects. For example, I may have some `Book` that I am
reading that inspires a `Question`. That `Question` may lead to me discovering something
about myself or the world that I want to capture in a new `Word`. Eventually, the `Book`
that started all of this may interest me enough to begin a deep dive into some `Topic`
where I learn a bunch of `Facts`.

Phew...

Most of the time I don't expect these core objects to be that intertwined, but more often
than not, they tend to be connected to one or two other core objects.

Within each core object, there may be one or more supporting objects that have a
many-to-one relationship with its core object. I will spell these out further below, but
as an example a `Question` may have one or many `Resources` that I have used in
exploration of that `Question`.

## Objects

### Core

- (Q) Questions
- (B) Books
- (F) Facts
- (W) Words
- (T) Topics

### Supporting

- Resources (Q, T, F, B, W)
- Thoughts (Q)
- Answers (Q)
- Reviews (B)
- Notebooks (Q, T, F, W, B)
- Quotes (Q, T, B)
- Concepts (Q, T, F, W, B)

## User Interface

I really enjoy the process of exploring an idea in a journal, and I make a TON of lists so
I want to capture both of these things in the interface. Because of this, I think that I
hate the UI of forms. Instead, I think that I will rely on formulaic text entry that I can
then parse into the correct form in the backend.  In addition, each core object will be
connected to a `Notebook` that I can use as a scratch pad. I plan to use `Notebooks`
sparingly where each core object will have only a few and hopefulle only one for a long
while.

I also like games. I plan to integrate **streaks** and other games so that I can find
small bursts of motivation to write more frequently.

To aid my bad memory, I want to produce stats for each core object and the global site
usage.

## Repository

I am using Django REST framework as a backend API with a ReactJS frontend.

## TODO

- Test
- Perhaps add a global Home that gives global stats or something
- fix "Cant perform react state update on unmounted component error"
- stats in Home page
- stats page
- question/:id page
- refactor for computer
- new favicon
