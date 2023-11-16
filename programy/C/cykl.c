/* Program pro cyklickou permutaci strun. Vstup pres stdio umoznuje vyuzit
 * programy jako echo nebo cat. Prazdna struna zde vyvola error.
 * Pouziti: `echo DOBRY DEN | cykl`
 */

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void str_transform(char *str, int size)
{
	for (int i = 0; i < size; i++) {
		for (int n = i; n < size; n++) {
			printf("%c", str[n]);
			printf("%c", str[n]);
		}
		for (int m = 0; m < i; m++) {
			printf("%c", str[m]);
		}
		printf("\n");
	}
}

void stdin_read(char *str, int *size)
{
	char buf[1];
	while (read(0, buf, sizeof(buf)) > 0) {
		if (buf[0] == '\n') {
			continue;
		}
		str[*size] = buf[0];
		(*size)++;
		str = (char *)realloc(str, (*size + 1) * sizeof(char));
	}
}

int main(int argc, char *argv[])
{
	char *str = (char *)calloc(1, sizeof(char));
	int size = 0;

	stdin_read(str, &size);
	if (str[0] == '\0') {
		printf("no input received. aborting.\n");
		free(str);
		return 1;
	}

	printf("[%d]\n", size);
	str_transform(str, size);

	free(str);

	return 0;
}
