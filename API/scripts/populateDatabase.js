import mongoose from 'mongoose';
import faker from 'faker';
import Specialist from '../models/specialistModel.js';
import City from '../models/cityModel.js';
import Specialty from '../models/specialtyModel.js';
import Customer from '../models/customerModel.js';

// Conexión a la base de datos
mongoose.connect('mongodb+srv://rodadev:polimero@cluster0.uzggi56.mongodb.net/', {
  useNewUrlParser: true,
});

// Datos ficticios
const cities = ['Bogota', 'Lima', 'Buenos Aires', 'Caracas', 'Mexico DF'];
const specialities = ['Cardiology', 'Dermatology', 'Ophthalmology', 'Neurology'];

// Función para generar datos ficticios
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Función para llenar la base de datos
const populateDatabase = async () => {
  try {
    // Crear ciudades
    const createdCities = await City.create(cities.map(name => ({ name })));

    // Crear especialidades
    const createdSpecialities = await Specialty.create(specialities.map(name => ({ name })));

    // Crear especialistas
    const specialistsData = Array.from({ length: 50 }, () => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      description: 'No hay nadie que ame el dolor mismo, que lo busque, lo encuentre y lo quiera, simplemente porque es el dolor',
      password: 'password123',
      phone: '123456789',
      cityId: getRandomElement(createdCities)._id,
      specialtyId: getRandomElement(createdSpecialities)._id,
    }));

    await Specialist.create(specialistsData);

    // Crear clientes
    const customersData = Array.from({ length: 50 }, () => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password123',
      phone: '123456789',
    }));

    await Customer.create(customersData);

    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    mongoose.connection.close();
  }
};

// Ejecutar la función de población
populateDatabase();
