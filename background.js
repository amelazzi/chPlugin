var stop = false; // variable qui donne si la recherche automatique est active ou non
var Expression = ""; // chaine contenant l'expression régulière à rechercher




chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        if (request.cmd == "start") { // quand on reclick sur le run auto on doit refaire le calcul

            if(stop == true){
                stop = false;
                
                Expression = request.regExp;
                


                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                                    
                        g = response.response;
                        chrome.browserAction.setBadgeText({text: ''+g+''});
                    });  
                });
            } else if (stop == false){ // une fois que l'auto run est désactivé on désaffiche le badge du nombre de résultat
                stop = true;
                chrome.browserAction.setBadgeText({text: ''});
            }

        }else if (request.cmd == "getState"){ // pour retourner l'état du background et donc savoir si checked = true ou false
            sendResponse({ result: stop , message: `Invalid 'cmd'` });


        }else if (request.cmd == "getExp"){ // pour sauvegarder l'expression qui a été écrite 
            sendResponse({ result: Expression , message: `Invalid 'cmd'` });


        }
         else if (request.cmd == "regExp") { // chaque fosi que le user écrit un caractère on refaire le calcul (recherche dynamique ) 
            if(stop == false){
                Expression = request.regExp;
            
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                                    
                        g = response.response;
                        chrome.browserAction.setBadgeText({text: ''+g+''});
                    });  
                });
            }

        }
        else {
            sendResponse({ result: "error", message: `Invalid 'cmd'` });
        }

        // pour l'envoie asynchrone
        return true;
    }
);




chrome.tabs.onActivated.addListener(function(activeInfo){ // on refait le calcul a chaque fois que le user change de tabs

    if(stop == false){

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            
            chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                
                g = response.response;
                chrome.browserAction.setBadgeText({text: ''+g+''});
            });  
            
        });
    }

});

chrome.tabs.onCreated.addListener(function(activeInfo){ // on refait le calcul a chaque tab que le suer crée

    if(stop == false){

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                            
                g = response.response;
                chrome.browserAction.setBadgeText({text: ''+g+''});
            });  
        });

    }
});

chrome.tabs.onUpdated.addListener(function(activeInfo){ // on refait le calcul a chaque fois que le user refresh la page

    if(stop == false){
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {cmd: "calcul",reg:Expression}, function(response) {
                            
                g = response.response;
                chrome.browserAction.setBadgeText({text: ''+g+''});
            });  
        });

    }
});