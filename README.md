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


#### Setup
##### Requirements

* You need a compatible intercom (one where you can push a button thus closing a circuit which opens the door)
* a Raspberry Pi (only raspbian tested)
* a Relais and a circuit with a transistor that activates it Link to tutorial
* access to your router so you can forward port 8000

1. Open your door opener with a screwdriver and connect the relais output. Then you need a 5V Ground and 3.3V  I/O pin on your raspberry pi (we used pin 7 for the I/O).

2. connect your raspberry pi to the internet
4. Install software on your raspberry pi

How exactly you can find in the raspberry folder


Now search for opendoor in the marketplace and download the app
TODO make create Device only form

Open your door


#### Client
The client was built with cordova (http://cordova.org), thus it can be built for many platforms, including iOS, Android and Web. It also uses backbone and handlebars. The client sends requests using express to the server which is written with node.js.

#### Server
You can install your own server, how is explained in detail in the server folder

or

you can simply use our server (contact us)

#### API Documentation
You may also build your own client

http://docs.opendoor.apiary.io/
