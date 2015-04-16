var ejs = require("ejs");
//var mysql = require('./mysql');
var mysql = require('./connections');
var session = require('express');

//var sess = require('express');

function signIn(req,res) {
	//sess=req.session;
 //sess.email=req.param("emailId");
	
		ejs.renderFile('./views/login.ejs',function(err, result) {
	   // render on success
		var email=req.param("emailId");
		var password=req.param("password");
		var getUser="select * from users where emailId='"+req.param("emailId")+"' and password='"+req.param("password")+"'";
		console.log("Query is:"+getUser);	
		if((password!==undefined && email !==undefined)&&(password!=="" && email !=="")&&(password!=="=" && email!=="="))
		{
			var query = mysql.getConnection().query("select userId from users where emailId=? and password=?",[email,password], function(err, rows){
	      if(err){
	           console.log(err);
	           res.send(err);
	      }
	      else{	 
	    	  session.userId=rows[0].userId;
	    	  mysql.getConnection().end();
	    	 var lastLogin1=new Date();
	    	  var data={lastLogin:new Date()};	
	  		var userid=rows[0].userId;
	  		console.log(lastLogin1);
	    	  console.log("In function - signout"+userid);
	  		    var query2 = mysql.getConnection().query("Update users set ? where userId=? ",[data,userid], function(err, rows){    	  
	  		    	 if(err){
	  		           console.log(err);
	  		           res.send(err);
	  		      }	 
	  		}); mysql.getConnection().end();
	    	    session.emailId=email;
		    	console.log(session.emailId);
		    	console.log(session.userId);
		    	
	  res.send({"userId":rows[0].userId,"lastLogin":rows[0].lastLogin,"emailId":session.emailId,"login":"Success"});
	    	console.log("hii in else");	    	
	    	//  res.send({"login":"Success","respo":session.email});
	   	   }
	      
	         
	   });
			mysql.getConnection().end();
		}
	});
}
function signUp(req,res) {
	if(session.userId!==null || session.userId!==''){
		ejs.renderFile('./views/index.ejs',function(err, result) {
		   // render on success
		   if (!err) {
			   console.log("in fn");
			   var emailId=req.param("emailId");
				var password=req.param("password");
				var firstName=req.param("firstName");
				var lastName=req.param("lastName");
				
				console.log(emailId+password+firstName+lastName);
				if((firstName!==undefined && password !==undefined && lastName!==undefined && emailId !==undefined) && (firstName!=="" && password !=="" && lastName!=="" && emailId !=="") )  
				{	
					var data={userId:null,firstName:firstName,lastName:lastName,emailId:emailId,
							 password:password,summary:null,lastLogin:null
							 };	
				    var query =mysql.getConnection().query("INSERT INTO users set ? ",data, function(err, rows){    	  
				    			if(err){
				    					console.log(err);
				    					res.send(err);
				    					}
				    			else{
				    					session.emailId=emailId;
				    				res.send({"status":"Success"});	
				    				console.log("succeess");
				    				console.log(session.emailId);
				    			}
				    			
				    			mysql.getConnection().end();
				    			}); 
				}
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
		   }
		   else {
	            res.send({"Status":"Success"});
	            console.log(err);
		}});
	}
	else{
		console.log("session expired");
		
	}
}


