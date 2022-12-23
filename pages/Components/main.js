import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Main() {
    const [location, setLocation] = useState("")
    const router = useRouter()
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [error, setError] = useState("")



    useEffect(() => {
        window.localStorage.removeItem("location")
    }, [])
    async function handleKeyUp(e) {
        const Enterlocation = e.target.value;
        const address = location.split(",")
        setCity(address[0])
        setCountry(address[1])
        if(location.length<1){
            setError("Please enter something")
        }
        if(location.length>0){
            setError("")
        }

        if (e.keyCode === 13 && !e.shiftKey && location.length > 0) {
            // console.log(Enterlocation)
             setError("")
            const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=f173681fef9de51588929c936617834c&units=metric`);
            const data = await api_call.json();
            // setWeather(data.main);
            console.log("Local data ", data)
            if (data.message =='city not found') {
                console.log("citsdfsy not foundksjd")
                setError("Sorry could not find city!")
            } else{
                window.localStorage.setItem("location", location)
                
                console.log("city not foundksjd")
                router.push({
                    pathname: "/state",
                    query: { search: `${location}` },
                })
            }
        }
        // // else{
        //     setError("Please enter something!")
        // }
    }
    function handleBlur() {
        if (location.length < 1) {
            setError("")
        }
    }

    async function handleSearchClick(event) {
        event.preventDefault();
        const address = location.split(",")
        setCity(address[0])
        setCountry(address[1])
        if (location.length > 0) {
            const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=f173681fef9de51588929c936617834c&units=metric`);
            const data = await api_call.json();
            // setWeather(data.main);
            console.log("Local data ", data)
            if (!data.messsage === "city not found" || !data.message === "Bad request") {
                window.localStorage.setItem("location", location)
                router.push({
                    pathname: "/state",
                    query: { search: `${location}` },
                })
            } else {
                setError("Sorry could not find city!")
            }
        }
        console.log("Button Clicked", location)
    }

    return (
        <div style={{ height: 668, backgroundColor: '#282727' }}>
            <div style={{ paddingTop: 70, paddingLeft: 370, height: 500, width: 600, backgroundColor: '#282727' }}>
                <h1 style={{ paddingLeft: 50, color: '#b0aaaa' }}>Global Watch Weather Application</h1>
                {/* <div style={{display}}> */}
                <input type="text" value={location} placeholder="Enter city name " className="locationInput" onChange={(event) => setLocation(event.target.value)} onKeyUp={(event) => handleKeyUp(event)} onBlur={() => handleBlur()}></input>
                {/* </div> */}
                {location ? <button className="searchButton" onClick={(event) => handleSearchClick(event)}><i className="fa-solid fa-arrow-right"></i></button> : ""}
                <h3 style={{ color: '#dc665b', paddingLeft: 160, paddingTop: 70 }}>{error}</h3>
            </div>
        </div>
    )
}