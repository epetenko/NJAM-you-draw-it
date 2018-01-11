var pymChild = null;
var pymChild = new pym.Child();

var data = [
// {'year': 1998, 'house': 205947.86},
// {'year': 1999, 'house': 207511.73},
// {'year': 2000, 'house': 205545.89},
// {'year': 2001, 'house': 208966.2},
// {'year': 2002, 'house': 217889.51},
{'year': 2003, 'house': 225802.09},
{'year': 2004, 'house': 236176.49},
{'year': 2005, 'house': 252741.41},
{'year': 2006, 'house': 273458.11},
{'year': 2007, 'house': 296851.21},
{'year': 2008, 'house': 302309.22},
{'year': 2009, 'house': 324990.67},
{'year': 2010, 'house': 328061.18},
{'year': 2011, 'house': 319043.77},
{'year': 2012, 'house': 311262.26},
{'year': 2013, 'house': 301675.29},
{'year': 2014, 'house': 299957.46},
{'year': 2015, 'house': 300629.23},
{'year': 2016, 'house': 301753}

]

var winwidth = parseInt(d3.select('#chart-body-3').style('width'))
var winheight = parseInt(d3.select('#chart-body-3').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-3').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height: 250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();



c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth*.21-13).attr('cy',c.height*.52).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth*.21-5).attr('y',c.height*.52).text('Start dragging here').attr('class','intro-text')


c.x.domain([2003, 2016])
c.y.domain([210000, 340000])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => '$'+ d )

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('house', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('house', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(2006) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area.house-area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-3').attr('class', 'your-line house-line')

c.drawAxis()

yourData = data
  .map(function(d){  return {year: d.year, house: d.house, defined: 0} })
  .filter(function(d){
    if (d.year == 2006) d.defined = true
    return d.year >= 2006
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('opacity', 0)
    var pos = d3.mouse(this)
    var year = clamp(2007, 2016, c.x.invert(pos[0]))
    var house = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.house = house
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2016))
      d3.select('#answer-3').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>$"+ d3.format(",.3r")(yourData[yourData.length-1].house) + "</p> for 2016.</div><div>The real value was <p class='your-pink'>$"+d3.format(",.3r")(data[10].house)+"</p>.</div>")
      d3.select('#explain-3').style('visibility', 'visible').style('opacity', 1)
          pymChild.sendHeight();


    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }