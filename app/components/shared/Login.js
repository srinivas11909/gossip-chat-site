"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Dropdown from "./Dropdown";
import axios from "axios";
import { Country, State } from "country-state-city";
import classes from "./Dropdown.module.css"

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";



const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY; // ✅ Load from `.env.local`

export default function Login(){
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("18");
    const [gender, setGender] = useState("Male");
    const [country, setCountry] = useState("");
    const [state, setState] = useState(""); 
    const [countries, setCountries] = useState([]); // All countries 
    const [states, setStates] = useState([]); // states of selected countires 
    const [loadingLocation, setLoadingLocation] = useState(true);
    const router = useRouter();
    const [stateName, setStateName] = useState("")
    const [countryName, setCountryName] = useState("")

    
    useEffect(() => {
      const checkLogin = async () => {
          const encryptedUser = Cookies.get("chatUser");
  
          if (!encryptedUser) return; // ✅ Don't redirect if no user
  
          try {
              const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
              const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
              if (decryptedData?.username) {
                  router.replace("/guest/chat"); // ✅ Use `replace` to prevent flickering
              }
          } catch (error) {
              console.error("Error decrypting user data:", error);
              Cookies.remove("chatUser"); // ✅ Remove corrupted cookies
          }
      };
  
      // ✅ Run checkLogin only once
      if (!Cookies.get("checkedLogin")) {
          checkLogin();
          Cookies.set("checkedLogin", "true"); // Prevent infinite loop
      }
  }, []);

    // useEffect(() => {
    //   const encryptedUser = Cookies.get("chatUser");
    //   if (encryptedUser) {
    //     try {
    //         const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
    //         const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            
    //         if (decryptedData?.username) {
    //             router.push("/guest/chat"); // ✅ Redirect to chat page
    //         }
    //     } catch (error) {
    //         console.error("Error decrypting user data:", error);
    //         Cookies.remove("chatUser"); // ✅ Remove invalid cookies
    //     }
    // }
    // }, [])

    // useEffect(() => {
    //     const loggedInUser = sessionStorage.getItem("chatUser");
    //     if (loggedInUser) {
    //       router.push("/");
    //     }
    // }, []);

    useEffect(() => {
      //Load all countries on page load
      setCountries(Country.getAllCountries());
  
      const fetchLocation = async () => {
        try {
          const { data } = await axios.get("/api/location");
          // Find country by name to get its ISO code
          if (!data || !data.country) {
            console.warn("Geolocation API did not return valid data.");
            return;
        }
          const detectedCountry = Country.getAllCountries().find(
              (c) => c.name.toLowerCase() === data.country.toLowerCase()
            );
            if (detectedCountry) {
              setCountry(detectedCountry.isoCode);
              setCountryName(detectedCountry.name)
              updateStates(detectedCountry.isoCode, data.region);
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
      setStateName(matchedState.name)
      setState(matchedState ? matchedState.isoCode : statesData[0]?.isoCode || "");
    };

    const handleCountryChange = (e) => {
      const newCountryCode = e.target.value// e.target.value;
      setCountryName(e.target.options[e.target.selectedIndex].text);
      setCountry(newCountryCode);
      updateStates(newCountryCode);
    };



      const handleLogin = async () => {
        if (!username.trim()) return alert("Username is required!");
        const newUser = { username, age, gender, country, state, countryName, stateName };

          // ✅ Encrypt user data before storing in cookies
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(newUser),
            SECRET_KEY
        ).toString();
        Cookies.set("chatUser", encryptedData, { expires: 1, secure: true, sameSite: "Strict" });

        await axios.post("/api/users", newUser);
        //sessionStorage.setItem("chatUser", JSON.stringify(newUser));
    
        if ("Notification" in window && Notification.permission !== "granted") {
          Notification.requestPermission();
        }
    
        router.push("/guest/chat");
    };


    return <>
      <div className="container">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required 
                className={`w-full bg-transparent font-semibold placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none mb-3 ${username === '' ? "border-red-300 focus:border-red-400 hover:border-red-400": "border-slate-200"}`} />
            <div className="flex flex-wrap mb-3">
            <select value={age} onChange={(e) => setAge(e.target.value)}  className={`w-1/3 font-semibold bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none ${classes.slect}`}>
                {Array.from({ length: 43 }, (_, i) => 18 + i).map((num) => (
                <option key={num} value={num}>{num}</option>
                ))}
            </select>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-1/2 font-semibold bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none ml-auto">
                    <option value="Male">👨 Male</option>
                    <option value="Female">👩 Female</option>
                </select>
            </div>
            {/* <Dropdown onChange={getData} /> */}
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
      <select value={state} onChange={(e) => { setState(e.target.value); setStateName(e.target.options[e.target.selectedIndex].text) }}  disabled={loadingLocation} className={`w-full font-semibold bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer ${classes.slect}`}>
        {loadingLocation  ? 
        (<option>Detecting location...</option>) : 
        states.length > 0 ? (
            states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)
          ) : (
            <option value="">No states available</option>
          )
        
        }
        
      </select>
            <div className="flex justify-center mt-3">
            <button 
              onClick={handleLogin} 
              disabled={username === ""}
              className={`w-full text-white font-semibold px-2 py-2 min-w-[100px] rounded 
                ${username === "" 
                  ? "bg-gradient-to-r from-gray-400 to-gray-600 cursor-not-allowed opacity-70" 
                  : "bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90"}`
              }>
              Login
            </button>
            </div>
        </div>
    </>
}