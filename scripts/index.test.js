const {ObjectId} = require('mongodb');
const Reservation  = require('../models/Reservation');
const controller  = require('../controllers/controller.js');

//Test if website renders (may need to open website first)
test('Salon website renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/');
    const body = await response.text();
    expect(response.status).toBe(200);

  });


// RESERVATION-RELATED TESTS
jest.mock('../models/Reservation',() => ({
  updateOne: jest.fn().mockResolvedValue({nModified: 1}),
  create: jest.fn().mockResolvedValue('mock reservation')
}));

// testing the cancel reservation function
describe("Cancel a reservation", () => {
  it("Update status to cancelled", async   () => {

    const req = {
      body: {
        reservation_id: '614cb3fbb49ae3f9602cb5bc' // random id
      }
    };
    
    const res = { 
      sendStatus: jest.fn()
    };

    await controller.postCancelReservation(req, res);
    expect(Reservation.updateOne).toHaveBeenCalledWith({_id: req.body.reservation_id}, {status: "Cancelled"});
    expect(res.sendStatus).toHaveBeenCalledWith(200);

   });

});

// testing the creation of a reservation
describe("Make a reservation", () => {
  it("should successfully create a reservation", async   () => {
    let userid_obj = new ObjectId("5f8614a2f796ac1c7e62af94");//random test id
    const testReservation = {

      userID: userid_obj,
      timestamp: "2025-01-01",
      services: [{
        serviceTitle: "Haircut",
        preferredEmployee: "Juan",
        details: "None"
      }],
      status: "Pending"
    };

    const savedReservation = await Reservation.create(testReservation);
    expect(savedReservation).toBe('mock reservation');
    expect(Reservation.create).toHaveBeenCalledWith(testReservation);

   });

});


