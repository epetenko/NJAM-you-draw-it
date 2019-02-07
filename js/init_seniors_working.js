var pymChild = null;
var pymChild = new pym.Child();


var data = [
  // {"year": 2001,    "hisp": 31.4},
  // {"year": 2002,    "hisp": 32.6},
  // {"year": 2003,    "hisp": 34.5},
  // {"year": 2004,    "hisp": 35.5},
{'year': 2005, 'hisp': 25.3},

{'year': 2006, 'hisp': 25.9},
{'year': 2007, 'hisp': 26.6},
{'year': 2008, 'hisp': 30.3},

{'year': 2009, 'hisp': 30.1},
{'year': 2010, 'hisp': 31.1},

{'year': 2011, 'hisp': 30.8},
{'year': 2012, 'hisp': 30.8},
{'year': 2013, 'hisp': 31.0},
{'year': 2014, 'hisp': 31.0},
{'year': 2015, 'hisp': 30.5},
{'year': 2016, 'hisp': 30.6},
{'year': 2017, 'hisp': 30.6}

]


var winwidth = parseInt(d3.select('#chart-body-4').style('width'))

var winheight = parseInt(d3.select('#chart-body-4').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-4').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height:  250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth*.31-20).attr('cy',c.height*.50).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth*.31-16).attr('y',c.height*.49).text('Start dragging here').attr('class','intro-text')


c.x.domain([2005, 2017])
c.y.domain([22, 38])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d =>  d3.format(",.3r")(d) + '%')

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('hisp', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('hisp', c.y))

var clipRect = c.svg
  .append('clipPath#clip-4')
  .append('rect')
  .at({width: c.x(2009)-2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip-4)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-4').attr('class', 'your-line')

c.drawAxis()


yourData = data
  .map(function(d){ 
    return {year: d.year, hisp: d.hisp, defined: 0} })
  .filter(function(d){
    if (d.year == 2009) d.defined = true
    return d.year >= 2009
  })


var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('visibility', 'hidden')
    var pos = d3.mouse(this)
    var year = clamp(2005, 2017, c.x.invert(pos[0]))

    var hisp = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.hisp = hisp
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})
    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2016))
      d3.select('#answer-4').html('<div></div>')
      // d3.select('#answer-4').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].hisp) + " </p>percent for 2016.</div><div>The real value was <p class='your-pink'>"+d3.format(",.3r")(data[6].hisp)+"</p> percent.</div>")
      d3.select('#explain-4').style('visibility', 'visible').style('opacity', 1)
      pymChild.sendHeight();

    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }