recentlyVacantParkings = [];
parkingSlot = objectLoop = process.env.PARKING_SIZE
parkingObj = {};

module.exports = (app) => { 
    app.get('/',(req,res)=>{
        res.send(parkingObj)
    })

    //Assuming All cars will have different car number so condition is not given
    app.get('/CarNo/:carNo',(req,res)=>{
        let parked = null;
        // if car parking is very big and we not want to go through every paking slot and see which one is free
        // rather using the parking slot vacant recently
        if(recentlyVacantParkings.length){
            parkingObj[recentlyVacantParkings[0]] = req.params.carNo;
            parked = recentlyVacantParkings[0];
            recentlyVacantParkings.shift();
            parkingSlot--;
        }
        else{  //if no parking slot is vacant recently
            //res.send(parkingSlot)
            let value = false;
            if(parkingSlot != 0){
                for(let i = 0; i < objectLoop; i++){
                    if(parkingObj[i] == undefined){
                        parkingSlot--;
                        parkingObj[i] = req.params.carNo;
                        parked = i;
                        break;
                    }
                }
            }
        }
        if(parked == null){
            res.send("Parking Full")
        }
        res.send({'Parked slot' : parked})
    })


    app.get('/SlNo/:slotNo',(req,res) => {
        let slot = req.params.slotNo
        if(parkingObj[slot] != undefined){ // Vacating the parking space
            parkingObj[slot] = undefined;
            parkingSlot++;
            recentlyVacantParkings.push(slot)
        }
        res.send(slot + "empty for parking" + recentlyVacantParkings);
    })

    app.get('/Info/:info',(req,res)=>{
        let carDetailsArr = [];
        let info = req.params.info;
        if(parkingObj[info] != null){ //To find with slot number
            carDetailsArr.push({
                CarNo : parkingObj[info],
                parking : info
            })
        }
        else{ //find with car no
            let slot = Object.keys(parkingObj).find(key => parkingObj[key] === info)
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
}