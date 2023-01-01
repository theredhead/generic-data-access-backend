# About the mysql/docker-compose.yml file.

This docker compose file starts a mysql 5.7 database instance that will be available at localhost:3306 almost just as if you were running it as a normal service.

To start the service, first make sure that sure you have Docker Desktop installed and then open a terminal window and navigate into this directory. From there type:

`docker-compose up`

This should start a database server. The setup is such that databases will persist between reboots.
