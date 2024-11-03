import {useEffect, useRef, useState} from "react";
import {useMapsLibrary} from "@vis.gl/react-google-maps";

import "./autocomplete.css"

const PlaceAutocomplete = ({onPlaceSelect}) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
            componentRestrictions: {country: "pl"}
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener("place_changed", () => {
            onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="autocomplete-container">
            <input ref={inputRef}/>
        </div>
    );
};

export default PlaceAutocomplete;