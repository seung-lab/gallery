![Build Status](https://magnum.travis-ci.com/seung-lab/gallery.svg?token=XgJykxTsTUBYXsq64oSK&branch=master "travis")

# gallery
Repository for the museum.

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
grunt:mongobackup:dump
grunt:mongobackup:restore