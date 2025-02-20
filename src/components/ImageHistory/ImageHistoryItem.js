import React from 'react';

function ImageHistoryItem({ item, setResults}) {
    const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images/${item}`;


    const onClickRecord= async ()=>{
   const response = await fetch(apiGatewayUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setResults(data);
        console.log('====================================');
        console.log("uploadProgress", data);
        console.log('====================================');
    }

  return (
    <li onClick={onClickRecord(item)} className="flex items-center space-x-1 p-3 bg-gray-700 rounded-md hover:bg-gray-600">
      <div className="text-sm text-gray-200">{item}</div>
    </li>
  );
}

export default ImageHistoryItem;
