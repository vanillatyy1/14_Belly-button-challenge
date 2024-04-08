
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


// Display the default plots
function init() {
    // Use D3 to select the dropdown menu 
    let dropdownMenu = d3.select("#selDataset");
    
    // Fetch the JSON data
    d3.json(url).then((data)=> {
    
    // Call upon the array of id names
        let names = data.names;
    // Iterate through the names Array and add to drop down menu
    names.forEach((name) => {dropdownMenu.append("option").text(name).property("value", name)});
    
    // Assign the first name to name variable
    let name = names[0];
    
    // Call the functions to make the demographic panel, bar chart, and bubble chart
         panel(name);
         graph(name);
     });
    }

//Create a horizontal bar chart to display the top 10 OTUs found in the individual selected from the dropdown menu 
    
    function graph(selectedValue){
        // Fetch the JSON data and console log it
        d3.json(url).then((data) => {
        
        //Obtaining the samples
        let samples = data.samples;
        //Filterting the samples to the specific ID in the dropdown
        let filteredData = samples.filter((sample) => sample.id == selectedValue);
        let obj = filteredData[0];
    
        //top 10 OTUs found in that individual

        let trace = [{
            //Use sample_values as the values for the bar chart.
            x: obj.sample_values.slice(0,10).reverse(),
            //Use otu_ids as the labels for the bar chart.
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            //Use otu_labels as the hovertext for the chart.
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        Plotly.newPlot("bar", trace);
        
        //Create Bubble Chart
         //Create the parameters for the bubble chart
      let trace_b = [{
        // Use otu_ids for the x values.
        x: obj.otu_ids,
        // Use sample_values for the y values.
        y: obj.sample_values,
        // Use otu_labels for the text values.
        text: obj.otu_labels,
        mode: 'markers',
        marker: {
            // Use sample_values for the marker size
            size: obj.sample_values,
            // Use otu_ids for the marker colors
            color: obj.otu_ids,
            colorscale: 'Viridis'
        }}];

   //Create the labels and the margins 
   let layout = {
       xaxis: {title: "OTU IDs"},
       margin: {
           l: 40, 
           r: 20,
           b: 90,
           t: 40,
       },
       showlegend: false
   };

   Plotly.newPlot("bubble", trace_b, layout);
    });
    }
    
    // Make the demographics panel
    function panel(selectedValue) {
        // Fetch the JSON data and console log it
        d3.json(url).then((data) => {
    
            // An array of metadata objects
            let metadata = data.metadata;
            
            // Filter data where id = selected value after converting their types 
            // (bc meta.id is in integer format and selectValue from is in string format)
            let filteredData = metadata.filter((meta) => meta.id == selectedValue);
          
            // Assign the first object to obj variable
            let obj = filteredData[0]
            
            // Clear the child elements in div with id sample-metadata
            d3.select("#sample-metadata").html("");
      
            // Object.entries() is a built-in method in JavaScript 
            // This returns an array of a given object's own enumerable property [key, value]
            let entries = Object.entries(obj);
            
            // Iterate through the entries array
            // Add a element for each key-value pair to the div with id sample-metadata
            entries.forEach(([key,value]) => {
                d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
            });
    
            // Log the entries Array
            console.log(`${obj} panel`);
    
        });
      }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

     //Update all the plots when a new sample is selected.
    function optionChanged(selectedValue) {
        panel(selectedValue);
        graph(selectedValue);
    
    }
    
    init();