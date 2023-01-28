import { formatDate , removeActive } from "./main.js";

//______________________________Authentication______________________________//
let authentication =JSON.parse(sessionStorage.getItem("admin"));
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
$("#dateContiner").hide() 

let tabsContent=document.getElementsByClassName("tab-pane");
let pendtingBtn=document.getElementById("requests-tab");
let allEmpBtn=document.getElementById("allEmp-tab");
let todayBtn=document.getElementById("today-tab");
let allDataBtn=document.getElementById("allData-tab");
let rangeBtn=document.getElementById("range-tab");
allEmpBtn.addEventListener("click",showALLEmp);
pendtingBtn.addEventListener("click",showPending);
todayBtn.addEventListener("click",showTodayReport)
allDataBtn.addEventListener("click",showAllDataReport);
rangeBtn.addEventListener("click",showRangeReport);
//***************************************************************************** */
//                               Pending Table                                  */
//***************************************************************************** */
//______________________________Show Pending Table______________________________//
function showPending(e){
    removeActive();
    this.classList.add("active")
    tabsContent[0].classList.add("active")
    $("#dateContiner").hide() 

}
//______________________________Add Pending Data______________________________//
(async function addPending(){
    
    let allPending= await fetch(`http://localhost:3000/pending`);
    let allPendingObjects= await allPending.json();
    $("#pendingRows").html("");
    for (let i = 0; i < allPendingObjects.length; i++) {
        let row = document.createElement("tr");
        let confirm = document.createElement("td");
        confirm.innerHTML='<i class="fa-solid fa-circle-check fs-2 mailIcon send"  ></i>'
        confirm.children[0].addEventListener("click",sendMail);
        let ignore = document.createElement("td");
        ignore.innerHTML='<i class="fa-solid fa-circle-xmark  fs-2 delete"></i>'
        ignore.children[0].addEventListener("click",deleteRequest);
        $(row).append("<td>"+allPendingObjects[i].firstName+" "+allPendingObjects[i].lastName+"</td>");
        $(row).append("<td>"+allPendingObjects[i].address+"</td>");
        $(row).append("<td>"+allPendingObjects[i].email+"</td>");
        $(row).append("<td>"+allPendingObjects[i].age+"</td>");
        $(row).append("<td>"+`
        <select name="Country" id="jop" class="form-select w-auto m-auto " aria-label="Default select example" required>
            <option value="" selected Display hidden></option>
            <option value="security">Security</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
        </select>`+"</td>");
        $(row).append(confirm)
        $(row).append(ignore)
        $("#pendingRows").append(row)
    }
    $('#pendingTable').DataTable({
        responsive: true,
        autoWidth: false,
        
    });
})();
//***************************************************************************** */
//                               Send Email                                    */
//***************************************************************************** */
async function sendMail(e){
    let userEmail=e.target.parentElement.parentElement.children[2].innerHTML;
    let roleValue=e.target.parentElement.previousSibling.children[0].value;
    if(roleValue.length==0)
    {
        Swal.fire({
            title: 'You Have To choose Role First?',
            icon: 'error',
            confirmButtonColor: '#901b20',
          })

        return;
    }
    let userData= await fetch(`http://localhost:3000/pending?email=${userEmail}`);
    let userDataObject= await userData.json();
    userDataObject[0].role=roleValue;
    
    emailjs.send("default_service", "template_uyf499f", {
        to_name: `${userDataObject[0].firstName}`,
        message: `Username: ${userDataObject[0].userName}`,
        massage2: `Password: ${userDataObject[0].password}`,
        email_id: userDataObject[0].email,
        subject: "ITI Login Information",
        }).then(()=>{
            fetch(`http://localhost:3000/pending/${userDataObject[0].id}`, {method: 'DELETE',})


            fetch(`http://localhost:3000/empData`,{ method: "POST",
                body: JSON.stringify(userDataObject[0]),         
                headers: {"Content-type": "application/json; charset=UTF-8"} });//end of post EmpData

                if(userDataObject[0].role!=="admin"){
                    fetch(`http://localhost:3000/attendence`,{ method: "POST",
                        body: JSON.stringify({
                            id:userDataObject[0].userName,
                            userName:userDataObject[0].userName,
                            startDate:formatDate(new Date()),
                            attend: 0,
                            absent: 0,
                            late:0,
                            excuse:0,
                            attendInfo: [{date: ""}],
                            absInfo:[]
                        }),         
                        headers: {"Content-type": "application/json; charset=UTF-8"} });//end Of Fetch
                }//end of if role Not Admin

        })
    
}

