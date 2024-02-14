import React from 'react';
import { AreaChart, Area, ResponsiveContainer, defs, linearGradient, stop, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const MyAreaChart = (props) => {
    return (

        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={props.graphData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3BF7D1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E2E5EA" stopOpacity={0} />
                    </linearGradient>
                </defs>
                {/* <Tooltip /> */}
                <XAxis dataKey="days" tick={{ fill: '#3BF7D1' }} axisLine={{ stroke: '#3BF7D1' }} />
                <YAxis tick={{ fill: '#F2F3F4' }} axisLine={{ stroke: '#F2F3F4' }} />
                <Area
                    type="monotone"
                    dataKey="sent"
                    stackId="1"
                    stroke={props.stroke}
                    fill="url(#colorUv)"
                    strokeWidth={2} // Adjust the stroke width as needed
                />
            </AreaChart>
        </ResponsiveContainer>

    );
};

export default MyAreaChart;
