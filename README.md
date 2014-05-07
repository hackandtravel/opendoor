OpenDoor
========

## The Problem

I live in a flatshare on the 5th floor in Vienna. If you have a smiliar living situation you might have encountered the problem, that when you get guests (friends, pizza, parcel) first you have to let them in downstairs. This usually happens with a phone on the wall and a button to open. Now, you have to get up, go there open your friend, and then you have to wait until he comes up, this usually takes 1-2 minutes or even longer, in which time you can not really do anything but wait.

I was really annoyed by this, since our rooms are all quite far away from the door opener and no one wants to get up and open the door. This is why I was looking into a solution with my raspberry pi, which wasn't doing anything anyway.
I manage to open the door via ssh and was already very happy. When we went to Berlin, this was the perfect oportunity to make an app for this. So this is what we came up with:

### Solution
#### OpenDoor

A client and a server. The client authenticates with the server gets a token and from then on any door you add can be opened with a single button push. You can add multiple doors and choose between them.

The server has the capabilities to generate passphrases with a masterpasswort. These passphrases can then be used to login to the server and obtain a secure token which will be used for authentication from this point on.
#### API Documentation

http://docs.opendoor.apiary.io/

#### Setup
##### Requirements

* You need a compatible door opener (one where you can push a button thus closing a circuit which opens the door)
* a Raspberry Pi (only raspbian tested)
* a Relais and a circuit with a transistor that activates it Link to tutorial
* access to your router so you can forward port 8000

1. Open your door opener with a screwdriver and connect the relais output. Then you need a 5V Ground and 3.3V  I/O pin on your raspberry pi (we used pin 7 for the I/O).

2. Make the IP of your raspberry pi static 
3. Forward port 8000 to your raspberry 
4. Install software on your raspberry pi
Install git and node js on your raspberry pi.
Type: 

    sudo apt-get install git node npm
    git clone https://github.com/hackandtravel/opendoor.git
    cd opendoor

start the server with:

    node server/server.js


Now search for opendoor in the marketplace and download the app
Open it and enter yourip:8000 in the first field
in the second field enter the passphrase you just provided and add the door

Open your door

You are done

#### Details
The client was built with cordova (http://cordova.org), thus it can be built for many platforms, including iOS, Android and Web. It also uses backbone and handlebars. The client sends requests using express to the server which is written with node.js.

#### Simple File Server
Extre: 

    npm install -g gpio

The server is installed on the raspberry pi. It accepts valid requests and checks for the token in a file and if valid calls a method to open the door in a npm module called GPIO (this basically just sets one pin from 0 to 1).

#### Extended with MongoDB
this is a little bit more elaborate but can be greatly extended.
you need to have a server running somewhere with mongodb and node js installed
you also need an extra npm modules:

    npm install -g monk
    start the db and the server.js scritp with
    node server.js

furthermore you have to setup your raspberry pi to execute ssh commands and install gpio (apt-get install gpio)
