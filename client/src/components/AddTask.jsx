import { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const handleAddTask = async () => {
    if (!taskData.title || !taskData.description) {
      alert("Please fill in both title and description");
      return;
    }

    try {
      let result = await fetch("http://localhost:5000/add-task", {
        method: "POST",
        body: JSON.stringify(taskData),
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();

      if (result.success) {
        console.log("New task added:", result);
        navigate("/"); // redirect to task list
      } else {
        alert(result.message || "Failed to add task. Try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

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
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          className="textarea-field"
        ></textarea>
      </div>

      <button onClick={handleAddTask} className="submit-btn">
        Add Task
      </button>
    </div>
  );
}
