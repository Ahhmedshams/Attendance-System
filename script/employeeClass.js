class Employee{
    #firstName;
    #lastName;
    #address;
    #email;
    #age;
    #role;
    #userName;
    #password;
    constructor(_firstName,_lastName,_address,_email,_age,_userName,_password,_role){
        this.fName=_firstName;
        this.lName=_lastName;
        this.Address=_address;
        this.Email=_email;
        this.Age=_age;
        this.#userName=_userName;
        this.#password=_password;
        this.#role=_role;
    }//End of constructor
    //======== Geter =======//
    set fName(_firstName){
        this.#firstName=_firstName
    }
    get fName(){
        return this.#firstName;
    }
    ////////////////////////
    set lName(_lastName){
        this.#lastName=_lastName;
    }
    get lName(){
        return this.#lastName;
    }
    //////////////////////
    set Address(_address){
        this.#address=_address;
    }
    get Address(){
        return this.#address;
    }
    /////
    set Email(_email){
        this.#email=_email;
    }
    get Email(){
        return this.#email;
    }
    ////
    set Age(_age){
        this.#age=_age;
    }
    get Age(){
        return this.#age;
    }
    ////-----
    set Role(_role){
        this.#role=_role;
    }
    get Role(){
        return this.#role;
    }
    
    ///----------
    save(){ 
    
        fetch("http://localhost:3000/pending", { method: "POST",
            body: JSON.stringify({
                id:`${this.#userName}`,
                firstName: `${this.#firstName}`,
                lastName: `${this.#lastName}`,
                address: `${this.#address}`,
                email: `${this.#email}`,
                age: `${this.#age}`,
                userName:`${this.#userName}`,
                password:`${this.#password}`,
                role:`${this.#role}`
            }),         
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })     
    }
    
}//end of class
export{Employee}

