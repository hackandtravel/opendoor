### Login

Login to the raspberry via `ssh pi@YOUR_IP`. The default username is `pi` with password is `raspberry`.

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

    export PATH=$PATH:/opt/node/bin
   
### App placement
    
The app should be placed in `/home/pi/raspberry`. The default user is called `pi`.
Create the `raspberry` folder in the home directory via `mkdir /home/pi/raspberry`.
Copy the files from your computer to the pi via `scp *.js* pi@YOUR_IP:raspberry`.

### Get dependencies

    cd /home/pi/raspberry
    npm install --release
    
### Optional: Starting the app via 'nodemon'

    cd /home/pi/raspberry
    node_modules/.bin/nodemon raspberry.js

### Installing 'forever'

    sudo /opt/node/bin/npm install -g forever

### Startup script

Put the text below before `exit 0` in `/etc/rc.local`:

    export PATH=$PATH:/opt/node/bin:/usr/local/bin/
    forever start -a -l /home/pi/forever.log /home/pi/raspberry/raspberry.js
 
This will start the server using `forever` on startup.

## Wifi

Plugin EDIMAX EW-7811Un.
More info: http://www.datenreise.de/raspberry-pi-wlan-einrichten-edimax/

### Deaktivate power save

    sudo vi /etc/modprobe.d/8192cu.conf

The content should be:

    options 8192cu rtw_power_mgnt=0 rtw_enusbss=0
    
    
### Set SSID and password

    sudo vi /etc/network/interfaces
    
File should look like this, insert between "s

    auto lo
    iface lo inet loopback
    iface eth0 inet dhcp
    
    auto wlan0
    allow-hotplug wlan0
    iface wlan0 inet dhcp
    wpa-ap-scan 1
    wpa-scan-ssid 1
    wpa-ssid "YOUR WIFI SSID"
    wpa-psk "YOUR WIFI PASSWORD"
    
### Restart network

    sudo service networking restart
    


