<template>
  <q-page class="flex flex-center">
      <div class="q-pa-md">
          <div class="q-gutter-md row">
              <q-select
                  filled
                  v-model="currentSelection"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="options"
                  @filter="filterFn"
                  hint="Mininum 2 characters to trigger autocomplete"
                  style="width: 250px; padding-bottom: 32px"
              >
                  <template v-slot:no-option>
                      <q-item>
                          <q-item-section class="text-grey">
                              No results
                          </q-item-section>
                      </q-item>
                  </template>
              </q-select>
              <q-btn @click="addSelection" label="Add"/>
              <q-btn @click="generateOther" label="Generate"/>
          </div>
          <div>
              <q-slider v-model="horizontal" :min="0" :max="360" @input="generateOther"/>
              <q-slider v-model="vertical" :min="-90" :max="90" @input="generateOther"/>
          </div>
          <div>
              <p>Selections:</p>
              <p v-for="cityName in cities" :key="cityName">{{ generateDisplayStringForCity(cityName) }}</p>
          </div>
          <div>
              <canvas id="canvas" height="450" width="900"></canvas>
          </div>
      </div>
  </q-page>
</template>

<style>
    #sphere {
        stroke: #444;
        stroke-width: 2;
    }
    .polygons {
        stroke: #444;
    }

    .sites {
        stroke: black;
        fill: white;
    }
</style>

<script>
    import { geoVoronoi } from "d3-geo-voronoi";
    import capitals from 'assets/capitals.json';

    const d3 = require('d3');

    export default {
        name: 'PageIndex',
        computed: {
            stringOptions() {
                return this.capitals.features.map((feat) => { return feat.properties.city; }).filter(v => v);
            },
        },
        data() {
            return {
                cities: ['Washington, DC'],
                capitals,
                currentSelection: '',
                options: [],
                horizontal: 0,
                vertical: -30,
            };
        },
        mounted() {
            this.generateOther();
        },
        methods: {
            filterFn(val, update, abort) {
                const self = this;
                if (val.length < 2) {
                    abort();
                    return;
                }

                update(() => {
                    const needle = val.toLowerCase();
                    this.options = self.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
                });
            },
            addSelection() {
                const { currentSelection } = this;
                const matches = this.stringOptions.filter(v => v === currentSelection);
                if (this.currentSelection.length > 0 && matches.length > 0) {
                    this.cities.push(this.currentSelection);
                    this.currentSelection = "";
                }
                this.generateOther();
            },
            findCityByName(name) {
                return this.capitals.features.filter(v => v.properties.city === name)[0];
            },
            generateDisplayStringForCity(name) {
                const info = this.findCityByName(name);
                if (info) {
                    return `${name} at ${info.geometry.coordinates[0]},${info.geometry.coordinates[1]}`;
                } else {
                    return name;
                }
            },
            generateOther() {
                console.log('generateOther');
                const self = this;
                const points = d3.range(this.cities.length).map((i) => {
                    return self.findCityByName(self.cities[i]).geometry.coordinates;
                });
                const mesh = geoVoronoi(points).cellMesh();
                const phi = (1 + Math.sqrt(5)) / 2;
                const graticule = d3.geoGraticule10();
                const sphere = ({ type: "Sphere" });
                const width = 900;
                const height = 450;
                const projection = d3.geoOrthographic()
                    .fitExtent([[1, 1], [width - 1, height - 1]], sphere)
                    .rotate([self.horizontal, self.vertical]);
                const canvas = document.getElementById('canvas');
                const context = document.getElementById('canvas').getContext("2d");
                context.clearRect(0, 0, width, height);
                const path = d3.geoPath(projection, context).pointRadius(2.5);
                context.beginPath();
                path(graticule);
                context.lineWidth = 1;
                context.strokeStyle = "#ccc";
                context.stroke();

                context.beginPath();
                path(sphere);
                context.strokeStyle = "#000";
                context.stroke();

                context.beginPath();
                path(mesh);
                context.stroke();

                context.beginPath();
                path({ type: "MultiPoint", coordinates: points });
                context.fillStyle = "#f00";
                context.fill();
            },
            generateVoronoi() {
                console.log('generating voronoi');
                const self = this;
                const points = {
                    type: "FeatureCollection",
                    // eslint-disable-next-line func-names
                    features: d3.range(this.cities.length).map((i) => {
                        return {
                            type: "Point",
                            coordinates: self.findCityByName(self.cities[i]).geometry.coordinates,
                        };
                    }),
                };

                const v = geoVoronoi()(points);
                // eslint-disable-next-line prefer-const
                const projection = d3.geoOrthographic();
                const path = d3.geoPath().projection(projection);
                const svg = d3.select("svg");
                svg.selectAll("*").remove();
                svg.append('path')
                    .attr('id', 'sphere')
                    .datum({ type: "Sphere" })
                    .attr('d', path);
                svg.append('g')
                    .attr('class', 'polygons')
                    .selectAll('path')
                    .data(v.polygons().features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('fill', (_, i) => { return d3.schemeCategory10[i % 10]; });
                svg.append('g')
                    .attr('class', 'sites')
                    .selectAll('path')
                    .data(points.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('id', (_, i) => { return `path${i}`; });
                this.cities
                    .map((cityName) => { return this.findCityByName(cityName); })
                    .forEach((city, index) => {
                        svg.append('use').attr('href', `#path${index}`).attr('fill', 'none').attr('stroke', 'red');
                        svg.append('text').attr('font-size', 25).attr('fill', 'blue')
                            .insert('textPath')
                            .attr('href', `#path${index}`)
                            .attr('text-anchor', 'right')
                            .text(city.properties.NAME);
                    });
                // gentle animation
                const SPEED_QUOTIENT = 15; // less is faster
                d3.interval((elapsed) => {
                    projection.rotate([elapsed / SPEED_QUOTIENT, 0]);
                    svg.selectAll('path')
                        .attr('d', path);
                }, 50);
            },
        },
    };
</script>
