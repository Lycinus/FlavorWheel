const width = 700;
const height = 700;
const radius = Math.min(width, height) / 2;
const color = d3.scaleOrdinal(d3.schemeCategory10);

const g = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

const partition = d3.partition()
    .size([2 * Math.PI, radius]);



d3.json("data.json", function(error, nodeData) {
    if (error) throw error

    const root = d3.hierarchy(nodeData)
        // .sum(function(d) { return d.size })
        .count()
        .sort(function(a, b) { return b.value - a.value })

    partition(root);
    const arc = d3.arc()
        .startAngle(function(d) { return d.x0 })
        .endAngle(function(d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    const slice = g.selectAll('g')
        .data(root.descendants())
        .enter().append('g').attr('class', 'node')
    
    slice.append('path')
        .attr('display', function(d) { return d.depth <= 2 ? null : 'none' })
        .attr('d', arc)
        .style('stroke', '#fff')
        .style('fill', function(d) { return color((d.children ? d : d.parent).data.name); } );

    g.selectAll('.node')
        .append('text')
        .attr('transform', function(d) {
            return `translate(${arc.centroid(d)})rotate(${computeTextRotation(d)})`
        })
        .attr('dx', '-15')
        .attr('dy', '.5em')
        .attr('display', function(d) { return d.depth <= 2 ? null : 'none' })
        .text(function(d) { return d.parent ? d.data.name : "" })
})

function computeTextRotation(d) {
    const angle = (d.x0 + d.x1) / Math.PI * 90;
    return (angle < 180) ? angle - 90 : angle + 90;
}