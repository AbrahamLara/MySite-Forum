# MySite-Forum-django

This web app is built using the Django web framework utilizing jQuery, Boostrap, and PostgreSQL.

This web app allows users to signup and login to begin creating threads for other users to post on. Users also have the ability to reply to a post made. As more threads, posts, and replies are made the first 15 objects will be displayed and a button for fetching the next set of objects will appear.

Users also have the ability to view other user profiles while also being able to see teh threads, posts, and replies they have made. Another feature being able to delete threads, posts, and replies from your profile page.


## Note
If you wish to use a database other than postgres learn more [here](https://docs.djangoproject.com/en/2.0/ref/settings/#databases).

## Setup

* begin local database server.
* enter local database information in _DATABASES_ setting in `settings.py` file.
* must have a `2.0` version of django. This project was developed using django _2.0.6_
* must have python 3
* start server `python manage.py runserver`

# Screenshots
<image src="images/Screenshot1.png"/>
<image src="images/Screenshot2.png"/>
<image src="images/Screenshot3.png"/>
<image src="images/Screenshot4.png"/>
<image src="images/Screenshot5.png"/>
