import { useEffect, useRef, useState, Fragment } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const GoogleMap = ({ center, zoom }) => {
  const ref = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return (
    <div
      ref={ref}
      id="map"
      zoom={zoom}
      style={{ height: "200px", width: "100%" }}
    />
  );
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <p>Loading</p>;
    case Status.FAILURE:
      return <p>Error</p>;
    case Status.SUCCESS:
      return <GoogleMap />;
    default:
      return null;
  }
};

export const Map = ({ dentists, showMap, setShowMap }) => {
  const [zoom, setZoom] = useState(3); // initial zoom

  return (
    <Fragment>
      {dentists.length > 0 && (
        <button onClick={() => setShowMap(!showMap)}>
          {showMap ? "Hide map" : "Show on map"}
        </button>
      )}
      {showMap && (
        <Wrapper
          apiKey={process.env.GOOGLE_MAPS_API_KEY}
          render={render}
          zoom={zoom}
        />
      )}
    </Fragment>
  );
};
