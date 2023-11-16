/* Program pocita kvadrantickou rovnici v R s koeficienty odpovidajici
 * argumentum poskytnutym na prikazove radce.
 * Pouziti: `kvadr 1 2 1`
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int a, b, c, D;
float x1, x2;

int main(int argc, char *argv[])
{
	if (argc != 4) {
		printf("not enough arguments\n");
		exit(1);
	}

	a = atoi(argv[1]);
	b = atoi(argv[2]);
	c = atoi(argv[3]);
	printf("%dx^2 + %dx + %d = 0\n", a, b, c);

	D = (b * b) - (4 * a * c);
	printf("D = %d\n", D);

	if (D > 0) {
		x1 = (-b + sqrt(D)) / (2 * a);
		x2 = (-b - sqrt(D)) / (2 * a);
		printf("x1 = %.3f\n", x1);
		printf("x2 = %.3f\n", x2);
	} else if (D == 0) {
		x1 = -b / (2 * a);
		printf("x = %.3f\n", x1);
	} else {
		printf("no solution in R\n");
	}
	return 0;
}
