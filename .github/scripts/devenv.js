// Stolen from https://github.com/ilammy/msvc-dev-cmd/blob/master/index.js
// I wanted to use it as a Github Action from the marketplace
// Sadly, due to Github Entreprise restrictions, I am unable to do so
// Instead I need to run it by hand in the actions
// I know, it sucks, but I have no other choices

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { exitCode } = require('process')
const process = require('process')

const PROGRAM_FILES_X86 = process.env['ProgramFiles(x86)']

const EDITIONS = ['Enterprise', 'Professional', 'Community']
const VERSIONS = ['2019', '2017']

const VSWHERE_PATH = `${PROGRAM_FILES_X86}\\Microsoft Visual Studio\\Installer`

const InterestingVariables = [
    'INCLUDE',
    'LIB',
    'LIBPATH',
    'VCINSTALLDIR',
    'Path',
    'Platform',
    'VisualStudioVersion',
    /^VCTools/,
    /^VSCMD_/,
    /^WindowsSDK/i,
]

function findWithVswhere(pattern) {
    try {
        let installationPath = child_process.execSync(`vswhere -products * -latest -prerelease -property installationPath`).toString().trim()
        return installationPath + '\\' + pattern
    } catch (e) {
        console.warn(`vswhere failed: ${e}`)
    }
    return null
}

function findVcvarsall() {
    // If vswhere is available, ask it about the location of the latest Visual Studio.
    let path = findWithVswhere('VC\\Auxiliary\\Build\\vcvarsall.bat')
    if (path && fs.existsSync(path)) {
        console.log(`Found with vswhere: ${path}`)
        return path
    }
    console.log("Not found with vswhere")

    // If that does not work, try the standard installation locations,
    // starting with the latest and moving to the oldest.
    for (const ver of VERSIONS) {
        for (const ed of EDITIONS) {
            path = `${PROGRAM_FILES_X86}\\Microsoft Visual Studio\\${ver}\\${ed}\\VC\\Auxiliary\\Build\\vcvarsall.bat`
            console.log(`Trying standard location: ${path}`)
            if (fs.existsSync(path)) {
                console.log(`Found standard location: ${path}`)
                return path
            }
        }
    }
    console.log("Not found in standard locations")

    // Special case for Visual Studio 2015 (and maybe earlier), try it out too.
    path = `${PROGRAM_FILES_X86}\\Microsoft Visual C++ Build Tools\\vcbuildtools.bat`
    if (fs.existsSync(path)) {
        console.log(`Found VS 2015: ${path}`)
        return path
    }
    console.log(`Not found in VS 2015 location: ${path}`)

    throw new Error('Microsoft Visual Studio not found')
}

function setenv(name, value) {
    child_process.execSync(`powershell.exe -File .github/scripts/add_env.ps1 "${name}" "${value}"`);
}

function main() {
    if (process.platform != 'win32') {
        console.log('This is not a Windows virtual environment, bye!')
        return
    }

    // Add standard location of "vswhere" to PATH, in case it's not there.
    process.env.PATH += path.delimiter + VSWHERE_PATH

    var args = ["x64"]

    const command = `"${findVcvarsall()}" ${args.join(' ')} && set`
    console.debug(`Running: ${command}`)
    const environment = child_process.execSync(command, {shell: "cmd"}).toString().split('\r\n')

    for (let string of environment) {
        const [name, value] = string.split('=')
        for (let pattern of InterestingVariables) {
            if (name.match(pattern)) {
                setenv(name, value)
                break
            }
        }
    }

    console.log(`Configured Developer Command Prompt`)
}

try {
    main()
}
catch (e) {
    console.error('Could not setup Developer Command Prompt: ' + e.message)
    process.exit(84)
}
