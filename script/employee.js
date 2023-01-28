import { formatDate,ChangeWelcome , removeActive ,getEndIndex ,getStartIndex } from "./main.js";
//______________________________Authentication______________________________//
let authentication =JSON.parse(sessionStorage.getItem("employee"));
if(authentication==null){
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Violation of User Agreement",
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        location.assign(`http://127.0.0.1:5500/home.html`)
      })}
//______________________________Variables______________________________//    
let name=document.getElementById("name").children[0];
let empUserName=authentication.userName
let tabsContent=document.getElementsByClassName("tab-pane");
let dailyBtn=document.getElementById("daily-tab");
let monthBtn=document.getElementById("month-tab");
let statusBtn=document.getElementById("status-tab");
dailyBtn.addEventListener("click",showDailyTable);
monthBtn.addEventListener("click",showMonthTable);
statusBtn.addEventListener("click",showStatusTable)

//______________________________Welcome Message______________________________// 
ChangeWelcome(empUserName,name )

//***************************************************************************** */
//                               Daily Table                                    */
//***************************************************************************** */
//______________________________Show Daily Table______________________________//
function showDailyTable(e){
    removeActive();
    this.classList.add("active")
    tabsContent[0].classList.add("active")
    $("#dateContiner").hide()
}
//______________________________Add Daily Data______________________________//
(async function addDaily(){
    $("#dateContiner").hide()
    let empData= await fetch(`http://localhost:3000/attendence/${empUserName}`);
    let empDataObjects= await empData.json();
    let attendInfo = empDataObjects.attendInfo
    let lastDay = attendInfo[attendInfo.length -1]
    if(lastDay.date== formatDate(new Date()) ){
        $("#dailyRows").html("");
        $("#dailyTable").show();
        $("#absent").hide();
        let row = document.createElement("tr");
        $(row).append("<td>"+lastDay.date+"</td>");
        $(row).append("<td>"+lastDay.arrive+"</td>");

        //if still here 
        if(lastDay.out){
            $(row).append("<td>"+lastDay.out+"</td>");
            $(row).append("<td>"+lastDay.exStatus+"</td>");
        }else{
            $(row).append("<td>"+"Still here"+"</td>");
            $(row).append("<td>"+"Still here"+"</td>");
        }
        $(row).append("<td>"+lastDay.status+"</td>");
        //
        $("#dailyRows").append(row)
    }//if Employee Attend Today 
    else{
        $("#dailyTable").hide();
        $("#absent").show();
    }
    
    
    // $('#dailyTable').DataTable({
    //     responsive: true,
    //     "autoWidth": false
    // });
})();
//***************************************************************************** */
//                               Month Table                                    */
//***************************************************************************** */
//______________________________Show Month Table______________________________//
function showMonthTable (e){
    removeActive();
    $("#dateContiner").show()
    this.classList.add("active")
    tabsContent[1].classList.add("active")
}

//_______________________________________Date Range______________________________//
$(function() {
    $('.daterangepicker-field').daterangepicker(
    {
      opens: 'left',
      locale: {
        format: 'D-M-Y'
      }
    });
  });

//Get Date from User
$("#search").click(e=>{
    e.preventDefault()
    let time =$(".daterangepicker-field").val()
   let startAndEnd =  time.split(" - ")
   monthReport(startAndEnd[0],startAndEnd[1])
})

//______________________________Add Range Data______________________________//
async function monthReport(start,end){
    let empData= await fetch(`http://localhost:3000/attendence/${empUserName}`);
    let empDataObjects= await empData.json();
    let attendArray = empDataObjects.attendInfo
    $("#monthRows").html("");
    if(attendArray.length){
        
        let startIndex = getStartIndex(start,attendArray);
        if(startIndex==0){
            startIndex=1
        }
        let endIndex = getEndIndex(end,attendArray)
        for (let i = startIndex; i < endIndex; i++) {
            let row = document.createElement("tr");
            $(row).append("<td>"+attendArray[i].date+"</td>");
            $(row).append("<td>"+attendArray[i].arrive+"</td>");
    
            //if still here 
            if(attendArray[i].out){
                $(row).append("<td>"+attendArray[i].out+"</td>");
                $(row).append("<td>"+attendArray[i].exStatus+"</td>");
            }else{
                $(row).append("<td>"+"4:00 pm"+"</td>");
                $(row).append("<td>"+"False"+"</td>");
            }
            $(row).append("<td>"+attendArray[i].status+"</td>");
            //
            $("#monthRows").append(row) 
        }

// attendInfo
   
    // $('#monthTable').DataTable({
    //     responsive: true,
    //     autoWidth: false,
        
    // });
     }
    
}
//***************************************************************************** */
//                               Status Table                                  */
//***************************************************************************** */
//______________________________Show Status Table______________________________//
function showStatusTable(e){
    removeActive();
    this.classList.add("active")
    tabsContent[2].classList.add("active")
    addStatus()
}
//______________________________Add Status Data______________________________//
async function addStatus(){
    $("#dateContiner").hide()
    let empData= await fetch(`http://localhost:3000/attendence/${empUserName}`);
    let empDataObjects= await empData.json();
    if(empDataObjects){
        $("#statusRows").html("");
        let row = document.createElement("tr");
        $(row).append("<td>"+empDataObjects.startDate+"</td>");
        $(row).append("<td>"+empDataObjects.attend+"</td>");
        $(row).append("<td>"+empDataObjects.late+"</td>");
        $(row).append("<td>"+empDataObjects.absent+"</td>");
        $(row).append("<td>"+empDataObjects.excuse+"</td>");
        $("#statusRows").append(row)
    }
};

//____________________________________LogOut____________________________________//
$("#logOut").click(e=>{
    window.sessionStorage.removeItem("employee");
    location.href ="http://127.0.0.1:5500/home.html";
})


