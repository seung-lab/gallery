![Build Status](https://magnum.travis-ci.com/seung-lab/gallery.svg?token=XgJykxTsTUBYXsq64oSK&branch=master "travis")

# gallery
Repository for the museum.

## Getting Started

* run `npm install` (may need to be run with `sudo`)
* run `bower install`
* run `grunt --force`
* Get mongodb up and running:
	* [Download mongodb](http://www.mongodb.org/downloads)
	* Unzip into a location of choice. (Note: This is where you will run the daemon)
	* Open terminal and use the following command to make the directory where mongo will store data: `$ mkdir -p /data/db`
	* Start the mongodb server in a separate terminal window (if you get an error, you may need to ‘sudo’ this command): `$ ./mongodb-xxxxxxx/bin/mongod`
* run `grunt serve`

Start server with:
* First, in another terminal run `mongod` (if you have trouble with this step, see above)
* Then, run `grunt serve`

## Dependencies
run ./install.sh

## TODO list:

* improve orbit controller
* simplify mesh when far (removing noise effect)
* make colors more distinguishable for a given set.

# Code coverage

run 'npm test'
open ./coverage/ 'browser' / index.html


# To run forever
grunt serve:dist

#to stop it:
grunt forever:server:stop

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
