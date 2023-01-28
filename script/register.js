import { Employee } from "./employeeClass.js";
import { generateRandomUsername,generateRandomPassword , IsNameValid ,IsAddValid ,IsEmailValid } from "./main.js";


let emailArray =[];
let userNames=[];
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

    let form = document.querySelectorAll('.needs-validation')[0];
    let firstname= document.getElementById("firstname");
    let lastname= document.getElementById("lastname");
    let address= document.getElementById("address");
    let email= document.getElementById("email");
    //let role=document.getElementById("jop");
    let email_validation= document.getElementById("emailExist");
    let email_validation2= document.getElementById("emailNotValid")
    
    //event 
    firstname.addEventListener("blur",checkfName);
    lastname.addEventListener("blur",checklName);
    address.addEventListener("blur",checkAddress);
    email.addEventListener("blur",checkEmail);
    

function checkfName(e){
    if (!IsNameValid(firstname.value)) {
        firstname.classList.remove('is-valid');
        firstname.classList.add('is-invalid');
        return false;
      } else {
        firstname.classList.remove('is-invalid');
        firstname.classList.add('is-valid');
        return true;
      }
}
function checklName(e){
    if (!IsNameValid(lastname.value.trim())) {
        lastname.classList.remove('is-valid');
        lastname.classList.add('is-invalid');
        return false;
      } else {
        lastname.classList.remove('is-invalid');
        lastname.classList.add('is-valid');
        return true;
      }
}
function checkAddress(e){
    if (!IsAddValid(address.value)) {
        address.classList.remove('is-valid');
        address.classList.add('is-invalid');
        return false;
      } else {
        address.classList.remove('is-invalid');
        address.classList.add('is-valid');
        return true;
      }
}


///
function checkEmail(e){
    if (!IsEmailValid(email.value)) {
        
        email.classList.remove('is-valid');
        email.classList.add('is-invalid');
        email_validation.classList.add('d-none');
        email_validation2.classList.remove('d-none');
        return false;
      } else {
        for (let i = 0; i < emailArray.length; i++) {
          if(email.value==emailArray[i]){
            console.log(email_validation)
            email_validation.classList.remove('d-none');
            email_validation2.classList.add('d-none');
            email.classList.remove('is-valid');
            email.classList.add('is-invalid');
            return false;
          }
        }
        email_validation.classList.add('d-none');
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
        return true;
      }
    
}





//-----------Send Data-----//
function sendData(){
  let newEmp = new Employee(
    firstname.value,
    lastname.value,
    address.value.trim(),
    email.value,
    age.value,
    generateRandomUsername(firstname.value),
    generateRandomPassword(),
    // role.value,
  )
  newEmp.save()
  
}



//************************************************** */
(function () {
    form.addEventListener(
        'submit',
        
        function (event) {
          event.preventDefault();
          if (
            !form.checkValidity() ||
            !checkfName() ||
            !checklName() ||
            !checkAddress()||
            !checkEmail() 
          ) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            sendData();
            form.classList.add('was-validated');
            
            location.href ="http://127.0.0.1:5500/pages/confirm.html";
           
          }
        },
        false
      );
    
  })();


