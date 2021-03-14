
#CMake Boiler Plate
cmake_minimum_required (VERSION 3.10)
set (CMAKE_CXX_STANDARD 17)

project(demo_test CXX)

include(CTest)
enable_testing()

find_package(GTest)

add_executable (demo_test "test_main.cpp" "../src/mymath.cpp")


target_link_libraries(demo_test ${CONAN_LIBS_GTEST})

gtest_discover_tests(demo_test)

option(COVERAGE "Generate coverage data" ON)
if (COVERAGE)
    if(CMAKE_COMPILER_IS_GNUCXX)
        message("I will generate coverage")
        set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fprofile-arcs -ftest-coverage")
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fprofile-arcs -ftest-coverage")
    endif()
endif()

#TESTS







