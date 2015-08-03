import re

def rgb_to_hex(rgb):

	return '#%02x%02x%02x' % tuple(float_colors)

matlab = """0    1.0000         0
         0         0    1.0000
    1.0000         0         0
    1.0000    0.1034    0.7241
         0    1.0000    0.9655
    1.0000    0.8621    0.4483
         0    0.5517    1.0000
         0    0.4483         0
    1.0000    0.7931    0.9310
    0.2414         0    0.4138
    0.6552    0.1724    0.2414
    0.5862    1.0000    0.5862
    0.7241    0.3448    1.0000
    0.4483    0.3448    0.0345
    0.2069    0.5517    0.6552
    0.8621    1.0000         0
    1.0000    0.5517         0
    0.6897    0.7586    0.6207
    0.5517    0.3448    0.5172
    0.9655    0.6207    0.5172 """


for line in matlab.split('\n'):

	rgb = re.match(r"\s*(\d+.?\d*)\s+(\d+.?\d*)\s+(\d+.?\d*)",  line)
	if rgb != None:

		float_colors = []
		for color in rgb.groups():
			float_colors.append( float(color) * 255 )
		float_colors = tuple(float_colors)

		print rgb_to_hex( float_colors ) 


