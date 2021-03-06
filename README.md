# abletron

## Detailed description

#### Why
I have a bunch of tracks that I was working on in Ableton 11.1 that I needed to bring back to 11.0 because of some VST compatibility issues. I wrote this script to allow me to quickly change the XML of an `.als` file to reflect the desired version.

#### How
This script simply extracts the XML from a compressed `.als` file and replaces the <Ableton> tag with one specific to the version of your choosing. It then saves the result to a new file.

#### Disclaimers
This may not work... Ableton releases new features all the time and also alters the schema definitions of their project files. This script only updates the root `<Ableton>` XML node. Nodes may still exist in the XML file that are not compatible with the version you are targeting with this tool. In most of these cases, this will cause an error when loading the project.

## Requirements

This has only been tested on MacOS. To use this, make sure you have NPM and NodeJS installed. https://nodejs.org.

## Installation

```
$ npm install abletron -g
```

You will likely need to use the `sudo` command to install this globally. You can also call the script locally.

## Usage
This script will parse an Ableton file and change it's version delegation
Warning - This may not always work. Use at your own risk

Usage:
```
abletron [filename] [version]
```

Example:
```
abletron "Sick Tune-3.als" 11.0
```

Available Versions:

- 11.0
- 11.1
- 10.1
