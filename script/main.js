let userNames=[];
let emailArray =[];
(async function verifyStorage(){
  let allEmpData = await fetch(`http://localhost:3000/empData`);
  let allEmpDataobjects = await allEmpData.json();
  let pendingData = await fetch(`http://localhost:3000/pending`);
  let pendingDataobjects = await pendingData.json();
  allEmpDataobjects.forEach(element => {
    emailArray.push(element.email);
    userNames.push(element.userName);
  });
  pendingDataobjects.forEach(element => {
    emailArray.push(element.email);
    userNames.push(element.userName);
  });
})();
  /// Function fo  generate username and password

 export function generateRandomUsername(name) {
    let chars ="0123456789!@-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let usernameLength = 3;
    let username = name;
    for (let i = 0; i <= usernameLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      username += chars.substring(randomNumber, randomNumber + 1);
    }
      for (let i = 0; i < userNames.length; i++) {
        if(username==userNames[i]){
          return username=generateRandomUsername(name);
        }
      }
    return username;
  }
  
  export function generateRandomPassword() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 12;
    let password = "";
    for (let i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

export function IsNameValid(name){
    const NamePattern =/^[a-zA-Z,.'-]{3,15}$/;
    return name.match(NamePattern);
}
export function IsAddValid(name){
    const Pattern =/^[#.0-9a-zA-Z\s,-]{5,55}$/;
    return name.match(Pattern);
}
export function IsEmailValid(name)
{
    const Pattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return name.match(Pattern);
}
export function getStartIndex(date,array){

  for (let i = 0; i < array.length; i++) {
      
      if(array[i].date==date){
          return i;
      }
  }
  return 0 ;
}
export function getEndIndex(date,array){

  for (let i = 0; i < array.length; i++) {
      
      if(array[i].date==date){
          return i;
      }
  }
  return array.length ;
}


//-----------------------------///
export function removeActive(){
  $(".tab-pane").each(function(index,element){
      element.classList.remove("active")
  })
  $(".active").each(function(index,element){
      element.classList.remove("active")
  })
} 


export function formatDate(date) {
  return  date.getDate()+ "-" +  (date.getMonth()+1) + "-" + date.getFullYear();
}
export async function ChangeWelcome (empUserName,name) {
  let empData= await fetch(`http://localhost:3000/empData?userName=${empUserName}`);
  let empDataObjects= await empData.json();
  name.innerText=`Welcome ${empDataObjects[0].firstName}`
}
export  function getTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return  strTime;
}

export function checkExecuse(date)
{                                                       
    if(new Date("2022-09-20T12:00:00.000").getHours()-date.getHours()> 0){
      return true;
      
    }   
    else 
    return false;
}

export function attendStatus(date) {
    if (date.getHours() - new Date("2022-09-20T09:00:00.000").getHours() >= 0) {
      return "Late";
    } else if (
      date.getHours() - new Date("2022-09-20T09:00:00.000").getHours() ==
      0
    ) {
      if (
        date.getMinutes() - new Date("2022-09-20T09:00:00.000").getMinutes() >
        15
      ) {
        return "Late";
      }
    } else return "On Time";
  }