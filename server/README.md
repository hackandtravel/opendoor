# OpenDoor Server

## Docker

### Build image

    docker build -t opendoor/server .

### Run

These are the command required to run the server in a production environment.

Make sure there is a `/var/data' directory that contains another (empty) `db` directory.
This directory will contain the mongodb files that will outlive the Docker container.

    docker run -d --name mongodb -v /var/data:/data dockerfile/mongodb
    docker run -d --name server -p 3000:3000 -p 3001:3001 --link mongodb:db opendoor/server