//***************************************************************************** */
//                               Ignore Request                                  */
//***************************************************************************** */
async function deleteRequest(e){
    let userName=e.target.parentElement.parentElement.children[2].innerHTML;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#808080',
        cancelButtonColor: '#901b20',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            deletePending(userName)
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })  
}
async function deletePending(userName){
        let userData= await fetch(`http://localhost:3000/pending?email=${userName}`);
        let userDataObject= await userData.json();
        fetch(`http://localhost:3000/pending/${userDataObject[0].id}`, {method: 'DELETE',})
}
//***************************************************************************** */
//                            All Employees Table                               */
//***************************************************************************** */
//___________________________Show  All Employees Table___________________________//
function showALLEmp(e){
    $("#dateContiner").hide() 
    removeActive();
    this.classList.add("active")
    tabsContent[1].classList.add("active")
    // addAllEmp()
}
//________________________________________________________________________________//
(async function addAllEmp(){
    
    let allEmp= await fetch(`http://localhost:3000/empData`);
    let allEmpObjects= await allEmp.json();
    let allattendence= await fetch(`http://localhost:3000/attendence`);
    let allattendenceObjects= await allattendence.json();
    $("#allEmpRows").html("");
     for (let i = 0; i < allEmpObjects.length; i++) {
        if(allEmpObjects[i].role !="admin"){
            let user = allattendenceObjects.find(user => user.userName == allEmpObjects[i].userName)
            let row = document.createElement("tr");
            $(row).append("<td>"+allEmpObjects[i].firstName+" "+allEmpObjects[i].lastName+"</td>");
            // $(row).append("<td>"+allEmpObjects[i].address+"</td>");
            // $(row).append("<td>"+allEmpObjects[i].email+"</td>");
            $(row).append("<td>"+allEmpObjects[i].role+"</td>");
            $(row).append("<td>"+user.excuse+"</td>");
            $(row).append("<td>"+user.late+"</td>");
            $(row).append("<td>"+user.attend+"</td>");
            $(row).append("<td>"+user.absent+"</td>");
            $("#allEmpRows").append(row)
        }
       
     }
    //  $('#allEmpTable').DataTable({
    //     responsive: true,
    //     autoWidth: false,
    // });
    $('#allEmpTable').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
    
})();
//***************************************************************************** */
//                               Taday Table                                  */
//***************************************************************************** */
//______________________________Show Taday Table______________________________//
function showTodayReport(e){
    $("#dateContiner").hide() 
    removeActive();
    this.classList.add("active")
    tabsContent[2].classList.add("active")
    // todayData()
}
//______________________________Show Taday Data______________________________//
(async function todayData(){
    
    let allEmp= await fetch(`http://localhost:3000/empData`);
    let allEmpObjects= await allEmp.json();
    let allattendence= await fetch(`http://localhost:3000/attendence`);
    let allattendenceObjects= await allattendence.json();
    $("#todayRows").html("");
    for (let i = 0; i < allattendenceObjects.length; i++) {
        let attendArray =allattendenceObjects[i].attendInfo
        for (let j = 0; j < attendArray.length; j++) {
            if(attendArray[j].date==formatDate(new Date()))
            {
                let row = document.createElement("tr");
                let user = allEmpObjects.find(user => user.userName == allattendenceObjects[i].userName)
                $(row).append("<td>"+user.firstName+" "+user.lastName+"</td>");
                $(row).append("<td>"+user.role+"</td>");
                $(row).append("<td>"+attendArray[j].arrive+"</td>");
                if(attendArray[j].out){
                    $(row).append("<td>"+attendArray[j].out+"</td>");
                }else{
                    $(row).append("<td>"+ "Still Here" +"</td>");
                }
                $("#todayRows").append(row)
               
               
            }
            
        }
       
    }
    $('#todayTable').DataTable({
        responsive: true,
        "autoWidth": false
    });
    
    
})();
//***************************************************************************** */
//                               All Data Table                                  */
//***************************************************************************** */
//______________________________Show All Data Table______________________________//
function showAllDataReport(e){
    removeActive();
    $("#dateContiner").hide() 
    this.classList.add("active")
    tabsContent[3].classList.add("active")
    // addAllData()
}
//______________________________Add AllEmployee Data______________________________//
(async function addAllData(){
    let allEmp= await fetch(`http://localhost:3000/empData`);
    let allEmpObjects= await allEmp.json();
    $("#allEmpRows").html("");
    for (let i = 0; i < allEmpObjects.length; i++) {
       let row = document.createElement("tr");
       let deletebtn = document.createElement("td");
       deletebtn.innerHTML='<i class="fa-solid fa-circle-xmark fa-2x delete"></i>'
       deletebtn.children[0].addEventListener("click",deleteAllData);
        $(row).append("<td>"+allEmpObjects[i].firstName+" "+allEmpObjects[i].lastName+"</td>");
        $(row).append("<td class='d-none d-lg-table-cell'>"+allEmpObjects[i].address+"</td>");
        $(row).append("<td class='d-none  d-md-table-cell'>"+allEmpObjects[i].email+"</td>");
        $(row).append("<td class='d-none d-md-table-cell'>"+allEmpObjects[i].age+"</td>");
        $(row).append("<td >"+allEmpObjects[i].userName+"</td>");
        $(row).append("<td>"+allEmpObjects[i].role+"</td>");
        $(row).append(deletebtn);
        $("#allDataRows").append(row)  
        }
       //class='d-sm-none d-md-inline-block'
       
    
    $('#allDataTable').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
})();
$('#allDataTable').DataTable(
    {
        "responsive": true, "lengthChange": false, "autoWidth": false
    })
