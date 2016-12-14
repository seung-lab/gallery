![Build Status](https://magnum.travis-ci.com/seung-lab/gallery.svg?token=XgJykxTsTUBYXsq64oSK&branch=master "travis")

# gallery
Repository for connectomic reconstructions of neruons from Seung Lab.

## Getting Started

You'll need nodejs, npm, and mongodb to bootstrap.  

1. Get `gulp`: `npm install -g gulp`  
2. Run `npm install` (may need to be run as `sudo npm install --unsafe-perms`)
3. Get bower: `npm install -g bower` 
4. Run `bower install`  
5. Get mongodb up and running:
	* [Download mongodb](http://www.mongodb.org/downloads)
	* Unzip into a location of choice. (Note: This is where you will run the daemon)
	* Open terminal and use the following command to make the directory where mongo will store data: `$ mkdir -p /data/db`
	* Start the mongodb server in a separate terminal window (if you get an error, you may need to ‘sudo’ this command): `$ ./mongodb-xxxxxxx/bin/mongod`
6. git submodule update --init
7. cd import
8. mkdir data
9. sudo apt-get install liboctave-dev
10. python main.py (or main_py3.py for Py3)
11. Acquire meshes from someone who has them (~850MB)
12. Run `gulp`
13. Run `npm start`

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


<!-- Alex Branch -->


