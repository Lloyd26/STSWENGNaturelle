const {ObjectId} = require('mongodb');
const Reservation  = require('../models/Reservation');
const controller  = require('../controllers/controller.js');
const Notification  = require('../models/Notification');
const adminController = require('../controllers/admin-controller.js');
const authController = require('../controllers/auth-controller.js');
//const employeeController = require('../controllers/employee-controller.js');
const User = require('../models/User');


//import {res} as adminReservations from '../public/js/admin-reservations.js';
//Test if website renders (may need to open website first)
test('Salon website renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/');
    const body = await response.text();
    expect(response.status).toBe(200);

  });


// RESERVATION-RELATED TESTS
jest.mock('../models/Reservation',() => ({
  updateOne: jest.fn().mockResolvedValue({nModified: 1}),
  create: jest.fn().mockResolvedValue('mock reservation'),
  findOne: jest.fn()
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


//test postreserve
describe("Creating reservations", () => {
  it("should create a reservation", async   () => {
    const req = {
      body: {
        services: [
          {
            serviceTitle: "Haircut",
            preferredEmployee: "Juan",
            details: "None"
          }
        ],
        date: "2025-01-01"
      },
      session: {
        logged_in: {
          user: {
            userID: '5f8614a2f796ac1c7e62af94' // random id
          }
        }
      }
    };

    const res = {
      redirect: jest.fn()
    };

    await authController.postReserve(req, res);
    expect(Reservation.create).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith("/reserve");


  });
});


//NOTIFICATION-RELATED TESTS
jest.mock('../models/Notification',() => ({
  updateOne: jest.fn().mockResolvedValue({nModified: 1}),
  create: jest.fn().mockResolvedValue('mock notification'),
  findOne: jest.fn().mockResolvedValue('mock notification'),
  find: jest.fn().mockReturnValue(['mock notification 1', 'mock notification 2', 'mock notification 3'])
}));


// testing the find notification function
describe("Find a notification", () => {
  it("should find a notification", async   () => {
    const req = {
      query: {
        id: '614cb3fbb49ae3f9602cb5bc' // random id
      }
    };
    
    const res = { 
      send: jest.fn()
    };

    await controller.findNotification(req, res);
    expect(Notification.findOne).toHaveBeenCalledWith({_id: req.query.id});
    expect(Notification.updateOne).toHaveBeenCalledWith({_id: req.query.id}, {isRead: "true"});
    expect(res.send).toHaveBeenCalledWith('mock notification');

   });

});


// testing getting all notifications
describe("Get all notifications", () => {
  it("should get all notifications", async   () => {
    //creation of a mock user session
    const req = {
      session: {
        logged_in: {
          user: {
            userID: '5f8614a2f796ac1c7e62af94' // random id
          },
          type: "customer"
        }
      }
    };
    
    const res = { 
      send: jest.fn()
    };

    await controller.getNotifications(req, res);
    expect(Notification.find).toHaveBeenCalledWith({receiver: req.session.logged_in.user.userID});
    expect(res.send).toHaveBeenCalledWith(['mock notification 3', 'mock notification 2', 'mock notification 1']);

   });

});

//test get all notifications (no user session)
describe("Get all notifications without user session", () => {
  it("should redirect to login", async   () => {
    const req = {
      session: {
        logged_in: null
      }
    };
    
    const res = { 
      redirect: jest.fn()
    };

    await controller.getNotifications(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/login?next=" + encodeURIComponent("/reservation"));

   });

});

//test get all notifications (not a customer)
describe("Get all notifications but not a customer", () => {
  it("should redirect to login", async   () => {
    const req = {
      session: {
        logged_in: {
          type: "employee"
        }
      }
    };
    
    const res = { 
      redirect: jest.fn()
    };

    await controller.getNotifications(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/login?next=" + encodeURIComponent("/reservation"));

   });

});

// ADMIN-RELATED TESTS

//test postupdatereservationstatus
describe("Update reservation status", () => {
  it("should update reservation status", async   () => {
    const req = {
      session: {
        logged_in: {
          user: {
            userID: '5f8614a2f796ac1c7e62af94' // random id
          },
          type: "admin"
        },
      },
      body: {
        reservation_id: '614cb3fbb49ae3f9602cb5bc', // random id
        status: "Cancelled"
      }
    };
    
    const res = { 
      sendStatus: jest.fn()
    };

    await adminController.postUpdateReservationStatus(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(200);

   });

});

//test postupdatereservationstatus (not an admin)
describe("Update reservation status but not an admin", () => {
  it("should give a 403", async   () => {
    const req = {
      session: {
        logged_in: {
          user: {
            userID: '5f8614a2f796ac1c7e62af94' // random id
          },
          type: "customer"
        },
      },
      body: {
        reservation_id: '614cb3fbb49ae3f9602cb5bc', // random id
        status: "Cancelled"
      }
    };
    
    const res = { 
      status: jest.fn()
    };

    await adminController.postUpdateReservationStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(403);

   });

});

// i cant import the function from admin-reservations.js so i cant test it rn
// // test resetModalServices
// describe("Reset modal services", () => {
//   it("should reset modal services", async   () => {
//     const res = { 
//       innerHTML: "not null"
//     };

//     adminReservations.resetModalServices();
//     expect(res.innerHTML).toBe("");

//    });

// });


//test getservicesofreservation
describe("Get services of reservation", () => {
  it("should get services of reservation", async   () => {


    const mockReservation = {
      _id: '614cb3fbb49ae3f9602cb5bc',
      services: [
        {
          serviceTitle: "Haircut",
          preferredEmployee: "Juan",
          details: "None"
        }
      ]
    };
    const req = {
      query: {
        reservation_id: '614cb3fbb49ae3f9602cb5bc' // random id
      }  
    };

    // Reservation.findOne.mockImplementation(() => ({
    //   populate: jest.fn().mockResolvedValue(req.services)
    // }));
    jest.spyOn(Reservation, 'findOne').mockReturnThis()
      .mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReservation),
      });

    const res = { 
      send: jest.fn()
    };

    await adminController.getServicesOfReservation(req, res);
    expect(Reservation.findOne).toHaveBeenCalledWith({_id: req.query.reservation_id},'services');
    expect(res.send).toHaveBeenCalledWith(mockReservation);

   });

});


// ACCOUNT MANAGEMENT TESTS


//mock user model and bcrypt functions
jest.mock('../models/User',() => ({
  updateOne: jest.fn().mockResolvedValue({nModified: 1}),
  findOne: jest.fn().mockResolvedValue('mock user'),
  create: jest.fn().mockResolvedValue('mock user')
}));

jest.mock('bcrypt',() => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashedPassword')
}));

//test postlogin
describe("Login Functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
 });
  it("should redirect to home", async   () => {
    const req = {
      body: {
        email: 'testEmail@gmail.com',
        password: 'password'
      },
      session: {
        logged_in: null
      },
      query: {
        next: "/"
      }
    };

    const res = { 
      redirect: jest.fn()
    };


    await authController.postLogin(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/");
    expect(req.session.logged_in).not.toBe(null);
    expect(req.session.logged_in.user).not.toBe(null);
  });

  it("should not redirect or log in", async   () => {
    const req = {
      body: {
        email: 'testEmail@gmail.com',
        password: 'password'
      },
      session: {
        logged_in: null
      },
      query: {
        next: "/"
      }
    };

    const res = {
      redirect: jest.fn(),
      render: jest.fn()
    };

    //mock the findOne function to return null
    User.findOne.mockImplementation(() => null);

    await authController.postLogin(req, res);
    expect(res.redirect).not.toHaveBeenCalledWith("/");
    expect(req.session.logged_in).toBe(null);

    

  });
});

//change password functionality test here (it doesnt exist yet)