exports.profile1=function profile1(req,res){
	ejs.renderFile('./views/login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
};

function profile2(req,res){
	console.log("in prof2");
	var userId=session.userId;
	//query = "select * from users u where userId= '" +userId +"'";
	var query2=mysql.getConnection().query("select * from users  where userId=?",userId,function(err,rows){
		if(err){ throw err; }
		else 
		{
			var fullName = rows[0].firstName +" "+rows[0].lastName;
			var lastLogin = rows[0].lastLogin.toUTCString();
			var summary = rows[0].summary;
			var skills = rows[0].skills;
			
			//query = "select * from education  where uidedu= '" +userId +"' and deleteFlag = 'N'";
		var query3=	mysql.getConnection().query("select * from education  where uidedu=? and deleteFlag = 'N'",userId,function(err,rows3){
				if(err) { throw err; }
				else {
					var schoolName = ['','',''];
					var fieldOfStudy = ['','',''];
					var startYear = ['','',''];
					var endYear = ['','',''];
					var grade =['','',''];
					for(var i=0;i<rows3.length;i++) {
						switch(rows3[i].degree) {
							case "Graduation":
								schoolName[0] = rows3[i].schoolName;
								fieldOfStudy[0] = rows3[i].fieldOfStudy;
								startYear[0] = rows3[i].startDate;
								endYear[0] = rows3[i].endDate;
								grade[0]=rows3[i].grade;
								break;
							case "Under Graduation":
								schoolName[1] = rows3[i].schoolName;
								fieldOfStudy[1] = rows3[i].fieldOfStudy;
								startYear[1] = rows3[i].startDate;
								endYear[1] = rows3[i].endDate;
								grade[1]=rows3[i].grade;
								break;
							case "High School":
								schoolName[2] = rows3[i].schoolName;
								fieldOfStudy[2] = rows3[i].fieldOfStudy;
								startYear[2] = rows3[i].startDate;
								endYear[2] = rows3[i].endDate;
								grade[2]=rows3[i].grade;
								break;
						}
					}
					//query = "select * from experience  where uid= '" +userId +"' and deleteFlag = 'N'";
					var query2=mysql.getConnection().query("select * from experience  where uid=? and deleteFlag = 'N'",userId,function(err,rows2){
						if(err) { throw err; }
						else {
							console.log("in query2");
							var companyName = ['','',''];
							var designation = ['','',''];
							var startYear1 = ['','',''];
							var endYear1 = ['','',''];
							var description = ['','',''];
							for(var i=0;i<rows2.length;i++) {
								switch(rows2[i].experience) {
									case "Exp1":
										companyName[0] = rows2[i].companyName;
										designation[0] = rows2[i].designation;
										startYear1[0] = rows2[i].startDate;
										endYear1[0] = rows2[i].endDate;
										description[0] = rows2[i].description;
										break;
									case "Exp2":
										companyName[1] = rows2[i].companyName;
										designation[1] = rows2[i].designation;
										startYear1[1] = rows2[i].startDate;
										endYear1[1] = rows2[i].endDate;
										description[1] = rows2[i].description;
										break;
									case "Exp3":
										companyName[2] = rows2[i].companyName;
										designation[2] = rows2[i].designation;
										startYear1[2] = rows2[i].startDate;
										endYear1[2] = rows2[i].endDate;
										description[2] = rows2[i].description;
										break;
								}
							}
							console.log(schoolName[2] +companyName[1]);
							res.send({"status":"Success","fullName":fullName,"lastLogin":lastLogin,"summary":summary,"skills":skills,
								"school":schoolName,"field":fieldOfStudy,"startYear1":startYear,"endYear1":endYear,
								"company":companyName,"desg":designation,"desc":description,"startYear2":startYear1,"endYear2":endYear1,"grade":grade});
						}
						});
					mysql.getConnection().end();
				}
				});
		mysql.getConnection().end();
		}
	});
	mysql.getConnection().end();
}
/*
function profile1(req,res) {
	console.log("before function");
	// res.send({"ss":session.userId});
	var emailId=session.emailId;
	var userId=session.userId;
	var summary=null,name=null,logInTime,degree1,endYear1,schoolName1,fieldOfStudy1;
	var degree2,endYear2,schoolName2,fieldOfStudy2,degree3,endYear3,schoolName3,fieldOfStudy3=null,startYear1,startYear2,startYear3=null;
	var company1,company2,company3,designation1,designation2,designation3,endYears1,endYears2,endYears3,grade1,grade2,grade3=null;
var startYears1,startYears3,startYears2,description1,description2,description3,skills;
	var query2=mysql.getConnection().query("select * from education  where uidedu=?",userId,function(err,rows){	
		
		if(rows.length===null){
			res.send('login',"Enter the details first ");
			res.render('/error',"No values in DB");
		}
		else{
		degree1=rows[0].degree.toString();
	   console.log(degree1);
		fieldOfStudy1=rows[0].fieldOfStudy.toString();
		schoolName1=rows[0].schoolName.toString();
		endYear1=rows[0].endDate.toDateString();
		startYear1=rows[0].startDate.toDateString();
		degree2=rows[1].degree.toString();
		fieldOfStudy2=rows[1].fieldOfStudy.toString();
		schoolName2=rows[1].schoolName.toString();
		endYear2=rows[1].endDate.toDateString();
		startYear2=rows[1].startDate.toDateString();
		degree3=rows[2].degree.toString();
		fieldOfStudy3=rows[2].fieldOfStudy.toString();
		schoolName3=rows[2].schoolName.toString();
		endYear3=rows[2].endDate.toDateString();
		startYear3=rows[2].startDate.toDateString();
		grade1=rows[0].grade.toString();
		grade2=rows[1].grade.toString();
		grade3=rows[2].grade.toString();
		
		}

var query3=mysql.getConnection().query("select * from experience  where uid=?",userId,function(err,rows){	
	if(rows.length===null){
		res.send('login',"Enter the details first ");
		ejs.render('/error',"No values in DB");
		}
	else{
	company1=rows[0].companyName.toString();
	designation1=rows[0].designation.toString();
	endYears1=rows[0].endDate.toDateString();
	company2=rows[1].companyName.toString();
	designation2=rows[1].designation.toString();
	endYears2=rows[1].endDate.toDateString();
	company3=rows[2].companyName.toString();
	designation3=rows[2].designation.toString();
	endYears3=rows[2].endDate.toDateString();
	startYears1=rows[0].startDate.toDateString();
	startYears2=rows[1].startDate.toDateString();
	startYears3=rows[2].startDate.toDateString();
	description1=rows[0].description.toString();
	description2=rows[1].description.toString();
	description3=rows[2].description.toString();
	
	
	
	console.log(endYear3+startYear3);
	}


	var query=mysql.getConnection().query("select * from users u where u.userId=?",userId,function(err,rows){
		if(!err){
			if(rows.length===null){
				res.send('login',"Enter the details first ");
			}
			else{
		summary=rows[0].summary.toString();
		name=rows[0].firstName.toString()+" "+rows[0].lastName.toString();
		logInTime=rows[0].lastLogin.toUTCString();
		skills=rows[0].skills;
		console.log(name);
		
		}}
	else{
		res.end(err);
		res.send('login',"Enter the details first ");
	}

	if((name==="" || name===null) && (degree1==="" || degree1===null) && (company1 ==="" || company1===null)){
		console.log("in if");
		res.render('login',{"name":null,"summary":null,"logInTime":null,
			"degree1":null,"fieldOfStudy1":null,"schoolName1":null,"endYear1":null,"startYear1":null,
			"degree2":null,"fieldOfStudy2":null,"schoolName2":null,"endYear2":null,"startYear2":null,
			"degree3":null,"fieldOfStudy3":null,"schoolName3":null,"endYear3":null,"startYear3":null,
			"company1":null,"designation1":null,"endYears1":null,
			"company2":null,"designation2":null,"endYears2":null,
			"company3":null,"designation3":null,"endYears3":null});
	}else{
	console.log(degree1+name+startYear3);
        res.render('login',{"name":name,"summary":summary,"logInTime":logInTime,
		"degree1":degree1,"fieldOfStudy1":fieldOfStudy1,"schoolName1":schoolName1,"endYear1":endYear1,"startYear1":startYear1,
		"degree2":degree2,"fieldOfStudy2":fieldOfStudy2,"schoolName2":schoolName2,"endYear2":endYear2,"startYear2":startYear2,
		"degree3":degree3,"fieldOfStudy3":fieldOfStudy3,"schoolName3":schoolName3,"endYear3":endYear3,"startYear3":startYear3,
		"company1":company1,"designation1":designation1,"endYears1":endYears1,
		"company2":company2,"designation2":designation2,"endYears2":endYears2,
		"company3":company3,"designation3":designation3,"endYears3":endYears3,"grade1":grade1,"grade2":grade2,"grade3":grade3,
		"skills":skills,"description1":description1,"description2":description2,"description3":description3
        });
        
	res.render('login',{"name":"1212","summary":"1212","logInTime":"1213",
		"degree1":"1212","fieldOfStudy1":"1212","schoolName1":"1212","endYear1":"1212","startYear1":"1212",
		"degree2":"1212","fieldOfStudy2":"1212","schoolName2":"1212","endYear2":"1212","startYear2":"1212",
		"degree3":"1212","fieldOfStudy3":"1212","schoolName3":"1212","endYear3":"1212","startYear3":"1212",
		"company1":"1212","designation1":"1212","endYears1":"1212",
		"company2":"1212","designation2":"1212","endYears2":"1212",
		"company3":"1212","designation3":"1212","endYears3":"1212","session":session.emailId});
	//res.send({"login":"Success"});
	}});
});
mysql.getConnection().end();
});
}*/

function signOut(req,res){		
			console.log("HI...");
	var userid=session.userId;
// session.userId=null;
 //session.emailId=null;

	if((userid!==undefined && userid!=="") )  
		{			
		var data={logOutTime:new Date()}	;	
		console.log("In function - signout"+userid);
		    var query = mysql.getConnection().query("Update users set ? where userId=? ",[data,userid], function(err, rows){    	  
		    			if(err){
		    					console.log(err);
		    					res.send(err);
		    			}
		    			else{
		    				session.userId=null;
		    				session.emailId=null;
		    				//session.destroy();
		    				 console.log("destroyed");
		    				res.send({"Status":"Logged out successfully"});		    				
		    			}		    			
		    			mysql.getConnection().end();
		    		}); 
		    console.log(query);
		
		}
	res.send({"Status":"Logged out successfully"});
}


function updateSummary(req,res){
	console.log("in updatesumm");
	//ejs.render('./views/login.ejs',function(err, result){
		console.log("in updatesumm");
	//	if(!err){	
			if(session.userId!==null ||session.userId!==''){
			var userId=session.userId;
			var summary=req.param("summary");
			var data={summary:summary};
			if((userId!==undefined && userId!=="")&&(summary!==undefined && summary!=="") ){
				 var query = mysql.getConnection().query("Update users set ? where userId=? ",[data,userId], function(err, rows){    	  
					 if(err){
	    					console.log(err);
	    					res.send(err);
	    			}
	    			else{
	    				res.send({"Status":"Success"});		    				
	    			}		    			
	    			mysql.getConnection().end();	
				 });
				 console.log(query);
			}
			}
			else{
				console.log("Session expired");
				res.send({"Status":"Failed"});
			    console.log(err);
			}
		}
			  
//	});


exports.updateSkills= function updateSkills(req,res){
			if(session.userId!==null ||session.userId!==''){
			var userId=session.userId;
			var skills=req.param("skills");
			var data={skills:skills};
			if((userId!==undefined && userId!=="")&&(skills!==undefined && skills!=="") ){
				 var query = mysql.getConnection().query("Update users set ? where userId=? ",[data,userId], function(err, rows){    	  
					 if(err){
	    					console.log(err);
	    					res.send(err);
	    			}
	    			else{
	    				res.send({"Status":"Success"});		    				
	    			}		    			
	    			mysql.getConnection().end();	
				 });
				 console.log(query);
			}
			}
			else{
				console.log("Session expired");
				res.send({"Status":"Failed"});
			   // console.log(err);
			}
	
} ;
function updateExperience(req,res){
			   	var companyName =[req.param("company1"),req.param("company2"),req.param("company3")];
				var designation =[req.param("designation1"),req.param("designation2"),req.param("designation3")];
				var startDate =[req.param("startYears1"),req.param("startYears2"),req.param("startYears3")];
				var endDate =[req.param("endYears1"),req.param("endYears2"),req.param("endYears3")];
				var description =[req.param("description1"),req.param("description2"),req.param("description3")];
				var experience=["Exp1","Exp2","Exp3"];
	        	var uidedu=session.userId;
				
			/*	var companyName =['abc','def','asdasdad'] ;
				var designation =["eddssfddsfu","12221","asdas"] ;
				var startDate =['1991-01-01','1991-01-01','1991-01-01'] ;
				var endDate =['1991-01-01','1991-01-01','1991-01-01'];
				var description =["aca","asda","asd"];
				var exp=["Exp1","Exp2","Exp3"] ;
				var uidedu="1";
				var date1='01-01-1991';
				console.log(date1);
				console.log(date1.toString);*/
	        	
				for(var i=0;i<=2;i++){
					console.log("hi"+i);
					(function(i){
					var query = mysql.getConnection().query("Select * from experience where uid = ? and deleteFlag='N'",uidedu, function(err, rows){
							if(rows.length===0){
								console.log("hi11");
								/*insert*/
								if(companyName[i]!=="" && designation[i]!=="" && startDate[i]!=="" && endDate[i]!==""){
									var data1={ experienceId:null, companyName:companyName[i],designation:designation[i],
											description:description[i],startDate:startDate[i],endDate:endDate[i],uid:uidedu,experience:experience[i]};
									
									var query3=mysql.getConnection().query("insert into experience set ?",data1,function(err,rows){
									console.log("insert into experience set");
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									}
								else{
									res.send({"Status":"Missing Mandatory Fields"});
								}
								}
							else{
								if(companyName[i]=="" && designation[i]=="" && startDate[i]=="" && endDate[i]==""){
									/*delete flag*/
									var data1={companyName:companyName[i],designation:designation[i],
											description:description[i],startDate:startDate[i],endDate:endDate[i],uid:uidedu,experience:experience[i]}
									
									var query1=mysql.getConnection().query("update experience set deleteFlag=? where uid=? and experience=?",['Y',uidedu,experience[i]],function(err,rows){
									
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									
								}
								else if(companyName[i]!="" && designation[i]!="" && startDate[i]!="" && endDate[i]!=""){
									/*Update query*/
									var data={companyName:companyName[i],designation:designation[i],
											description:description[i],startDate:startDate[i],endDate:endDate[i],uid:uidedu,experience:experience[i]};
									
									var query2=mysql.getConnection().query("update experience set ? where uid=? and experience=?",[data,uidedu,experience[i]],function(err,rows){
									
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									
								}
								else{
									res.send({"Status":"Missing Mandatory Fields"});
								}
							}
							
				}); mysql.getConnection().end();
					})(i);
					}		
		   }
		   // render or error	

function insertEducation(req,res){
	console.log("hi");
		   // render on success
		console.log("hi");
			    var schoolName =[req.param("schoolName1"),req.param("schoolName2"),req.param("schoolName3")];
				var fieldOfStudy =[req.param("fieldOfStudy1"),req.param("fieldOfStudy2"),req.param("fieldOfStudy3")] ;
				var grade =[req.param("grade1"),req.param("grade2"),req.param("grade3")] ;
				var startDate =[req.param("startYear1"),req.param("startYear2"),req.param("startYear3")] ;
				var endDate =[req.param("endYear1"),req.param("endYear2"),req.param("endYear3")];
				var description =[req.param("description1"),req.param("description2"),req.param("description3")];
				var degree=["Graduation","Under Graduation","High School"] ;
				console.log(schoolName[0]);
				
				/*var schoolName1 =['abc','def','efg'] ;
				var fieldOfStudy1 =["edu","asc","asdas"] ;
				var grade1 =["A","B","C"] ;
				var startDate1 =['1991-01-01','1991-01-01','1991-01-01'] ;
				var endDate1 =['1991-01-01','1991-01-01','1991-01-01'];
				var description1 =["aca","asda","asd"];
				var degree1=["Graduation","Under Graduation","High School"] ;
				var uidedu="1";*/
				console.log("hi");
				
				var uidedu=session.userId;
				for(var i=0;i<=2;i++){	
					console.log(i);
					(function(i){
				var query = mysql.getConnection().query("Select * from education where uidedu = ? and deleteFlag='N' and degree=?",[uidedu,degree[i]], function(err, rows){
							if(rows.length===0){
								console.log(i);
								console.log(schoolName[i]);
								/*insert*/
								if(schoolName[i]!=="" && fieldOfStudy[i]!=="" && grade[i]!=="" && startDate[i]!=="" && endDate[i]!==""){
									var data1={ educationId:null, schoolName:schoolName[i],startDate:startDate[i],endDate:endDate[i],fieldOfStudy:fieldOfStudy[i],
											degree:degree[i],grade:grade[i],uidedu:uidedu};
									console.log(schoolName[i]);
									var query1=mysql.getConnection().query("insert into education set ?",data1,function(err,rows){
										console.log(schoolName[i]);
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									}
								else{
									res.send({"Status":"Missing Mandatory Fields"});
								}
								}
							else{
								if(schoolName[i]=="" && fieldOfStudy[i]=="" && grade[i]=="" && startDate[i]=="" && endDate[i]==""){
									/*delete flag*/
									var data1={schoolName:schoolName[i],fieldOfStudy:fieldOfStudy[i],
											grade:grade[i],startDate:startDate[i],endDate:endDate[i],degree:degree[i]}
									
									var query1=mysql.getConnection().query("update education set deleteFlag=? where uidedu=? and degree=?",['Y',uidedu,degree[i]],function(err,rows){
									
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									
								}
								else if(schoolName[i]!="" && fieldOfStudy[i]!="" && grade[i]!="" && startDate[i]!="" && endDate[i]!=""){
									/*Update query*/
									var data2={schoolName:schoolName[i],fieldOfStudy:fieldOfStudy[i],
											grade:grade[i],startDate:startDate[i],endDate:endDate[i]};
									
									var query2=mysql.getConnection().query("update education set ? where uidedu=? and degree=?",[data2,uidedu,degree[i]],function(err,rows){
									
										if(err){
					    					console.log(err);
					    					res.send({"Status":"DB Error"});
					    			}
					    			else{
					    				res.send({"Status":"Success"});		    				
					    			}		    			
					    			mysql.getConnection().end();
									});
									
								}
								else{
									res.send({"Status":"Missing Mandatory Fields"});
								}
							}
							mysql.getConnection().end();
				});
					})(i);
					}		
		   }
		   // render or error




function editP(req,res){
	ejs.renderFile('./views/editProfile.ejs',function(err, result) {
		   // render on success
		   if (err) {throw err;}
		   else{
			res.end(result);   
		   }
	});		   
}

function editPrf(req,res){
	console.log("in fn22");	
		// res.send({"ss":session.userId});
		var emailId=session.emailId;
		var userId=session.userId;
		var summary=null,degree1=null,endYear1=null,schoolName1=null,fieldOfStudy1=null;
		var degree2=null,endYear2=null,schoolName2=null,fieldOfStudy2=null,degree3=null,endYear3=null,schoolName3=null,fieldOfStudy3=null,startYear1=null,startYear2=null,startYear3=null;
		var company1=null,company2=null,company3=null,designation1=null,designation2=null,designation3=null,endYears1=null,endYears2=null,endYears3=null,grade1=null,grade2=null,grade3=null;
	var startYears1=null,startYears3=null,startYears2=null,description1=null,description2=null,description3=null,skills=null;
		var query2=mysql.getConnection().query("select * from education  where uidedu=?",userId,function(err,rows){	
			if(err){ 
				res.send({"name":null,"summary":null,"logInTime":null,
				"degree1":null,"fieldOfStudy1":null,"schoolName1":null,"endYear1":null,"startYear1":null,
				"degree2":null,"fieldOfStudy2":null,"schoolName2":null,"endYear2":null,"startYear2":null,
				"degree3":null,"fieldOfStudy3":null,"schoolName3":null,"endYear3":null,"startYear3":null,
				"company1":null,"designation1":null,"endYears1":null,
				"company2":null,"designation2":null,"endYears2":null,
				"company3":null,"designation3":null,"endYears3":null});
				throw err;}
			if(rows.length===null){
				res.send('login',"Enter the details first ");
				res.render('error',"No values in DB");
			}
			else{
			degree1=rows[0].degree.toString();
		   console.log(degree1);
			fieldOfStudy1=rows[0].fieldOfStudy.toString();
			schoolName1=rows[0].schoolName.toString();
			endYear1=rows[0].endDate.toISOString().substring(0,10);
			startYear1=rows[0].startDate.toISOString().substring(0,10);
			degree2=rows[1].degree.toString();
			fieldOfStudy2=rows[1].fieldOfStudy.toString();
			schoolName2=rows[1].schoolName.toString();
			endYear2=rows[1].endDate.toISOString().substring(0,10);
			startYear2=rows[1].startDate.toISOString().substring(0,10);
			degree3=rows[2].degree.toString();
			fieldOfStudy3=rows[2].fieldOfStudy.toString();
			schoolName3=rows[2].schoolName.toString();
			endYear3=rows[2].endDate.toISOString().substring(0,10);
			startYear3=rows[2].startDate.toISOString().substring(0,10);
			grade1=rows[0].grade.toString();
			grade2=rows[1].grade.toString();
			grade3=rows[2].grade.toString();
			console.log(grade3);
			}

	var query3=mysql.getConnection().query("select * from experience  where uid=?",userId,function(err,rows){	
		console.log("in fn3");
		if(err){ 
			res.send({"name":null,"summary":null,"logInTime":null,
			"degree1":null,"fieldOfStudy1":null,"schoolName1":null,"endYear1":null,"startYear1":null,
			"degree2":null,"fieldOfStudy2":null,"schoolName2":null,"endYear2":null,"startYear2":null,
			"degree3":null,"fieldOfStudy3":null,"schoolName3":null,"endYear3":null,"startYear3":null,
			"company1":null,"designation1":null,"endYears1":null,
			"company2":null,"designation2":null,"endYears2":null,
			"company3":null,"designation3":null,"endYears3":null});
			throw err;}
		if(rows.length===null){
			res.send('login',"Enter the details first ");
			ejs.render('/error',"No values in DB");
			}
		else{
		company1=rows[0].companyName.toString();
		designation1=rows[0].designation.toString();
		endYears1=rows[0].endDate.toDateString();
		company2=rows[1].companyName.toString();
		designation2=rows[1].designation.toString();
		endYears2=rows[1].endDate.toDateString();
		company3=rows[2].companyName.toString();
		designation3=rows[2].designation.toString();
		endYears3=rows[2].endDate.toDateString();
		startYears1=rows[0].startDate.toISOString().substring(0,10);
		startYears2=rows[1].startDate.toISOString().substring(0,10);
		startYears3=rows[2].startDate.toISOString().substring(0,10);
		description1=rows[0].description.toString();
		description2=rows[1].description.toString();
		description3=rows[2].description.toString();
		console.log(company3);
		console.log(endYear3+startYear3);
		}


		var query=mysql.getConnection().query("select * from users u where u.userId=?",userId,function(err,rows){
			if(!err){
				if(rows.length===null){
					res.send('login',"Enter the details first ");
				}
				else{
			summary=rows[0].summary.toString();
			var name=rows[0].firstName.toString()+" "+rows[0].lastName.toString();
			var logInTime=rows[0].lastLogin.toUTCString();
			skills=rows[0].skills;
			console.log(name);
			
			}		
				}
			else{
				res.send({"name":null,"summary":null,"logInTime":null,
					"degree1":null,"fieldOfStudy1":null,"schoolName1":null,"endYear1":null,"startYear1":null,
					"degree2":null,"fieldOfStudy2":null,"schoolName2":null,"endYear2":null,"startYear2":null,
					"degree3":null,"fieldOfStudy3":null,"schoolName3":null,"endYear3":null,"startYear3":null,
					"company1":null,"designation1":null,"endYears1":null,
					"company2":null,"designation2":null,"endYears2":null,
					"company3":null,"designation3":null,"endYears3":null});
					throw err;
			}
		/*else{
			res.end(err);
			res.send('login',"Enter the details first ");
		}*/

		if((name==="" || name===null) && (degree1==="" || degree1===null) && (company1 ==="" || company1===null)){
			console.log("in if");
			res.render('editProfile',{"name":null,"summary":null,"logInTime":null,
				"degree1":null,"fieldOfStudy1":null,"schoolName1":null,"endYear1":null,"startYear1":null,
				"degree2":null,"fieldOfStudy2":null,"schoolName2":null,"endYear2":null,"startYear2":null,
				"degree3":null,"fieldOfStudy3":null,"schoolName3":null,"endYear3":null,"startYear3":null,
				"company1":null,"designation1":null,"endYears1":null,
				"company2":null,"designation2":null,"endYears2":null,
				"company3":null,"designation3":null,"endYears3":null});
		}else{
		console.log(degree1+name+startYear3);
		console.log(summary);
	        res.render('editProfile',{"name":name,"summary":summary,"logInTime":logInTime,
			"degree1":degree1,"fieldOfStudy1":fieldOfStudy1,"schoolName1":schoolName1,"endYear1":endYear1,"startYear1":startYear1,
			"degree2":degree2,"fieldOfStudy2":fieldOfStudy2,"schoolName2":schoolName2,"endYear2":endYear2,"startYear2":startYear2,
			"degree3":degree3,"fieldOfStudy3":fieldOfStudy3,"schoolName3":schoolName3,"endYear3":endYear3,"startYear3":startYear3,
			"company1":company1,"designation1":designation1,"endYears1":endYears1,
			"company2":company2,"designation2":designation2,"endYears2":endYears2,
			"company3":company3,"designation3":designation3,"endYears3":endYears3,"grade1":grade1,"grade2":grade2,"grade3":grade3,
			"skills":skills,"description1":description1,"description2":description2,"description3":description3,"startYears1":startYears1,
			"startYears2":startYears2,"startYears3":startYears3});
		}});
	});
	});
	}
exports.connections=function connections(req,res){
	ejs.renderFile('./views/connections.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
};

exports.displaySearch=function displaySearch(req,res){
	ejs.renderFile('./views/searchMember.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log("error" +err);
        }
    });
};

exports.getSearch=function getSearch(req,res){
	var search=req.param("search");
	var userId = session.userId;
	var query1;
	//session.searchVal = search;
	var searchArr = search.split(" ");
	var cFullName, cBool, cUserId, errMsg;
	if (searchArr.length>1) {
		query1 = "select * from users where (firstName = '" +search +"') or (lastName = '" +search +"') or (firstName = '" +searchArr[0] +"' and lastName = '" +searchArr[1] +"') or (firstName = '" +searchArr[1] +"' and lastName = '" +searchArr[0] +"')";
	}
	else {
		query1 = "select * from users where (firstName = '" +search +"') or (lastName = '" +search +"') or (emailId = '" +search +"')";
	}
	if (query1!==undefined) {
		console.log(query1);
	mysql.getConnection().query(query1,(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log(results[0].emailId);
				cFullName = results[0].firstName +" " +results[0].lastName;
				cUserId = results[0].userId;
				var query2 = "select *from connections where (uidcon = '" +userId +"' and connectedToId = '" +cUserId +"') or (uidcon = '" +cUserId +"' and connectedToId = '" +userId +"')";
				mysql.getConnection().query(query2,(function(err,results){
					if(err) { throw err; }
					else {
						console.log("u:"+userId +",cu:" +cUserId);
						if(results.length >= 1 || userId.toString() === cUserId.toString()){
							cBool = true;
						}
						else {
							cBool = false;
						}
						res.send({"search":"Success","fullName":cFullName,"cUserId":cUserId,"cBool":cBool});
					}
				}));
				mysql.getConnection().end();
			}
			else {    
				console.log("No Search Results");
				res.send({"search":"Error","errMsg":"Please enter a valid name or email"});
			}
		}
	}));
	mysql.getConnection().end();
	}
	else {
		res.send({"search":"Error","errMsg":"Please enter a valid name or email"});
	}
};

exports.newConnection=function newConnection(req,res){
	var cUserId=req.param("cUserId");
	var userId=session.userId;
	//var query="insert into connections (connectionStatus, connectedToId, uidcon) values ('0','"+cUserId +"','"+userId+"')";
	var query=	mysql.getConnection().query("insert into connections (connectionStatus, connectedToId, uidcon) values ('0','"+cUserId +"','"+userId+"')",(function(err,results) {
		if(err){
			throw err;
		}
		else {
			res.send({"connect":"Request Sent"});
		}  
	}));
	mysql.getConnection().end();
	};

exports.getConnections=function getConnections(req,res){
	var userId = session.userId;
	var query;
	var iFullName, iCount, iUserId, cFullNames = "";
	query = "select * from users where userId in (select uidcon from connections where connectedToId = '" +userId +"' and connectionStatus = '0')";

	mysql.getConnection().query("select * from users where userId in (select uidcon from connections where connectedToId = '" +userId +"' and connectionStatus = '0')",(function(err,results){
		if(err){ throw err; }
		else 
		{
			iCount = results.length;
			if (results.length > 0) {
				iFullName = results[0].firstName +" " +results[0].lastName;
				iUserId = results[0].userId;
			}
			query = "select * from users where userId in (select connectedToId from connections where uidcon = '" +userId +"' and connectionStatus = '1')";
			
			mysql.getConnection().query("select * from users where userId in (select connectedToId from connections where uidcon = '" +userId +"' and connectionStatus = '1')",(function(err,results){
				if(err) { throw err; }
				else {
					for (var i=0; i<results.length;i++) {
						cFullNames += results[i].firstName +" " +results[i].lastName;
						if (i !== results.length -1) {
							cFullNames += "@#$&*";
						}
					}
					res.send({"status":"Success","iFullName":iFullName,"iUserId":iUserId,"iCount":iCount,"cCount":results.length,"cFullNames":cFullNames});
				}
				}));
			mysql.getConnection().end();
		}
	}));
	mysql.getConnection().end();
};

exports.acceptInvitation=function accptInvitation(req,res){
	var iUserId=req.param("iUserId");
	var userId=session.userId;
	//var query="insert into connections (connectionStatus, connectedToId, uidcon) values ('1','"+iUserId +"','"+userId+"')";
	mysql.getConnection().query("insert into connections (connectionStatus, connectedToId, uidcon) values ('1','"+iUserId +"','"+userId+"')",(function(err,results) {
		if(err){
			throw err;
		}
		else {
			//var query="update connections set connectionStatus = '1' where connectedToId = '" +userId +"' and uidcon = '" +iUserId +"'";
			mysql.getConnection().query("update connections set connectionStatus = '1' where connectedToId = '" +userId +"' and uidcon = '" +iUserId +"'",function(err,results) {
				if(err){
					throw err;
				}
				else {
					res.send({"status":"Connected"});
				}  
			});
			mysql.getConnection().end();
		}
	}));
	mysql.getConnection().end();
	};
	
exports.insertEducation=insertEducation;
exports.updateExperience=updateExperience;	
exports.updateSummary=updateSummary;
exports.signUp=signUp;
exports.profile2=profile2;
exports.editP=editP;
exports.signOut=signOut;
exports.signIn=signIn;
exports.editPrf=editPrf;