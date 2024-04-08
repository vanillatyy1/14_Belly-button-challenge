// Define global variables
let samplesData;
let metadata;

// Function to initialize the dashboard
function init() {
    // Load data from samples.json using D3
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
        samplesData = data.samples;
        metadata = data.metadata;

        // Populate dropdown menu with test subject IDs
        populateDropdown();

        // Initialize dashboard with default sample (e.g., first sample)
        updateDashboard(samplesData[0]);
    });
}

// Function to populate the dropdown menu with test subject IDs
function populateDropdown() {
    // Make connection with dropdown menu
    let dropdown = d3.select("#selDataset");
    
    // Iterate through each sample and append an option to the dropdown
    // .forEach() method: 
        //  iterate over each each object in the samplesData array, 
        //  appending an <option> element to the dropdown, 
        //  with the value attribute set to the id property of the current object and 
        //  the text content of the <option> also set to the id property of the current object.

    //  selection.append() method for appending elements, 
    //  the selection.text() method for setting text content,

    samplesData.forEach(function(sample) {
        dropdown.append("option").text(sample.id);
    });
}

// Function to update the dashboard based on the selected sample
function optionChanged(selectedSample) {
    // Filter samples data to get the selected sample
    let selectedData = samplesData.filter(function(sample) {
        return sample.id === selectedSample;
    })[0];
    
    // Update dashboard with the selected data
    updateDashboard(selectedData);
}

// Function to update the dashboard with new data
function updateDashboard(data) {
    // Update bar chart
    updateBarChart(data);
    
    // Update bubble chart
    updateBubbleChart(data);
    
    // Update demographic info
    updateDemographicInfo(data.id);
}

// Function to update the bar chart
function updateBarChart(data) {
 
    // Use sample_values as the values for the bar chart
    let sampleValues = data.sample_values.slice(0, 10);
    
    // Use otu_ids as the labels for the bar chart
    let otuIds = data.otu_ids.slice(0, 10);
    
    // Use otu_labels as the hovertext for the chart
    let otuLabels = data.otu_labels.slice(0, 10);

    // Create trace for the bar chart
    let trace = [{
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    }];

    // Create layout for the bar chart
    let layout = {
        title: "Top 10 OTUs Found",
        yaxis: {
            autorange: "reversed"
        }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", trace, layout);
}

// Function to update the bubble chart
function updateBubbleChart(data) {
    
    // Create trace for the bubble chart
    // colorscale: https://plotly.com/python/builtin-colorscales/

    let trace = [{
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
            size: data.sample_values,
            color: data.otu_ids,
            colorscale: 'Earth'
        }
    }];

    // Create layout for the bubble chart
    let layout = {
        title: "OTU Frequency",
        xaxis: {
            title: "OTU ID"
        },
        yaxis: {
            title: "Sample Value"
        }
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", trace, layout);
}

// Function to update demographic info
function updateDemographicInfo(selectedId) {
    // Select the div for the demographic info
    let demographicInfoDiv = d3.select("#sample-metadata");

    // Filter metadata to get the selected subject's info
    let selectedMetadata = metadata.filter(function(item) {
        return item.id === parseInt(selectedId);
    })[0];

    // Clear previous content
    demographicInfoDiv.html("");

    // Append each key-value pair from the metadata
    Object.entries(selectedMetadata).forEach(function([key, value]) {
        demographicInfoDiv.append("p").text(`${key}: ${value}`);
    });
}

// Call the init function to initialize the dashboard
init();
