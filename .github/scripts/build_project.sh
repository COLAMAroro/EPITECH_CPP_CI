#!/usr/bin/bash

workdir=/github/workspace

[ -d $workdir ] || workdir=./

echo "Uninstalling Conan"
pip3 uninstall -y conan #We have to unfuck the default docker

echo "Installing Conan again"
pip3 install conan

echo "Removing gtest from Conan. Don't do this in real prod code"
rpm -e gtest gtest-devel --nodeps

echo "Refreshing the environment and adding a configuration"
eval "$(exec /usr/bin/env -i "${SHELL}" -l -c "export")" #Weird
conan profile update settings.compiler.libcxx=libstdc++11 default

cd $workdir && mkdir build && cd build
conan install .. --build=missing |& tee build_results.txt
conanreturnval=$?
[ $conanreturnval -eq 0 ] || exit $conanreturnval
cmake .. |& tee -a build_results.txt
cmakereturnval=${PIPESTATUS[0]}
[ $cmakereturnval -eq 0 ] || exit $cmakereturnval
make |& tee -a build_results.txt
makereturnval=${PIPESTATUS[0]}
[ $makereturnval -eq 0 ] || exit $makereturnval
ctest |& tee -a build_results.txt
ctestreturnval=${PIPESTATUS[0]}
[ $ctestreturnval -eq 0 ] || exit $ctestreturnval