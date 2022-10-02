//Class Object Staff
function Staff(id,name,email,password,date,salary,position,workingTime){
    this.id = id;
    this.name = name;    
    this.email = email;    
    this.password = password;
    this.workingDate = date;
    this.salary = salary;
    this.position = position;
    this.workingTime = workingTime;
    this.rank = function (){
        if (this.workingTime >= 192) {
            return "Xuất sắc";
          } else if (this.workingTime >= 176) {
            return "Giỏi";
          } else if (this.workingTime >= 160) {
            return "Khá";
          } else {
            return "Trung bình";
          }
    }
    this.totalSalary = function(){
        if (this.position == 'Sếp'){
            return (this.salary * 3);
        } else if(this.position == 'Trưởng phòng'){
            return (this.salary * 2);
        } else{
            return this.salary;
        }
    }
}