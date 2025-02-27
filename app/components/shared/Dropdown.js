"use client"
import { useState, useRef, useEffect } from "react";
import { Country, State } from "country-state-city";
import axios from "axios";
import classes from "./Dropdown.module.css"



const Dropdown = ({getData}) => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState(""); 
  const [countries, setCountries] = useState([]); // All countries 
  const [states, setStates] = useState([]); // states of selected countires 
  const [loadingLocation, setLoadingLocation] = useState(true);

  const dropdownRef = useRef(null);

  // Toggle dropdown visibility

  // Close dropdown when clicking outside
  useEffect(() => {
    //Load all countries on page load
    setCountries(Country.getAllCountries());

    const fetchLocation = async () => {
      try {
        const { data } = await axios.get("/api/location");
        // Find country by name to get its ISO code
        const detectedCountry = Country.getAllCountries().find(
            (c) => c.name === data.country_name
          );
          if (detectedCountry) {
            setCountry(detectedCountry.isoCode);
            updateStates(detectedCountry.isoCode, data.region_name);
            getData(data.country_name, data.region_name)
          }
       // setCountry(data.country_name);// Set detected country (ISO code)
        //updateStates(data.country_code);
        //setState(data.region_name); // Set detected state
        //fetchStates(data.country_name);
      } catch (error) {
        console.error("Error fetching location:", error);
      }finally {
        setLoadingLocation(false); // NEW: Mark location as loaded
      }
    };

    fetchLocation();
  }, []);


  const updateStates = (selectedCountryCode, detectedState = "") => {
    const statesData = State.getStatesOfCountry(selectedCountryCode);
    setStates(statesData);
    const matchedState = statesData.find((s) => s.name === detectedState);
    setState(matchedState ? matchedState.isoCode : statesData[0]?.isoCode || "");
  };
  
//   const fetchStates = async (selectedCountry) => {
//     try {
//       const { data } = await axios.get(`/api/states?country=${selectedCountry}`);
//       setStates(data.states);
//       setState(data.states[0] || ""); // Select first state as default
//     } catch (error) {
//       console.error("Error fetching states:", error);
//       setStates([]);
//       setState("");
//     }
//   };

  const handleCountryChange = (e) => {
    const newCountryCode  = e.target.value;
    setCountry(newCountryCode);
    updateStates(newCountryCode);
  };
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

  return (
    <div className="relative w-72" ref={dropdownRef}>
      {/* Country dropdown */}
      <select value={country} onChange={handleCountryChange} disabled={loadingLocation} className={`w-full font-semibold bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer ${classes.slect} mb-3`}>
        {loadingLocation ? (
          <option>Detecting location...</option>
        ) : (
          <>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </>
        )}
      </select>

      {/* State dropdown updates dynamically */}
      <select value={state} onChange={(e) => setState(e.target.value)}  disabled={loadingLocation} className={`w-full font-semibold bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer ${classes.slect}`}>
        {loadingLocation  ? 
        (<option>Detecting location...</option>) : 
        states.length > 0 ? (
            states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)
          ) : (
            <option value="">No states available</option>
          )
        
        }
        
      </select>
    </div>
  );
};

export default Dropdown;
