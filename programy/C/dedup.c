/* Program pro deduplikaci vstupu s casovou narocnosti O(n^2). Vstupem jsou
 * argumenty prikazového radku. Pri nalezeni duplikatu je vypsan pouze jeho
 * prvni vyskyt. Skrze `cat` lze do programu nacist i soubor.
 * Pouziti: `dedup 1 2 3 3 4` `dedup $(cat ahoj.txt)`
 */

#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
	for (int m = 1; m < argc; m++) {
		int dup = 0;
		for (int n = 1; n < m; n++) {
			if (strcmp(argv[m], argv[n]) == 0) {
				dup = 1;
				break;
			}
		}
		if (dup == 0) {
			printf("%s\n", argv[m]);
		}
	}
	return 0;
}
