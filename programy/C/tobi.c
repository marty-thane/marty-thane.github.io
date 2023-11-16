/* Program pro prevod cisel z decimalniho do binarniho zapisu a vice
 * versa. Cisla musi byt kladna a nesmi presahnout maximalni hodnotu
 * (255). Uzivatel program ovlada skrze argumenty prikazoveho radku.
 * Pouziti: `tobi -d 01101` `tobi -b 34`
 */

#include <stdio.h>
#include <stdlib.h>
#include<string.h>

int dec = 0;
char bin[9];

void error()
{
	printf("error: wrong usage\n");
	exit(0);
}

int to_decimal(char *binary)
{
	int l = strlen(binary) - 1;
	if (l > 7) {
		error();
	}
	for (int i = 0; i <= l; i++) {
		if (binary[l - i] == '1') {
			dec += 1 << i;
		} else if (binary[l - i] != '0') {
			error();
		}
	}
	return dec;
}

char *to_binary(int decimal)
{
	if (0 > decimal || decimal > 255) {
		error();
	}
	for (int i = 0; i < 8; i++) {
		if (decimal - (1 << (7 - i)) >= 0) {
			bin[i] = '1';
			decimal -= (1 << (7 - i));
		} else {
			bin[i] = '0';
		}
	}
	bin[8] = '\0';
	return bin;
}

int main(int argc, char *argv[])
{

	if (argc != 3) {
		error();
	}

	if (strcmp(argv[1], "-d") == 0) {
		printf("%d\n", to_decimal(argv[2]));
	} else if (strcmp(argv[1], "-b") == 0) {
		printf("%s\n", to_binary(atoi(argv[2])));
	} else {
		error();
	}

	return 0;
}
