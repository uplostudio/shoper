const condition = () => localStorage.getItem('trial') !== null ? true : false;
 
const initialize = () => {
    
    let LSdata = JSON.parse(atob(localStorage.getItem('trial')));

    if ( Math.floor(new Date().getTime() / 1000) > LSdata[6] ) {
        localStorage.removeItem('trial');
    }
}
 
export default {
    condition,
    initialize
};