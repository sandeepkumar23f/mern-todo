import { useEffect, useState } from 'react';
import '../style/addtask.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateTask() {
    const [taskData, setTaskData] = useState({ title: '', description: '' });
    const navigate = useNavigate();
    const {id}=useParams();
    useEffect(() =>{
        getTask(id)
    },[])

    const getTask = async (id)=>{
        let data = await fetch(`http://localhost:5000/task/`+id);
        data = await data.json();
        if(data.tasks){
            setTaskData(data.tasks)
        }
    }

    const updateTask = async ()=>{
        console.log("function called", taskData);
        let data = await fetch("http://localhost:5000/update-task",{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(taskData),
        });

        data = await data.json()
        if(data){
            navigate('/')
        }
        else{
            alert("updae failed: "+ data.message)
        }
    }
    return (
        <div className="container">
            <h1>Update Task</h1>

            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    placeholder="Enter task title"
                    value={taskData.title}
                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder="Enter task description"
                    value={taskData.description}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    className="textarea-field"
                ></textarea>
            </div>

            <button onClick={updateTask} className="update-item">
                Update Task
            </button>
        </div>
    );
}
