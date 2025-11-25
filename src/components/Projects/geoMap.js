// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Box } from '@mui/material';
// import {
//   withGoogleMap,
//   GoogleMap,
//   Marker,
//   InfoWindow
// } from 'react-google-maps';
// import {
//   useDispatch
//   //  useSelector
// } from 'src/store';
// import { getCoordinates } from '../../slices/project_forms';

// const google = window.google;

// const GeoMap = () => {
//   const [coords, setCoords] = useState({ lat: 12.959744, lng: 77.6568832 });
//   const [isOpen, setOpen] = useState(false);
//   let location = [];
//   let autocomplete = null;
//   let autocompleteInput = React.createRef();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (location.length) {
//       setCoords((prevState) => ({
//         ...prevState,
//         lat: location[0],
//         lng: location[1]
//       }));
//     }
//   }, []);
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         dispatch(
//           getCoordinates([
//             position?.coords?.latitude,
//             position?.coords?.longitude
//           ])
//         );
//         setCoords((prevState) => ({
//           ...prevState,
//           lat: position?.coords?.latitude,
//           lng: position?.coords?.lng
//         }));
//       },
//       function (error) {
//         console.error(
//           `Error Code = ' + ${error.code} + ' - ' + ${error.message}`
//         );
//       }
//     );
//   }, [coords.lat]);
//   useEffect(() => {
//     autocomplete = new google.maps.places.Autocomplete(
//       autocompleteInput.current,
//       {
//         componentRestrictions: { country: 'IN' }
//       }
//     );
//     autocomplete.addListener('place_changed', handlePlaceChanged);
//   }, [coords.lat]);

//   const handlePlaceChanged = () => {
//     const event = autocomplete.getPlace();
//     let latt = event?.geometry?.location.lat();
//     let lng = event?.geometry?.location.lng();
//     setCoords((prevState) => ({
//       ...prevState,
//       lat: latt,
//       lng
//     }));
//     dispatch(getCoordinates([latt, lng]));
//   };

//   const handleClick = (e) => {
//     setCoords((prevState) => ({
//       ...prevState,
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng()
//     }));
//     dispatch(getCoordinates([e.latLng.lat(), e.latLng.lng()]));
//   };
//   const handleToggleOpen = () => {
//     setOpen(!isOpen);
//   };
//   const GoogleMapExample = withGoogleMap((props) => (
//     <GoogleMap
//       defaultCenter={coords}
//       defaultZoom={13}
//       onClick={(e) => {
//         handleClick(e);
//       }}
//     >
//       <Marker
//         key={props.index}
//         position={coords}
//         onClick={() => handleToggleOpen()}
//       >
//         {isOpen && (
//           <InfoWindow options={{ maxWidth: 300 }}>
//             <span>
//               Latitude:<b>{coords.lat}</b>,longitude:<b>{coords.lng}</b>
//             </span>
//           </InfoWindow>
//         )}
//       </Marker>
//     </GoogleMap>
//   ));
//   location = useSelector((state) => state.project.coords);
//   return (
//     <Box>
//       <Box
//         style={{
//           width: '85%',
//           border: '1px #A9A9A9 solid',
//           height: '35px',
//           paddingLeft: '8px'
//         }}
//       >
//         <input
//           ref={autocompleteInput}
//           id="autocomplete"
//           style={{
//             width: '97%',
//             border: 'none',
//             marginTop: '5px',
//             marginLeft: '4px',
//             padding:'4px'
//           }}
//           placeholder="Search location for autocomplete..."
//           type="text"
//         />
//       </Box>
//       <GoogleMapExample
//         containerElement={<div style={{ height: `500px`, width: '1000px' }} />}
//         mapElement={
//           <div style={{ height: `100%`, width: '100%', marginTop: '10px' }} />
//         }
//       />
//     </Box>
//   );
// };

// export default GeoMap;

import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for google map places autocomplete
      address: "",

      // showingInfoWindow: false,
      // activeMarker: {},
      // selectedPlace: {},

      mapCenter: {
        lat: 12.959744,
        lng: 77.6568832
      }
    };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);

        // update center state
        this.setState({ mapCenter: latLng });
      })
      .catch((error) => console.error("Error", error));
  };

  render() {
    return (
      <div id="googleMaps">
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input"
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <Map 
          google={this.props.google}
          initialCenter={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
          center={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
        >
          <Marker
            position={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }}
          />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDylAZazdDTAB1xeRCGaZX_EQ8ACXY7Z_s"
})(GoogleMap);