// import React from "react";

// const InsightsDisplay = ({ insights }) => {
//   if (!insights || insights.length === 0) {
//     return (
//       <div className="p-4 mt-4 border rounded-md shadow bg-white">
//         <h2 className="text-lg font-semibold text-gray-700">
//           No Insights Available
//         </h2>
//         <p className="text-sm text-gray-500">
//           Upload a file and analyze its content to see insights here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 mt-4 border rounded-md shadow bg-white">
//       <h2 className="text-lg font-semibold text-gray-700 mb-3">
//         Analyzed Insights
//       </h2>
//       <ul className="space-y-3">
//         {insights.map((insight, index) => (
//           <li key={index} className="bg-gray-100 p-3 rounded-md shadow-sm">
//             <p className="text-gray-800 text-sm">{insight}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default InsightsDisplay;
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const InsightsDisplay = ({ insights }) => {
  if (!insights || Object.keys(insights).length === 0) {
    return (
      <div className="p-4 mt-4 border rounded-md shadow bg-white">
        <h2 className="text-lg font-semibold text-gray-700">
          No Insights Available
        </h2>
        <p className="text-sm text-gray-500">
          Upload a file and analyze its content to see insights here.
        </p>
      </div>
    );
  }

  // Prepare data for link groups
  const linkData = Object.keys(insights.linkGroups).map((domain) => ({
    domain,
    count: insights.linkGroups[domain].length,
  }));

  return (
    <div className="p-4 mt-4 border rounded-md shadow bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Analyzed Insights
      </h2>

      {/* Links by Domain */}
      <div className="my-4">
        <h3 className="text-md font-semibold mb-2">Links by Domain</h3>
        <BarChart width={600} height={300} data={linkData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domain" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Sentiment Analysis */}
      <div className="my-4">
        <h3 className="text-md font-semibold mb-2">
          Sentiment Analysis of Quotes
        </h3>
        <ul>
          {insights.sentimentResults.map((data, index) => {
            // Determine background color based on sentiment
            const bgColor =
              data.sentiment === "Positive"
                ? "bg-green-200"
                : data.sentiment === "Neutral"
                ? "bg-blue-200"
                : "bg-red-200";

            return (
              <li
                key={index}
                className={`${bgColor} p-3 rounded-md my-2 shadow-md`}
              >
                <p className="font-semibold">{data.quote}</p>
                <p>
                  Sentiment: <span className="font-bold">{data.sentiment}</span>{" "}
                  (Score: {data.score})
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InsightsDisplay;
