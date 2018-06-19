var checked;
function onOff() {
    var exp = document.getElementById('regExp').value;
    if(this.checked == true){
        chrome.browserAction.setIcon({path: "iconActive.png"});
        document.getElementById('regExp').disabled = false;
        document.getElementById('OnOff').src = "./powerON.png";
        this.checked = false;
    }else{
        chrome.browserAction.setIcon({path: "iconDisabled.png"});
        document.getElementById('regExp').disabled = true;
        document.getElementById('OnOff').src = "./powerOFF.png";
        this.checked = true;
    }
    chrome.runtime.sendMessage({"cmd": "start","regExp":exp}, function(response) {
        console.log(response);
    });

}

function change(){
    var exp = document.getElementById('regExp').value;
    chrome.runtime.sendMessage({"cmd": "regExp","regExp":exp}, function(response) {
        console.log(response);
    });

}

window.onload=function(){
    document.getElementById('OnOff').addEventListener('click', onOff);
    document.getElementById('regExp').addEventListener('keyup',change);
}

chrome.runtime.sendMessage({"cmd": "getState"}, function(response) {

    this.checked = !response.result;

    if(this.checked == true){
        chrome.browserAction.setIcon({path: "iconActive.png"});
        document.getElementById('regExp').disabled = false;
        document.getElementById('OnOff').src = "./powerON.png";
    }else{
        chrome.browserAction.setIcon({path: "iconDisabled.png"});
        document.getElementById('regExp').disabled = true;
        document.getElementById('OnOff').src = "./powerOFF.png";
    }
    
});

chrome.runtime.sendMessage({"cmd": "getExp"}, function(response) {
    document.getElementById('regExp').value = response.result;
});
