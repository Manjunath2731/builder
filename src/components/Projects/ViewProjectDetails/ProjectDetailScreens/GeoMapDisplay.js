import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const GeoMapDisplay = ({ location }) => {
  const [coords, setCoords] = useState({ lat: location?.[0], lng: location?.[1] });
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (location.length) {
      setCoords((prevState) => ({
        ...prevState,
        lat: location[0],
        lng: location[1]
      }));
    }
  }, []);
  const handleToggleOpen = () => {
    setOpen(!isOpen);
  };
  const GoogleMapExample = withGoogleMap((props) => (
    <GoogleMap
      defaultCenter={coords}
      defaultZoom={15}
    >
      <Marker
        key={props.index}
        position={coords}
        onClick={() => handleToggleOpen()}
      >
        {isOpen && (
          <InfoWindow options={{ maxWidth: 300 }}>
            <span>
              Latitude:<b>{coords.lat}</b>,longitude:<b>{coords.lng}</b>
            </span>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  ));
  location = useSelector((state) => state.project.coords);
  return (
    <Box>
      
      <GoogleMapExample
        containerElement={<div style={{ height: 220, width: '500px' }} />}
        mapElement={
          <div style={{ height: `100%`, width: '100%',  }} />
        }
      />
    </Box>
  );
};

export default GeoMapDisplay;
