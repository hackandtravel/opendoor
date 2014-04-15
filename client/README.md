# OpenDoor Client

The OpenDoor client is basically just a web app.
However, it is suited to be packaged via Cordova/PhoneGap.

## Development

Run `gulp development`.
This will watch for file changes of the `.less`, `.coffee` and `.jsx` files and compile them.
It will also start a static web server and serve the app at [http://localhost:8000](http://localhost:8000).
If you have syntax errors in one of your files eventually gulp will crash.
Just restart it with the above command.

## Build

To build the app run `gulp build`.
This will run the `r.js` optimizer and output minified files in the `www` directory.
This directory is suitable to be packaged with Cordova/PhoneGap.