//____________________________________Delete All Data____________________________________//

function deleteAllData(e){
    let userName=e.target.parentElement.parentElement.children[4].innerHTML;
    let role=e.target.parentElement.parentElement.children[5].innerHTML;

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#808080',
        cancelButtonColor: '#901b20',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            deleteByUserName("empData",userName)

            if(role!="admin"){
                deleteByUserName("attendence",userName)
            }
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })  
    
}
///
async function deleteByUserName(location,userName){
    let userData= await fetch(`http://localhost:3000/${location}?userName=${userName}`);
    let userDataObject= await userData.json();
    fetch(`http://localhost:3000/${location}/${userDataObject[0].id}`, {method: 'DELETE',})
}
//____________________________________LogOut____________________________________//
$("#logOut").click(e=>{
    window.sessionStorage.removeItem("admin");
    location.href ="http://127.0.0.1:5500/home.html";
})


//_______________________________________Date Range______________________________//
$(function() {
    $('.daterangepicker-field').daterangepicker(
    {
        singleDatePicker: true,
    showDropdowns: true,
      opens: 'left',
      locale: {
        format: 'D-M-Y'
      }
    });
  });


  $("#search").click(e=>{
    e.preventDefault()
    let time =$(".daterangepicker-field").val()


   rangeDayReport(time)
})
function showRangeReport(e){
    removeActive();
    this.classList.add("active")
    tabsContent[4].classList.add("active")
    $("#dateContiner").show()
}
async function rangeDayReport(date){
    let allEmp= await fetch(`http://localhost:3000/empData`);
    let allEmpObjects= await allEmp.json();
    let allattendence= await fetch(`http://localhost:3000/attendence`);
    let allattendenceObjects= await allattendence.json();
    $("#rangeRows").html("");
    for (let i = 0; i < allattendenceObjects.length; i++) {
        let attendArray =allattendenceObjects[i].attendInfo
        for (let j = 0; j < attendArray.length; j++) {
            if(attendArray[j].date==date)
            {
                let row = document.createElement("tr");
                let user = allEmpObjects.find(user => user.userName == allattendenceObjects[i].userName)
                $(row).append("<td>"+user.firstName+" "+user.lastName+"</td>");
                $(row).append("<td>"+user.role+"</td>");
                $(row).append("<td>"+attendArray[j].arrive+"</td>");
                if(attendArray[j].out){
                    $(row).append("<td>"+attendArray[j].out+"</td>");
                }else{
                    $(row).append("<td>"+ "Still Here" +"</td>");
                }
                $("#rangeRows").append(row)
               
            }
            
        }
       
    }
    
//     $('#rangeTable').DataTable(
//         {
//             "responsive": true, "lengthChange": false, "autoWidth": false
//         })
}


