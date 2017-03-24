'use strict';
module.exports = [
    '$scope','$rootScope','$http','$ionicLoading','$filter','$ionicPopup','$ionicModal','Analytics','$interval', function($scope,$rootScope,$http,$ionicLoading,$filter,$ionicPopup,$ionicModal,Analytics,$interval) {
$rootScope.checkLogin();
if($rootScope.loggedUserId)
	{
		 $ionicLoading.show({
      template: 'Loading...'
    });
     $scope.getTransactionData=function()
     {
      $scope.myAccountAvailableUSD=0;
      $scope.myAccountAvailableHKD=0;
      $scope.MyEmployerAccountEscrowUSD=0;
      $scope.MyEmployerAccountEscrowHKD=0;
      $scope.MyTalentAccountEscrowUSD=0;
      $scope.MyTalentAccountEscrowHKD=0;

    $scope.AllTransations=[];
    $scope.AllTransationsKeys=[];
    

    var ref1 = firebase.database().ref("/transactions/").orderByChild('employer_id').equalTo($rootScope.loggedUserId);
        ref1.once("value", function(snapshot) {
         
          $scope.MyEmployerAccount=snapshot.val();
          

          for(var key in $scope.MyEmployerAccount)
          {
            if($scope.AllTransationsKeys.indexOf(key) === -1) {
              $scope.AllTransationsKeys.push(key);

             var d=$scope.MyEmployerAccount[key];
                d.id=key;
                d.newDate=new Date(d.date).getTime();
            $scope.AllTransations.push(d);

            if($scope.MyEmployerAccount[key].payment_status=='escrow' && $scope.MyEmployerAccount[key].currency=='USD')
              $scope.MyEmployerAccountEscrowUSD=parseFloat($scope.MyEmployerAccountEscrowUSD)+parseFloat($scope.MyEmployerAccount[key].amount);
            
            if($scope.MyEmployerAccount[key].payment_status=='escrow' && $scope.MyEmployerAccount[key].currency=='HKD')
              $scope.MyEmployerAccountEscrowHKD=parseFloat($scope.MyEmployerAccountEscrowHKD)+parseFloat($scope.MyEmployerAccount[key].amount);

            
            if(!$scope.$$phase) {
            $scope.$apply();
          }
        }
          }
          $ionicLoading.hide();
         });
        /*var ref2 = firebase.database().ref("/transactions/").orderByChild('talent_id').equalTo($rootScope.loggedUserId);
        ref2.once("value", function(snapshot) {
          $scope.MyTalentAccount=snapshot.val();
          
          for(var key in $scope.MyTalentAccount)
          {
            $scope.AllTransations.push($scope.MyTalentAccount[key]);

            if($scope.MyTalentAccount[key].payment_status=='escrow' && $scope.MyTalentAccount[key].currency=='USD')
            $scope.MyTalentAccountEscrowUSD=parseInt($scope.MyTalentAccountEscrowUSD)+parseInt($scope.MyTalentAccount[key].amount);

            if($scope.MyTalentAccount[key].payment_status=='escrow' && $scope.MyTalentAccount[key].currency=='HKD')
            $scope.MyTalentAccountEscrowHKD=parseInt($scope.MyTalentAccountEscrowHKD)+parseInt($scope.MyTalentAccount[key].amount);
              if(!$scope.$$phase) {
            $scope.$apply();
            }
            
          }
          $ionicLoading.hide();
         });*/
        var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
        ref3.once("value", function(snapshot) {
            $scope.MyAvialableAccount=snapshot.val();
            
            for(var key in $scope.MyAvialableAccount)
            {
              if($scope.AllTransationsKeys.indexOf(key) === -1) {
              $scope.AllTransationsKeys.push(key);
                var d=$scope.MyAvialableAccount[key];
                d.id=key;
                d.newDate=new Date(d.date).getTime();
              if($scope.MyAvialableAccount[key].payment_status=='available')
              $scope.AllTransations.push(d);

                if($scope.MyAvialableAccount[key].payment_status=='available' && $scope.MyAvialableAccount[key].currency=='USD')
                $scope.myAccountAvailableUSD=parseFloat($scope.myAccountAvailableUSD)+parseFloat($scope.MyAvialableAccount[key].amount);

                if($scope.MyAvialableAccount[key].payment_status=='available' && $scope.MyAvialableAccount[key].currency=='HKD')
                $scope.myAccountAvailableHKD=parseFloat($scope.myAccountAvailableHKD)+parseFloat($scope.MyAvialableAccount[key].amount);
                
                  if(!$scope.$$phase) {
            $scope.$apply();
            }
          
            }
          }
           $ionicLoading.hide();
         });
     }
     $scope.getTransactionData();
     $interval(function() {
		    $scope.getTransactionData();
      }, 30000);
	}
     $ionicModal.fromTemplateUrl('transation-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    $scope.viewTransactionDetails=function(trans)
    {
        $scope.openModal();
        $scope.trans=trans;
        $scope.milestone=null;
        if(trans.contractid && trans.milestoneid)
        {
          var myRootRef_a = firebase.database().ref('/contracts/'+trans.contractid +"/milestones/"+trans.milestoneid);
              myRootRef_a.once("value", function(milestone) {
                $scope.milestone=milestone.val();
              });
        }
    }
    $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.donwonloadInvoice=function()
  {
    if($scope.trans)
                {
                  $ionicLoading.show();
     var employer_id='';
     if($scope.trans.employer_id)
      employer_id=$scope.trans.employer_id;
     else if($scope.trans.employerid)
      employer_id=$scope.trans.employerid;

     var talent_id='';
     if($scope.trans.talent_id)
      talent_id=$scope.trans.talent_id;
     else if($scope.trans.talentid)
      talent_id=$scope.trans.talentid;


    var ref1_bill = firebase.database().ref("/users").child(employer_id);
    ref1_bill.once("value", function(snapshot) {
      $scope.inoviceEmployer=snapshot.val();

          var ref1_bill_t = firebase.database().ref("/users").child(talent_id);
          ref1_bill_t.once("value", function(snapshot) {

            $scope.inoviceTalent=snapshot.val();
              var Emp_billingaddress='';
              if($scope.inoviceEmployer.billaddress.addressLine1)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.addressLine1+'<br/>';
              if($scope.inoviceEmployer.billaddress.addressLine2)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.addressLine2+'<br/>';
              if($scope.inoviceEmployer.billaddress.addressLine3)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.addressLine3+'<br/>';
              if($scope.inoviceEmployer.billaddress.city)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.city+', ';
              if($scope.inoviceEmployer.billaddress.country)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.country+', ';
              if($scope.inoviceEmployer.billaddress.postCode)
                Emp_billingaddress=Emp_billingaddress+$scope.inoviceEmployer.billaddress.postCode+'<br/>';  

                var Talent_billingaddress='';
              if($scope.inoviceTalent.billaddress.addressLine1)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.addressLine1+'<br/>';
              if($scope.inoviceTalent.billaddress.addressLine2)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.addressLine2+'<br/>';
              if($scope.inoviceTalent.billaddress.addressLine3)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.addressLine3+'<br/>';
              if($scope.inoviceTalent.billaddress.city)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.city+', ';
              if($scope.inoviceTalent.billaddress.country)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.country+', ';
              if($scope.inoviceTalent.billaddress.postCode)
                Talent_billingaddress=Talent_billingaddress+$scope.inoviceTalent.billaddress.postCode+'<br/>';  


               
                    if($scope.trans.serviceFees=="true")
                    {
                        var templateString=serviceFeesTemplate;
                        if($scope.inoviceEmployer.companyName)
                            templateString=templateString.replace('###employerComanyName###',$scope.inoviceEmployer.companyName);
                        else
                            templateString=templateString.replace('###employerComanyName###','');
                        if($scope.inoviceEmployer.name)
                            templateString=templateString.replace('###employername###',$scope.inoviceEmployer.name);
                        else
                            templateString=templateString.replace('###employername###','');
                        if(Emp_billingaddress)
                            templateString=templateString.replace('###employerAddress###',Emp_billingaddress);
                        else
                            templateString=templateString.replace('###employerAddress###','');

                        if($scope.inoviceTalent.companyName)
                            templateString=templateString.replace('###TalentComanyName###',$scope.inoviceTalent.companyName);
                        else
                            templateString=templateString.replace('###TalentComanyName###','');
                        if($scope.inoviceTalent.name)
                            templateString=templateString.replace('###TalentName###',$scope.inoviceTalent.name);
                        else
                            templateString=templateString.replace('###TalentName###','');
                        if(Talent_billingaddress)
                            templateString=templateString.replace('###TalentAddress###',Talent_billingaddress);
                        else
                            templateString=templateString.replace('###TalentAddress###','');


                        templateString=templateString.replace('###date###',$scope.trans.date);
                        templateString=templateString.replace('###Invoiceid###',$scope.trans.id);
                        templateString=templateString.replace('###amount###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amountdue###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###serviceFeePercent###',$scope.trans.serviceFeePercent);
                        templateString=templateString.replace('###Contract###',$scope.trans.contract);
                        templateString=templateString.replace('###Contractsubj###',$scope.trans.job_name);
                        templateString=templateString.replace('###Clientname###',$scope.trans.employername);
                        templateString=templateString.replace('###specification###',$scope.trans.totalamt+' '+$scope.trans.currency+' X '+$scope.trans.serviceFeePercent+'% = '+$scope.trans.amount+' '+$scope.trans.currency);
                        templateString=templateString.replace('###currency1###',$scope.trans.currency);
                        templateString=templateString.replace('###currency2###',$scope.trans.currency);
                        templateString= templateString.replace('###amount1###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amount2###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###note###','Notes:  For Invoice '+$scope.trans.serviceFeeFor);
                        setTimeout(function(){
                        $('#serviceFees').html(templateString);  
                        createPDF('serviceFees'); 
                        $ionicLoading.hide();
                        },1000);
                    }
                    else if($scope.trans.withdraw_status=="true")
                    {
                         var templateString=withdrawFeesTemplate;
                       if($scope.inoviceEmployer.companyName)
                            templateString=templateString.replace('###employerComanyName###',$scope.inoviceEmployer.companyName);
                        else
                            templateString=templateString.replace('###employerComanyName###','');
                        if($scope.inoviceEmployer.name)
                            templateString=templateString.replace('###employername###',$scope.inoviceEmployer.name);
                        else
                            templateString=templateString.replace('###employername###','');
                        if(Emp_billingaddress)
                            templateString=templateString.replace('###employerAddress###',Emp_billingaddress);
                        else
                            templateString=templateString.replace('###employerAddress###','');



                        if($scope.inoviceTalent.companyName)
                            templateString=templateString.replace('###TalentComanyName###',$scope.inoviceTalent.companyName);
                        else
                            templateString=templateString.replace('###TalentComanyName###','');
                        if($scope.inoviceTalent.name)
                            templateString=templateString.replace('###TalentName###',$scope.inoviceTalent.name);
                        else
                            templateString=templateString.replace('###TalentName###','');
                        if(Talent_billingaddress)
                            templateString=templateString.replace('###TalentAddress###',Talent_billingaddress);
                        else
                            templateString=templateString.replace('###TalentAddress###','');


                        templateString=templateString.replace('###date###',$scope.trans.date);
                        templateString=templateString.replace('###Invoiceid###',$scope.trans.id);
                        templateString=templateString.replace('###amount###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amountdue###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###currency1###',$scope.trans.currency);
                        templateString=templateString.replace('###currency2###',$scope.trans.currency);
                        templateString= templateString.replace('###amount1###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amount2###',Math.abs($scope.trans.amount));
                        setTimeout(function(){
                        $('#serviceFees').html(templateString);  
                        createPDF('serviceFees'); 
                        $ionicLoading.hide();
                        },1000);
                    }else if($scope.trans.type=="bonus")
                    {

                         var templateString=bonusTemplate;
                        if($scope.inoviceEmployer.companyName)
                            templateString=templateString.replace('###employerComanyName###',$scope.inoviceEmployer.companyName);
                        else
                            templateString=templateString.replace('###employerComanyName###','');
                        if($scope.inoviceEmployer.name)
                            templateString=templateString.replace('###employername###',$scope.inoviceEmployer.name);
                        else
                            templateString=templateString.replace('###employername###','');
                        if(Emp_billingaddress)
                            templateString=templateString.replace('###employerAddress###',Emp_billingaddress);
                        else
                            templateString=templateString.replace('###employerAddress###','');



                        if($scope.inoviceTalent.companyName)
                            templateString=templateString.replace('###TalentComanyName###',$scope.inoviceTalent.companyName);
                        else
                            templateString=templateString.replace('###TalentComanyName###','');
                        if($scope.inoviceTalent.name)
                            templateString=templateString.replace('###TalentName###',$scope.inoviceTalent.name);
                        else
                            templateString=templateString.replace('###TalentName###','');
                        if(Talent_billingaddress)
                            templateString=templateString.replace('###TalentAddress###',Talent_billingaddress);
                        else
                            templateString=templateString.replace('###TalentAddress###','');

                        templateString=templateString.replace('###date###',$scope.trans.date);
                        templateString=templateString.replace('###Invoiceid###',$scope.trans.id);
                        templateString=templateString.replace('###amount###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amountdue###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###currency1###',$scope.trans.currency);
                        templateString=templateString.replace('###currency2###',$scope.trans.currency);
                        templateString= templateString.replace('###amount1###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amount2###',Math.abs($scope.trans.amount));
                        var m_details='';
                        if($scope.trans.milestonedetails)
                         m_details='('+$scope.trans.milestonedetails+')';

                        templateString=templateString.replace('###specification###','Invoice for (Bonus)('+$scope.trans.contractid+') : ('+$scope.trans.milestoneid+' #) , '+m_details+' to ('+$scope.inoviceTalent.name+')');
                        setTimeout(function(){
                        $('#serviceFees').html(templateString);  
                        createPDF('serviceFees'); 
                        $ionicLoading.hide();
                        },1000);
                    }
                    else if($scope.trans.payment_status=='available' && $scope.trans.payment_status!='escrow_refund' && $scope.trans.refund!='true' && $scope.trans.type!='bonus' && $scope.trans.withdraw_status!='true' && $scope.trans.serviceFees!='true')
                    {
                         var templateString=bonusTemplate;
                        if($scope.inoviceEmployer.companyName)
                            templateString=templateString.replace('###employerComanyName###',$scope.inoviceEmployer.companyName);
                        else
                            templateString=templateString.replace('###employerComanyName###','');
                        if($scope.inoviceEmployer.name)
                            templateString=templateString.replace('###employername###',$scope.inoviceEmployer.name);
                        else
                            templateString=templateString.replace('###employername###','');
                        if(Emp_billingaddress)
                            templateString=templateString.replace('###employerAddress###',Emp_billingaddress);
                        else
                            templateString=templateString.replace('###employerAddress###','');



                      if($scope.inoviceTalent.companyName)
                            templateString=templateString.replace('###TalentComanyName###',$scope.inoviceTalent.companyName);
                        else
                            templateString=templateString.replace('###TalentComanyName###','');
                        if($scope.inoviceTalent.name)
                            templateString=templateString.replace('###TalentName###',$scope.inoviceTalent.name);
                        else
                            templateString=templateString.replace('###TalentName###','');
                        if(Talent_billingaddress)
                            templateString=templateString.replace('###TalentAddress###',Talent_billingaddress);
                        else
                            templateString=templateString.replace('###TalentAddress###','');

                        templateString=templateString.replace('###date###',$scope.trans.date);
                        templateString=templateString.replace('###Invoiceid###',$scope.trans.id);
                        templateString=templateString.replace('###amount###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amountdue###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###currency1###',$scope.trans.currency);
                        templateString=templateString.replace('###currency2###',$scope.trans.currency);
                        templateString= templateString.replace('###amount1###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amount2###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###specification###','Invoice for ( '+$scope.trans.job_name+' )( '+$scope.trans.contractid+' ): ('+$scope.trans.milestoneid+' #) - ( '+$scope.trans.milestonedetails+' ), for ( '+$scope.inoviceTalent.name+' )');
                        setTimeout(function(){
                        $('#serviceFees').html(templateString);  
                        createPDF('serviceFees'); 
                        $ionicLoading.hide();
                        },1000);
                    } 
                    else if($scope.trans.payment_status=='escrow' || $scope.trans.payment_status=='escrow_transefered' || $scope.trans.payment_status=='escrow_refund' || $scope.trans.refund!='true')
                    {

                         var templateString=escrowTemplate;
                       if($scope.inoviceEmployer.companyName)
                            templateString=templateString.replace('###employerComanyName###',$scope.inoviceEmployer.companyName);
                        else
                            templateString=templateString.replace('###employerComanyName###','');
                        if($scope.inoviceEmployer.name)
                            templateString=templateString.replace('###employername###',$scope.inoviceEmployer.name);
                        else
                            templateString=templateString.replace('###employername###','');
                        if(Emp_billingaddress)
                            templateString=templateString.replace('###employerAddress###',Emp_billingaddress);
                        else
                            templateString=templateString.replace('###employerAddress###','');


                        if($scope.inoviceTalent.companyName)
                            templateString=templateString.replace('###TalentComanyName###',$scope.inoviceTalent.companyName);
                        else
                            templateString=templateString.replace('###TalentComanyName###','');
                        if($scope.inoviceTalent.name)
                            templateString=templateString.replace('###TalentName###',$scope.inoviceTalent.name);
                        else
                            templateString=templateString.replace('###TalentName###','');
                        if(Talent_billingaddress)
                            templateString=templateString.replace('###TalentAddress###',Talent_billingaddress);
                        else
                            templateString=templateString.replace('###TalentAddress###','');

                        templateString=templateString.replace('###date###',$scope.trans.date);
                        templateString=templateString.replace('###Invoiceid###',$scope.trans.id);
                        templateString=templateString.replace('###amount###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amountdue###',$scope.trans.currency+' '+Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###currency1###',$scope.trans.currency);
                        templateString=templateString.replace('###currency2###',$scope.trans.currency);
                        templateString= templateString.replace('###amount1###',Math.abs($scope.trans.amount));
                        templateString=templateString.replace('###amount2###',Math.abs($scope.trans.amount));
                        
                        if($scope.trans.paidFrom=='card')
                        templateString=templateString.replace('###specification###','Paid from (Visa / Master / Paypal ) to escrow ');
                        else
                          templateString=templateString.replace('###specification###','Paid from ('+$scope.trans.employername+') My Account to escrow ');  

                        setTimeout(function(){
                        $('#serviceFees').html(templateString);  
                        createPDF('serviceFees'); 
                        $ionicLoading.hide();
                        },1000);
                    }  
                    else
                    {
                        alert("Invoice not available.");
                    }
             
          });
    });
   

   
    }
 
    
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

	setTimeout(function(){
		if(!$scope.$$phase) {
 		$scope.$apply();
		}
  
		},5000);
        var  form,cache_width,
         a4  =[ 595.28,  841.89];  // foaper width and height
            function createPDF(id){
                form=$('#'+id);
                cache_width = form.width();
                 getCanvas().then(function(canvas){
                  var 
                  img = canvas.toDataURL("image/png"),
                  doc = new jsPDF({
                          unit:'px', 
                          format:'a4'
                });     
                doc.addImage(img, 'JPEG', 20, 20);
                doc.save('transactions.pdf');
                form.width(cache_width);
    });
}
 
// create canvas object
function getCanvas(){
 form.width((a4[0]*1.33333) -80).css('max-width','none');
 return html2canvas(form,{
     imageTimeout:2000,
     removeContainer:true
    }); 
}
Analytics.trackPage('Transactions');
}
];
var serviceFeesTemplate='<div style="width:50%;float:left;">'+
  '<div style="width: 150px;background: lightgray;text-align: center;height: 80px;line-height:80px;">'+
    'Worklidate Logo'+
  '</div>'+
  '<div style="width:100%;float:left;font-size: 14px;">'+
  '<div style="width:20%;float:left;">'+
  '  <div style="margin-top:10px;"><b>From</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
   ' <div style="margin-top:82px;"><b>Bill To</b> : </div>'+
  '  <div style="margin-top:10px;"><b>Attn</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
  '</div>'+
 ' <div style="width:80%;float:left;">'+
  '  <div style="margin-top:10px;">BLISS TECH LIMITED</div>'+
 '   <div style="margin-top:10px;min-height: 90px;">1702, Hewlett Centre, 54 Hoi Yuen Road<br/>Kwun Tong, Kowloon<br/>Hong Kong</div>'+
 '   <div style="margin-top:10px;">###employerComanyName###</div>'+
 '   <div style="margin-top:10px;">###employername###</div>'+
 '   <div style="margin-top:10px;min-height: 50px;">###employerAddress###</div>'+
  '</div>'+
 ' </div>'+
'</div>'+
'<div style="width:50%;float:left;">'+
  '<div style="width: 200px;background: lightgray;text-align: center;height: 40px;line-height:40px;float:right;">'+
 '   INVOICE'+
 ' </div>'+
 ' <div style="float:right;margin-top: 10px;margin-right: 10px;font-size: 13px;">'+
 '<div>Invoice # : ###Invoiceid###</div>'+
 ' <div>Date : ###date###</div>'+
'  <div>Total Amount:###amount###</div>'+
'  <div><b>Total Due:</b> ###amountdue###</div>'+
 ' </div>'+
'</div>'+
'<div style="float:left;width:100%;">'+
'<div style="float: left;width: 100%; min-height: 30px; border-top: 2px solid #111;border-bottom: 2px solid #111;">'+
'  <div style="float:left;width:65%;margin-left:5%;line-height:30px;">Description / Memo</div>'+
'  <div style="float:left;width:30%;text-align: center;line-height:30px;">Amount</div>'+
'</div>'+
 ' <div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 200px;">'+
 ' <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;    padding-top: 10px;">Service Fee - ###serviceFeePercent###%<br/>'+              
 ' Contract ID : ###Contract###<br/>           '+
 ' Contract Subject: ###Contractsubj###<br/>     '+         
 ' Client: ###Clientname###<br/>             '+
 ' Amount: ###specification###<br/>###note###<br/>'+
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
'    border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency1###:</div><div style="padding-top: 10px;float: left; text-align: center;width:50%;height: 100%;">###amount1###</div></div>'+
'</div>'+
'<div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 40px;">'+
'  <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;padding-top: 10px;">   '+          
 ' Total amount'+
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
  '  border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency2###:</div><div style="float: left; text-align: center;width:50%;height: 100%;padding-top: 10px;">###amount2###</div></div>'+
'</div>'+
'</div>';

var withdrawFeesTemplate='<div style="width:50%;float:left;">'+
  '<div style="width: 150px;background: lightgray;text-align: center;height: 80px;line-height:80px;">'+
    'Worklidate Logo'+
  '</div>'+
  '<div style="width:100%;float:left;font-size: 14px;">'+
  '<div style="width:20%;float:left;">'+
  '  <div style="margin-top:10px;"><b>From</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
   ' <div style="margin-top:82px;"><b>Bill To</b> : </div>'+
  '  <div style="margin-top:10px;"><b>Attn</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
  '</div>'+
 ' <div style="width:80%;float:left;">'+
  '  <div style="margin-top:10px;">BLISS TECH LIMITED</div>'+
 '   <div style="margin-top:10px;min-height: 90px;">1702, Hewlett Centre, 54 Hoi Yuen Road<br/>Kwun Tong, Kowloon<br/>Hong Kong</div>'+
 '   <div style="margin-top:10px;">###employerComanyName###</div>'+
 '   <div style="margin-top:10px;">###employername###</div>'+
 '   <div style="margin-top:10px;min-height: 50px;">###employerAddress###</div>'+
  '</div>'+
 ' </div>'+
'</div>'+
'<div style="width:50%;float:left;">'+
  '<div style="width: 200px;background: lightgray;text-align: center;height: 40px;line-height:40px;float:right;">'+
 '   INVOICE'+
 ' </div>'+
 ' <div style="float:right;margin-top: 10px;margin-right: 10px;font-size: 13px;">'+
 '<div>Invoice # : ###Invoiceid###</div>'+
 ' <div>Date : ###date###</div>'+
'  <div>Total Amount:###amount###</div>'+
'  <div><b>Total Due:</b> ###amountdue###</div>'+
 ' </div>'+
'</div>'+
'<div style="float:left;width:100%;">'+
'<div style="float: left;width: 100%; min-height: 30px; border-top: 2px solid #111;border-bottom: 2px solid #111;">'+
'  <div style="float:left;width:65%;margin-left:5%;line-height:30px;">Description / Memo</div>'+
'  <div style="float:left;width:30%;text-align: center;line-height:30px;">Amount</div>'+
'</div>'+
 ' <div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 200px;">'+
 ' <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;    padding-top: 10px;">Invoice for withdarwal fee<br/>'+              
 
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
'    border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency1###:</div><div style="padding-top: 10px;float: left; text-align: center;width:50%;height: 100%;">###amount1###</div></div>'+
'</div>'+
'<div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 40px;">'+
'  <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;padding-top: 10px;">   '+          
 ' Total amount'+
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
  '  border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency2###:</div><div style="float: left; text-align: center;width:50%;height: 100%;padding-top: 10px;">###amount2###</div></div>'+
'</div>'+
'</div>';


var bonusTemplate='<div style="width:50%;float:left;">'+
  '<div style="width:100%;float:left;font-size: 14px;">'+
  '<div style="width:20%;float:left;">'+
  '  <div style="margin-top:10px;"><b>From</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
   ' <div style="margin-top:82px;"><b>Bill To</b> : </div>'+
  '  <div style="margin-top:10px;"><b>Attn</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
  '</div>'+
 ' <div style="width:80%;float:left;">'+
  '  <div style="margin-top:10px;">###TalentComanyName###</div>'+
  '  <div style="margin-top:10px;">###TalentName###</div>'+
 '   <div style="margin-top:10px;min-height: 90px;">###TalentAddress###</div>'+
 '   <div style="margin-top:10px;">###employerComanyName###</div>'+
 '   <div style="margin-top:10px;">###employername###</div>'+
 '   <div style="margin-top:10px;min-height: 50px;">###employerAddress###</div>'+
  '</div>'+
 ' </div>'+
'</div>'+
'<div style="width:50%;float:left;">'+
  '<div style="width: 200px;background: lightgray;text-align: center;height: 40px;line-height:40px;float:right;">'+
 '   INVOICE'+
 ' </div>'+
 ' <div style="float:right;margin-top: 10px;margin-right: 10px;font-size: 13px;">'+
 '<div>Invoice # : ###Invoiceid###</div>'+
 ' <div>Date : ###date###</div>'+
'  <div>Total Amount:###amount###</div>'+
'  <div><b>Total Due:</b> ###amountdue###</div>'+
 ' </div>'+
'</div>'+
'<div style="float:left;width:100%;">'+
'<div style="float: left;width: 100%; min-height: 30px; border-top: 2px solid #111;border-bottom: 2px solid #111;">'+
'  <div style="float:left;width:65%;margin-left:5%;line-height:30px;">Description / Memo</div>'+
'  <div style="float:left;width:30%;text-align: center;line-height:30px;">Amount</div>'+
'</div>'+
 ' <div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 200px;">'+
 ' <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;    padding-top: 10px;">###specification###<br/>'+              
 
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
'    border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency1###:</div><div style="padding-top: 10px;float: left; text-align: center;width:50%;height: 100%;">###amount1###</div></div>'+
'</div>'+
'<div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 40px;">'+
'  <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;padding-top: 10px;">   '+          
 ' Total amount'+
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
  '  border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency2###:</div><div style="float: left; text-align: center;width:50%;height: 100%;padding-top: 10px;">###amount2###</div></div>'+
'</div>Remit to Worklidate<br/><br/>Invoice created via Worklidate'+
'</div>';

var escrowTemplate='<div style="width:50%;float:left;">'+
  '<div style="width: 150px;background: lightgray;text-align: center;height: 80px;line-height:80px;">'+
    'Worklidate Logo'+
  '</div>'+
  '<div style="width:100%;float:left;font-size: 14px;">'+
  '<div style="width:20%;float:left;">'+
  '  <div style="margin-top:10px;"><b>From</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
   ' <div style="margin-top:82px;"><b>Bill To</b> : </div>'+
  '  <div style="margin-top:10px;"><b>Attn</b> : </div>'+
   ' <div style="margin-top:10px;"><b>Address</b> : </div>'+
  '</div>'+
 ' <div style="width:80%;float:left;">'+
  '  <div style="margin-top:10px;">BLISS TECH LIMITED</div>'+
 '   <div style="margin-top:10px;min-height: 90px;">1702, Hewlett Centre, 54 Hoi Yuen Road<br/>Kwun Tong, Kowloon<br/>Hong Kong</div>'+
 '   <div style="margin-top:10px;">###employerComanyName###</div>'+
 '   <div style="margin-top:10px;">###employername###</div>'+
 '   <div style="margin-top:10px;min-height: 50px;">###employerAddress###</div>'+
  '</div>'+
 ' </div>'+
'</div>'+
'<div style="width:50%;float:left;">'+
  '<div style="width: 200px;background: lightgray;text-align: center;height: 40px;line-height:40px;float:right;">'+
 '   INVOICE'+
 ' </div>'+
 ' <div style="float:right;margin-top: 10px;margin-right: 10px;font-size: 13px;">'+
 '<div>Invoice # : ###Invoiceid###</div>'+
 ' <div>Date : ###date###</div>'+
'  <div>Total Amount:###amount###</div>'+
'  <div><b>Total Due:</b> ###amountdue###</div>'+
 ' </div>'+
'</div>'+
'<div style="float:left;width:100%;">'+
'<div style="float: left;width: 100%; min-height: 30px; border-top: 2px solid #111;border-bottom: 2px solid #111;">'+
'  <div style="float:left;width:65%;margin-left:5%;line-height:30px;">Description / Memo</div>'+
'  <div style="float:left;width:30%;text-align: center;line-height:30px;">Amount</div>'+
'</div>'+
 ' <div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 200px;">'+
 ' <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;    padding-top: 10px;">###specification###<br/>'+              
 
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
'    border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency1###:</div><div style="padding-top: 10px;float: left; text-align: center;width:50%;height: 100%;">###amount1###</div></div>'+
'</div>'+
'<div style="float: left;width: 100%; min-height: 30px;border-bottom: 2px solid #111;height: 40px;">'+
'  <div style="float:left;width:64%;margin-left:5%;border-right: 2px solid #111;height: 100%;padding-top: 10px;">   '+          
 ' Total amount'+
 ' </div>'+
 ' <div style="float:left;width:29%;text-align: center;height: 100%;"><div style="float: left; text-align: center;width:48%;'+
  '  border-right: 2px solid #111;height: 100%;padding-top: 10px;"> ###currency2###:</div><div style="float: left; text-align: center;width:50%;height: 100%;padding-top: 10px;">###amount2###</div></div>'+
'</div>'+
'</div>';

