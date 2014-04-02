### Installing OS on raspberry pi
    
    install NOOBS from https://github.com/raspberrypi/noobs
    
    
### Installing 'node' and 'npm'

Run the script in home directory.

    #!/bin/bash
     
    #Make a new dir where you'll put the binary
    sudo mkdir /opt/node
     
    #Get it
    wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-arm-pi.tar.gz      
     
    #unpack
    tar xvzf node-v0.10.24-linux-arm-pi.tar.gz
     
    #Copy to the dir you made as the first step
    sudo cp -r node-v0.10.24-linux-arm-pi/* /opt/node
     
    #Add node to your path so you can call it with just "node"
    cd ~
     
    echo "PATH=\$PATH:/opt/node/bin" >> .bash_profile
    echo "export PATH" >> .bash_profile
    
    #cleanup
    rm -r node-v0.10.24-linux-arm-pi*
     
    #Test
    node -v
    npm -v
    
### Path 

Adding `node` and `npm` to the path can be tricky. Use this if need be:

    export PATH=$PATH:/opt/node/bin
   
### App placement
    
The app is placed in `/home/pi/raspberry`. This means the user is called `pi`.

### Get dependencies

    cd /home/pi/raspberry
    npm install
    
### Starting the app via 'nodemon'

    cd /home/pi/raspberry
    node_modules/.bin/nodemon raspberry.js

### Installing 'forever'

    sudo /opt/node/bin/npm install -g forever

### Startup script

Put the before `exit 0` in `/etc/rc.local`:

    export PATH=$PATH:/opt/node/bin
    forever start /home/pi/raspberry/raspberry.js
 
This will start the server using `forever` on startup.


