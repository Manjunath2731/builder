// import React from "react";

// import GooglePlacesAutocomplete,{ geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

// export default function EventVenue({handleVenue}) {
//   const handleAddress = ({ description }) => {
//     geocodeByAddress(description)
//       .then((results) => getLatLng(results[0]))
//       .then(({ lat, lng }) =>{
//         handleVenue({
//               geoLocation: {
//                 coordinates: [lat,lng]
//               },
//               address: description
//             })
//         console.log("Successfully got latitude and longitude", { lat, lng });
//         console.log("Successfully got description and longitude", { description });

//       })
//       .catch((error) => console.error(error));
//   };
//   return (
//     <div className="App" 
//     >
//       <GooglePlacesAutocomplete
//         debounce={800}
//         apiKey="AIzaSyDylAZazdDTAB1xeRCGaZX_EQ8ACXY7Z_s"
//         onSelect={handleAddress}
//         // styles={{height:"53px",borderRadius:"10px"}}
//         renderSuggestions={( suggestions, onSelectSuggestion) => (
//           <div
//            className="suggestions-containers">
//             {suggestions.map((suggestion) => (
//               <div aria-hidden
//                 className="suggestion"
//                 onClick={(event) => onSelectSuggestion(suggestion, event)}
//                 onKeyDown={(event) => onSelectSuggestion(suggestion, event)}
//               >
//                 {suggestion.description}
//               </div>
//             ))}
//           </div>
//         )}
//       />
//     </div>
//   );
// }


import { usePlacesWidget } from "react-google-autocomplete";
import React, {memo} from "react";
import { TextField, InputAdornment } from "@mui/material";
import Search from "@mui/icons-material/Search";

function EventVenue({handleVenue})  {
  const { ref: materialRef } = usePlacesWidget({
    apiKey: "AIzaSyDylAZazdDTAB1xeRCGaZX_EQ8ACXY7Z_s",
    onPlaceSelected: (place) =>{ console.log(place);
    // options: {
    //   types: [],
    //   fields: ["types.postal_code", "types.locality", "types.route"],
    //   componentRestrictions: null
    // }
    
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    handleVenue({
      geoLocation: {
        coordinates: [lat,lng]
      },
      address: place?.formatted_address
    })
  },
  options: {
    types: ["(regions)"],
    componentRestrictions: { country: "in" },
  },
  });

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: "100%", marginTop: "20px" }}>
          <TextField
            fullWidth
            color="secondary"
            variant="outlined"
            inputRef={materialRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default memo(EventVenue);