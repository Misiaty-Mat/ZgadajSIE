import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: 52.190987,
    longitude: 19.355406,
  });
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsDefault(false);
      });
    }
  }, []);

  return { isDefault, location };
};

export default useGeolocation;
