// Step 1: Read in samples.json using D3
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
d3.json(url).then(function(data) {
    // Function to initialize the dashboard
    function init() {
        // Populate the dropdown menu with sample IDs
        let dropDownMenu = d3.select('#selDataset');
        data.names.forEach(function(name) {
            dropDownMenu.append('option').text(name).property('value', name);
        });
        // Initialize the dashboard with the first sample
        let firstSample = data.names[0];
        updateCharts(firstSample);
        updateMetadata(firstSample);
    }

    // Function to update charts and metadata
    function optionChanged(newSample) {
        updateCharts(newSample);
        updateMetadata(newSample);
    }

    // Function to update the bar and bubble charts
    function updateCharts(sample) {
        let samples = data.samples;
        let selectedSample = samples.find(obj => obj.id === sample);

        // Bar chart data
        let barData = [{
            x: selectedSample.sample_values.slice(0, 10).reverse(),
            y: selectedSample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: selectedSample.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        // Bar chart layout
        let barLayout = {
            title: 'Top 10 OTUs Found',
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
        };

        // Plot bar chart
        Plotly.newPlot('bar', barData, barLayout);

        // Bubble chart data
        let bubbleData = [{
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: 'Earth'
            }
        }];

        // Bubble chart layout
        let bubbleLayout = {
            title: 'OTU Bubble Chart',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        // Plot bubble chart
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    }

    // Function to update sample metadata
    function updateMetadata(sample) {
        let metadata = data.metadata;
        let selectedMetadata = metadata.find(obj => obj.id.toString() === sample);

        // Select the metadata div
        let metadataDiv = d3.select('#sample-metadata');

        // Clear existing metadata
        metadataDiv.html('');

        // Append metadata key-value pairs
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append('p').text(`${key}: ${value}`);
        });
    }

    // Initialize the dashboard
    init();
});