import {MapContainer, useMapEvents} from 'react-leaflet'
import './App.css';
import {useRef, useState} from "react";
import axios from "axios";
import L, {CRS} from 'leaflet';
const mapData={
    defaultLayersControl: null,
    layouts : []

}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
mapData.defaultLayersControl = L.control.layers({}, {}, {collapsed: false})
const loadMap = async (payload)=>{
    const map = payload.target
    console.log("map loaded",map)
    map.addControl(mapData.defaultLayersControl)
    map.setMinZoom(-100000)
    const gj = await axios.get('http://localhost:3000')
    let geo = L.geoJSON(gj.data.geoJson,
        {
            "pointToLayer": () => {
            },
            style: {
                "color": "#ff7800",
                "weight": 1,
                "opacity": 0.65
            }

        })
    mapData.layouts.push(geo)
    mapData.defaultLayersControl.addOverlay(geo,'Pafta')
    map.fitBounds(geo.getBounds())
    console.log(geo.getBounds())
}

const MapEventHandler = function () {
    const map = useMapEvents({
        async click(e) {

        },
        async contextmenu(){
            return await loadMap({target:map})
        },

        async dblclick(e){
            console.log(mapData.layouts)
            mapData.layouts[mapData.layouts.length-1].removeFrom(map)
mapData.defaultLayersControl.removeLayer(mapData.layouts[mapData.layouts.length-1])
            mapData.layouts[mapData.layouts.length-1] = undefined
            mapData.layouts.pop()
        }
    })
    return null
}
function App() {
    const mapRef = useRef(null)
    return (
        <div className="App">
            <MapContainer whenReady={loadMap}  crs={CRS.Simple} center={[404296.8749999999,
                5248278.0222078226]} zoom={-1} scrollWheelZoom={false} id="default-map" ref={mapRef}
                          scrollWheelZoom={true}>
                <MapEventHandler/>
            </MapContainer>
        </div>
    );
}

export default App;
