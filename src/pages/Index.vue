<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md">
            <div>
                <canvas id="canvas" height="450" width="900"></canvas>
            </div>
            <div class="row">
                <q-field borderless label="Horizontal Rotation" class="col-md-5">
                    <q-slider v-model="horizontal" :min="0" :max="360" @input="generateOther"/>
                </q-field>
                <span class="col"/>
                <q-field borderless label="Vertical Rotation" class="col-md-5">
                    <q-slider v-model="vertical" :min="-90" :max="90" @input="generateOther"/>
                </q-field>
            </div>
            <div class="q-gutter-md row">
                <div class="col-md-5">
                    <div class="row">
                        <div class="col-md-8">
                            <q-select
                                filled
                                v-model="currentSelection"
                                use-input
                                hide-selected
                                fill-input
                                input-debounce="0"
                                :options="options"
                                @filter="filterFn"
                                label="Enter a Capital City"
                                @keyup.enter="addSelection"
                                hint="Mininum 2 characters to trigger autocomplete"
                                style="width: 100%; padding-bottom: 32px"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <span class="col"/>
                        <div class="col-md-2">
                            <q-btn color="primary" @click="addSelection" label="Add"/>
                        </div>
                    </div>
                    <div class="row">
                        <q-field borderless label="Rotate Per Press">
                            <q-input type="number" v-model.number="arrowStep" :min="0" :max="100"/>
                        </q-field>
                    </div>
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
                            <q-item-section avatar>
                                <q-icon color="gray" name="delete" @click="removeCity(cityName)"/>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </div>
            <div class="row">
                <div class="col-12 row">
                    <p>DISCLAIMER:</p>
                </div>
                <div class="col-12 row">
                    <p>This project is not aiming to make political statements with the cities that are listed. The dataset comes from https://github.com/Stefie/geojson-world</p>
                </div>
            </div>
        </div>
        <q-dialog v-model="showHelp">
            <q-card>
                <q-toolbar>
                    <q-avatar>
                        <q-icon name="flight_takeoff" color="primary"/>
                    </q-avatar>

                    <q-toolbar-title><span class="text-weight-bold">Where to?</span> by Jyan</q-toolbar-title>

                    <q-btn flat round dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section>
                    <span class="text-weight-bold">Where to?</span> is a visualization tool that displays a Spherical <a href="https://en.wikipedia.org/wiki/Voronoi_diagram">Voronoi Diagram</a> based off capital cities that you enter. The goal is for you to enter countries you've been to, and after doing so you will see how large of chunks the Earth is split into. This will visualize what places of the world you haven't traveled to, and can be used to suggest your next destination.
                </q-card-section>
                <q-card-section>
                    <span class="text-weight-bold">The Controls</span>. There are two sliders which can be used to rotate the spherical projection along the two axis. You can also use your keyboard arrows, WASD, or IJKL to change the tilt values. You can modify how much the sphere rotates by in a text input below. To enter cities, start to type the name of the capital city and there will be options suggested. Click on one of the suggestions and press enter, or click the add button to add them to the list. To remove them from the list, simply click the trash icon next to the city name on the right.
                </q-card-section>
                <q-card-section>
                    <q-toggle label="Don't show me again" v-model="dontShowMeAgain" style="padding-top: 20px;"></q-toggle>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

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
                showHelp: true,
                dontShowMeAgain: false,
            };
        },
        mounted() {
            this.generateOther();
            const self = this;
            const canvas = document.getElementById('canvas');
            let lastDownTarget = null;

            document.addEventListener('mousedown', (event) => {
                lastDownTarget = event.target;
            }, false);
            document.addEventListener('keydown', (e) => {
                if (lastDownTarget === canvas) {
                    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 73) {
                        // up arrow
                        self.vertical -= self.arrowStep;
                        self.generateOther();
                    } else if (e.keyCode === 40 || e.keyCode === 83 || e.keyCode === 75) {
                        // down arrow
                        self.vertical += self.arrowStep;
                        self.generateOther();
                    } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 74) {
                        // left arrow
                        self.horizontal += self.arrowStep;
                        self.generateOther();
                    } else if (e.keyCode === 39 || e.keyCode === 68 || e.keyCode === 76) {
                        // right arrow
                        self.horizontal -= self.arrowStep;
                        self.generateOther();
                    }
                }
            });

            const stored = localStorage.getItem('dontShowMeAgain');
            if (stored) {
                console.log("Something stored");
                this.showHelp = stored === 'false';
                this.dontShowMeAgain = stored === 'true';
            } else {
                console.log("nothing stored");
                localStorage.setItem('dontShowMeAgain', false);
            }
            console.log(stored);
        },
        watch: {
            dontShowMeAgain() {
                localStorage.setItem('dontShowMeAgain', this.dontShowMeAgain);
            },
        },
        methods: {
            changeToggle() {
                console.log("ct");
                console.log(this.dontShowMeAgain);
            },
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
            removeCity(val) {
                this.cities = this.cities.filter(v => v !== val);
                this.generateOther();
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
                context.strokeStyle = "#878787";
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
