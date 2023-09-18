/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useFindPerson } from "../persons/custom-hooks";

export const Persons = ({ persons }) => {
  if (persons === null) return null;

  const { person, clearPerson, showPerson } = useFindPerson();

  if (person) {
    return (
      <div>
        <h2>{person.name}</h2>
        <div>
          {person.address.street}, {person.address.city}
        </div>
        <div>{person.phone}</div>
        <button onClick={clearPerson}>Close</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.id} onClick={() => showPerson(p.name)}>
          {p.name} {p.phone}
        </div>
      ))}
    </div>
  );
};
