const Campground = require('../models/campground')
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const campground = require('../models/campground');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(error => {
        console.log('Oh no an Error NO MONGO');
        console.log(error);
    })
const db = mongoose.connection
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 39)
        const camp = new Campground({
            author: '63ab240eb3c04e13dc8067d9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ratione amet hic. Dolor quasi doloribus, optio, quam blanditiis incidunt nostrum, delectus accusamus aliquid cumque earum magnam. Illo animi consectetur amet.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                url: 'https://res.cloudinary.com/diasx2emf/image/upload/v1672335887/YelpCamp/cqpwm5dj3cuaxbuwjied.jpg',
                filename: 'YelpCamp/cqpwm5dj3cuaxbuwjied'
                },
                {
                url: 'https://res.cloudinary.com/diasx2emf/image/upload/v1672335887/YelpCamp/tw5mqzvfy906rrm2jxjk.jpg',
                filename: 'YelpCamp/tw5mqzvfy906rrm2jxjk'
                },
                
            ]
        })
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close
})