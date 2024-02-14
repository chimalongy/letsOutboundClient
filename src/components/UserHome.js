import React, { PureComponent, useEffect, useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Calendar from "../components/Calendar"
import "../styles/UserHome.css"
import { useDispatch, useSelector } from 'react-redux';
import MyAreaChart from './MyAreaChart';

function UserHome() {






    // const user = useSelector((state) => state.user.userData);
    // const uOutbounds = []
    // const uEmails = []
    // const uTasks = []
    const user = useSelector((state) => state.user.userData);
    const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
    const uEmails = useSelector((state) => state.userEmails.userEmails.emails);
    const uTasks = useSelector((state) => state.userTasks.userTasks.task);

    // const [TotalCapacity, setTotalCapacity] = useState(0)




    let TotalCapacity = 0;

    uEmails.forEach(email => {
        if (email.primaryEmail == true) {
            TotalCapacity += email.dailySendingCapacity
        }
    });

    let secondaryEmails = uEmails.filter(email => email.primaryEmail == false)
    let completedTasks = uTasks.filter(task => task.status == "completed")
    let scheduledTasks = uTasks.filter(task => task.status != "completed")


    useEffect(() => {
        let TCapacity = 0;





    }, [])



    console.log(uTasks)







    function getGraphData() {
        const currentDate = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = currentDate.getDay();
        const daysElapsed = dayOfWeek + 1;

        const graphData = [];

        for (let i = 0; i < daysElapsed; i++) {
            const currentDay = new Date(currentDate);
            currentDay.setDate(currentDate.getDate() - (dayOfWeek - i));

            const formattedDate = currentDay.toISOString().split('T')[0];
            const dayTasks = uTasks.filter(task => task.taskDate === formattedDate);
            // let dayTasks = []
            // for (let indx = 0; indx < uTasks.length; indx++) {
            //     if (uTasks[indx].taskDate === formattedDate) {
            //         dayTasks.push(uTasks[indx])
            //     }
            // }

            if (dayTasks.length > 0) {
                let emailsSent = dayTasks.reduce((total, task) => {
                    const outbounds = uOutbounds.filter(outbound => outbound.outboundName === task.outboundName);
                    const emailLists = outbounds.map(outbound => outbound.emailList);
                    return total + emailLists.flat().reduce((count, allocItem) => count + allocItem.emailAllocations.length, 0);
                }, 0);


                graphData.push({ days: formattedDate, sent: emailsSent });
            } else {


                graphData.push({ days: formattedDate, sent: 0 });
            }
        }

        return graphData;

    }


    let graphData = getGraphData()
    console.log(graphData)

    return (
        <div className='user-home'>
            <div className='top-dash'>

                <div className='top-dash-item'>
                    <div className='top-dash-item-header' >
                        <div>
                            <p>Overall sending Capacity</p>

                        </div>
                        <i class="fa-solid fa-envelope-circle-check dashboard-header-icon"></i>

                    </div>
                    <div className='top-dash-item-body'>
                        <h1 style={{ fontSize: "50px" }}>{TotalCapacity}</h1>
                    </div>
                </div>
                <div className='top-dash-item'>
                    <div className='top-dash-item-header' >
                        <div>
                            <p>Emails</p>
                            <h3></h3>
                        </div>

                        <i class="fa-solid fa-envelope-open-text dashboard-header-icon"></i>
                    </div>
                    <div className='top-dash-item-body'>
                        <div>
                            <p><b>No. of Emails</b></p>
                            <p className="top-dash-item-body-tittle">{uEmails.length}</p>
                        </div>
                        <div>
                            <p><b>Secondary emails</b></p>
                            <p className="top-dash-item-body-tittle">{secondaryEmails.length}</p>
                        </div>
                    </div>
                </div>
                <div className='top-dash-item'>
                    <div className='top-dash-item-header' >
                        <div>
                            <p>Outbounds</p>
                            <h3></h3>
                        </div>

                        <i class="fa-solid fa-arrow-up-right-from-square dashboard-header-icon"></i>

                    </div>
                    <div className='top-dash-item-body'>


                        <div>
                            <p><b>No. of Outbounds</b></p>
                            <p className="top-dash-item-body-tittle">{uOutbounds.length}</p>
                        </div>
                    </div>
                </div>
                <div className='top-dash-item'>
                    <div className='top-dash-item-header' >
                        <div>
                            <p>Tasks</p>
                            <h3>{<h3>{uTasks.length}</h3>
                            }</h3>
                        </div>

                        <i class="fa-solid fa-layer-group dashboard-header-icon"></i>

                    </div>
                    <div className='top-dash-item-body'>
                        <div>
                            <p><b>Completed</b></p>
                            <p className="top-dash-item-body-tittle">{completedTasks.length}</p>
                        </div>
                        <div>
                            <p><b>Scheduled</b></p>
                            <p className="top-dash-item-body-tittle">{scheduledTasks.length} </p>
                        </div>
                    </div>
                </div>

            </div>
            <div className='sending-graph'>
                <h1>This week:</h1>
                {/* <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getGraphData()}>

                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="days" />
                        <YAxis domain={[0, TotalCapacity]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sent" stroke="#8884d8" activeDot={{ r: 8 }} />

                    </LineChart>
                </ResponsiveContainer> */}


                <MyAreaChart graphData={graphData} />

            </div>
            {/* <div>
               
                <Calendar />
            </div> */}


        </div>
    )
}

export default UserHome