

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import taskService from "../../services/taskService";
// import "./styles/AddTask.css";

// const AddTask = () => {
//   const navigate = useNavigate();

//   // 🔹 TODAY DATE (for disabling past dates)
//   const today = new Date().toISOString().split("T")[0];

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await taskService.addTask(form);

//     // ✅ Success message
//     setSuccessMessage("Task added successfully. Redirecting to dashboard...");

//     // Clear form (unchanged logic)
//     setForm({
//       title: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//     });

//     // ✅ Redirect after 2.5 seconds
//     setTimeout(() => {
//       navigate("/student");
//     }, 2500);
//   };

//   return (
//     <div className="add-task-wrapper">
//       <div className="add-task-container">
//         <h2>Add New Task</h2>

//         <form onSubmit={handleSubmit} className="task-form">
//           {/* TITLE */}
//           <input
//             type="text"
//             name="title"
//             placeholder="Task Title"
//             required
//             value={form.title}
//             onChange={handleChange}
//           />

//           {/* DESCRIPTION */}
//           <textarea
//             name="description"
//             placeholder="Task Description"
//             value={form.description}
//             onChange={handleChange}
//           />

//           {/* START DATE */}
//           <div className="date-field">
//             <label>Start Date</label>
//             <input
//               type="date"
//               name="startDate"
//               min={today}                 // ✅ No past dates
//               value={form.startDate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* END DATE */}
//           <div className="date-field">
//             <label>End Date</label>
//             <input
//               type="date"
//               name="endDate"
//               min={form.startDate || today} // ✅ Must be >= start date
//               value={form.endDate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit">Add Task</button>

//           {/* ✅ SUCCESS MESSAGE */}
//           {successMessage && (
//             <p className="success-message">{successMessage}</p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTask;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import StudentLayout from "../components/StudentLayout";
import "./styles/AddTask.css";

const AddTask = () => {
  const navigate = useNavigate();

  // 🔹 TODAY DATE (for disabling past dates)
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await taskService.addTask(form);

    // ✅ Success message
    setSuccessMessage("Task added successfully. Redirecting to dashboard...");

    // Clear form (unchanged logic)
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    });

    // ✅ Redirect after 2.5 seconds
    setTimeout(() => {
      navigate("/student");
    }, 2500);
  };

  return (
    <StudentLayout>
      <div className="add-task-wrapper">
        <div className="add-task-container">
          <h2>Add New Task</h2>

          <form onSubmit={handleSubmit} className="task-form">
            {/* TITLE */}
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              required
              value={form.title}
              onChange={handleChange}
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Task Description"
              value={form.description}
              onChange={handleChange}
            />

            {/* START DATE */}
            <div className="date-field">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                min={today}
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* END DATE */}
            <div className="date-field">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                min={form.startDate || today}
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Add Task</button>

            {/* ✅ SUCCESS MESSAGE */}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default AddTask;
