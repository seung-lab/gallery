from construct import *
import requests
from numpy import array, random, linspace, pi, ravel, cos, sin, empty
import numpy
from tvtk.api import tvtk
from mayavi.sources.vtk_data_source import VTKDataSource
from mayavi import mlab


def drawBox(min_x = 0.0, max_x=1.0, min_y=0.0, max_y=1.0, min_z=0.0, max_z=1.0):
	#Draw box
	print "drawing box"
	points = numpy.array([[min_x, min_y, min_z ], [max_x , min_y , min_z],[min_x, max_y , min_z],
												[max_x, max_y, min_z ],[max_x, max_y , max_z],[max_x,min_y, min_z],
												[max_x,min_y, max_z],	[min_x,min_y, min_z],[min_x,min_y, max_z],
												[min_x,max_y, min_z ],[min_x,max_y, max_z],[max_x,max_y, max_z],
												[min_x,min_y, max_z],[max_x,min_y, max_z]])


	view(points, opacity = 0.2)


def getCellPoints(cellID, mip ,x ,y ,z):


	path = "http://testdata.eyewire.org/cell/{0}/chunk/{1}/{2}/{3}/{4}/mesh".format(cellID * 10 + 1, mip ,x,y,z)
	r = requests.get(path)
	edge_length = 128 * (2 ** mip)

	vertex = Struct("vertex",
	     LFloat32("vx"),
	     LFloat32("vy"),
	     LFloat32("vz"),
	     LFloat32("nx"),
	     LFloat32("ny"),
	     LFloat32("nz")
	)

	meshParser = Array(len(r.content)/ 24 ,vertex)

	points = list()
	max_x = 0
	max_y = 0
	max_z = 0
	min_x = 1e10
	min_y = 1e10
	min_z = 1e10

	for vertex in meshParser.parse(r.content):

		output_x = edge_length * x + 0.5 * vertex.vx
		output_y = edge_length * y + 0.5 * vertex.vy
		output_z = 1.4 * edge_length * z + 1.4 * 0.5 * vertex.vz

		points.append(numpy.array([output_x ,output_y,output_z]))

		print numpy.array([output_x ,output_y,output_z])

		if output_x > max_x:
			max_x = output_x

		if output_y > max_y:
			max_y = output_y

		if output_z > max_z:
			max_z = output_z	

		if output_x < min_x:
			min_x = output_x

		if output_y < min_y:
			min_y = output_y

		if output_z < min_z:
			min_z = output_z	
		
	points = numpy.array(points)

	if len(points) == 0:
		return

	print "getting chunk {0}-{1}-{2} is not empty".format(x,y,z)
	print "bounding box is x[{0}-{1}] y[{2}-{3}] z[{4}-{5}]".format(int(min_x), int(max_x), int(min_y), int(max_y), int(min_z), int(max_z))
	drawBox(min_x, max_x, min_y, max_y, min_z, max_z)

	view(points)


def getVolumePoints(volume,x,y,z,segmentID):

	""" 
	$volumeID: integer, unique identifier for volume.
	$mip: integer, MIP-level - must be 0.
	$x, $y, $z: integer, the requested chunks position in the volume. For regular EyeWire volumes (256^3) it has to be either 0 or 1; or even higher for [Omni cubes][omni].
	$segmentID: integer, the segment to loa
"""
	path = "http://testdata.eyewire.org/volume/{0}/chunk/0/{1}/{2}/{3}/mesh/{4}".format(volume,x,y,z,segmentID)
	r = requests.get(path)

	vertex = Struct("vertex",
     LFloat32("vx"),
     LFloat32("vy"),
     LFloat32("vz"),
     LFloat32("nx"),
     LFloat32("ny"),
     LFloat32("nz")
	)

	meshParser = Array(len(r.content)/ 24 ,vertex)

	points = list()
	for vertex in meshParser.parse(r.content):
		points.append(numpy.array([vertex.vx,vertex.vy,vertex.vz]))

	points = numpy.array(points)

	if len(points) == 0:
		return

	view(points)


def view(points , opacity = 1.0):
	""" Open up a mayavi scene and display the dataset in it.
	"""

	triangles = list()
	for n in range(len(points) - 2  ):
		triangles.append(numpy.array([n, n+1 , n+2]))

	triangles = numpy.array(triangles)
	scalars = random.random(points.shape)

	# The TVTK dataset.
	mesh = tvtk.PolyData(points=points, polys=triangles)
	mesh.point_data.scalars = scalars
	mesh.point_data.scalars.name = 'scalars'

	surf = mlab.pipeline.surface(mesh, opacity=opacity)
	#mlab.pipeline.surface(mlab.pipeline.extract_edges(surf), color=(0, 0, 0), )

fig = mlab.figure(bgcolor=(1, 1, 1), fgcolor=(0, 0, 0))


for x in range(1):
	for y in range(1):
		for z in range(1):
			getCellPoints(11,6,x,y,z)

print "done"
mlab.show()

