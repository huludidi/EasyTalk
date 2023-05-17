const regs={
    email:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    number:/^([0]|[1-9][0-9]*)$/,
    password: /^(?![0-9a-zA-Z]+$)[a-zA-Z0-9~!@#$%^&*?_-]{1,50}$/,
    // /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-z~!@#$%^&*_]{8,18}&/,
}
const verify=(rule,value,reg,callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(new Error(rule.message))
        }
    }else{
        callback()
    }
}
export default{
    email:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    },
}