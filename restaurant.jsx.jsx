import React, { useState } from "react";
import "./App.css"; // Import the CSS file
import "./RestaurantReservation.css";
const App = () => {
  const [seatsLeft, setSeatsLeft] = useState(50); // Total seats available
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guestCount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if guest count exceeds available seats
    if (parseInt(formData.guestCount) > seatsLeft) {
      alert("Not enough seats available!");
      return;
    }

    // Check for duplicate names (optional)
    const isDuplicate = reservations.some(
      (res) => res.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (isDuplicate) {
      alert("A reservation with this name already exists!");
      return;
    }

    // Create new reservation
    const newReservation = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      guestCount: parseInt(formData.guestCount),
      checkInTime: new Date().toLocaleTimeString(),
      checkedOut: false,
    };

    // Update state
    setReservations([newReservation, ...reservations]);
    setSeatsLeft(seatsLeft - newReservation.guestCount);
    setFormData({ name: "", phone: "", guestCount: "" }); // Reset form
  };

  const handleCheckout = (id) => {
    const updatedReservations = reservations.map((res) => {
      if (res.id === id && !res.checkedOut) {
        setSeatsLeft(seatsLeft + res.guestCount); // Add seats back
        return { ...res, checkedOut: true, checkOutTime: new Date().toLocaleTimeString() };
      }
      return res;
    });
    setReservations(updatedReservations);
  };

  const handleDelete = (id) => {
    const reservationToDelete = reservations.find((res) => res.id === id);
    if (!reservationToDelete.checkedOut) {
      setSeatsLeft(seatsLeft + reservationToDelete.guestCount); // Add seats back if not checked out
    }
    const updatedReservations = reservations.filter((res) => res.id !== id);
    setReservations(updatedReservations);
  };

  return (
    <div className="app">
      <h1>Restaurant Reservation System</h1>
      <div className="seats-left">Seats Left: {seatsLeft}</div>

      <form onSubmit={handleSubmit} className="reservation-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="guestCount"
          placeholder="Number of Guests"
          value={formData.guestCount}
          onChange={handleInputChange}
          min="1"
          required
        />
        <button type="submit">Book Table</button>
      </form>

      <div className="reservations-table">
        <h2>Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Check-In Time</th>
              <th>Checkout Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.name}</td>
                <td>{res.phone}</td>
                <td>{res.checkInTime}</td>
                <td>
                  {res.checkedOut ? `Checked Out at ${res.checkOutTime}` : "Not Checked Out"}
                </td>
                <td>
                  {!res.checkedOut && (
                    <button onClick={() => handleCheckout(res.id)}>Click to Checkout</button>
                  )}
                  <button onClick={() => handleDelete(res.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;