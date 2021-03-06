var users={
       1520239:7 /* hogy */, 
       1526962:8 /* cseke */,
       1527157:9 /* kende */,
       1528572:11 /* robi */,
       1528571:6 /* nazs */
}
var currentMantisUId = 0;
jQuery.fn.reverse = [].reverse;
$.ajaxSetup({ cache: false });
function ajaxCall( func, d,asyn,fn) {
  var res;
  console.debug('ajax:'+func+' data:'+JSON.stringify(d));
  $.ajax({
        type: "POST",
		url: "index.php/" + func, 
		
        data: d,
		async: asyn,
        dataType: "json",
        success: function(data) {
			//console.debug('ajax success:'+fn+' data:'+JSON.stringify(data));
			res=data; 
			if (fn) { 
				f=fn.split(".");
				if (f.length>1) {
					var myFunc = window[f[0]][f[1]];
				}
				else {
					var myFunc = window[fn];
				}
				//alert(fn+' '+typeof myFunc);
				if(typeof myFunc === 'function') {
					//console.debug('ajax success,start func:'+fn+' data:'+JSON.stringify(data));
					myFunc(data);
				}
			  
			}
        },
        error: function(data) {
            console.debug('ajax error:'+func+' data:'+JSON.stringify(data));
			alert('ajax error:'+func+' data:'+JSON.stringify(data));
			res='ERROR';
        }
  });

  return res;
}

function showMain(){
	panelName='main';
	$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divcontent').html(tpl);		
			$('#divcontent').show();
			$('#togglDate').datepicker({'dateFormat':"yy-mm-dd"});
			$('#divmantisuj').addClass('tabactive');
			$('#divmantisregi').addClass('tabinactive');

			$('#togglUsers').hide();
			$('#togglProjects').hide();
			$('#divmantisusers').hide();
			$('#divmantisreporters').hide();            
			$('#mantisPartners').hide();
			$('#mantisMonths').hide();
            $('#cbOnlyTime').bind('click',function(){
                if ($(this).prop('checked')) {
                    $('#cbDateNeeded').prop('checked',false);
                    $('#cbDateNeeded').attr('disabled',true);
                    $('#cbDurationNeeded').prop('checked',false);
                    $('#cbDurationNeeded').attr('disabled',true);
                }
                else {
                    $('#cbDateNeeded').removeAttr('disabled');
                    $('#cbDurationNeeded').removeAttr('disabled');
                }
                    
            });
            $('#cbDateNeeded').bind('click',function(){
                if ($(this).prop('checked')) {
                    $('#cbOnlyTime').prop('checked',false);
                    $('#cbOnlyTime').attr('disabled',true);
                }
                else {
                    $('#cbDurationNeeded').prop('checked',false);
                    $('#cbOnlyTime').removeAttr('disabled');
                }
                    
            });            
            $('#cbDurationNeeded').bind('click',function(){
                if ($(this).prop('checked')) {
                    $('#cbOnlyTime').prop('checked',false);
                    $('#cbOnlyTime').attr('disabled',true);
                    $('#cbDateNeeded').prop('checked',true);
                }
                else {
                    if (!($('#cbDateNeeded').prop('checked'))) $('#cbOnlyTime').removeAttr('disabled');
                }
                    
            });                        
			fn='togglUsers';
			ajaxCall(fn,{},true, fn);
			fn='togglProjects';
			ajaxCall(fn,{},true, fn);
			
			fn='mantisUsers';
			ajaxCall(fn,{},true, fn);
			fn='mantisPartners';
			ajaxCall(fn,{},true, fn);
			fn='mantisMonths';
			ajaxCall(fn,{},true, fn);
			
			$('#togglfilter').click(function(){
				fn='togglTasks';
				uid = $('#togglUsers').val();
				pid = $('#togglProjects').val();
				until = $('#togglDate').val();
				ajaxCall(fn,{'userId':uid,'projectId':pid,'until':until},true, fn);
			});
			$('#divmantisuj').click(function(){
				$.get( "views/mantis_uj.tpl", function( data ) { 
					tpl = data; 
					$('.divtabcontent').html(tpl);
					$('#divmantisuj').addClass('tabactive');
					$('#divmantisregi').addClass('tabinactive');
					$('#divmantisregi').removeClass('tabactive');
					$('#divmantisuj').removeClass('tabinactive');
					$('#divmantiskulon').click(function(){
						$('#divDateNeeded').hide();
                        $('#divDurationNeeded').hide();
                        $('#divOnlyTime').hide();
						$('#divmantiskulon').addClass('tabactive');
						$('#divmantiskulon').removeClass('tabinactive');
						$('#divmantisegybe').addClass('tabinactive');
						$('#divmantisegybe').removeClass('tabactive');
						$('#divsubcontent2').hide();
						$('#divsubcontent1').show();
					});
					$('#divmantisegybe').click(function(){
						$('#divDateNeeded').show();
                        $('#divDurationNeeded').show();
                        $('#divOnlyTime').show();
						$('#divmantisegybe').addClass('tabactive');
						$('#divmantisegybe').removeClass('tabinactive');
						$('#divmantiskulon').addClass('tabinactive');
						$('#divmantiskulon').removeClass('tabactive');
						$('#divsubcontent1').hide();
						$('#divsubcontent2').show();
					});				
					$('#bkulonstart').click(function(){
						mantis_newbug();
					});
					$('#begybestart').click(function(){
						mantis_newbug_with_note();
					});
                    $('#divmantisusers').hide();
                    $('#divmantisreporters').show();
					$('#divmantiskulon').trigger('click');
				});
			
				
			});
			
			$('#divmantisregi').click(function(){
				$.get( "views/mantis_old.tpl", function( data ) { 
					tpl = data; 
					$('.divtabcontent').html(tpl);
					$('#divDateNeeded').show();
                    $('#divDurationNeeded').show();
                    $('#divOnlyTime').show();
					$('#divmantisregi').addClass('tabactive');
					$('#divmantisuj').addClass('tabinactive');
					$('#divmantisuj').removeClass('tabactive');
					$('#divmantisregi').removeClass('tabinactive');
                    $('#divmantisusers').show();
                    $('#divmantisreporters').hide();
					$('#bmantisquery').click(function(){
						mantisQuery();
					});					
				});
			
			});
			$('#divmantisuj').trigger('click');

	})
}

