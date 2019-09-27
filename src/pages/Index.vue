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
              <q-btn @click="generateVoronoi" label="Generate"/>
          </div>
          <div>
              <p>Selections:</p>
              <p v-for="cityName in cities" :key="cityName">{{ generateDisplayStringForCity(cityName) }}</p>
          </div>
          <div>
              <svg width="960" height="600"></svg>
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
    import geodata from 'assets/cities.json';
    import { geoVoronoi } from "d3-geo-voronoi";

    const d3 = require('d3');

    export default {
        name: 'PageIndex',
        mounted() {
            console.log(geodata);
        },
        computed: {
            stringOptions() {
                return this.geodata.features.map((feat) => { return feat.properties.NAME; }).filter(v => v);
            },
        },
        data() {
            return {
                cities: ['HA NOI'],
                currentSelection: '',
                geodata,
                options: [],
            };
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
            },
            findCityByName(name) {
                return this.geodata.features.filter(v => v.properties.NAME === name)[0];
            },
            generateDisplayStringForCity(name) {
                const info = this.findCityByName(name);
                if (info) {
                    return `${name} at ${info.geometry.coordinates[0][0][0]},${info.geometry.coordinates[0][0][1]}`;
                } else {
                    return name;
                }
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
                            coordinates: self.findCityByName(self.cities[i]).geometry.coordinates[0][0],
                        };
                    }),
                };

                const v = geoVoronoi()(points);
                // eslint-disable-next-line prefer-const
                const projection = d3.geoOrthographic();
                const path = d3.geoPath().projection(projection);
                console.log(v.polygons().features);
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
