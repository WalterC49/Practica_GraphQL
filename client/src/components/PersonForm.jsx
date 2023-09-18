/* eslint-disable react/prop-types */
import { useCreatePerson } from "../persons/custom-hooks";

export const PersonForm = ({ notifyError }) => {
  const { inputs, handleSubmit, handleChange } = useCreatePerson({
    notifyError,
  });

  return (
    <div>
      <h2>Create new Person</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            placeholder="name"
            value={inputs.name}
            name="name"
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            placeholder="phone"
            value={inputs.phone}
            name="phone"
            onChange={handleChange}
          />
        </label>
        <label>
          Street:
          <input
            placeholder="street"
            value={inputs.street}
            name="street"
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            placeholder="city"
            value={inputs.city}
            name="city"
            onChange={handleChange}
          />
        </label>
        <button>Add Person</button>
      </form>
    </div>
  );
};