function mantis_newbug (){
			
				fn='Insert';
				//uid = $('#mantisUsers').val();
                uid = currentMantisUId;
				pid = $('#mantisPartners').val();
                rid = $('#mantisReporters').val();
				month = $('#mantisMonths').val();
                selected_count = $('#divtogglfilterresult input:checkbox:checked').length; 
                var mehet=false;
                mehet = (selected_count==1);
                if (selected_count>1) {
                	mehet = confirm(selected_count + " db különálló bejelentés fog a Mantisba kerülni. Folytatod?");
                }
                
				if (mehet) {
                    $('#divtogglfilterresult input:checkbox:checked').reverse().each(function(){
                        taskid = $(this).attr('taskid');
                        durationms = $(this).attr('durationms');
                        start = $(this).attr('start');
                        taskdesc = $('#desc'+taskid).html();
                        togglPar = {'taskId':taskid};
                        mantisPar = {'uid':uid,'pid':pid,'rid':rid,'desc':taskdesc,'durms':durationms,'start':start,'month':month,'note':''};
                        ajaxCall(fn,{'togglPar':togglPar,'mantisPar':mantisPar},true, fn);
                    });
                }

				
			
}

function mantis_newbug_with_note (){
			
				fn='InsertWithNote';
				//uid = $('#mantisUsers').val();
                uid = currentMantisUId;
				pid = $('#mantisPartners').val();
                rid = $('#mantisReporters').val();
				month = $('#mantisMonths').val();
				mantisDesc = $('#mantisDesc').val();
				start="";
				durationms = 0;
				note = "";
				taskIds ="";
				noteToggl="";
				$('#divtogglfilterresult input:checkbox:checked').reverse().each(function(){
					taskid = $(this).attr('taskid');
					curdur = $(this).attr('durationms');
					durationms = durationms + parseInt(curdur);
					s = $(this).attr('start');
					if (start=="") start = s;
					if ($('#cbDateNeeded').prop('checked')) {
						note += s+": "+$('#desc'+taskid).html();
                        if ($('#cbDurationNeeded').prop('checked')) {
                            note += " ("+mstoHM(curdur)+")";
                        }
                        note += "\n";
					}
					else {
						note += $('#desc'+taskid).html()+"\n";
					}

					if ($('#cbOnlyTime').prop('checked')) {
						note = "";
					}

					noteToggl += $('#desc'+taskid).html()+"\n";
					taskIds += taskid+ "\n";
				});
				mantisPar = {'uid':uid,'pid':pid,'rid':rid,'desc':mantisDesc,'durms':durationms,'start':start,'month':month,'note':note};
				togglPar = {'taskIds':taskIds,'togglDesc':noteToggl};
				ajaxCall(fn,{'togglPar':togglPar,'mantisPar':mantisPar},true, fn);
}
function mantisUpdate(mantisId,mantisHM){
				fn='UpdateWithNote';
				//uid = $('#mantisUsers').val();
                uid = currentMantisUId;
				pid = $('#mantisPartners').val();
				month = $('#mantisMonths').val();				
				start="";
				durationms = 0;
				note = "";
				taskIds ="";
				noteToggl="";
				$('#divtogglfilterresult input:checkbox:checked').reverse().each(function(){
					taskid = $(this).attr('taskid');
					curdur = $(this).attr('durationms');
					durationms = durationms + parseInt(curdur);
					s = $(this).attr('start');
					if (start=="") start = s;
					if ($('#cbDateNeeded').prop('checked')) {
						note += s+": "+$('#desc'+taskid).html();
                        if ($('#cbDurationNeeded').prop('checked')) {
                            note += " ("+mstoHM(curdur)+")";
                        }
                        note += "\n";
                        
					}
					else {
						note += $('#desc'+taskid).html()+"\n";
					}
					if ($('#cbOnlyTime').prop('checked')) {
						note = "";
					}
					noteToggl += $('#desc'+taskid).html()+"\n";
					taskIds += taskid+ "\n";
				});
				mantisPar = {'uid':uid,'pid':pid,'id':mantisId,'mantishm':mantisHM,'durms':durationms,'start':start,'month':month,'note':note};
				togglPar = {'taskIds':taskIds,'togglDesc':noteToggl};
				ajaxCall(fn,{'togglPar':togglPar,'mantisPar':mantisPar},true, fn);
	
}
function Insert(result){
	/*alert(JSON.stringify(result));*/
	$( "#togglfilter" ).trigger( "click" );
}
function InsertWithNote(result){
	/*alert(JSON.stringify(result));*/
	$( "#togglfilter" ).trigger( "click" );
}
function UpdateWithNote(result){
	/*alert(JSON.stringify(result));*/
	$( "#togglfilter" ).trigger( "click" );
	mantisQuery();
	
}


