#include "mymath.hpp"

int mymath::fibonacci(int n)
{
	int first = 0;
	int second = 1;

	if (n <= 0)
		return 0;
	if (n == 1)
		return 1;
	int tmp;
	while (n--) {
		tmp = first + second;
		first = second;
		second = tmp;
	}
	return first;
}