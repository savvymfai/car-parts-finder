import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

type CarPart = {
  id: string;
  name: string;
  description: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyAbgkEx5-XXkStn7IMHLTyQKxY-9GwWzd4",
  authDomain: "car-parts-finder-88840.firebaseapp.com",
  projectId: "car-parts-finder-88840",
  storageBucket: "car-parts-finder-88840.appspot.com",
  messagingSenderId: "771209660481",
  appId: "1:771209660481:web:f3fa6bcd3f6bf008af1ec0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AddRemoveCarPartsPage: React.FC = () => {
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [newCarPart, setNewCarPart] = useState<CarPart>({ id: '', name: '', description: '' });
  type FirebaseUser = firebase.User | null;
  const [user, setUser] = useState<FirebaseUser>(null);

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
    
    const unsubscribe = firebase.auth().onAuthStateChanged((user: FirebaseUser) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    
    return () => {
      unsubscribe();
    }
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

  return (
    <div>
      {user ? (
        <>
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
          <ul>\n            {carParts.map((carPart) => (
              <li key={carPart.id}>
                <h2>{carPart.name}</h2>
                <p>{carPart.description}</p>
                <button onClick={() => handleRemoveCarPart(carPart.id)}>Remove Car Part</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>You must be logged in to access this page.</p>
      )}
    </div>
  );
};

export default AddRemoveCarPartsPage;
