import { useRouter } from 'next/router'
import { use, useEffect, useState } from 'react'
export default function State() {
    const [weather, setWeather] = useState("")
    const [sunrise, setSunrise] = useState("")
    const [sunset, setSunset] = useState("")
    const [airPollution, setAirPollution] = useState("")
    const [pollution, setPollution] = useState({ co: "", no: "", no2: "", o3: "", so2: "", pm2_5: "", pm10: "", nh3: "" })
    const [aQI, setaQI] = useState("")
    // const[city,setCity] = useState("")
    // const[country,setCountry] = useState("")
    // const [tobeSearch,SetToBeSearch]=useState()
    const router = useRouter()
    const { search } = router.query
    const tobeSearch = search

    useEffect(() => {
        searchData()
        setTimeout(() => {
            airPollutionCheck()
        }, 100)
    }, [])
    var Sunrise;
    var Sunset;
    var mainData;
    var CO;

    async function searchData() {
        let local = window.localStorage.getItem("location")
        if (local.includes(",")) {
            const address = local.split(",")
            const Cityy = address[0]
            const Countryy = address[1]
            const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Cityy},${Countryy}&appid=f173681fef9de51588929c936617834c&units=metric`);
            const data = await api_call.json();
            setWeather(data);
            console.log("Local data ", data)
            let date = new Date(data.sys.sunrise * 1000).toString();
            Sunrise = date.slice(16, 24);
            console.log(Sunrise, "Sunrise")
            setSunrise(Sunrise)
            let newDate = new Date(data.sys.sunset * 1000).toString();
            Sunset = newDate.slice(16, 24);
            console.log(Sunset, "Sunset")
            setSunset(Sunset)
        }
        else if (local.includes(" ")) {
            const address = tobeSearch.split(" ")
            const Cityy = address[0]
            const Countryy = address[1]
            const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Cityy},${Countryy}&appid=f173681fef9de51588929c936617834c&units=metric`);
            const data = await api_call.json();
            setWeather(data);
            console.log("Local data ", data)
            let date = new Date(data.sys.sunrise * 1000).toString();
            Sunrise = date.slice(16, 24);
            console.log(Sunrise, "Sunrise")
            setSunrise(Sunrise)
            let newDate = new Date(data.sys.sunset * 1000).toString();
            Sunset = newDate.slice(16, 24);
            console.log(Sunset, "Sunset")
            setSunset(Sunset)
        }
        else {
            const Cityy = local;
            const Countryy = undefined
            const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Cityy},${Countryy}&appid=f173681fef9de51588929c936617834c&units=metric`);
            const data = await api_call.json();
            setWeather(data);
            mainData = data
            let date = new Date(data.sys.sunrise * 1000).toString();
            Sunrise = date.slice(16, 24);
            console.log(Sunrise, "Sunrise")
            setSunrise(Sunrise)
            let newDate = new Date(data.sys.sunset * 1000).toString();
            Sunset = newDate.slice(16, 24);
            console.log(Sunset, "Sunset")
            setSunset(Sunset)
        }
    }

    async function airPollutionCheck() {
        // let local = window.localStorage.getItem("location")
        const newlongitude = mainData.coord.lon;
        const newlatitude = mainData.coord.lat;
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${newlatitude}&lon=${newlongitude}&appid=f173681fef9de51588929c936617834c&units=metric`);
        const data = await api_call.json();
        console.log("Air pollution", data)
        setAirPollution(data)
        if (data.list[0].main.aqi == 1) {
            setaQI("Good")
        }
        if (data.list[0].main.aqi == 2) {
            setaQI("Fair")
        }
        if (data.list[0].main.aqi == 3) {
            setaQI("Moderate")
        }
        if (data.list[0].main.aqi == 4) {
            setaQI("Poor")
        }
        if (data.list[0].main.aqi == 5) {
            setaQI("Very Poor")
        }
        setPollution({ co: data.list[0].components.co, no: data.list[0].components.no, no2: data.list[0].components.no2, o3: data.list[0].components.o3, so2: data.list[0].components.so2, pm2_5: data.list[0].components.pm2_5, pm10: data.list[0].components.pm10, nh3: data.list[0].components.nh3 })
    }


    return (
        <div style={{ backgroundColor: '#282727', width: 1350, color: '#b0aaaa' }}>
            <h1>Location = {weather.name}</h1>
            <div className='first'>
                <h2 className='maindivision'>Weather</h2>
                <div className='weatherTemp'>
                    {weather != "" ?
                        <>
                            <h3>Lattitude : {weather.coord.lat}</h3>
                            <h3>Longitude : {weather.coord.lon}</h3>
                            <h3>Humidity : {weather.main.humidity}</h3>
                            <h3>Temperature : {weather.main.temp} C</h3>
                            <h3>Feels Like : {weather.main.feels_like}</h3>
                            <h3>Maximum Temperature : {weather.main.temp_max}</h3>
                            <h3>Minimum Temperature : {weather.main.temp_min}</h3>
                            <h3>Weather : {weather.weather[0].main}, {weather.weather[0].description}</h3>
                            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
                            <h3>Wind Speed : {weather.wind.speed}</h3>
                            <h3>Sunrise : {sunrise !== null ? sunrise : 0}</h3>
                            <h3>Sunset: {sunset !== null ? sunset : 0}</h3>
                            <h3>Sea Level: {weather.main.sea_level}</h3>
                        </>
                        : "Loading..."}
                </div>
                <h2 className='maindivision'>Pollution</h2>
                <div className='secondDiv'>
                    <h3>Air Quality Index : Good,Fair,Moderate,Poor,Very Poor.</h3>
                    <h3>Present Status : {airPollution !== null ? aQI : "Loading..."}</h3>
                    <h3>Concentration of Carbon monoxide : {airPollution !== null ? pollution.co : "Loading..."} μg/m3</h3>
                    <h3>Concentration of Nitrogen monoxide: {airPollution !== null ? pollution.no : "Loading..."} μg/m3</h3>
                    <h3>Concentration of Nitrogen dioxide, : {airPollution !== null ? pollution.no2 : "Loading..."} μg/m3</h3>
                    <h3>Concentration of Ozone : {airPollution !== null ? pollution.o3 : "Loading..."} μg/m3</h3>
                    <h3>Concentration of  Sulphur dioxide: {airPollution !== null ? pollution.so2 : "Loading..."} μg/m3</h3>
                    <h3>Concentration of  Fine particles matter: {airPollution !== null ? pollution.pm2_5 : "Loading..."} μg/m3</h3>
                    <h3>Concentration of  Coarse particulate matter: {airPollution !== null ? pollution.pm10 : "Loading..."} μg/m3</h3>
                    <h3>Concentration of  Ammonia: {airPollution !== null ? pollution.nh3 : "Loading..."} μg/m3</h3>
                </div>
            </div>

        </div>
    )
}