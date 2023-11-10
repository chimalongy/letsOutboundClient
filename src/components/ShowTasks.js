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
                            <li><p>{task.taskName}</p>
                            <p>{task.taskDate}</p>
                            <p>{task.taskTime}</p>
                            <div>{ task.status==="completed"?(<i class="fa-solid fa-square-check completed" title='completed'></i>):(<i class="fa-solid fa-circle-dot pending" title='pending'></i>)}</div>
                            
                            </li>
                        ))
                    }
                </ul>
            </div>


        </div>
    )
}

export default ShowTasks