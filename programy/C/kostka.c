/* Program se uzivatele zepta, kolikrat ma hodit kostkou. Nasledne vypise padle
 * hodnoty (jednicka padla jednou, dvojka trikrat apod.), jejich soucet a
 * aritmeticky prumer.
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int pocet;
int vysledky[6];
int suma;
float prumer;

int main()
{
	srand(time(0));

	printf("pocet hodu:");
	scanf("%d", &pocet);

	for (int i = 0; i < pocet; i++) {
		int hod = rand() % 6;
		vysledky[hod]++;
		suma += hod + 1;
	}

	for (int i = 0; i < 6; i++) {
		printf("%d:%d\n", i + 1, vysledky[i]);
	}

	printf("suma:%d\n", suma);

	prumer = (float)suma / pocet;
	printf("prumer:%.1f\n", prumer);

	return 0;
}
