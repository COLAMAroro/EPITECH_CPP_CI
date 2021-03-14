#include "mymath.hpp"
#include <boost/filesystem.hpp>
#include <iostream>

int main()
{
	std::cout << "Current path is " << boost::filesystem::current_path() << std::endl;
	std::cout << "Fibonnaci(19) = " << mymath::fibonacci(19) << std::endl;
	return 0;
}