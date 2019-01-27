# MySite-Forum

This web app is built using the Django web framework utilizing jQuery, Boostrap, and PostgreSQL.

This web app allows users to signup and login to begin creating threads for other users to post on. Users also have the ability to reply to a post made. As more threads, posts, and replies are made the first 15 objects will be displayed and a button for fetching the next set of objects will appear.

Users also have the ability to view other user profiles while also being able to see the threads, posts, and replies they have made. Another feature being able to delete threads, posts, and replies from your profile page.

## Requirements
* PostgreSQL 10 or higher
* pip (to install Django)
* Django `2.0.6`
* Python 3

## Installing Django using pip
```
pip install Django==2.0.6
```

## Creating Database
Open PostgreSQL in the terminal and type:
```
CREATE ROLE admin WITH LOGIN PASSWORD 'mysite';
CREATE DATABASE mysite;
GRANT ALL PRIVILEGES ON DATABASE mysite TO admin;
```

## Starting the project:
```
git clone https://github.com/AbrahamLara/MySite-Forum.git
cd MySite-Forum/
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```
Then visit __127.0.0.1:8000__ in a browser

# Screenshots
<image src="images/Screenshot1.png"/>
<image src="images/Screenshot2.png"/>
<image src="images/Screenshot3.png"/>
<image src="images/Screenshot4.png"/>
<image src="images/Screenshot5.png"/>
