<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md">
            <div>
                <canvas id="canvas" height="450" width="900"></canvas>
            </div>
            <div class="row">
                <q-field label="Horizontal Rotation" class="col-md-5">
                    <q-slider v-model="horizontal" :min="0" :max="360" @input="generateOther"/>
                </q-field>
                <span class="col"/>
                <q-field label="Vertical Rotation" class="col-md-5">
                    <q-slider v-model="vertical" :min="-90" :max="90" @input="generateOther"/>
                </q-field>
            </div>
            <div class="q-gutter-md row">
                <div class="col-md-5">
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
                </div>
                <span class="col"/>
                <div class="col-md-5">
                    <q-toolbar class="bg-primary text-white shadow-2">
                        <q-toolbar-title>Displayed Cities</q-toolbar-title>
                    </q-toolbar>
                    <q-list separator bordered>
                        <q-item v-for="cityName in cities" :key="cityName">
                            <q-item-section>
                                <q-item-label>{{ cityName }}, {{ findCityByName(cityName).properties.country }}</q-item-label>
                                <q-item-label caption>Latitude: {{ findCityByName(cityName).geometry.coordinates[0] }}, Longitude: {{ findCityByName(cityName).geometry.coordinates[1] }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </div>
            <hr>
            <div>
                <p>DISCLAIMER:</p>
                <p>This project is not aiming to make political statements with the cities that are listed. The dataset comes from https://github.com/Stefie/geojson-world</p>
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
                arrowStep: 5,
            };
        },
        mounted() {
            this.generateOther();
            const self = this;
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 38) {
                    // up arrow
                    self.vertical -= self.arrowStep;
                    self.generateOther();
                } else if (e.keyCode === 40) {
                    // down arrow
                    self.vertical += self.arrowStep;
                    self.generateOther();
                } else if (e.keyCode === 37) {
                    // left arrow
                    self.horizontal += self.arrowStep;
                    self.generateOther();
                } else if (e.keyCode === 39) {
                    // right arrow
                    self.horizontal -= self.arrowStep;
                    self.generateOther();
                }
            });
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
                // console.log('generateOther');
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
        },
    };
</script>
