const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the webpage
function init() {
    // Using the d3.select() method to select the dropdown menu, see 3\Activities\10-Stu_Event_Final
    let dropdownMenu = d3.select("#selDataset");
    
    // console.log(d3.json(url));

    // Fetch data from the specified URL
    d3.json(url).then((data) => {
        console.log(`Initiation load ${data}`)

        // Get the sample names
        let names = data.names;

        // console.log(names[0]);
        
        // Using .forEach() method
            //  iterate over each element in the 'names' array and append an <option> element to the 'dropdownMenu'
            // , setting the text and value attributes of the option to the current name within the arrow function.

            names.forEach((name) => {
                dropdownMenu.append("option").text(name).property("value", name);
            });
        
        // Select the first sample name by default
        let name = names[0];
        
        // Display demographic panel, bar chart, and bubble chart for the first sample
        panel(name);
        graph(name);
    });
}

// Display demographic information for a selected sample
function panel(selectedValue) {
    // Fetch metadata associated with the samples
    d3.json(url).then((data) => {
        console.log(`panel load ${data}`)

        let metadata = data.metadata;
        // Filter metadata for the selected sample
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let i = filteredData[0];
        
        // Clear existing information in the demographic panel
        d3.select("#sample-metadata").html("");
        
        // Display demographic information for the selected sample
        let entries = Object.entries(i);
        entries.forEach(([key, value]) => {
            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });
    });
}

// Display bar and bubble charts for a selected sample
function graph(selectedValue) {
    // Fetch sample data
    d3.json(url).then((data) => {
        let samples = data.samples;
        // Filter sample data for the selected sample
        let filteredData = samples.filter((sample) => sample.id == selectedValue);
        let i = filteredData[0];
        
        // Display top 10 OTUs in a bar chart
        let trace = [{
            x: i.sample_values.slice(0, 10).reverse(),
            y: i.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: i.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        Plotly.newPlot("bar", trace);
        
        // Display all OTUs in a bubble chart
        let trace_b = [{
            x: i.otu_ids,
            y: i.sample_values,
            text: i.otu_labels,
            mode: 'markers',
            marker: {
                size: i.sample_values,
                color: i.otu_ids,
                colorscale: 'Jet'
            }
        }];
        let layout = {
            xaxis: { title: "OTU IDs" },
            margin: { l: 40, r: 20, b: 90, t: 40 },
            showlegend: false
        };
        Plotly.newPlot("bubble", trace_b, layout);
    });
}

// Update demographic panel and charts when a new sample is selected
function optionChanged(selectedValue) {
    panel(selectedValue);
    graph(selectedValue);
}

// Initialize the webpage
init();