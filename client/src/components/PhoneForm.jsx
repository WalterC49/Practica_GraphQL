import { useChangeNumber } from "../persons/custom-hooks";

export const PhoneForm = () => {
  const { inputs, handleChange, handleSubmit } = useChangeNumber();

  return (
    <div>
      <h2>Edit Phone Number</h2>
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
        <button>Change Phone</button>
      </form>
    </div>
  );
};
