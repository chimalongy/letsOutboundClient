import React from 'react'
import "../styles/ShowTasks.css"

function ShowTasks(props) {
    return (
        <div className='form-holder'>
            <h2>Tasks</h2>
            <div className='show-tasks'>
                <ul  >
                    {
                        props.data.map((task, index) => (
                            <li key={index}>
                                <div className='task-highlight'>
                                    <p>{task.taskName}</p>
                                     <div>
                                        <p>{task.taskDate}</p>
                                        <p>{task.taskTime}</p>
                                        <div>{task.status === "completed" ? (<i class="fa-solid fa-square-check completed" title='completed'></i>) : (<i class="fa-solid fa-circle-dot pending" title='pending'></i>)}</div>
                                    </div>
                                </div >
                                <details className="task-detail">
                                    <summary>More Details About this task</summary>
                                    <div>
                                        <div className='pop-sub-title'>
                                            <p><b>Subject :</b><br /><small>{task.taskSubject}</small></p>
                                            <p><b>Body :</b><br /><small>{task.taskBody}</small></p>
                                        </div>
                                    </div>
                                </details>

                            </li>
                        ))
                    }
                </ul>
            </div>


        </div>
    )
}

export default ShowTasks