function togglUsers(result){
	r=result;
	selectStr = "";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.id+"'>"+res.fullname+"</option>";
		//alert(JSON.stringify(res));
	}
	$('#togglUsers').append(selectStr);
    $('#togglUsers').bind('change',function(){
            togglUId = $(this).val();
            mantisUId =  users[togglUId];
            $('#mantisUsers').val(mantisUId);
            currentMantisUId = mantisUId;
            $('#mantisReporters').val(currentMantisUId);
    })
	sortSelect('togglUsers');
	$('#togglUsers').show();
    $('#togglUsers').trigger('change');
	
}

function togglProjects(result){
	r=result;
	selectStr="";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.id+"'>"+res.name+"</option>";
		//alert(JSON.stringify(res));
	}
	$('#togglProjects').append(selectStr);
	sortSelect('togglProjects');
	$('#togglProjects').show();
	
	$('#togglProjects').bind('change',function () {
		togglPId =  $(this).val();
		fn='projectAssignCheck';
		ajaxCall(fn,{'togglPId':togglPId,'mantisPId':-1},true, fn+'Toggl');
        $('#divmantisresult').empty();
        $('#mantisDesc').val("");
        $('#mantisUsers').val(-1);

	})
	$('#togglProjects').trigger('change');
	
	
}
function mstoHM(ms) {
		hours = Math.trunc(ms / 1000 / 3600) ;
		minutes = Math.trunc((ms - (hours * 1000 * 3600)) / 1000 / 60);
		hours = ("00" + hours).slice(-2);
		minutes = ("00" + minutes).slice(-2);
		return hours+':'+minutes;

}
function sortSelect(id){
	var my_options = $("#"+id+" option");
	//var selected = $("#togglProjects").val(); /* preserving original selection, step 1 */

	my_options.sort(function(a,b) {
		if (a.text > b.text) return 1;
		else if (a.text < b.text) return -1;
		else return 0
	})

	$("#"+id).empty().append( my_options );
	//$("#togglProjects").val(selected); /* preserving original selection, step 2 */
	
}
function togglTasks(result){
	r=result;
	selectStr="";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		durstr = mstoHM(res.dur);
		selectStr += "<div class='toggltask' ttaskid='"+res.id+"'>";
		selectStr += "<input class=togglcb start='"+res.start.substring(0,10)+"' durationms='"+res.dur+"' taskid='"+res.id+"' type=checkbox id=cb"+res.id+">";
		selectStr += "<span>"+res.start.substring(0,10)+": </span>";
		selectStr += "<span id=desc"+res.id+">"+res.description+"</span>";
		selectStr += "<span> ("+durstr+")</span>";
		selectStr += "</div>";
		//alert(JSON.stringify(res));
	}
	$('#divtogglfilterresult').html(selectStr);
	$('.toggltask').click(function(){
		id = $(this).attr('ttaskid');
		$('#cb'+id).prop("checked", !$('#cb'+id).prop("checked"));
	});	
	$('.togglcb').click(function(event){
		event.stopPropagation();
		//event.preventDefault();
	});	
	
}

