var Expression = ""; //contains the regular expression to search
var stop = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //recalculate once the plugin is ON
        if (request.cmd == "start") { 

            if(stop == true){
                stop = false;
                
                Expression = request.regExp;
                
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul", reg:Expression}, function(response) {           
                        g = response.response;
                        chrome.browserAction.setBadgeText({text: '' + g + ''});
                    });  
                });
            }

        // return background state to check after if the plugin is active or not
        }else if (request.cmd == "getState"){ 
            sendResponse({ result: stop , message: `Invalid 'cmd'` });

        // save the regular expression
        }else if (request.cmd == "getExp"){ 
            sendResponse({ result: Expression ,message: `Invalid 'cmd'` });

        // dynamic esearch
        }else if (request.cmd == "regExp") { 
            Expression = request.regExp;
        
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                                
                    g = response.response;
                    chrome.browserAction.setBadgeText({text: ''+g+''});
                });  
            });
        }
        else {
            sendResponse({ result: "error", message: `Invalid 'cmd'` });
        }

        // pour l'envoie asynchrone
        return true;
    }
);

// recalculate once the user changer the tabs in the chrome browser
chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        
        chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
            
            g = response.response;
            chrome.browserAction.setBadgeText({text: ''+g+''});
        });  
        
    });
});

// recalculate once the user add a new tab in the browser
chrome.tabs.onCreated.addListener(function(activeInfo){ 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                        
            g = response.response;
            chrome.browserAction.setBadgeText({text: ''+g+''});
        });  
    });
});

 // recalculate once the page is refreshed
chrome.tabs.onUpdated.addListener(function(activeInfo){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                        
            g = response.response;
            chrome.browserAction.setBadgeText({text: ''+g+''});
        });  
    });
});