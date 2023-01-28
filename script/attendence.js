import { formatDate,getTime , checkExecuse ,attendStatus  } from "./main.js";
//______________________________Authentication______________________________//
let authentication =JSON.parse(sessionStorage.getItem("security"));
if(authentication==null){
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Violation of User Agreement",
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        location.assign(`http://127.0.0.1:5500/home.html`)
      })
    
}
//______________________________Get All UserName______________________________//
let userNames=[];
(async function storeUserName(){
  let allEmpData = await fetch(`http://localhost:3000/empData`);
  let allEmpDataobjects = await allEmpData.json();
  allEmpDataobjects.forEach(element => {
    userNames.push(element.userName);
  });
})();
//______________________________Start working Day ______________________________//
(async function checkStartState(){
  fetch('http://localhost:3000/workingDay')
  .then((response) => response.json())
  .then((data) => {
    if(data.length){
      if(data[data.length-1].id==formatDate(new Date())){
        //The Day Allredy Exist
        $("#startBtn").hide()
        $("#submitButton").show()
      }else{
        $("#startBtn").show()
        $("#submitButton").hide()
      }
    } 
  })//end Of then
}
)()

//______________________________Variable______________________________//
let submitButton= document.getElementById("submitButton");
let input=document.getElementById("attendInput");
let startButton= document.getElementById("startBtn");
submitButton.addEventListener("click",addAttend)
startButton.addEventListener("click",startNewDay)

async function startNewDay(e){
  e.preventDefault()
  fetch('http://localhost:3000/workingDay')
  .then((response) => response.json())
  .then((data) => {
    if(data.length){
            if(data[data.length-1].id!=formatDate(new Date())){
              //The Day Allredy Exist
              absentFun()
            }
    }else{
          absentFun()
    }
    
  })//end Of then

}

//______________________________Handel Absent______________________________//
async function absentFun(){
  let userData= await fetch(`http://localhost:3000/attendence`);
  let userDataObject= await userData.json();
  for (let i = 0; i < userDataObject.length; i++) {
    //Add Absent to all data
    userDataObject[i].absInfo.push(formatDate(new Date()));
    userDataObject[i].absent++;
  }
  for (let i = 0; i < userDataObject.length; i++) {
    
    await fetch(`http://localhost:3000/attendence/${userDataObject[i].id}`,{ method: "PATCH",
    body: JSON.stringify({
      absInfo:userDataObject[i].absInfo,
      absent:userDataObject[i].absent
    }),         
    headers: {"Content-type": "application/json; charset=UTF-8"} })
  }
  fetch(`http://localhost:3000/workingDay`,{ method: "POST",
    body: JSON.stringify( {id:formatDate(new Date()) }   ),         
    headers: {"Content-type": "application/json; charset=UTF-8"} })
}


//***************************************************************************** */
//                                Attendence                                    */
//***************************************************************************** */

//Event
function addAttend(e){
     e.preventDefault()
     let today = new Date();
     let inputValue=input.value;
    for (let i = 0; i < userNames.length; i++) {
        if(userNames[i]==inputValue){
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            checkAttend(inputValue,today)
            break;
        }else{
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }   
    }
}

//Main Function 
async function checkAttend(userName,date){
    let userData= await fetch(`http://localhost:3000/Attendence?userName=${userName}`);
    let userDataObject= await userData.json();
    let lastIndexOfArray =userDataObject[0].attendInfo[userDataObject[0].attendInfo.length-1]; //Use it to check the orign Data
    let updatedattendInfo=userDataObject[0].attendInfo; //Use it to push New Data Old Data + New Data 
        if(lastIndexOfArray.date==formatDate(date)){
            if(lastIndexOfArray.out){
                 Swal.fire("He's already  register departure")
            }else{
                  let currentExcuse=userDataObject[0].excuse;
                  if(checkExecuse(date)){
                    currentExcuse++;
                    lastIndexOfArray.exStatus=true;
                  }else{
                    lastIndexOfArray.exStatus=false;
                  }
                  lastIndexOfArray.out=getTime(date)
                  updatedattendInfo[updatedattendInfo.length-1]=lastIndexOfArray
                  fetch(`http://localhost:3000/Attendence/${userName}`,{ method: "PATCH",
                  body: JSON.stringify({
                  attendInfo:updatedattendInfo,
                  excuse:currentExcuse}),headers: {"Content-type": "application/json; charset=UTF-8"} })//End of Fetch 
                  ///////
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Register Departure Successfully',
                    showConfirmButton: false,
                    timer: 1500
                  })
            }
        }else{
            let lateValue=userDataObject[0].late
            let attendValue=userDataObject[0].attend;
            attendValue++;
            let absentValue=userDataObject[0].absent;
                if(absentValue!=0){
                  absentValue--;
                }
            let newAbsInfo = userDataObject[0].absInfo.slice(0, -1)
            let currentStatus =attendStatus(date);
            if(currentStatus=="Late")
            {
              lateValue++;
            }
            let attendobject= {arrive:`${getTime(date)}`,date:`${formatDate(date)}`,status:`${currentStatus}`}
            updatedattendInfo.push(attendobject)
              fetch(`http://localhost:3000/Attendence/${userName}`,{ method: "PATCH",
              body: JSON.stringify({
                  late:lateValue,
                  absent:absentValue,
                  attend:attendValue,
                  attendInfo:updatedattendInfo,
                  absInfo:newAbsInfo
              }),
              headers: {"Content-type": "application/json; charset=UTF-8"} })
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Register Attend Successfully',
                showConfirmButton: false,
                timer: 1500
              })
        }
}


//______________________________Log Out ______________________________//
$("#logOut").click(e=>{
  window.sessionStorage.removeItem("employee");
  window.sessionStorage.removeItem("security");
  location.href ="http://127.0.0.1:5500/home.html";
})
