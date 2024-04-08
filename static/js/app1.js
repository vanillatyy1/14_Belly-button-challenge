// Define global variables
var samplesData;
let metadata;
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"


// Function to initialize the dashboard
function init() {
    // Load data from samples.json using D3
    d3.json(url).then(data => {
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
    const dropdown = d3.select("#selDataset");
    
    // Iterate through each sample and append an option to the dropdown
    samplesData.forEach(sample => {
        dropdown.append("option")
            .attr("value", sample.id)
            .text(sample.id);
    });
}

// Function to update the dashboard based on the selected sample
function optionChanged(selectedSample) {
    // Filter samples data to get the selected sample
    let selectedData = samplesData.filter(sample => sample.id === selectedSample)[0];
    
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
    // Select the div for the bar chart
    let barChartDiv = d3.select("#bar");

    // Use sample_values as the values for the bar chart
    let sampleValues = data.sample_values.slice(0, 10);
    
    // Use otu_ids as the labels for the bar chart
    let otuIds = data.otu_ids.slice(0, 10);
    
    // Use otu_labels as the hovertext for the chart
    let otuLabels = data.otu_labels.slice(0, 10);

    // Create trace for the bar chart
    let trace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    // Create layout for the bar chart
    let layout = {
        title: "Top 10 OTUs Found",
        yaxis: {
            autorange: "reversed"
        }
    };

    // Plot the bar chart
    Plotly.newPlot(barChartDiv.node(), [trace], layout);
}

// Function to update the bubble chart
function updateBubbleChart(data) {
    // Select the div for the bubble chart
    const bubbleChartDiv = d3.select("#bubble");

    // Create trace for the bubble chart
    const trace = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
            size: data.sample_values,
            color: data.otu_ids
        }
    };

    // Create layout for the bubble chart
    const layout = {
        title: "OTU Frequency",
        xaxis: {
            title: "OTU ID"
        },
        yaxis: {
            title: "Sample Value"
        }
    };

    // Plot the bubble chart
    Plotly.newPlot(bubbleChartDiv.node(), [trace], layout);
}

// Function to update demographic info
function updateDemographicInfo(selectedId) {
    // Select the div for the demographic info
    const demographicInfoDiv = d3.select("#sample-metadata");

    // Filter metadata to get the selected subject's info
    const selectedMetadata = metadata.filter(item => item.id === parseInt(selectedId))[0];

    // Clear previous content
    demographicInfoDiv.html("");

    // Append each key-value pair from the metadata
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        demographicInfoDiv.append("p").text(`${key}: ${value}`);
    });
}

// Call the init function to initialize the dashboard
init();