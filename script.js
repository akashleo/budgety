var budgetController = (function(){

     var expense = function(id, description, value){
          this.id= id;
          this.description = description;
          this.value= value;
          this.percentage = -1;
     };

     var income = function(id, description, value){
          this.id= id;
          this.description = description;
          this.value= value;
     };

     expense.prototype.calcPercentage = function(totalIncome){

          if(totalIncome>0){
               this.percentage = Math.round((this.value/totalIncome)*100);
          }
          else{
               this.percentage = -1;
          }
         
     };

     expense.prototype.getPercentage = function(){
          return this.percentage;
     };
 

     var calculateTotal = function(type)
     {
          var sum=0;
          data.allitems[type].forEach( function(cur) {
               sum= sum + cur.value;
          });

          data.totals[type]=sum;
     };

     var data ={ 
          allitems : {
               inc : [],
               exp : []
          },

          totals : {
               inc : 0,
               exp : 0
          },

          budget : 0,
          percentage : 0,
     };

     return {
          addItem : function(type,description,value) {
               var newItem, id1=0;
               //[1,2,3,4,5] next id=6
               //[1,3,5,8] next id=9
               // id= last id + 1
               if(data.allitems[type].length > 0){
                    id1 =data.allitems[type][data.allitems[type].length - 1].id + 1;}
               else{
                    id1=0;}


               //create new item based on inc or exp
               if( type==='exp'){
                    newItem = new expense(id1,description,value);}
               else if( type==='inc' ){
                    newItem = new income(id1,description,value);}

               //push it onto the data structure
               data.allitems[type].push(newItem);


               // return the item
               return newItem;
          },

          calculateBudget : function()
          {
               //Calculate total income and expenses
               calculateTotal('exp');
               calculateTotal('inc');
               
          
               // calculate the budget : income - expenses
               data.budget = data.totals.inc - data.totals.exp;

               //calculate the percenteage income that we spent
               if(data.totals.inc>0)
               {
                    data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100 );
               }
               else
               {
                    data.percentage= -1;
               }
               

               //console.log(data.percentage);

          },

          calculatePercentages : function(){

               data.allitems.exp.forEach(function(cur){
                    cur.calcPercentage(data.totals.inc);
               });


          },

          getPercentages : function(){
               var allPerc = data.allitems.exp.map(function(cur){
                    return cur.getPercentage();
               });
               return allPerc;
          },

          getBudget : function(){

               return {
               budget : data.budget,
               totalInc : data.totals.inc,
               totalExp : data.totals.exp,
               percentage : data.percentage,
               }
          },

          deleteItem : function(type, id){

               var index, ids;
               ids= data.allitems[type].map(function(current){
                    return current.id;
               });

               index = ids.indexOf(id);
               if(index != -1)
               {
                    data.allitems[type].splice(index, 1);
               }

          },


          testing : function(){
               console.log(data);
          }
     }


     
})();


