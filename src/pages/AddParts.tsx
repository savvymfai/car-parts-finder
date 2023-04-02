import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import type { User } from 'firebase/auth';

interface CarPart {
  id: string;
  name: string;
  description: string;
}

const AddRemoveCarPartsPage: React.FC = () => {
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [newCarPart, setNewCarPart] = useState<CarPart>({ id: '', name: '', description: '' });
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchCarParts = async () => {
      const db = firebase.database();
      const carPartsRef = db.ref('carParts');
      const carPartsSnapshot = await carPartsRef.once('value');
      const carPartsVal = carPartsSnapshot.val() || {};
      const carPartsArray = Object.entries(carPartsVal).map(([id, carPart]) => ({ id, ...carPart }));
      setCarParts(carPartsArray);
    };
    fetchCarParts();

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewCarPart((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddCarPart = async () => {
    const db = firebase.database();
    const carPartsRef = db.ref('carParts');
    const newCarPartRef = carPartsRef.push();
    await newCarPartRef.set(newCarPart);
    setCarParts((prevState) => [...prevState, { ...newCarPart, id: newCarPartRef.key! }]);
    setNewCarPart({ id: '', name: '', description: '' });
  };

  const handleRemoveCarPart = async (carPartId: string) => {
    const db = firebase.database();
    const carPartRef = db.ref(`carParts/${carPartId}`);
    await carPartRef.remove();
    setCarParts((prevState) => prevState.filter((carPart) => carPart.id !== carPartId));
  };

  if (!user) {
    return <p>You must be logged in to access this page.</p>;
  }

  return (
    <div>
      <h1>Add/Remove Car Parts</h1>
      <form onSubmit={(event) => { event.preventDefault(); handleAddCarPart(); }}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={newCarPart.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={newCarPart.description} onChange={handleInputChange} />
        </div>
        <button type="submit">Add Car Part</button>
      </form>
      <ul>
        {carParts.map((carPart) => (
          <li key={carPart.id}>
            <h2>{carPart.name}</h2>
            <p>{carPart.description}</p>
            <button onClick={() => handleRemoveCarPart(carPart.id)}>Remove Car Part</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddRemoveCarPartsPage;