function mantisPartners(result){
	r=result;
	selectStr = "";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.id+"'>"+res.name+"</option>";
		//alert(JSON.stringify(res));
	}
	$('#mantisPartners').append(selectStr);
	$('#mantisPartners').show();
	$('#mantisPartners').bind('change',function () {
		togglPId =  $('#togglProjects').val();
		mantisPId = $(this).val();
		fn='projectAssignCheck';
		ajaxCall(fn,{'togglPId':togglPId,'mantisPId':mantisPId},true, fn);
        
        fn='mantisReporters';
        ajaxCall(fn,{'pid':mantisPId},true, fn);
        
	})
}

function projectAssignCheck (result) {
	if (result=='') {
		var r = confirm("Toggl és Mantis partner összerendelés. Folytatod?");
		if (r == true) {
			togglPId =  $('#togglProjects').val();
			mantisPId = $('#mantisPartners').val();
			fn='projectAssign';
			ajaxCall(fn,{'togglPId':togglPId,'mantisPId':mantisPId},true, fn);
		};
		
	}
}
function projectAssignCheckToggl (result) {
	if (result!='') {
			$('#mantisPartners').val(result[0].rcount);
            fn='mantisReporters';
            pid = $('#mantisPartners').val();
            ajaxCall(fn,{'pid':pid},true, fn);

	}
}

function projectAssign(result) {
	//alert(JSON.stringify(result));
}

function mantisUsers(result){
	r=result;
	selectStr = "";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.id+"'";
        if (res.id==-1) selectStr += " selected ";
        selectStr +=">"+res.username +"</option>";
		//alert(JSON.stringify(res));
	}
	$('#mantisUsers').append(selectStr);
	//$('#mantisUsers').show();
}
function mantisReporters(result){
    $('#mantisReporters').empty();
	r=result;
	selectStr = "";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.id+"'>"+res.username+"</option>";
		//alert(JSON.stringify(res));
	}
	$('#mantisReporters').append(selectStr);
    $('#mantisReporters').val(currentMantisUId);
	//$('#mantisUsers').show();
}
function mantisMonths(result){
	r=result;
	selectStr = "";
	for (var i = 0;i < r.length;i++){
		res = r[i];
		selectStr += "<option value='"+res.version+"'>"+res.version+"</option>";
		//alert(JSON.stringify(res));
	}
	$('#mantisMonths').append(selectStr);
	$('#mantisMonths').show();

}

function mantisQuery(){
	uid = $('#mantisUsers').val();
	pid = $('#mantisPartners').val();
	fn = 'mantisQueryResult';
	ajaxCall(fn,{'uid':uid,'pid':pid},true, fn);
	
}
function mantisQueryResult(result){
	selectStr="";
	for (var i = 0;i < result.length;i++){
		res = result[i];
        statusClass = "mantistask";
        if (res.status==80) statusClass = "mantistaskSolved";
        else
        if (res.status==10) statusClass = "mantistaskUnassigned";
		selectStr += "<div class='"+statusClass+"' mantishm='"+res.platform+"' mantisid="+res.id+">";
		selectStr += "<span>["+res.id+"] "+res.last_updated+" : "+res.summary;
		if (res.fixed_in_version!="") selectStr += " ("+res.fixed_in_version+") ";
        if (res.platform!="") selectStr += " ["+res.platform+"] ";
		selectStr +=" </span>"
		selectStr += "</div>";
	}
	$('#divmantisresult').html(selectStr);
	$('.mantistaskSolved, .mantistask, .mantistaskUnassigned').click(function(){
		mantisId = $(this).attr('mantisid');
		mantisHM = $(this).attr('mantishm');
		mantisDesc = $(this).text();
		var r = confirm("felírás ide: "+mantisDesc+". Folytatod?");
		if (r == true) {
			mantisUpdate(mantisId,mantisHM);
		};
		
	});

}

$(document).ready(function () {
	showMain();
})