from conans import ConanFile, CMake

class Demo(ConanFile):
	build_requires = "boost/1.71.0", "gtest/1.10.0"
	generators = "cmake"
	build_policy = "missing"

	def build(self):
		cmake = CMake(self)
		# Coverage.
		if self.options.coverage:
			cmake.definitions["COVERAGE"] = "ON"
		cmake.configure()
		cmake.install()
		cmake.test()

	def package(self):
		self.copy("*.h")
		self.copy("*.lib", dst="lib", src="lib", keep_path=False)
		self.copy("*.dll", dst="bin", src="bin", keep_path=False)
		self.copy("*.dylib", dst="bin", src="lib", keep_path=False)
		self.copy("*.so", dst="lib", keep_path=False)
		self.copy("*.a", dst="lib", keep_path=False)