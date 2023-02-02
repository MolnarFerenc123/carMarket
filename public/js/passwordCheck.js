function checkPassword(form){
    let password = form.password.value;
    let password2 = form.passwordAgain.value;
    if(password != password2){
        alert("A két jelszónak egyeznie kell!");
        return false;
    }
    if(password.length < 8){
        alert("A jelszónak minimum 8 karakter hosszúnak kell lennie!");
        return false;
    }
    return true;
}