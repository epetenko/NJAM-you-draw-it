var pymChild = null;
var pymChild = new pym.Child();


var data = [
  // {"year": 2001,    "income": 31.4},
  // {"year": 2002,    "income": 32.6},
  // {"year": 2003,    "income": 34.5},
  // {"year": 2004,    "income": 35.5},
  // {"year": 2005,    "income": 76618},
  // {"year": 2006,    "income": 77025},
  // {"year": 2007,    "income": 78461},
  // {"year": 2008,    "income": 78992},
  // {"year": 2009,    "income": 76684},
  {"year": 2010,    "income": 73999},
  {"year": 2011,    "income": 72571},
  {"year": 2012,    "income": 72818},
  {"year": 2013,    "income": 72187},
  {"year": 2014,    "income": 72841},
  {"year": 2015,    "income": 73214},
  {"year": 2016,    "income": 76216}

]

var winwidth = parseInt(d3.select('#chart-body-2').style('width'))
var winheight = parseInt(d3.select('#chart-body-2').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-2').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height: 250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();


c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth-winwidth).attr('cy',c.height*.30).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth-winwidth+5).attr('y',c.height*.28).text('Start dragging here').attr('class','intro-text')


c.x.domain([2010, 2016])
c.y.domain([60000, 80000])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => '$'+ d )

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('income', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('income', c.y))

var clipRect = c.svg
  .append('clipPath#clip-2')
  .append('rect')
  .at({width: c.x(2010), height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip-2)')

correctSel.append('path.area.income-area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-2').attr('class', 'your-line income-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {year: d.year, income: d.income, defined: 0} })
  .filter(function(d){
    if (d.year == 2010) d.defined = true
    return d.year >= 2010
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('visibility', 'hidden')
    var pos = d3.mouse(this)
    var year = clamp(2011, 2016, c.x.invert(pos[0]))
    var income = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.income = income
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      console.log(yourData[6])
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2016))
      d3.select('#answer-2').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>$"+ d3.format(",.3r")(yourData[yourData.length-1].income) + "</p> for 2016.</div><div>The real value was <p class='your-pink'>$"+d3.format(",.3r")(data[6].income)+"</p>.</div>")
    d3.select('#explain-2').style('visibility', 'visible').style('opacity', 1)
    pymChild.sendHeight();

    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }