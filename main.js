// Select dataset, variable name and target date
// var setelah = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_SO2').select('SO2_column_number_density').filterDate('2020-08-01', '2020-08-31');
var setelah = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2').select('NO2_column_number_density').filterDate('2020-08-11', '2020-08-14');
// Define the threshold value for transparency
var threshold = 0.00005;
// Bar color and range
var band_viz = {
min: 0.00001,
max: 0.0001,
opacity: 0.6,
palette: ['#FFFFFF', '#0000FF', '#00FF00', '#FFFF00', '#FF0000']};

// Mask values below the threshold
var setelahMasked = setelah.mean().updateMask(setelah.mean().gte(threshold));
Map.addLayer(setelahMasked, band_viz);
// Select the center of your map
Map.setCenter(98.39, 3.17, 7);
// Add labels
var header = ui.Label('Map of SO2 Emission After M. Sinabung Eruption', { fontSize: '25px', color: 'darkSlateGrey' });
var text_1 = ui.Label('Map of SO2 Emission around Mount Sinabung captured by Sentinel-5P, August 2020', { fontSize: '15px' });
var toolPanel = ui.Panel([header, text_1], 'flow', { width: '400px' });
ui.root.widgets().add(toolPanel);
// Add a marker to the volcanic activity site
// Define the specific latitude and longitude (lat-lon) for your pin
var pinLat = 3.17;
var pinLon = 98.39;
// Create a pin marker using an ee.Geometry.Point
var pinMarker = ee.Geometry.Point([pinLon, pinLat]);
// Add the pin marker to the map as a black point
Map.addLayer(pinMarker, { color: 'black' }, 'Pin Location');
// Create a label for the pin
var pinLabel = ui.Label('Mount Sinabung - Indonesia', { color: 'black' });
// Add the pin label to the map at the specified lat-lon
Map.add(ui.Panel([pinLabel], ui.Panel.Layout.flow('vertical')));



// Color bar legend
var legendTitle2 = ui.Label({ value: 'S5P SO2 [mol/m^2]', style: { fontWeight: 'bold', fontSize: '15px', margin: '10px 0 0 0', padding: '0' } });
// Panel configuration options
var legend = ui.Panel({ style: { position: 'bottom-right', padding: '8px 15px' } });
var titleTextVis = { 'margin': '0px 0px 15px 0px', 'fontSize': '18px', 'font-weight': '', 'color': '3333ff' };
// Create a legend title
var legendTitle = ui.Label('Legenda', titleTextVis);
// Added a second legend title
legend.add(legendTitle2);
// Create a legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((band_viz.max - band_viz.min) / 100.0).add(band_viz.min);
var legendImage = gradient.visualize(band_viz);
// Create text above the legend
var panel = ui.Panel({ widgets: [ui.Label('>'.concat(band_viz['max']))], });
legend.add(panel);
// Displays the legend image
var thumbnail = ui.Thumbnail({ image: legendImage, params: {bbox: '0,0,10,100', dimensions: '10x50' }, style: { padding: '1px', position: 'bottom-center' } });
// Added an image to the legend
legend.add(thumbnail);
// Create text below the legend
var panel = ui.Panel({ widgets: [ui.Label(band_viz['min'])], });
legend.add(panel);
// Displays the legend on the main map
Map.add(legend);

