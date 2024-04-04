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

static sem_t sem_one;
static sem_t sem_two;

//tic tac toe data
char placements[5][5] = {
	{' ', ' ', ' ', ' ', ' '},
	{' ', ' ', ' ', ' ', ' '},
	{' ', ' ', ' ', ' ', ' '},
	{' ', ' ', ' ', ' ', ' '},
	{' ', ' ', ' ', ' ', ' '},
};

// tic tac toe meta data
int row_count[5] = {0, 0, 0, 0, 0};
int column_count[5] = {0, 0, 0, 0, 0};
int diagonal_count[2] = {0, 0};
int total_count = 0;

char mkey = 'X';
char nkey = 'O';

int game_over = false;

void *make_move(void *arg);
void *take_move(void *arg);
int check_win(int row, int column);
void set_game_over(char *msg);
void assemble_board(int clean_length);
void clean_screen(int line_count);
int filter_input(int row, int column);
void error_handling(char* message);

int main(int argc, char* argv[]) {
	int sock;
	char init_msg[BUF_SIZE];
	struct sockaddr_in serv_adr;
    
	pthread_t id_t1, id_t2;
	int sem_one_init_val = 1, sem_two_init_val = 0;    

	if (argc != 3) {
		printf("Usage: %s <IP> <PORT>\n", argv[0]);
		exit(1);
  }

  if ((sock = socket(PF_INET, SOCK_STREAM, 0)) == -1)
  	error_handling("socket() error");
    
  memset(&serv_adr, 0, sizeof(struct sockaddr_in));
  serv_adr.sin_family = AF_INET;
  serv_adr.sin_addr.s_addr = inet_addr(argv[1]);
  serv_adr.sin_port = htons(atoi(argv[2]));

  if (connect(sock, (struct sockaddr*) &serv_adr, sizeof(struct sockaddr_in)) == -1) 
  	error_handling("connect() error");
  else 
    puts("Connected......");

  read(sock, init_msg, BUF_SIZE - 1);
	assemble_board(1);

  if (!strcmp(init_msg, "second")) {
  	mkey = 'O';
    nkey = 'X';
		sem_one_init_val = 0;
		sem_two_init_val = 1;	
	}

	sem_init(&sem_one, 0, sem_one_init_val);
	sem_init(&sem_two, 0, sem_two_init_val);
	
  pthread_create(&id_t1, NULL, make_move, (void*) &sock); 
  pthread_create(&id_t2, NULL, take_move, (void*) &sock); 

  pthread_join(id_t1, NULL);
  pthread_join(id_t2, NULL);

  sem_destroy(&sem_one);
  sem_destroy(&sem_two);

  close(sock);

  return 0;
}

void *make_move(void *arg){
  int sock = *((int*) arg);
	int row, column, did_win;
	char msg[BUF_SIZE];

  while(1){
  	sem_wait(&sem_one);
        
    if (game_over)
    	break;

		// input validation
		while(1) {
			fputs("\nInput tile number: ", stdout);
			fgets(msg, BUF_SIZE, stdin);

			if (strlen(msg) == 3) {
				row = msg[0] - '1';
				column = msg[1] - '1';

				if (filter_input(row, column))
					break;
			}
			
			clean_screen(2);
			fputs("INVALID INPUT!", stdout);
			memset(msg, '\0', sizeof(msg));
		}
        
    placements[row][column] = mkey;
    assemble_board(20); //Refresh the board post-input

		// update meta info
		total_count++;
		row_count[row]++;
		column_count[column]++;

		if (row == column)
			diagonal_count[0]++;

		if (row + column == 4)
			diagonal_count[1]++;

		did_win = check_win(row, column);
		if (did_win == 0) {
			// Send the input message to the server
      write(sock, msg, strlen(msg));
      memset(msg, '\0', sizeof(msg));
      sem_post(&sem_two);
		}
		else {
			if (did_win == 1) {
				set_game_over("You win!\n");
				write(sock, "gameover", strlen("gameover"));
			}
			else {
				set_game_over("Draw!\n");
				write(sock, "draw", strlen("draw"));
			}
      sem_post(&sem_two);
      break;
		} 
	}
  return NULL;
}

void *take_move(void *arg) {
	int sock = *((int*) arg);
	int row, column, str_len;
	char msg[BUF_SIZE];

  while(1){
  	sem_wait(&sem_two);
        
		if (game_over)
    	break;

    // Wait to receive a message from the server
		memset(msg, '\0', sizeof(msg));
    str_len = read(sock, msg, BUF_SIZE - 1);
        
		if(!strcmp(msg, "gameover")){
			set_game_over("You lose!\n");            
      sem_post(&sem_one);
      break;
    }
    else if(!strcmp(msg, "draw")){
			set_game_over("Draw!\n"); 
      sem_post(&sem_one);
      break;
    }

    row = msg[0] - '1';
    column = msg[1] - '1';

    placements[row][column] = nkey;
		assemble_board(18);

		total_count++;

    sem_post(&sem_one);
	}
  return NULL;
}

int check_win(int row, int column) {
	// win
	if (row_count[row] == 5 || column_count[column] == 5
		|| diagonal_count[0] == 5 || diagonal_count[1] == 5)	
		return 1;

	// draw
	if (total_count == 25)
		return -1;

	// no win yet
	return 0;
}

void set_game_over(char *msg) {
	clean_screen(18);
	printf("%s", msg);
	game_over = true;
}

void assemble_board(int clean_length){
	char number_board[] = 
		" 11| 12| 13| 14| 15\n"
		"---+---+---+---+---\n"
		" 21| 22| 23| 24| 25\n"
		"---+---+---+---+---\n"
		" 31| 32| 33| 34| 35\n"
		"---+---+---+---+---\n"
		" 41| 42| 43| 44| 45\n"
		"---+---+---+---+---\n"
		" 51| 52| 53| 54| 55\n";    
  char complete_board[200] = "";
  char board_bar[] = "---+---+---+---+---\n";

	for (int i = 0; i < 5; i++) {
    char row[] = "   |   |   |   |   \n";
		for(int j = 0; j < 5; j++){
			row[4*j + 1] = placements[i][j];
		}

		// Append the row to the complete board
    strncat(complete_board, row, sizeof(row) - 1);
		// Append the board bar if not the last row
    if (i != 4)
      strncat(complete_board, board_bar, sizeof(board_bar) - 1);
  }

  clean_screen(clean_length);
  printf("%s", number_board);
  printf("%s", complete_board);     
}

void clean_screen(int line_count){
  for(int i = 0; i < line_count; i++){
    printf("\033[1A"); // Move cursor up one line
    printf("\033[K");  // Clear line
  }
}

int filter_input(int row, int column) {
  // Check if row and column are within bounds
  if (row < 0 || row > 4 || column < 0 || column > 4) {
  	return 0; // Invalid input, out of bounds
  }

  // Check if the cell is already occupied
  if (placements[row][column] != ' ') {
  	return 0; // Invalid input, cell already occupied
  }

  return 1; // Valid input
}

void error_handling(char* message) {
  fputs(message, stderr);
  fputc('\n', stderr);
  exit(1);
}
