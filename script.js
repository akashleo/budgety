var budgetController = (function(){

     var expense = function(id, description, value){
          this.id= id;
          this.description = description;
          this.value= value;
     };

     var income = function(id, description, value){
          this.id= id;
          this.description = description;
          this.value= value;
     };
 
     var data ={
          allitems : {
               inc : [],
               exp : []
          },

          totals : {
               inc : 0,
               exp : 0
          }
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
          expenseContainer : '.expenses__list'
     };

     return {
          getInput : function() {
               return {
                    type : document.querySelector(DOMstrings.inputType).value,
                    description : document.querySelector(DOMstrings.descType).value,
                    value : document.querySelector(DOMstrings.valType).value
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
               console.log(element);
               newhtml = html.replace('%id%',obj.id);
               newhtml =newhtml.replace('%description%',obj.description);
               newhtml =newhtml.replace('%value%',obj.value);
               console.log(newhtml);

               //document.querySelector(element).insertAdjacentElement('beforeend',newhtml);
               document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);

          },

          getDOMstrings : function() {return DOMstrings;}
     };
     
})();


var controller=(function(budC, UIC){


     var setUpEventListeners = function(){

          var DOM =UIC.getDOMstrings();
          document.querySelector(DOM.btnType).addEventListener('click',ctrlAddItem);
          document.addEventListener('keypress',function(event){
               if(event.keyCode===13 || event.which===13)
               {
                    ctrlAddItem();
               
               }
          }); 

     }

     
     var ctrlAddItem = function()
     {    
          var input , newItem ;
          //1. get the field input data
          input=UIC.getInput();
          
          //2. add the item to the budget controller
          newItem1 = budC.addItem(input.type, input.description, input.value);
          console.log(newItem1);

          //3. add the item to the ui
          UIC.addListItem(newItem1, input.type);


          //4. Calculatte the budget


          //5. display the budget on the ui
     };

     return {
          init : function() 
         { console.log("Application has Started "),
          setUpEventListeners()}
     }


    
  
})(budgetController,UIController);


controller.init();  // initial line of the code