function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // console.log(metadata)

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = Object.values(data.samples);  
    // console.log(samples);  
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(Obj => Obj.id == sample);
    // console.log(filteredSamples);
       
    //  5. Create a variable that holds the first sample in the array.
    // already have only one object but inside [] which are removed next
    var sampleOne = filteredSamples[0];
    // console.log(sampleOne);
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleOne.otu_ids;
    var otu_labels = sampleOne.otu_labels;
    var sample_values = sampleOne.sample_values;
    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values); 


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    // console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"    
        }  
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>", 
      font: { size: 12, color: "darkblue" },

    };


    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, {responsive:true})
  
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Cividis'
        }

      }
   
    ];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Samples</b>', font: { size: 12, color: "darkblue"  },
      xaxis: {title: 'OTU ID'},
      margin: {
        t: 40,
        b: 80,
        l: 40,
        r: 40},
      hovermode: 'closest',
               
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {responsive:true})

    // 1. Gauge - Create a variable that filters the metadata array for the object with the desired sample number.
    var sampleArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // console.log(sampleArray)

    // 2. Create a variable that holds the first sample in the metadata array.
    sample = sampleArray[0];
    // console.log(sample)

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(sample.wfreq)
    // console.log(wfreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per week</br>",
         font: { size: 17 }},
        gauge: { 
          axis: {  range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "aquamarine" },
            { range: [2, 4], color: "darkturquoise" },
            { range: [4, 6], color: "cyan" },
            { range: [6, 8], color: "deepskyblue" },
            { range: [8, 10], color: "cornflowerblue" }
            ]

          }
        }
           
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 450,
      margin: { 
        b: 0,
        t: 0,
        l: 0,
        r: 0 },
      font: { color: "darkblue" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, {responsive:true});

  });
}
