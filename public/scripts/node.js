
$(document).ready(()=>{
     $login = $('#Login');
     $Username = $('#Username');
     $Password = $('#Password');

     $login.click(function(){
         $.ajax({
           type:"POST",
           url:"/login",
           data:{'Username':$Username.val(),'Password':$Password.val()}
         });
     });
});