const columns = [{head: "Category"}, {head: "Ingredient"}];

const rows = [
    {category: "Continent"},
    {category: "Cuisine"},
    {category: "Protein"},
    {category: "Vegetable"},
    {category: "Herb/Spice"}
]

const table = d3.select('.ingrdedients')
    .append('table')

table.append('thead').append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .text(d => d.head)

table.append('tbody').selectAll('tr')
    .data(rows).enter()
    .append('tr')
    .text(d => d.category)
