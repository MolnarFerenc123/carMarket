function stringToMoney(raw){
    let money = "";
    let count = 0;
    for(let i = raw.length - 1; i >= 0; i--){
        if(count % 3 === 0 && count!== 0){
            money = " " + money;
        }
        money = raw[i] + money;
        count++;
    }
    return money;
}