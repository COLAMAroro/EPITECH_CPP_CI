
#CMake Boiler Plate
cmake_minimum_required (VERSION 3.10)
set (CMAKE_CXX_STANDARD 17)

project (demo CXX)

#Conan region
#Calling conan from the CMake, allows for a "click-to-run" experience on Visual Studio
if (WIN32)
	find_program(conan_path conan)
	execute_process(COMMAND ${conan_path} "install" "${PROJECT_SOURCE_DIR}" "-s" "build_type=Debug" WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR})
else()
	add_definitions("-fPIC")
endif()
include(${CMAKE_CURRENT_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()
Set(Boost_INSTALL_DIR ${CONAN_BOOST_ROOT})

#Extensions
find_package(Boost REQUIRED)

#Main project
include_directories(demo "include" ${CONAN_INCLUDE_DIRS_BOOST})
add_executable (demo "src/main.cpp" "src/mymath.cpp")
target_link_libraries(demo ${CONAN_LIBS})

file(MAKE_DIRECTORY "${DEMO_BUILD_DIR}")
set_target_properties(demo PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${DEMO_BUILD_DIR}")
set_target_properties(demo PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${DEMO_BUILD_DIR}")
set_target_properties(demo PROPERTIES RUNTIME_OUTPUT_DIRECTORY_DEBUG "${DEMO_BUILD_DIR}")
set_target_properties(demo PROPERTIES RUNTIME_OUTPUT_DIRECTORY_RELEASE p"${DEMO_BUILD_DIR}")


if (MSVC) #Because Windows require to install a .dll or having it near the executable for dynamic linking, we need to copy it*
    set_target_properties(demo PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "$(TargetDir)")
endif (MSVC)

enable_testing()

add_subdirectory(tests)