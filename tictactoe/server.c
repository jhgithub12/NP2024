#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define BUF_SIZE 1024

void error_handling(char* message);

int main(int argc, char* argv[]) {
    int serv_sock, clnt_socks[2], str_len;
    char message[BUF_SIZE];
    struct sockaddr_in serv_adr, clnt_adr;
    socklen_t clnt_adr_sz;

    if (argc != 2) {
        printf("Usage: %s <PORT>\n", argv[0]);
        exit(1);
    }

    if ((serv_sock = socket(PF_INET, SOCK_STREAM, 0)) == -1) {
        error_handling("socket() error");
    }

    memset(&serv_adr, 0, sizeof(struct sockaddr_in));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_adr.sin_port = htons(atoi(argv[1]));

    if (bind(serv_sock, (struct sockaddr*)&serv_adr, sizeof(struct sockaddr_in)) == -1) {
        error_handling("bind() error");
    }
    else{
        printf("Bind Successful\n");
    }

    if (listen(serv_sock, 2) == -1) { // Change the backlog to 2 for accepting two clients
        error_handling("listen() error");
    }

    clnt_adr_sz = sizeof(struct sockaddr_in);

    // Accept two clients
    for (int i = 0; i < 2; i++) {
        clnt_socks[i] = accept(serv_sock, (struct sockaddr*)&clnt_adr, &clnt_adr_sz);
        if (clnt_socks[i] == -1) {
            error_handling("clnt_sock error");
        } else {
            printf("Connected client %d\n", i + 1);
        }
    }
    printf("Two Players have connected!\n");
    write(clnt_socks[0], "message\n", strlen("start\n"));
    while (1) {
        // Read message from client 1 and send it to client 2
        str_len = read(clnt_socks[0], message, BUF_SIZE);
        if (str_len <= 0) break;
        write(clnt_socks[1], message, str_len);

        // Read message from client 2 and send it to client 1
        str_len = read(clnt_socks[1], message, BUF_SIZE);
        if (str_len <= 0) break;
        write(clnt_socks[0], message, str_len);
    }

    // Close client sockets
    close(clnt_socks[0]);
    close(clnt_socks[1]);
    close(serv_sock);

    return 0;
}

void error_handling(char* message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
