// Get the data from samples.json
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
function init() {
  d3.json(samples).then(function(data) { 
    let sampleIDs = data.names;
    let first_value = sampleIDs[0];

    populateDropDown();
    demographInfo(first_value);
    plotBarGraph(first_value);
    plotBubbleChart(first_value);
  });
};

function populateDropDown() {
  d3.json(samples).then(function(data) {

    let names = data.names;
    let dropdown = d3.select("#selDataset");

    for (var i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]).property("value", names[i]);
    }
  })
};

function plotBarGraph(sampleID) {
  d3.json(samples).then(function(data) {
    let sample = data.samples;
    let sampleArray = sample.filter(sampleIDList => sampleIDList.id == sampleID);
    let sample_values = sampleArray[0].sample_values.slice(0,10).reverse();
    let otu_ids = sampleArray[0].otu_ids.slice(0,10).reverse();
    let otu_labels = sampleArray[0].otu_labels.slice(0,10).reverse();
    let otu_ids_text = [];

    for (let i = 0; i < otu_ids.length; i++) {
        otu_ids_text.push(`OTU ${otu_ids[i]}`)
    }

    let trace1 = {
        x: sample_values,
        y: otu_ids_text,
        text: otu_labels,
        type: 'bar',
        orientation: "h"
      };
      
      // Data array
      let bar_data = [trace1];
      
      let layout = {
        margin: {
            l: 80,
            r: 80,
            t: 80,
            b: 80
          }
      };
      
      Plotly.newPlot("bar", bar_data, layout);
  })
};

function plotBubbleChart(sampleID) {
  d3.json(samples).then(function(data) {
    let sample = data.samples;
    let sampleArray = sample.filter(sampleIDList => sampleIDList.id == sampleID);
    let sample_values = sampleArray[0].sample_values;
    let otu_ids = sampleArray[0].otu_ids;
    let otu_labels = sampleArray[0].otu_labels;

    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        size: sample_values,
        mode: 'markers',
        marker: {
          sizemode: 'diameter',
          sizeref: 1.25,
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      };
      
      // Data array
      let bar_data = [trace1];
      
      let layout = {
        title: "Bacteria Cultures",
        margin: {t: 0},
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        margin: {t: 30}
      };
      
      Plotly.newPlot("bubble", bar_data, layout);
  })
};

function demographInfo(infoID) {
  d3.json(samples).then(function(data) {
    let demographicInfo = data.metadata;
    
    for (let i = 0; i < demographicInfo.length; i++) {
      if (infoID == demographicInfo[i].id) {
        let demographicInfoData = demographicInfo[i];
        let pageElement = d3.select("#sample-metadata");
        pageElement.html("");

        for (var key in demographicInfoData) {
          let rowData = `${key.toUpperCase()}: ${demographicInfoData[key]}`;
          pageElement.append("h6").text(rowData);
        };
      };
    };

  });
};

function optionChanged(newIDValue) {
  demographInfo(newIDValue);
  plotBarGraph(newIDValue);
  plotBubbleChart(newIDValue);
}

init();
