import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

export default function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function fetchClimateApi() {
      const url = `https://climate-by-zip.p.rapidapi.com/climate/30276`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'd75e8c0e4bmsh7c809ff22addb71p1dc9a5jsn549f343c6280',
          'x-rapidapi-host': 'climate-by-zip.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        setServerData(result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchClimateApi();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{serverData}</h1>
    </>
  );
}
