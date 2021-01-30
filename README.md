![Build Status](https://magnum.travis-ci.com/seung-lab/gallery.svg?token=XgJykxTsTUBYXsq64oSK&branch=master "travis")

# gallery
Repository for connectomic reconstructions of neruons from Seung Lab.

## Getting Started

You'll need nodejs, npm, and mongodb to bootstrap.

1. Run `npm install`
2. Run `npx bower install`
3a. Get mongodb up and running on Ubuntu:
	* sudo apt install mongodb
	* sudo mkdir -p /data/db
	* sudo chown -R mongodb:mongodb /data
	* sudo service mongodb restart
3b. Get mongodb up and running on MacOS: 
    * brew tap mongodb/brew
    * brew install mongodb-community@4.2
    * brew services start mongodb-community@4.2
    * cd gallery
    * mongod --dbpath .
4. git submodule update --init
5. cd import
6. mkdir data
7. sudo apt install liboctave-dev
8. pip install -r requirements.txt
9. python main.py
10. [Download meshes](https://drive.google.com/file/d/1-qmE1sEL3AIGpNfi0w50MEOgm2WIF4_1/view?usp=sharing) (~1.1GB)
11. Extract meshes to $GALLERY/data/meshes/
12. Run `npx gulp`
13. Run `npm start`

When configuring the server to use `museum.service` a systemd startup script, make sure to set up nginx so you don't have to run the service as root or with sudo.

# Code coverage

run 'npm test'
open ./coverage/ 'browser' / index.html

#database backup
grunt mongobackup:dump
grunt mongobackup:restore

#How to update the classification 
* Jinseop will provide a matlab file  usually called gc_types_load_cells.m,
replace the it with the one in /import/gc_types_load_cells.m

* He will also provide a file with the stratification profiles. 

* The goal is to create two files , server/config/sets.json and server/config/cells.json. 
This files will be used to populate the database when the server is run.

* To create these files, just run /import/import.py

* If the format of the matlab script changed, modify matlab_script.py

# Contributors
The cell museum is being developed by Seung Lab.

- Mio Akasako and Alex Norton designed the splash figure which explains the classification, they also provided blueprints, and design suggestions.
- Nico Kemnitz suggested using OpenCTM as a mesh encoding, which greatly improved mesh loading.
- Jinseop Kim provided classification, stratification profiles and meshes for the neurons being displayed.
- Alex Bae provided calcium temporal response curves.
- Shang Mu provided calcium directional response curves.
- Sebastian Seung provided code for creating sets of highly differentiable colors, and usability feedback.
- Jack Hudson was the driving force of the second version and implemented prototypes of the homepage and the selector page. 
- Alex Norton coded the current d3 chart interactions and contributed the new design.
- Ignacio Tartavull and later William Silversmith provided general maintenance. 



