var select=d3.select('#selDataset');
var id;
var maxwfreq=0;
Optionboxbuilder();

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}
function mydata(data){

  d3.select('.mytable').remove();

  var panelTable=d3.select('#sample-metadata').append('table').attr("class","table mytable").attr("style","padding:5px;font-size:9px;border: solid 1px;");
  var tr,td,wfreq;
  Object.entries(data).forEach(([key,value])=>{
    tr = panelTable.append("tr")
    tr.append("th").attr("style","text-transform:uppercase;background-color:lightblue;border: solid 1px;").text(key);
    tr.append("td").attr("style","border: solid 1px;").text(value);
    if(key=="wfreq"){
      wfreq=value;
    }
  });

}


function Optionboxbuilder(){
d3.json("./static/data/samples.json").then((data) => {
    data.metadata.forEach((element)=>{
      Object.entries(element).forEach(([key, value]) => {
        if (key=="id"){
          select.append("option").attr("value",value).text(value);
        }
        if (key=="wfreq"){
          if (value > maxwfreq)
            maxwfreq=value;
        }
      });
    });

});
}
var newdata;


function Graph(id){
  //id=d3.select('#selDataset').property('value');
  d3.json("./static/data/samples.json").then((data) => {
    data.metadata.forEach((element,i)=>{
      Object.entries(element).forEach(([key, value]) => {
        if (key=="id"){
          if(value==id){
            console.log(data.metadata[i]);
            console.log(data.samples[i])
            mycharts(data.samples[i],data.metadata[i].wfreq);
            mydata(data.metadata[i]);
          }
        }
      });
    });

}); 
}

function Buildchart(xaxis,yaxis,ticks,type,title,orientation,color,colorscale,size,width,mode,val,wfreq)
{
  if (width == null){
    width = 500;
  }

  if (type=='bar'){
    xaxis = xaxis.reverse();
    yaxis=yaxis.reverse();
    text = ticks.reverse();
  }
  if (type=="gauge"){
    var level=wfreq*20;
    if ( maxrange % 2 == 0)
      var maxrange=maxwfreq + 2;
    else
      var maxrange=maxwfreq + 3;
    var trace1 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: val,
      type: "indicator",
      mode: mode,
      title: { text: level, font: { size: 14 },font : { color: "Red" } },
      delta: { reference: maxrange/4, increasing: { color: "Red" } },
      gauge: {
        axis: { range: [null, maxrange], tickwidth: 1, tickcolor: "Black" },
        bar: { color: "#DAF7A6" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, maxrange/8],color: "#C9DBC7" },
          { range: [maxrange/8, maxrange/4], color: "#93D58F" },
          { range: [maxrange/4, maxrange/2], color: "#70CF66" },
          { range: [maxrange/2, (4*maxrange)/6], color: "#46B03B" },
          { range: [(4*maxrange)/6,maxrange], color: "pink" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 0.25
        }}
    }
  var layout = { 
    title: title,
    width: 600, height: 350, margin: { t: 150, r: 25, l: 25, b: 25 } ,
    paper_bgcolor: "white",
  font: { color: "darkblue", family: "Arial" }
  };
  }
  else{
  var trace1 = {
    x: xaxis,
    y: yaxis,
   text: ticks,
   mode: 'markers',
   name: "Top 10 OTUs",
   type: type,
   orientation: orientation,
  marker: {
       color: color,
       size: size,  
       colorscale: colorscale,
    }
};
var layout = {
  title: title,
  showlegend: false,
  height: 600,
  width: width,
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  },
};
}
var chartdata = [trace1];
Plotly.newPlot(type, chartdata, layout);
}
function mycharts(data,freq){
  // Draw Bar
  var xaxis = data.sample_values.slice(0,10);
  var yaxis = data.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
  var ticks = data.otu_labels.slice(0,10)
  var color=null;
  var colorscale=null;
  var size =null;
  var val=null;
  var mode =null;
  var wfreq=null;
  Buildchart(xaxis,yaxis,ticks,"bar","Top 10 OTUs in Individuals","h",color,colorscale,size,null,mode,val,wfreq)
//Draw Bubble
  xaxis= data.otu_ids
  yaxis= data.sample_values
  ticks= data.otu_labels
  color=data.otu_ids
  colorscale="RdBu"
  size= data.sample_values
  val=null;
  mode=null
  wfreq=null;
  Buildchart(xaxis,yaxis,ticks,"bubble","OTUs in Individuals",null,color,colorscale,size,900,mode,val,wfreq)

  //Draw Gauge
  ticks="<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"
  color=null
  colorscale=null
  size=null;
  mode="gauge+number+delta";
  val=freq;
  wfreq=freq;
  Buildchart(xaxis,yaxis,ticks,"gauge","<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",null,color,colorscale,size,null,mode,val,wfreq)
  
}

