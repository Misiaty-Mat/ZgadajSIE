import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({ lat: 52.0693, lng: 19.4803 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return location;
};

export default useGeolocation;
