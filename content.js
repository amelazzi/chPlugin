chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if ( (msg.cmd == 'calcul') & (msg.reg != "") ) {
      
        var excludedTags = ["style","script","canvas","head","title","meta","link"];
      
      var numOcc=0;
      var replaceTextInNode = function(parentNode,regInput){
        
        input = regInput;
        regularExpression = new RegExp(input,'igm');
            
        node = parentNode.getElementsByTagName("HTML");
        count = node[0].innerText.match(regularExpression);
        count = (count) ? count.length : 0;
        numOcc = numOcc + count;


        var allInputs = document.getElementsByTagName("input");
    
        for(var x=0;x<allInputs.length;x++){
            
            var input = allInputs[x].value;
            
            count = input.match(regularExpression);
            count = (count) ? count.length : 0;
            numOcc = numOcc + count;
        }

        

      };
      
      replaceTextInNode(document,msg.reg);

      sendResponse({
        response: numOcc
        });
    }
  });