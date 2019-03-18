const width = 700;
const height = 750;
const radius = width / 6;

const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => 1.2 * Math.max(d.y0 * radius, d.y1 * radius - 1));

const partition = data => {
    const root = d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value);
    return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
}

const recipe = {}

d3.json('data.json').then(data => {
    const root = partition(data);
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    root.each(d => d.current = d);

    const svg = d3.select('svg')
        .style('width', width)
        .style('height', height)
        .style('font-family', 'Helvetica')
        .style('font-size', '15px')

    const g = svg.append('g')
        .attr('transform', `translate(350, 300)`);

    const path = g.append('g')
        .selectAll('path')
        .data(root.descendants().slice(1))
        .join('path')
            .attr('fill', d => color((d.children ? d : d.parent).data.name))
            .attr('fill-opacity', d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr('d', d => arc(d.current));

    path.filter(d => d.children)
        .style('cursor', 'pointer')
        .on('click', handleClick)
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    const label = g.append('g')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none')
        .selectAll('text')
        .data(root.descendants().slice(1))
        .join('text')
            .attr('dy', '0.35em')
            .attr('fill-opacity', d => +labelVisible(d.current))
            .attr('transform', d => labelTransform(d.current))
            .text(d => d.data.name);

    const parent = g.append('circle')
        .datum(root)
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('click', handleClick);

    function handleClick(p) {
        
        // Update recipe with new item or remove last item
        if (recipe[p.depth + 1]) {
            delete recipe[p.depth + 1]
            console.log(recipe)
            d3.select('.ingredients')
              .selectAll('p')
              .data(Object.values(recipe))
              .exit()
              .remove()
        } else if (p.depth !== 0) {
            recipe[p.depth] = {[p.depth]: p.data.name}
            console.log(recipe)
            d3.select('.ingredients')
              .selectAll('p')
              .data(Object.values(recipe))
              .enter()
              .append('p')
              .text(d => handleRecipeCreate(d))
        }

        // Set root data for the middle circle
        parent.datum(p.parent || root);


        // Sets the end position for the transition
        root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

        
        // Sets the length of the transition
        const t = g.transition().duration(500);

        // Executes the transition, interpolating between the closest hidden ring 
        // and changing the fill-opacity of that ring (to make it visible) and the 
        // current ring (to make it invisible)
        path.transition(t)
                .tween('data', d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute('fill-opacity') || arcVisible(d.target);
                })
                .attr('fill-opacity', d => arcVisible(d.target) ? 0.6 : 0)
                .attr('stroke', this.getAttribute('stroke') ? 'none' : null)
                .attrTween('d', d => () => arc(d.current))


        // Excecutes the same transition for the labels
        label.filter(function (d) {
            return +this.getAttribute('fill-opacity') || labelVisible(d.target);
        }).transition(t)
                .attr('fill-opacity', d => +labelVisible(d.target))
                .attrTween('transform', d => () => labelTransform(d.current));
    }

    // Adds a border to the arcs on mouseover
    function mouseOver(d, i, n) {
        if (this.getAttribute('fill-opacity') > 0) {
            d3.select(n[i])
                .transition()
                .attr('stroke', this.getAttribute('fill'))
                .attr('stroke-opacity', .8)
        }
    }

    // Removes border from the arcs on mouseout (currently buggy)
    function mouseOut(d, i, n) {
        if (this.getAttribute('fill-opacity') > 0) {
            d3.select(n[i])
              .transition()
              .attr('stroke', 'white')
        }
    }

    function arcVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    function handleRecipeCreate(d) {
        const depth = Math.max(Object.keys(d));
        const element = d[depth]
        switch (Math.max(Object.keys(d))) {
            case 1:
                if (element === 'Americas') {
                    return "Let's cook some food using items from the Americas."
                } else {
                    return `Let's cook some food using items from ${element}.`;
                };
            case 2:
                return `Awesome, let's focus on the flavors of ${element}.`;
            case 3:
                if (element === 'none') {
                    return 'Who needs meat anyway? Pick a vegetable to be the star of this dish.'
                } else {
                    return `Pick a vegetable to go with that ${element}.`
                };
            case 4:
                return `${element[0].toUpperCase() + element.slice(1)} - good choice. Here are some herbs and spices that will go well with your items.`;
        }
    }
});


