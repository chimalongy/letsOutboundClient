import React, {useState} from 'react'

export default function UpdatePassword(props) {
  const [formData, setFormData] = useState({
    email: "",
});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  setErrors({ ...errors, [name]: "" });
};
  return (
    <div className='login-form'>
      <div className='form-holder'>
      <h2>Update Password</h2>
      <form onSubmit={"handleSubmit"}>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <button type="submit">Get Password</button>
      </form>
      </div>
      <div className='login-nav'>
        <p onClick={props.showLogin}>Cancel</p>
      </div>
      
    </div>
  )
}
