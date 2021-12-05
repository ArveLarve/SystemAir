# System Air Ventilation

This setup uses a Raspberry Pi with a Modbus USB dongle.

You can run everything on the Raspberry Pi, but you can also just use the RPi be a Modbus TCP to Modbus RTU converter.

All that is needed is a clean Rasbian lite installation with `socat` installed (preferebly with ssh enabled).


## Install socat

```
sudo apt install socat
```

## Start socat forwarding on startup

Add the following command to the `/etc/rc.local` file:

```
socat TCP-LISTEN:1234,fork /dev/ttyUSB0,raw &
```
This will forward all TCP traffic on port 1234 to the ttyUSB0 serial device.
Modify this to the name of your serial device. These has a tendency to be different between vendors.