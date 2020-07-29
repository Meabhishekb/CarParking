const express = require('express');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 10, // limit each IP to 10 requests per windowMs
    message : "Too many request, Please try again later"
});

const app = express();

app.use(limiter);

let car_slot = {
    slot1 : null,
    slot2 : null
}
let recentlyVacantParkings = [];

app.get('/',(req,res)=>{
    res.send(car_slot)
})

app.get('/CarNo/:carNo',(req,res)=>{
    let parked = null;
    if(recentlyVacantParkings.length){
        car_slot[recentlyVacantParkings[0]] = req.params.carNo;
        parked = recentlyVacantParkings[0];
        recentlyVacantParkings.shift();
    }
    else{
        for(let slot in car_slot){
            if(car_slot[slot] == null){
                car_slot[slot] = req.params.carNo;
                parked = slot
                break;
            }
        }
    }
    if(parked == null){
        res.send("Parking Full")
    }
    res.send(parked)
})


app.get('/SlNo/:slotNo',(req,res) => {
    let slot = req.params.slotNo
    if(car_slot[slot] != null){
        car_slot[slot] = null;
        recentlyVacantParkings.push(slot)
    }
    res.send(slot + "empty for parking" + recentlyVacantParkings);
})

app.get('/Info/:info',(req,res)=>{
    let carDetailsArr = [];
    let info = req.params.info;
    if(car_slot[info] != null){ //To find with slot number
        carDetailsArr.push({
            CarNo : car_slot[info],
            parking : info
        })
    }
    else{ //find with car no
        let slot = Object.keys(car_slot).find(key => car_slot[key] === info)
        if(slot){
            carDetailsArr.push({
                carNo : info,
                parking : slot
            })
        }
    }
    if(carDetailsArr.length){
        res.send(carDetailsArr)
    }
    else{
        res.send({message: "No Record Found "})
    }

})

const PORT = process.env.PORT || 5000;
app.listen(PORT);