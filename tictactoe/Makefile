clean:
	rm server
	rm client

server.c: server.c
	gcc server.c -o server

client.c: client.c
	gcc client.c -o client -D_REENTRANT -lpthread
