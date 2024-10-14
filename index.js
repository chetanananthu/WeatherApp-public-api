const express=require('express');
const axios=require('axios');
const mongoose=require('mongoose');

//Create Express app
const app=express();
const PORT=3000;

mongoose.connect('mongodb://127.0.0.1:27017/mydb', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('Connected to MongoDB'))
    .catch(err=>console.error('Could not connect to MongoDB',err));

    const whetherSchema=new mongoose.Schema({
        temp:String,
        feels_like:String,
        temp_min:String,
        temp_max:String,
        pressure:String,
        humidity:String,
        sea_level:String,
        grnd_level:String
    });

    // end-point to check localhost:3000/save-wheather?city=hyderabad
    //Create a Mongoose model
    const Wheather=mongoose.model('Wheather',whetherSchema);

    app.get('/save-wheather',async(req,res)=>{
        try{
            const apiKey='5e57406c3e0bdb9b3839ae8d48e39ebe';
            const city=req.query.city; //inorder to get the city from query parameter

            if(!city){
                return res.status(400).json({error:'Please provide a city name'});
            }

            const wheatherUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            
            const response=await axios.get(wheatherUrl);

            const wheatherData=response.data;

            const newWheather=new Wheather({
                temp:wheatherData.main.temp,
                feels_like:wheatherData.main.feels_like,
                temp_min:wheatherData.main.temp_min,
                temp_max:wheatherData.main.temp_max,
                pressure:wheatherData.main.pressure,
                humidity:wheatherData.main.humidity,
                sea_level:wheatherData.main.sea_level,
                grnd_level:wheatherData.main.grnd_level
            });
            await newWheather.save();

            res.json({
                message:'Wheather data saved successfully',
                wheatherData:newWheather
            });
        }
        catch(error){
            console.error('Error fetching wheather data:', error);
            res.status(500).json({error:'Internal server error'});
        }
    });

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });

