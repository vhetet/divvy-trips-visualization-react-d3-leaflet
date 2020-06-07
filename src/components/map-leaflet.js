import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import L from 'leaflet';

function MapLeaftlet({ markersData }) {
    // todo ==> store value in the state? Make sure the thing map and data are rendered appropriately. Improve code organisation. Add a way to select a station
    // const [count, setCount] = useState(0);

    // create map
    const mapRef = React.useRef(null);
    console.log(mapRef)
    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [41.8281, -87.6898],
            zoom: 12,
            layers: [
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        // Add a svg layer to the map
        L.svg().addTo(mapRef.current);

        console.log(mapRef)
        let markers_obj = {};
        let markers = [];

        d3.json('https://data.cityofchicago.org/resource/fg6s-gzvg.json?from_station_id=265')
            .then(data => {
                const map = mapRef.current
                console.log(mapRef)

                const from_lat = data[0]['from_latitude'], from_long = data[0]['from_longitude']
                data.map(m => {
                    if (markers_obj[m['to_station_id']]) {
                        markers_obj[m['to_station_id']].count++
                    } else {
                        markers_obj[m['to_station_id']] = { long: parseFloat(m.to_longitude), lat: parseFloat(m.to_latitude), count: 1, color: 'red' }
                    }
                })

                markers = []
                // add trip origin
                markers.push({ long: parseFloat(from_long), lat: parseFloat(from_lat), count: 100, color: 'blue' })
                // add trips destinations
                Object.keys(markers_obj).map(k => markers.push(markers_obj[k]))

                console.log(markers)
                console.log('current map ref ', mapRef)
                console.log('current map ref ', mapRef.current)
                console.log(d3.select(mapRef.current))
                d3
                    // .select(mapRef.current)
                    .select("svg")
                    .selectAll("myCircles")
                    .data(markers)
                    .enter()
                    .append("circle")
                    .attr("cx", d => map.latLngToLayerPoint([d.lat, d.long]).x)
                    .attr("cy", d => map.latLngToLayerPoint([d.lat, d.long]).y)
                    .attr("r", d => Math.log(d.count) + 2)
                    .style("fill", d => d.color)
                    .attr("stroke", d => d.color)
                    .attr("stroke-width", 3)
                    .attr("fill-opacity", .4)
            })

    }, []);

    return (
        <div id="map" />
    );
}

export default MapLeaftlet;
