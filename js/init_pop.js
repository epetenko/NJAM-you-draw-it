var pymChild = null;
var pymChild = new pym.Child();


var data = [
  // {"year": 2001,    "pop": 31.4},
  // {"year": 2002,    "pop": 32.6},
  // {"year": 2003,    "pop": 34.5},
  // {"year": 2004,    "pop": 35.5},
{'year': 2005, 'pop': 8521427},
{'year': 2006, 'pop': 8724560},
{'year': 2007, 'pop': 8685920},
{'year': 2008, 'pop': 8682661},
{'year': 2009, 'pop': 8707740},

{'year': 2010, 'pop': 8807624},
{'year': 2011, 'pop': 8821155},
{'year': 2012, 'pop': 8864590},
{'year': 2013, 'pop': 8899339},
{'year': 2014, 'pop': 8938175},
{'year': 2015, 'pop': 8958013},
{'year': 2016, 'pop': 8944469}

]


var winwidth = parseInt(d3.select('#chart-body-1').style('width'))

var winheight = parseInt(d3.select('#chart-body-1').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-1').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height:  250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',0).attr('cy',174).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',5).attr('y',173).text('Start dragging here').attr('class','intro-text')


c.x.domain([2005, 2016])
c.y.domain([8300000, 9000000])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d =>  d3.format(",.3r")(d) )

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('pop', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('pop', c.y))

var clipRect = c.svg
  .append('clipPath#clip-1')
  .append('rect')
  .at({width: c.x(2005), height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip-1)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-1').attr('class', 'your-line')

c.drawAxis()


yourData = data
  .map(function(d){ 
    return {year: d.year, pop: d.pop, defined: 0} })
  .filter(function(d){
    if (d.year == 2005) d.defined = true
    return d.year >= 2005
  })


var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('visibility', 'hidden')
    var pos = d3.mouse(this)
    var year = clamp(2006, 2016, c.x.invert(pos[0]))

    var pop = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.pop = pop
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2016))
      d3.select('#answer-1').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].pop) + "</p> for 2016.</div><div>The real value was <p class='your-pink'>"+d3.format(",.3r")(data[11].pop)+"</p>.</div>")
      d3.select('#explain-1').style('visibility', 'visible').style('opacity', 1)
      pymChild.sendHeight();

    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }