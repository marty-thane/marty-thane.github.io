/* Algoritmus pro vypocet faktorialu s vyuzitim rekurze implementovany v
 * golang. Program prijima libovolny pocet argumentu a dokaze rozpoznat, zda se
 * jedna o int, ci nikoliv.
 * Pouziti: `faktorial 0 1 6 -3 abc`
 */

package main

import (
	"fmt"
	"os"
	"strconv"
)

func factorial(n int) int {
	if n == 0 {
		return 1
	}
	return n * factorial(n-1)
}

func main() {
	for _, arg := range os.Args[1:] {

		num, err := strconv.Atoi(arg)
		if err != nil {
			fmt.Printf("%s neni integer\n", arg)
			continue
		}

		if num < 0 {
			fmt.Printf("%d! neni definovan\n", num)
			continue
		}

		fmt.Printf("%d! = %d\n", num, factorial(num))
	}
}
