export default function error(type : string, value : string){

    switch(type){
        case 'password':
            if(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/.test(value))
                return true;
            else
                return "At least 6 chars long and contain at least 1 special char"

    }

    return false;

}