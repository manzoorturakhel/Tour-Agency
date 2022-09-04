import { useEffect, useState } from "react";

const useFetch = (url, method, body, headers) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetching() {
      try {
        const genericData = await fetch(url, {
          method: method || "GET",
          body: null || JSON.stringify(body),
          headers: headers || {
            "Content-Type": "application/json",
          },
        });
        const extractedData = await genericData.json();
        if (extractedData.status !== "success") {
          throw new Error("something horrible happend");
        }
        setData(extractedData);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetching();
  }, [url, method, body, headers]);

  return [data];
};

export default useFetch;
