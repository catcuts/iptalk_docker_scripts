import socket
import struct

address = ('192.168.89.107', 3550)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(address)
send_data = struct.pack("4I", 0x6666AAAAL, 0x10000, 0, 0)
sock.sendto(send_data, ('239.239.239.1', 3550))
sock.close()

address = ('192.168.89.107', 3550)
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(address)
while True:
    data, addr = s.recvfrom(2048)
    if not data:
        print "client has exist"
    else:
        print data
    break
s.close()
