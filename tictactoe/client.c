#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>

#define BUF_SIZE 1024
#define true 1
#define false 0

int game_over = false;

static sem_t sem_one;
static sem_t sem_two;

void error_handling(char* message);

void assemble_board(char placements[][5], int clean_length);
void *make_move(void *arg);
void *take_move(void *arg);
int check_win();
void clean_screen(int line_count);
int filter_input(int row, int column);

//tic tac toe data
char placements[][5] = {
    {' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' '},
};
char mkey = 'X';
char nkey = 'O';

int sock, str_len;
char outbound_message[BUF_SIZE];
char inbound_message[BUF_SIZE];
struct sockaddr_in serv_adr;

int main(int argc, char* argv[]) {
    pthread_t id_t1, id_t2;
    sem_init(&sem_one, 0, 0);
    sem_init(&sem_two, 0, 1); 


    if (argc != 3) {
        printf("Usage: %s <IP> <PORT>\n", argv[0]);
        exit(1);
    }

    if ((sock = socket(PF_INET, SOCK_STREAM, 0)) == -1) {
        error_handling("socket() error");
    }

    memset(&serv_adr, 0, sizeof(struct sockaddr_in));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = inet_addr(argv[1]);
    serv_adr.sin_port = htons(atoi(argv[2]));

    if (connect(sock, (struct sockaddr*)&serv_adr, sizeof(struct sockaddr_in))
        == -1) {
        error_handling("connect() error");
    } else {
        puts("Connected......");
        for(int i = 0; i < 19; i++){  //make space for initial clean_screen()
            printf("\n");             //runs only ones in the whole process
        }
    }

    pthread_create(&id_t1, NULL, make_move, NULL); //read라는 함수를 넣고 파라미터는 없다
    pthread_create(&id_t2, NULL, take_move, NULL); //계산

    pthread_join(id_t1, NULL);
    pthread_join(id_t2, NULL);

    sem_destroy(&sem_one);
    sem_destroy(&sem_two);

    close(sock);

    return 0;
}

void error_handling(char* message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}

void assemble_board(char placements[][5], int clean_length){
    char complete_board[200] = "";
    char board_bar[] = "---+---+---+---+---\n"; //tic tac toe board bar
    for(int i = 0; i < 5; i++){ //rows
        char column[] = "   |   |   |   |   \n";
        column[1] = placements[i][0];
        column[5] = placements[i][1];
        column[9] = placements[i][2];
        column[13] = placements[i][3];
        column[17] = placements[i][4];
        strncat(complete_board, column, sizeof(column)-1); // Append the column to the complete board
        if (i != 4) {
            strncat(complete_board, board_bar, sizeof(board_bar)-1); // Append the board bar if not the last row
        }
    }
    clean_screen(clean_length);
    printf(" 11| 12| 13| 14| 15\n---+---+---+---+---\n 21| 22| 23| 24| 25\n---+---+---+---+---\n 31| 32| 33| 34| 35\n---+---+---+---+---\n 41| 42| 43| 44| 45\n---+---+---+---+---\n 51| 52| 53| 54| 55\n");
    printf("%s", complete_board);     
}


void *make_move(void *arg){
    while(1){
        sem_wait(&sem_one);
        //Check if game over
        if(game_over){ //prevents the game from progressing when game over
            break;
        }
        // Prompt for input only after receiving a message
        assemble_board(placements, 18); //Show the board for input
        printf("\n");
        int row, column;
        while(1){
            fputs("Input tile number: ", stdout);
            fgets(outbound_message, BUF_SIZE, stdin);
            row = outbound_message[0] - '0';
            column = outbound_message[1] - '0';
            if(!filter_input(row, column)){
                clean_screen(2);
                fputs("INVALID INPUT!\n", stdout);
            }
            else{
                clean_screen(1);
                break;
            }
        }
        

        placements[row - 1][column - 1] = mkey;
        assemble_board(placements, 19); //Refresh the board post-input

        //Check for win
        if(check_win() == 1){
            clean_screen(20);
            printf("You win!\n");
            // Send win message to the server
            write(sock, "gameover\n", strlen("gameover\n"));
            memset(outbound_message, '\0', sizeof(outbound_message));
            game_over = true;
            sem_post(&sem_two);
            break;
        }
        else if(check_win() == -1){
            clean_screen(20);
            printf("Draw!\n");
            // Send win message to the server
            write(sock, "draw\n", strlen("draw\n"));
            memset(outbound_message, '\0', sizeof(outbound_message));
            game_over = true;
            sem_post(&sem_two);
            break;
        }
        else{
            // Send the input message to the server
            write(sock, outbound_message, strlen(outbound_message));
            memset(outbound_message, '\0', sizeof(outbound_message));
            sem_post(&sem_two);
        }
    }

    return NULL;
}

void *take_move(void *arg){
    while(1){
        sem_wait(&sem_two);
        //Check if game over
        if(game_over){ //prevents the game from progressing when game over
            break;
        }
        // Wait to receive a message from the server
        str_len = read(sock, inbound_message, BUF_SIZE - 1);
        if(!strcmp(inbound_message, "message\n")){
            mkey = 'O';
            nkey = 'X'; 
        }
        else if(!strcmp(inbound_message, "gameover\n")){
            clean_screen(20);
            printf("You lose!\n");
            game_over = true;
            sem_post(&sem_one);
            break;
        }
        else if(!strcmp(inbound_message, "draw\n")){
            clean_screen(20);
            printf("Draw!\n");
            game_over = true;
            sem_post(&sem_one);
            break;
        }
        inbound_message[str_len] = 0;
        int row = inbound_message[0] - '0';
        int column = inbound_message[1] - '0';
        placements[row -1][column - 1] = nkey;
        sem_post(&sem_one);
    }

    return NULL;
}

int check_win() {
    // Check rows
    for (int i = 0; i < 5; i++) {
        if (placements[i][0] != ' ' && placements[i][0] == placements[i][1] && placements[i][1] == placements[i][2] &&
            placements[i][2] == placements[i][3] && placements[i][3] == placements[i][4]) {
            return 1; // Player wins
        }
    }

    // Check columns
    for (int i = 0; i < 5; i++) {
        if (placements[0][i] != ' ' && placements[0][i] == placements[1][i] && placements[1][i] == placements[2][i] &&
            placements[2][i] == placements[3][i] && placements[3][i] == placements[4][i]) {
            return 1; // Player wins
        }
    }

    // Check diagonals
    if (placements[0][0] != ' ' && placements[0][0] == placements[1][1] && placements[1][1] == placements[2][2] &&
        placements[2][2] == placements[3][3] && placements[3][3] == placements[4][4]) {
        return 1; // Player wins
    }
    if (placements[0][4] != ' ' && placements[0][4] == placements[1][3] && placements[1][3] == placements[2][2] &&
        placements[2][2] == placements[3][1] && placements[3][1] == placements[4][0]) {
        return 1; // Player wins
    }

    // Check if the board is full (no empty spaces left)
    int is_board_full = 1;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            if (placements[i][j] == ' ') {
                is_board_full = 0;
                break;
            }
        }
        if (!is_board_full) {
            break;
        }
    }
    if (is_board_full) {
        return -1; // Board full, no winner (draw)
    }

    return 0; // No win yet
}


void clean_screen(int line_count){
    for(int i = 0; i < line_count; i++){
        printf("\033[1A"); // Move cursor up one line
        printf("\033[K");  // Clear line
    }
}

int filter_input(int row, int column) {
    // Check if row and column are within bounds
    if (row < 1 || row > 5 || column < 1 || column > 5) {
        return 0; // Invalid input, out of bounds
    }

    // Check if the cell is already occupied
    if (placements[row - 1][column - 1] != ' ') {
        return 0; // Invalid input, cell already occupied
    }

    return 1; // Valid input
}

