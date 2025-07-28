import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import adminRoutes from './routes/admin.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express(); 
const prisma = new PrismaClient(); 

const JWT_SECRET = process.env.JWT_SECRET || "abcd1234";


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

// Register Route
// ... existing code ...
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, age, password, driverLicense, gender } = req.body;

  try {
      // Validate required fields
      if (!firstName || !lastName || !email || !password || !driverLicense || !gender) {
          return res.status(400).json({ 
              message: 'All fields are required',
              missing: {
                  firstName: !firstName,
                  lastName: !lastName,
                  email: !email,
                  password: !password,
                  driverLicense: !driverLicense,
                  gender: !gender
              }
          });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate password length
      if (password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
          data: { 
              firstName, 
              lastName, 
              email, 
              password: hashedPassword, 
              driverLicense, 
              gender,
          },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ 
          message: 'User registered successfully', 
          user: userWithoutPassword 
      });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
          message: 'Internal Server Error',
          error: error.message 
      });
  }
});
// ... existing code ...

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Protected Routes
app.get('/protected/share', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You can access this route!' });
});

//store trips data
app.post('/create-trip', authenticateToken, async (req, res) => {
    const { from, to, departureDate, departureTime, spots, price, message } = req.body;

    try {
        // Validate required fields
        if (!from || !to || !departureDate || !departureTime || !spots) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: { from, to, departureDate, departureTime, spots }
            });
        }

        // Validate spots is a positive number
        const spotsNum = parseInt(spots);
        if (isNaN(spotsNum) || spotsNum <= 0) {
            return res.status(400).json({ message: 'Spots must be a positive number' });
        }

        // Validate price
        const priceNum = parseFloat(price) || 0;
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ message: 'Price must be a non-negative number' });
        }

        // Create the departure datetime
        const departureDatetime = new Date('${departureDate}T${departureTime}');
        if (isNaN(departureDatetime.getTime())) {
            return res.status(400).json({ message: 'Invalid date or time format' });
        }

        const trip = await prisma.share.create({
            data: {
                driverId: req.user.id,
                origin: from,
                destination: to,
                departureTime: departureDatetime,
                spots: spotsNum,
                price: priceNum,
                message: message || null,
            },
        });

        res.status(201).json({ message: 'Trip created successfully', trip });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

// Search Rides Route
app.get('/search-rides', authenticateToken, async (req, res) => {
    const { from, to, date } = req.query;

    try {
        const rides = await prisma.share.findMany({
            where: {
                origin: { contains: from, mode: 'insensitive' },
                destination: { contains: to, mode: 'insensitive' },
                departureTime: {
                    gte: new Date(date), // Match rides on or after the given date
                    lte: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Match rides from 2025-04-20 00:00:00  →  2025-04-20 23:59:59

                },
                spots: { gt: 0 }, // Ensure there are available spots
            },
            include: {
                driver: {
                    select: { firstName: true, lastName: true }, // Include driver's name
                },
            },
        });

        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Request Ride Route
app.post('/request-ride', authenticateToken, async (req, res) => {
    const { shareId, message } = req.body;

    try {
        // Check if spots are available
        const ride = await prisma.share.findUnique({ where: { id: shareId } });
        if (!ride || ride.spots <= 0) {
            return res.status(400).json({ message: 'No spots available for this ride' });
        }

        // Create a new request
        const newRequest = await prisma.request.create({
            data: {
                shareId,
                userId: req.user.id, // User ID from the JWT
                message: message || null,
            },
        });

        res.status(201).json({ message: 'Request raised successfully', request: newRequest });
    } catch (error) {
        console.error('Error raising ride request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get driving trips
app.get('/trips/driving', authenticateToken, async (req, res) => {
    try {
      const trips = await prisma.share.findMany({
        where: { driverId: req.user.id },
        include: {
          requests: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      });
  
      res.status(200).json(trips);
    } catch (error) {
      console.error('Error fetching driving trips:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Get riding trips (where user is a passenger)
  app.get('/trips/riding', authenticateToken, async (req, res) => {
    try {
      const requests = await prisma.request.findMany({
        where: { 
          userId: req.user.id 
        },
        include: {
          share: {
            include: {
              driver: {
                select: { 
                  firstName: true, 
                  lastName: true 
                }
              }
            }
          }
        }
      });
  
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching riding trips:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Update request status
  app.patch('/requests/:requestId/status', authenticateToken, async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    try {
      // Verify the user is the driver of the trip
      const request = await prisma.request.findUnique({
        where: { id: parseInt(requestId) },
        include: { share: true }
      });

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.share.driverId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this request' });
      }

      const updatedRequest = await prisma.request.update({
        where: { id: parseInt(requestId) },
        data: { status }
      });

      // If request is approved, decrease available spots
      if (status === 'APPROVED') {
        await prisma.share.update({
          where: { id: request.shareId },
          data: { spots: { decrement: 1 } }
        });
      }

      res.json(updatedRequest);
    } catch (error) {
      console.error('Error updating request status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Admin routes
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));