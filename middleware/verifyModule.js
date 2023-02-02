function checkLogged(req, res, next){
    if(req.session.user_id){
        next();
        return;
    }
}

function checkAdmin(req, res, next){
    if(req.session.jog == 10){
        next();
        return;
    }else{
        //ehhez nincs jogosultsága
    }
}

module.exports = {
    checkLogged : checkLogged
}