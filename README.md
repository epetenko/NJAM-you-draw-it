# NJAM-you-draw-it
Charts where readers guess the trend.

First off, 90 percent of this code is owed to NYT's Adam Pearce. My only real changes were design-related.

So you want to create one of these? https://s3.amazonaws.com/nj-apps/you-draw-it/index_seniors_working.html

Here's what you're gonna need to do:
### Get the files:
- Download one of the HTML files. 
- Download one of the init_ files, along with d3v4 (or use the latest remote version).
- Download the css file.
- Change the HTML title of the chart.
- Change the text in `<p>` tags. That's what will show up after the person has finished guessing.

### Data changes:
First you'll need to add your data. Go to this section --  
`````
var data = [
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
``````
And change it to your data. At the moment, it only works by year. But you can change the year range. To do that, go to 

``````
c.x.domain([2005, 2017])
c.y.domain([22, 38])
`````
Change the x.domain to the years you want to show, and the y domain to the y axis of the graph. If you're not displaying percentages, you may also have to change `c.yAxis.ticks(5).tickFormat(d =>  d3.format(",.3r")(d) + '%')
` to remove the percent sign or add, say, a dollar sign.

You'll also have to change this, later in the code:
```````
    var year = clamp(2005, 2017, c.x.invert(pos[0]))
``````
Again, just change it to the years you want.

You also have to configure what year to show at first, the trendline part before the reader adds their guess. That's here: 

``````
var clipRect = c.svg
  .append('clipPath#clip-4')
  .append('rect')
  .at({width: c.x(2009)-2, height: c.height})
`````
Right now, it's set to show everyone up to 2009.

You'll do the same thing at 
 ````````
 yourData = data
  .map(function(d){ 
    return {year: d.year, hisp: d.hisp, defined: 0} })
  .filter(function(d){
    if (d.year == 2009) d.defined = true
    return d.year >= 2009
  })
````````
Again, change 2009 to the year you want.


### The annoying part: That dot
I'm sorry to say this next part will take some guesswork and trial-and-error, and I haven't found an easier way to do it. It's that dot and text that tells the reader to start drawing there.
Right here: 

```````
c.svg.append('circle').attr('cx',c.totalWidth*.31-20).attr('cy',c.height*.50).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth*.31-16).attr('y',c.height*.49).text('Start dragging here').attr('class','intro-text')
```````
`circle` refers to the dot, `text` refers to the accompanying text. To move them around, change `totalWidth*.31-20` and `c.height*.50` to the horizontal and vertical locations, respectively, of your dot and text. You may have to double check it in mobile as well.

That's it! Embed with pym as needed.
