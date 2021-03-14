#include <gtest/gtest.h>
#include "mymath.hpp"

TEST(Demo, under_or_equal_0)
{
	ASSERT_EQ(mymath::fibonacci(-5), 0);
	ASSERT_EQ(mymath::fibonacci(0), 0);
}

TEST(Demo, equal_1)
{
	ASSERT_EQ(mymath::fibonacci(1), 1);
}

TEST(Demo, big)
{
	ASSERT_EQ(mymath::fibonacci(10), 55);
	ASSERT_EQ(mymath::fibonacci(19), 4181);
}