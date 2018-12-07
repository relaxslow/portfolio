# how to reference another svg
Make the second SVG just a <use> element that points to the first. You can scale the <use> using a transform. It will always reflect whatever you do to the first SVG automatically.

<svg width="100" height="100">
    <use transform="scale(0.1)" xlink:href="#SVG1"/>
</svg>

# how to deepcopy svg using javascript 

JSON.parse(JSON.stringify(obj))

# draw effect
vector-effect="non-scaling-stroke" lead wrong result when using getTotalLength();