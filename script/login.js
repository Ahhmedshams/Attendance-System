
let form = document.getElementsByTagName("form")[0];
let userName= document.getElementById("userName");
let password= document.getElementById("password");

async function checkUserAndPassword(){
   let userNameinput= userName.value;
   let passwordinput= password.value;
  let empData = await fetch(`http://localhost:3000/empData?userName=${userNameinput}&password=${passwordinput}`);
  let empObject = await empData.json();
     if(empObject.length){
      switch (empObject[0].role) {
        case "security":
          sessionStorage.setItem("security", JSON.stringify( {userName:userNameinput}));
          sessionStorage.setItem("employee", JSON.stringify( {userName:userNameinput}));
          location.assign(`http://127.0.0.1:5500/pages/attendence.html`)
          break;
        case "employee":
          sessionStorage.setItem("employee", JSON.stringify( {userName:userNameinput}));
          location.assign(`http://127.0.0.1:5500/pages/employee.html`)
          break;
          case "admin":
          sessionStorage.setItem("admin", JSON.stringify( {userName:userNameinput}));
          location.assign(`http://127.0.0.1:5500/pages/admin.html`)
          break;
        default:
          break;
      }
      
    }else{
        userName.classList.remove('is-valid');
        userName.classList.add('is-invalid');
        password.classList.remove('is-valid');
        password.classList.add('is-invalid');
    }
}



(function () {
    form.addEventListener(
        'submit',
        function (event) {
            event.preventDefault();
          if (
            !form.checkValidity() 
          ) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            checkUserAndPassword()
            
          }
        },
        false
      );
  })();