var UIController =(function(){
     
     var DOMstrings = {
          inputType :'.add__type',
          descType : '.add__description',
          valType : '.add__value',
          btnType : '.add__btn',
          incomeContainer : '.income__list',
          expenseContainer : '.expenses__list',
          budgetLabel : '.budget__value',
          incomeLabel : '.budget__income--value',
          expensesLabel : '.budget__expenses--value',
          percentageLabel : '.budget__expenses--percentage',
          container : '.container',
          expPercLabel : '.item__percentage',
          dateLabel : '.budget__title--month'
     };

     var nodeListForEach = function(list , callback){
          for(var i=0;i<list.length;i++)
          {
               callback(list[i], i);
          }

     };


     var formatNumber = function(num , type){

          var numSplit , int , dec  ;

          num= Math.abs(num);
          num= num.toFixed(2);

          numSplit = num.split('.');

          int= numSplit[0];
          if (int.length>0)
          {
               int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3, 3);
          }

          dec = numSplit[1];

         ;

          return  (type === 'exp' ? '-' : '+' ) + ' ' +int +'.'+ dec ;

     };

     return {
          getInput : function() {
               return { 
                    type : document.querySelector(DOMstrings.inputType).value,
                    description : document.querySelector(DOMstrings.descType).value,
                    value : parseFloat(document.querySelector(DOMstrings.valType).value)
               };
          },

          addListItem : function(obj , type) {

               var newhtml, html, element ;


               if(type==='exp')
               {
                    element = DOMstrings.expenseContainer;
                    html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

               }
               else if(type==='inc')
               {
                    element=DOMstrings.incomeContainer;

                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }
               //console.log(element); //prinnts either income or expense
               newhtml = html.replace('%id%',obj.id);
               newhtml =newhtml.replace('%description%',obj.description);
               newhtml =newhtml.replace('%value%',formatNumber(obj.value, type));
               //console.log(newhtml);  // was used to check the generated html

               //document.querySelector(element).insertAdjacentElement('beforeend',newhtml);
               document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);

          },


          deleteListItem : function(selectorID){

               var el= document.getElementById(selectorID);
               el.parentNode.removeChild(el);

          },
 
          // Clearing the input fields
          clearFields : function(){

               var fields, fieldsArr;

               fields = document.querySelectorAll(DOMstrings.descType +', '+ 
               DOMstrings.valType); 

               fieldsArr = Array.prototype.slice.call(fields);

               fieldsArr.forEach(function(current, index, array){
                    current.value="";
               });

               fieldsArr[0].focus();

          }, 

          displayBudget : function(obj){
               var type;

               (obj.budget>0) ? type = 'inc': type = 'exp';

               document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
               document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
               document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);
               

               if(obj.percentage>0)
               {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
               }
               else
               {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
               }

          },

          displayPercentages : function(percentages){

               var fields = document.querySelectorAll(DOMstrings.expPercLabel);
                             
               nodeListForEach(fields , function(current, index ){
                    if(percentages[index]>0)
                    {
                         current.textContent = percentages[index] +' %';
                    }
                    else
                    {
                         current.textContent = '---';
                    }
                    
               })


          },

          displayMonth : function(){
               var now, year, month , months;

               months = ['January', 'February', 'March', 'April', ' May','June', 'July', 'August',
                'September', 'October','November','December'];

               now = new Date();
               year = now.getFullYear();
               month = now.getMonth();

               document.querySelector(DOMstrings.dateLabel).textContent = months[month] +', '+ year;
          },

          changedType : function(){

               var fields = document.querySelectorAll(DOMstrings.inputType+ ',' + 
               DOMstrings.descType+ ','+ DOMstrings.valType);

               nodeListForEach( fields, function(cur){
                    cur.classList.toggle('red-focus');
               });

               document.querySelector(DOMstrings.btnType).classList.toggle('red');
          },


          getDOMstrings : function() {return DOMstrings;}
     };
     
})();


var controller=(function(budC, UIC){

     var DOM =UIC.getDOMstrings();
     var setUpEventListeners = function(){

          document.querySelector(DOM.btnType).addEventListener('click',ctrlAddItem);
          document.addEventListener('keypress',function(event){
               if(event.keyCode===13 || event.which===13)
               {
                    ctrlAddItem();
               
               }
          }); 

          document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
          document.querySelector(DOM.inputType).addEventListener('change',UIC.changedType);

     }

    



     var updateBudget = function(){
          // calculate the budget
          budC.calculateBudget();

          //return the budget
          var budget = budC.getBudget();

          //show the buddget on the UI
          //console.log(budget);   // printing in console before actually printing in UI
          UIC.displayBudget(budget);
     }

     var updatePercentages = function(){
          // 1. calculate the percentges
          budC.calculatePercentages();

          //2. read the percentage from the buudget controller
          var percentages = budC.getPercentages();

          //3. Update the ui with the new percentages
          console.log(percentages);
          UIC.displayPercentages(percentages);
     }
     
     var ctrlAddItem = function()
     {    
          var input , newItem ;
          //1. get the field input data
          input=UIC.getInput();

          if(input.description!="" && input.value> 0  && !isNaN(input.value)){

                //2. add the item to the budget controller
               newItem = budC.addItem(input.type, input.description, input.value);
               //console.log(newItem);  // used to see data structure

               //3. add the item to the ui
               UIC.addListItem(newItem, input.type);

               //4. Clear the fields;
               UIC.clearFields();

               //4. Calculate and update the budget
               updateBudget();

               //5. Calculate and update percentages
               updatePercentages();

          }
          
         
     };

     var ctrlDeleteItem = function(event){

          var itemID,splitID , type , id;
          
          itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

          if(itemID)
          {
               splitID = itemID.split('-');
               type= splitID[0];
               id= parseInt(splitID[1]);
          }

          console.log('type  '+ type +', id  '+ id);

          // delete the item from the data stucture
          budC.deleteItem(type,id);


          //delete the item from the ui
          UIC.deleteListItem(itemID);

          // update the show the budget
          updateBudget();

          // update the percentages in expenses
          updatePercentages();
     };

     return {
          init : function()  
         { console.log("Application has Started "),
          UIC.displayMonth();
          UIC.displayBudget({
               budget : 0,
               totalInc : 0,
               totalExp : 0,
               percentage : -1,

          });
          setUpEventListeners()}
     }


    
  
})(budgetController,UIController);


controller.init();  // initial line of the code 