$(document).ready(function load()
{
//var query = document.getElementById('queryBox').value;
//document.getElementById('spanId').innerHTML = query;
    
    var domain = "exa.dei.unipd.it";
    var bucketSize = 10;
    
    var initialTimestamp = Math.floor(Date.now() / 1000);
    
    var lastTimestamp = initialTimestamp;
    
    var graph_mode_flag = false;
    

    var nanoListContainerMaxHeight = 800;
    
    /* D3 variables */
    
    var expanded_nodes_list = new Array();
    var svg;
    var color;
    var simulation;
    var circles_size = 8;
    var list_of_nodes_to_exclude = new Array();
    var list_of_parents_not_to_exclude = new Array();
    var nanoID;
    var windowCounter = 0;
    
    // Nanopub graph					   
    var nanopub_graph = {
	"nodes": [],
	
	"links":[]};
    
    var nanopub_graph_copy = {
	"nodes": [],
	
	"links":[]};

    var nanopub;
    
    // Labels
    
    var labels_array = [];
    
    //Colors schema
 var colors = {"assertion":{"background":"#99CCFF","subject":"#E33722","predicate":"#1840F4","object":"#408B13"},"provenance":"#EB613D", "publication_info":"#FFFF66","generic_node":"#0F2B46", "GENE": "#008B00", "DISEASE": "#B71C1C" }; 
    


 $('.searchButton').click(function () {

     $('#searchForm').on('submit', function() {
         let queryText = $('#query').val();
         console.log('queryText: '+queryText);

         queryText = queryText.replace("/","");
         console.log('queryText (replace done): '+queryText);

         $('#query').val(queryText);
         return;
     });




 });
    
    function getNanopubIdFromUrl(nanopub_URL)
    {
        nanopub_URL = nanopub_URL.substr(nanopub_URL.lastIndexOf("/")+1);
        nanopub_URL = nanopub_URL.replace("#assertion","");
        nanopub_URL = nanopub_URL.substring(nanopub_URL.indexOf(".")+1);
        return nanopub_URL;
    }
    
    $('#toggle-graph-nanoinfo').click(async function(){
        console.log($('#toggle-graph-nanoinfo-text').html());
        let text_button_nanoinfo = $('#toggle-graph-nanoinfo-text').html();
        if(text_button_nanoinfo.includes("Show Graph Layer&nbsp;"))
            {
                $("#graphAnalysis").show();
                $("#nanopubInfo").hide();
                //$('#toggle-graph-nanoinfo-text').html("Show Nanopub Info");
                $('#toggle-graph-nanoinfo-text').html("Show Nanopub Info&nbsp;");
                $('#toggle-graph-nanoinfo-text-copy').html("Show Nanopub Info&nbsp;");
                $('#nanoListContainer').removeClass('col-md-12');
                $('#nanoListContainer').addClass('col-md-6');
                $('#expand-nanoInfo').html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Graph Layer");
                graph_mode_flag = true;
                
            }
        else
            {
                if(nanoID != undefined)
                    {
                        let modal_loading_body = "<center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>";
                        
                        showModal('loadingNanoData','Loading Nanopub Data',modal_loading_body);
                        
                        let nano_html = await getNanopubInfoHtml(nanoID,windowCounter);
                        
                        
                        $('#nanopubInfo').html(nano_html);
                        
                        setTimeout(function(){hideModal("loadingNanoData");},500);
        
                        moreTextFunction();
                         $('.card-header').click(function()
                            {
                                console.log('card click: '+this.id);

                                 let card_body =  $('#'+this.id).parent().find('.card-body');

                                card_body.toggle('fast');

                            });
                    }
                $("#nanopubInfo").show();
                $("#graphAnalysis").hide();
                $('#toggle-graph-nanoinfo-text').html("Show Graph Layer&nbsp;");
                $('#toggle-graph-nanoinfo-text-copy').html("Show Graph Layer&nbsp;");
                $('#nanoListContainer').removeClass('col-md-12');
                $('#nanoListContainer').addClass('col-md-6');
                $('#expand-nanoInfo').html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Nanopub Info");
                graph_mode_flag = false;
                
            }
        
    });
    
    function showModal(id, title, body){
        
        
        
         let modal = "<div class=\"modal fade\" id=\""+id+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">"+title+"<\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\">"+body+"<\/div><\/div><\/div><\/div>";
        
        $("body").append(modal);
        
        $('#'+id).modal('show');
    }
    
    function showModalV2(id, title, body, style){
        
        
        
         let modal = "<div class=\"modal fade\" id=\""+id+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">"+title+"<\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\"  style=\""+style+"\">"+body+"<\/div><\/div><\/div><\/div>";
        
        $("body").append(modal);
        
        $('#'+id).modal('show');
    }
    
    function hideModal(id)
    {
            $('#'+id).modal('hide');
            $('#'+id).hide();
            $('#'+id).remove();
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            $('body').css('padding-right','0px');
    }
    
     function hideModalLight(id)
    {

            $('#'+id).modal('hide');
            $('#'+id).hide();

            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            $('body').css('padding-right','0px');
    }
    
    function newInfoButton(id, html)
    {
        return "<button class='btn btn-info'>"+html+"</button>";
    }
    
    function newCenteredInfoButton(id, html)
    {
        return "<center><button id='"+id+"' class='btn btn-info'>"+html+"</button></center>";
    }
    
    function moreTextFunction()
    {
             $('.moreText').click(function(){
                    
                    
        let label_text = $('#'+this.id).text();
        console.log('click on '+label_text);
         
        let target_id = $('#'+this.id).attr("target-id");
        let target_text = $('#'+this.id).attr("target-text");
         
         console.log("target_text rg.1152: "+target_text);
        
         console.log("target_id: "+target_id);
         //target_text = target_text.replace(/[^a-zA-Z ]/g, "");
                    console.log(target_text);
        let text_dimension = parseInt($('#'+this.id).attr("dimension"));
                    console.log(text_dimension);
       
        if(text_dimension>text_dimension_threshold)
            {
                short_text = getShortText(target_text);
                
                console.log("short_text rg.1164: "+short_text);
                
                $('#'+this.id).attr("dimension",text_dimension_threshold);
                $('#'+this.id).text("more");
                
                $('#'+target_id).html(short_text);
            
            }
        
        else if(label_text == "more" )
        {
            long_text = target_text;
            
           
            $('#'+this.id).attr("dimension",target_text.length);
            $('#'+this.id).text("less");
            
            console.log("long_text rg.1181: "+long_text);
            
            
            $('#'+target_id).html(long_text+"&nbsp;");
        }
         else
             {
                 $('#'+this.id).attr("dimension",text_dimension_threshold);
                 $('#'+this.id).text("");
                 $('#'+target_id).html(target_text);
             }


    });
    }
    
    function getNanopubInfoHtml(nanopubID, number){


        console.log('nanopubID in getNanopubInfoHtml(): '+nanopubID);

  return new Promise(resolve => {



                $.ajax({url: //"http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
                "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(function( data ) {



             var nanopubData = data;

              var description = nanopubData.content.description;
              var entities = nanopubData.content.entities;
              var subject = nanopubData.content.subject;
              var creationDate = nanopubData.creation_date;
              var creators = nanopubData.creators;
              var collaborators = nanopubData.collaborators;
              var platform = nanopubData.platform;
              var rights_holder = nanopubData.rights_holder;
              var rights_holder_id = nanopubData.rights_holder_id;
              var nanopub_url = nanopubData.url_np;
              var identifier = nanopubData.identifier;
              var text_snippet = nanopubData["text-snippet"];

              console.log("text_snippet: " +text_snippet);



                /* begin */

                   if(nanopubData.evidenceReferences!= undefined)
          {
                evidence_authors = nanopubData.evidenceReferences[0]["authors"];
	            evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
                evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
	            evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
          }

	  var assertion_generated_by = nanopubData["generated_by"];
	  var assertion_generationComment = nanopubData["generationComment"];
	  var assertion_subject;
	  var assertion_object;
	  var assertion_predicate;



            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);

              var creators_string = "[";

            if(creators != undefined )
                {
                  for(let j=0;j<creators.length;j++)
                      {
                          let name_creator = creators[j]["name"];
                          let family_name_creator = creators[j]["family_name"];
                          let id_agent_creator = creators[j]["id_agent"];

                          if(j<creators.length-1)
                              {
                                 creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                              }
                          else{
                              creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                          }
                      }
                }

            creators_string += "]";

             var collaborators_string = "[";

             if(collaborators != undefined )
                {

                  for(let j=0;j<collaborators.length;j++)
                      {
                          let name_collaborator = collaborators[j]["name"];
                          let family_name_collaborator = collaborators[j]["family_name"];
                          let id_agent_collaborator = collaborators[j]["id_agent"];

                          if(j<collaborators.length-1)
                              {
                                 collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                              }
                          else{
                              collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                          }
                      }
                }

            collaborators_string += "]";


            var evidence_authors_string = "[";

            if(evidence_authors != undefined )
                {

              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];

                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
                }

            evidence_authors_string += "]";


              var assertion_items = description.split(" - ");

              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }

                      }

                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {

                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }

                  counter++;


              }

                /* end */




              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/

            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion"+number+"\"><h5 class=\"card-header\" id=\"cardAssertionHeader"+number+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion"+number+"\">"+subject+" between: ["+assertion_items_string+"]</div></div>";

              let disease = "";
              let gene = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          }

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }

            let nanopub_url_short = getShortUrl(nanopub_url);

            var NanoPublicationInfoCard = "<div class=\"card\" id=\"cardPublicationInfo"+number+"\"><h5 class=\"card-header\" id=\"cardPublicationInfoHeader"+number+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Publication Info</h5><div class=\"card-body\" id=\"collapsePublicationInfo"+number+"\"><label class=\"blackLabel\">Creation date:&nbsp;</label>"+creationDate+"<br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+creators_string+"<br/><label class=\"blackLabel\">Collaborators:&nbsp;</label>"+collaborators_string+"<br/><label class=\"blackLabel\">Platform (Link to database data):&nbsp;</label><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer'>"+platform+"</a>&nbsp;<i class=\"fas fa-database\"></i><br/><label class=\"blackLabel\">Rights holder:&nbsp;</label><a href='"+rights_holder_id+"' target='_blank' rel='noopener noreferrer'>"+rights_holder+"</a><br/><label class=\"blackLabel\">Nanopub URL:&nbsp;</label><a href='http://np.inn.ac/"+ identifier+"' target='_blank' rel='noopener noreferrer'>"+nanopub_url_short+"</a><br/></div></div>";

            var NanoPublicationProvenanceCard;

            if(evidence_abstract != "")
                {
                    NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance"+number+"\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader"+number+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance"+number+"\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract"+number+"'>"+getShortText(evidence_abstract)+"</span><span class='moreText' id='moreText-textAbstract"+number+"' target-id='textAbstract"+number+"' target-text='"+encodeHTMLString(evidence_abstract)+"' dimension='300'>more</span><br/></div></div>";

                }
            else
                {
                     NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance"+number+"\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader"+number+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance"+number+"\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract"+number+"'>"+"-"+"</span><span class='moreText' id='moreText-textAbstract"+number+"' target-id='textAbstract"+number+"' target-text='"+"-"+"' dimension='300'>more</span><br/></div></div>";
                }

              var textSnippetCard = "<div class=\"card\" id=\"cardTextSnippet"+number+"\"><h5 class=\"card-header\" id=\"cardTextSnippetHeader"+number+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Cite this nanopub</h5><div class=\"card-body\" id=\"collapseTextSnippet"+number+"\">"+encodeAllUrlInText(text_snippet)+"</div></div><br/>";

             resolve(basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard);
            //return basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard;


        }).fail(function() {





                 let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder"+number+"\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader"+number+"\">Nanopub Data</h5><div class=\"card-body\"><div class=\"alert alert-danger\" role=\"alert\">No data retrieved!</div></div></div>";

                //return placeholderInfoCard;
                resolve(placeholderInfoCard);






          });


  });

        //windowCounter = number + 1;
    }

    function getNanopubData(nanopubID){





            console.log('nanopubID in getNanopubData(): ' + nanopubID);

            var nanopubData;

            return new Promise(function (resolve, reject) {


                if(nanopubID == undefined) {

                    reject("undefined id");
                }
                else
                {
                    
                    fetch("http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/" + nanopubID)
                      .then((response) => {
                        
                        return response.json();
                      })
                      .then((myJson) => {
                        nanopubData = myJson;
                        //  console.log(myJson);
                        resolve(nanopubData);
                      })
                    .catch(
                        function(){
                            console.log("Couldn't fetch data for nanopub: "+nanopubID);
                            reject("Couldn't fetch data for nanopub: "+nanopubID);
                            
                        });

                   /* $.ajax({
                        //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/db/" + nanopubID,
                        url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/" + nanopubID,
                        type: 'GET',
                        async: true,
                        timeout: 10000
                    })
                        .done(function (data) {


                            nanopubData = data;
                            resolve(nanopubData);

                        }).fail(function () {


                        //return placeholderInfoCard;
                        reject("promise error");


                    });*/

                }


            });


        //windowCounter = number + 1;
    }

      function getNanopubBucket(nanopubs) {

            console.log(nanopubs);

         let p = new Promise(async function (resolve, reject) {


             let nanopubs_data_array = new Array();
             let promises_array = new Array();
             

             for (let i = 0; i < nanopubs.length; i++) {
                 
                 var nanopubID = nanopubs[i];

                 console.log("i: " + i + " nanopubsProcessed: " + nanopubsProcessed + " nanopubID: " + nanopubID);

                 try{
                     let promise_result = await getNanopubData(nanopubID);
                     console.log(promise_result);
                     nanopubs_data_array.push(promise_result);
                 }
                 catch(error)
                 {
                     console.log("promise error: "+error);
                 }


                 
    
                
                 /*Promise.resolve()
                     .then(getNanopubData)
                     .catch(err => {

                         console.error(err);
                         console.log(nanopubs_data_array);
                         //return err;
                     })
                     .then(ok => {
                         console.dir(nanodata);

                         if (nanodata["identifier"] != undefined) {
                             nanopubs_data_array.push(nanodata);

                         } else {
                             // Request Timed Out Error

                             requestTimedOut();
                         }


                         //console.log(nanopubs_data_array.length);
                         console.log(nanopubs_data_array);
                     });*/


             }

             
             
             //nanopubs_data_array = await Promise.all(promises_array);
             
             
             console.log(nanopubs_data_array);
             
             resolve(nanopubs_data_array);

             /*if(nanopubs_data_array.length == nanopubs.length)
             {

                 
                 
                 resolve(nanopubs_data_array);
             }
             else
             {
                 throw("Lengths do not corresponds");
             }*/
         });
          
          console.log(p);
         
        
          return p;
    }

              
    
    
    /* D3 functions */



    function getNodeColor(nodeID)
    {
        let circle_id = TextWithoutSpaces(nodeID);


        let circle_color = $('#circle-'+circle_id).attr('fill');

       return circle_color;
    }

    function getTypeOfNodeUsingColor(nodeID)
    {
        let color = getNodeColor(nodeID);

        if(color == "#B71C1C")
        {
            return "DISEASE";
        }
        else if(color == "#008B00" ){
            return "GENE"
        }

        return "NO_TYPE";

    }
    function getNodeIndex(graph, node) {

        for(let i=0;i<graph["nodes"].length;i++)
        {
            if(graph["nodes"][i]["id"] == node["id"])
            {
                return i;
            }
        }

        return -1;

    }

    function findRootNode(graph){

        let nodes_l = graph["nodes"];

        for( node of nodes_l)
        {
            if(node["id"]==node["parent"])
            {
                return node;
            }
        }

        throw("NoRootElementFound");

    }

    function getRealX(graph, node)
    {
        let node_id = node["id"];

        let circle_id = TextWithoutSpaces(node_id);


        let circle_transform_text = $('#circle-'+circle_id).attr('transform');

        let circle_translate_coords = translateTextToCoords(circle_transform_text);


        console.dir(`circle_translate_coords: ${circle_translate_coords}`);

        let g_transform_text;

        let g_parent = $('#circle-'+circle_id).parent();

        console.dir(g_parent);

        if(g_parent.attr('transform')!= undefined)
        {
            g_transform_text = g_parent.attr('transform');
        }
        else
        {
            let mid_object = g_parent[0]['attributes'];
            console.dir(mid_object);
            console.log(typeof mid_object);
            g_transform_text = mid_object.transform.value;

        }

        console.dir(g_transform_text);

        console.log("parent: "+$('#circle-'+circle_id).parent()+", g_transform_text: "+g_transform_text);



        let g_translate_coords = translateTextToCoords(g_transform_text);

        console.dir(`g_translate_coords: ${g_translate_coords}`);



        let old_x = parseFloat(circle_translate_coords[0]);
        console.log("old_y: "+old_x);

        console.log('g_translate_coords[0] '+g_translate_coords[0]);
        let real_x = parseFloat(g_translate_coords[0])+old_x-200;


       return real_x;
    }

    function getRealY(graph, node)
    {
        let node_id = node["id"];

        let circle_id = TextWithoutSpaces(node_id);


        let circle_transform_text = $('#circle-'+circle_id).attr('transform');

        let circle_translate_coords = translateTextToCoords(circle_transform_text);


        console.dir(`circle_translate_coords: ${circle_translate_coords}`);

        let g_transform_text = $('#circle-'+circle_id).parent().attr('transform');

        let g_translate_coords = translateTextToCoords(g_transform_text);

        console.dir(`g_translate_coords: ${g_translate_coords}`);



        let old_y = parseFloat(circle_translate_coords[1]);

        console.log("old_y: "+old_y);

        let real_y = parseFloat(g_translate_coords[1])+old_y-200;


        return real_y;
    }

    function moveNode(graph, node, new_x, new_y)
    {
        let node_id = node["id"];

        let circle_id = TextWithoutSpaces(node_id);


        let circle_transform_text = $('#circle-'+circle_id).attr('transform');

        let circle_translate_coords = translateTextToCoords(circle_transform_text);


        //console.dir(`circle_translate_coords: ${circle_translate_coords}`);

        let g_transform_text = $('#circle-'+circle_id).parent().attr('transform');

        let label = $('#circle-'+circle_id).next();



        let g_translate_coords = translateTextToCoords(g_transform_text);

        //console.dir(`g_translate_coords: ${g_translate_coords}`);



        let old_x = parseFloat(circle_translate_coords[0]);
        let old_y = parseFloat(circle_translate_coords[1]);


        let delta_x = new_x-g_translate_coords[0]-old_x+200;
        let delta_y = new_y-g_translate_coords[1]-old_y+200;

        //console.log("g_translate_coords[0]: "+g_translate_coords[0]);
        //console.log("g_translate_coords[1]: "+g_translate_coords[1]);
        //console.log("old_x: "+old_x);
        //console.log("old_y: "+old_y);
        //console.log("delta_x: "+delta_x);
        //console.log("delta_y: "+delta_y);

        new_y = old_y + delta_y;
        new_x = old_x + delta_x;

        console.log("MoveNode(): new_x: "+new_x+", new_y: "+new_y);


        $('#circle-'+circle_id).attr('transform',"translate("+new_x+","+new_y+")");
        label.attr("x",new_x+10);
        label.attr("y",new_y);
        console.log("MoveNode(): getNodeIndex(graph, node): "+getNodeIndex(graph, node));
        graph["nodes"][getNodeIndex(graph, node)]["px"] = new_x;
        graph["nodes"][getNodeIndex(graph, node)]["py"] = new_y;

        return graph;


    }

    function rearrangeChildrenRecursive(graph,node,list_of_nodes_processed)
    {

        if(!list_of_nodes_processed.includes(node["id"]))
        {
            list_of_nodes_processed.push(node["id"]);

            let type = getTypeOfNodeUsingColor(node["id"]);
            console.log('node type: '+type);
            let children_list = getChildrenOfNodeType(node["id"], graph, type);

            console.log(`children_list: ${children_list}`);
            console.dir(children_list);

            // number of expanded nodes contained in children_list
            let n_o_e_n_c = 0;

            for (child of children_list) {
                if (expanded_nodes_list.includes(child["id"])) {
                    n_o_e_n_c++;
                }

            }


            let n_o_e = children_list.length - n_o_e_n_c + 1;
            let step_degree = 180 / n_o_e;

            console.log('step_degree: ' + step_degree);

            let start_angle = 90;
            let angle_counter_i = 1;


            for (child of children_list) {

                if (!expanded_nodes_list.includes(child["id"])) {
                    console.log('Elaboro nodo figlio: ' + child['id']);

                    let angle_i = start_angle - angle_counter_i * step_degree;
                    let radius = Math.min((250 + expanded_nodes_list.length * 30), 400);

                    console.log("n_o_e: " + n_o_e);

                    if (n_o_e == 2) {
                        radius = 600;
                    }

                    console.log('radius: ' + radius);

                    let real_x_node_l = getRealX(graph, node);
                    let real_y_node_l = getRealY(graph, node);

                    console.log(`Real x (node:${node["id"]}): ${real_x_node_l}`);
                    console.log(`Real y (node:${node["id"]}): ${real_y_node_l}`);

                    let node_x = getNewX(real_x_node_l, radius, angle_i);
                    let node_y = getNewY(real_y_node_l, radius, angle_i);

                    console.log('x: ' + node_x + ' y:' + node_y);

                    graph = moveNode(graph, child, node_x, node_y);

                    angle_counter_i++;


                } else {
                    console.log('Non elaboro: ' + child['id']);
                    graph = rearrangeChildrenRecursive(graph, child, list_of_nodes_processed);
                }
            }
        }
        else
        {
            console.log('Already processed: '+node['id']);
        }
        return graph;
    }

    function rearrangeNodes(graph)
    {
        let nodes_l = graph["nodes"];
        let root = findRootNode(graph);

        console.log(`root node: ${root["id"]}`);

        let real_x_root = getRealX(graph,root);
        let real_y_root = getRealY(graph,root);
        console.log('real_x_root: '+real_x_root+', real_y_root: '+real_y_root);

        graph = moveNode(graph,root,real_x_root,real_y_root);
        let list_of_nodes_processed = new Array();



        for(node_i of nodes_l)
        {
            let real_x_i = getRealX(graph,node_i);
            let real_y_i = getRealY(graph,node_i);

            if(real_x_i < 50)
            {
                for(node_j of nodes_l)
                {
                    let real_x_j = getRealX(graph,node_j);
                    let real_y_j = getRealY(graph,node_j);
                    graph = moveNode(graph, node_j, real_x_j+200, real_y_j);

                }
            }
            if(real_y_i < 100)
            {
                for(node_j of nodes_l)
                {
                    let real_x_j = getRealX(graph,node_j);
                    let real_y_j = getRealY(graph,node_j);
                    graph = moveNode(graph, node_j, real_x_j, real_y_j+200);

                }
            }
        }

        return graph;
    }
    
     async function showLinkInfo(source, target){
        
        //alert('source: '+source+" target: "+target);

         console.log("entered in showLinkInfo");
         hideModal("nanopubInfoModal");
         
         let modal_body = "<center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>";
        showModal("loadingInfoLinkModal","Loading link information",modal_body);

        let url_related_to = "http://"+domain+":8000/nanopub_related_to/"+encodeURIComponent(source.replace("/","§"))+"/"+encodeURIComponent(target.replace("/","§"));

        console.log(url_related_to);

        $.ajax({
            //url: "http://exa.dei.unipd.it:8000/nanopub_related_to/"+encodeURIComponent(source.replace("/","§"))+"/"+encodeURIComponent(target.replace("/","§")),
            url: url_related_to,
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(async function( data ) {
            
            setTimeout(function(){hideModal("loadingInfoLinkModal");},500);
            
            let url_assertion = data["id_assertion"];
            
            let np_id = getNanopubIdFromUrl(url_assertion);
            
            console.log('Nanopub id: '+np_id);
            
            cleanSvgTooltip();
            
        console.log('click done');
            
        
                                
        let nanopubID = np_id;
        nanoID = nanopubID;
            
        console.log('nanoID: '+nanoID);
        
        showModal("loadingNanoData","Loading Nanopub Data","<center><div class=\"spinner-border text-primary\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>");
         
        /*let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Loading Nanopub Data</h5><div class=\"card-body\"></div></div>";
        
        $('#nanopubInfo').html(placeholderInfoCard);
        
        $('#nanopubInfo').show();*/
                
                                
            let html_nanopub =  await getNanopubInfoHtml(nanoID,windowCounter);
            
            let expandViewButton = newCenteredInfoButton("expandViewButton"+windowCounter, "Expand View");
            
            
            console.log("Nanopub Data after GET request: "+data);
            console.dir(data);
           
            setTimeout(function(){hideModal("loadingNanoData");},500);
           
            
            //showModal('nanopubInfoModal','Nanopub Information: '+source+' - '+target,basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard);
            
            showModalV2('nanopubInfoModal'+windowCounter,'Nanopub Information: '+source+' - '+target,html_nanopub+expandViewButton, "max-height:500px;overflow-y:scroll;");
            
            
           
            $('#expandViewButton'+windowCounter).click(function()
            {
                hideModal('nanopubInfoModal'+windowCounter);
                $('#nanoListContainer').removeClass('col-md-12');
                $('#nanoListContainer').addClass('col-md-6');

                $('#graphAnalysis').hide('slow');
                $('#nanopubInfo').show('slow');
                
                cleanSvgTooltip();


                $('#expand-nanoInfo').html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Nanopub Info");    
                graph_mode_flag = false;  $('#nanopubInfo').html(html_nanopub);
                
                $('#toggle-graph-nanoinfo-text').html("Show Graph Layer&nbsp;");
                $('#toggle-graph-nanoinfo-text-copy').html("Show Graph Layer&nbsp;");
                
                moreTextFunction();
                 $('.card-header').click(function()
                    {
                        console.log('card click: '+this.id);
                
                         let card_body =  $('#'+this.id).parent().find('.card-body');
                
                        card_body.toggle('fast');
                
                    });
            });
            
 
            
            
            moreTextFunction();
            
            $('.card-header').click(function()
                    {
                        console.log('card click: '+this.id);
                
                         let card_body =  $('#'+this.id).parent().find('.card-body');
                
                        card_body.toggle('fast');
                
                    });
            //$('#nanopubInfo').show();

           
            $('[data-toggle="tooltip"]').tooltip();   


        
                                

        


        })
        .fail(function( data ) {
            
            alert('Error in loading Link nanopub info');
        });
        
        $('#loadingInfoLinkModal').modal('hide');
        windowCounter++;
        
    }
    
    function cleanSvgTooltip()
    {
        $('.mytooltip').hide();
        $('.mytooltip').remove();
    }
    
       function showModalNodeInfo(nodeID, id_reference, type, description)
        {
            $('.modal-backdrop').remove();
            $('#ModalNodeInfo').remove();
            
            let modal = "<div class=\"modal fade\" id=\"ModalNodeInfo\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Information about: \""+nodeID+"\" <\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\"><label class=\"greyLabels\">ID entity:&nbsp; </label>"+getShortUrlWithLink(id_reference)+"<br/><label class=\"greyLabels\">Type:&nbsp;</label>"+type+"<br/><label class=\"greyLabels\">Description:&nbsp;</label><div class=\"alert alert-warning\" role=\"alert\">No description available</div></div></div></div></div>";
            
            if(description != null && description.length > text_dimension_threshold)
                {
                    
                    modal = "<div class=\"modal fade\" id=\"ModalNodeInfo\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Information about: \""+nodeID+"\" <\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\"><label class=\"greyLabels\">ID entity:&nbsp;</label>"+getShortUrlWithLink(id_reference)+"<br/><label class=\"greyLabels\">Type:&nbsp;</label>"+type+"<br/><label class=\"greyLabels\">Description:&nbsp;</label><div id='descriptionModalNodeInfo' >"+getShortText(description)+"</div><span class='moreText' id='moreText-ModalNodeInfoDescription' target-text='"+encodeHTMLString(description)+"' target-id='descriptionModalNodeInfo' dimension='"+text_dimension_threshold+"'>more</span></div></div></div></div>";
                    
            
                }

            $("body").append(modal);

            $('#ModalNodeInfo').modal({'show': true, backdrop: true});
            
                    $('.moreText').click(function(){
                    
                    
        let label_text = $('#'+this.id).text();
        console.log('click on '+label_text);
         
        let target_id = $('#'+this.id).attr("target-id");
        let target_text = $('#'+this.id).attr("target-text");
         
         console.log("target_text rg.68: "+target_text);
        

         //target_text = target_text.replace(/[^a-zA-Z ]/g, "");
                   
        let text_dimension = parseInt($('#'+this.id).attr("dimension"));
                    console.log(text_dimension);
       
        if(text_dimension>text_dimension_threshold)
            {
                short_text = getShortText(target_text);
                
                console.log("short_text rg.80: "+short_text);
                
                $('#'+this.id).attr("dimension",text_dimension_threshold);
                $('#'+this.id).text("more");
                
                $('#'+target_id).html(short_text);
            
            }
        
        else if(label_text == "more" )
        {
            long_text = target_text;
            
           
            $('#'+this.id).attr("dimension",target_text.length);
            $('#'+this.id).text("less");
            
            console.log("long_text rg.97: "+long_text);
            
            
            $('#'+target_id).html(long_text+"&nbsp;");
        }
         else
             {
                 $('#'+this.id).attr("dimension",text_dimension_threshold);
                 $('#'+this.id).text("");
                 $('#'+target_id).html(target_text);
             }


    });
            
    
        $('.nanopub-info-toggle').click(function (){
        
        
        cleanSvgTooltip();
            
        console.log('click done');
            
        $('#nanoListContainer').removeClass('col-md-12');
        $('#nanoListContainer').addClass('col-md-6');
        
        $('#graphAnalysis').hide('slow');
        $('#nanopubInfo').show('slow');
        
            
        graph_mode_flag = false; 
            
        
                                
        let nanopubID = this.id.replace("nanopub-info-toggle-","");
        
         let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Loading Nanopub Data</h5><div class=\"card-body\"><div class=\"spinner-border text-primary\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></div></div>";
        
        $('#nanopubInfo').html(placeholderInfoCard);
        
        $('#nanopubInfo').show();
                
                                
        $.ajax({
            //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
            url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(function( data ) {

             
            
             var nanopubData = data;
            
              var description = nanopubData.content.description;
              var entities = nanopubData.content.entities;
              var subject = nanopubData.content.subject;
              var creationDate = nanopubData.creation_date;
              var creators = nanopubData.creators;
              var collaborators = nanopubData.collaborators;
              var platform = nanopubData.platform;
              var rights_holder = nanopubData.rights_holder;
              var rights_holder_id = nanopubData.rights_holder_id;
              var nanopub_url = nanopubData.url_np;
              var identifier = nanopubData.identifier;
              var text_snippet = nanopubData["text-snippet"];
            
              console.log("text_snippet: " +text_snippet);
            
            
            
                /* begin */
            
                   if(nanopubData.evidenceReferences!= undefined)
          {
                evidence_authors = nanopubData.evidenceReferences[0]["authors"];
	            evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
                evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
	            evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
          }
	 
	  var assertion_generated_by = nanopubData["generated_by"];
	  var assertion_generationComment = nanopubData["generationComment"];
	  var assertion_subject;
	  var assertion_object;
	  var assertion_predicate;
                
            
            
            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);
              
              var creators_string = "[";
            
            if(creators != undefined )
                {
                  for(let j=0;j<creators.length;j++)
                      {
                          let name_creator = creators[j]["name"];
                          let family_name_creator = creators[j]["family_name"];
                          let id_agent_creator = creators[j]["id_agent"];

                          if(j<creators.length-1)
                              {
                                 creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                              }
                          else{
                              creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                          }
                      }
                }
            
            creators_string += "]";
            
             var collaborators_string = "[";
    
             if(collaborators != undefined )
                {
            
                  for(let j=0;j<collaborators.length;j++)
                      {
                          let name_collaborator = collaborators[j]["name"];
                          let family_name_collaborator = collaborators[j]["family_name"];
                          let id_agent_collaborator = collaborators[j]["id_agent"];

                          if(j<collaborators.length-1)
                              {
                                 collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                              }
                          else{
                              collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                          }
                      }
                }
            
            collaborators_string += "]";
            
            
            var evidence_authors_string = "[";
    
            if(evidence_authors != undefined )
                {    
        
              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];
                      
                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
                }
            
            evidence_authors_string += "]";
            
            
              var assertion_items = description.split(" - ");
            
              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }
                         
                      }
                  
                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {
                                  
                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }
                  
                  counter++;
                  
                  
              }
            
                /* end */
            
            
            
            
              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/
                
            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion\"><h5 class=\"card-header\" id=\"cardAssertionHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion\">"+subject+" between: ["+assertion_items_string+"]</div></div>";
            
              let disease = "";
              let gene = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          } 

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
            
            let nanopub_url_short = getShortUrl(nanopub_url);
            
            var NanoPublicationInfoCard = "<div class=\"card\" id=\"cardPublicationInfo\"><h5 class=\"card-header\" id=\"cardPublicationInfoHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Publication Info</h5><div class=\"card-body\" id=\"collapsePublicationInfo\"><label class=\"blackLabel\">Creation date:&nbsp;</label>"+creationDate+"<br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+creators_string+"<br/><label class=\"blackLabel\">Collaborators:&nbsp;</label>"+collaborators_string+"<br/><label class=\"blackLabel\">Platform (Link to database data):&nbsp;</label><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer'>"+platform+"</a>&nbsp;<i class=\"fas fa-database\"></i><br/><label class=\"blackLabel\">Rights holder:&nbsp;</label><a href='"+rights_holder_id+"' target='_blank' rel='noopener noreferrer'>"+rights_holder+"</a><br/><label class=\"blackLabel\">Nanopub URL:&nbsp;</label><a href='http://np.inn.ac/"+ identifier+"' target='_blank' rel='noopener noreferrer'>"+nanopub_url_short+"</a><br/></div></div>";
            
            var NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract'>"+getShortText(evidence_abstract)+"</span><span class='moreText' id='moreText-textAbstract' target-id='textAbstract' target-text='"+encodeHTMLString(evidence_abstract)+"' dimension='300'>more</span><br/></div></div>";
            
              var textSnippetCard = "<div class=\"card\" id=\"cardTextSnippet\"><h5 class=\"card-header\" id=\"cardTextSnippetHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Cite this nanopub</h5><div class=\"card-body\" id=\"collapseTextSnippet\">"+encodeAllUrlInText(text_snippet)+"</div></div>";
            
            
            console.log("Nanopub Data after GET request: "+data);
            console.dir(data);
            
            $('#nanopubInfo').html(basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard);
            
 
     $('.moreText').click(function(){
                    
                    
        let label_text = $('#'+this.id).text();
        console.log('click on '+label_text);
         
        let target_id = $('#'+this.id).attr("target-id");
        let target_text = $('#'+this.id).attr("target-text");
         
         console.log("target_text rg.1152: "+target_text);
        
         console.log("target_id: "+target_id);
         //target_text = target_text.replace(/[^a-zA-Z ]/g, "");
                    console.log(target_text);
        let text_dimension = parseInt($('#'+this.id).attr("dimension"));
                    console.log(text_dimension);
       
        if(text_dimension>text_dimension_threshold)
            {
                short_text = getShortText(target_text);
                
                console.log("short_text rg.1164: "+short_text);
                
                $('#'+this.id).attr("dimension",text_dimension_threshold);
                $('#'+this.id).text("more");
                
                $('#'+target_id).html(short_text);
            
            }
        
        else if(label_text == "more" )
        {
            long_text = target_text;
            
           
            $('#'+this.id).attr("dimension",target_text.length);
            $('#'+this.id).text("less");
            
            console.log("long_text rg.1181: "+long_text);
            
            
            $('#'+target_id).html(long_text+"&nbsp;");
        }
         else
             {
                 $('#'+this.id).attr("dimension",text_dimension_threshold);
                 $('#'+this.id).text("");
                 $('#'+target_id).html(target_text);
             }


    });
            
            $('.card-header').click(function()
                    {
                        console.log('card click: '+this.id);
                
                         let card_body =  $('#'+this.id).parent().find('.card-body');
                
                        card_body.toggle('fast');
                
                    });
            $('#nanopubInfo').show();

           
            $('[data-toggle="tooltip"]').tooltip();   


        }).fail(function() {


           
              
            
                 let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Nanopub Data</h5><div class=\"card-body\"><div class=\"alert alert-danger\" role=\"alert\">No data retrieved!</div></div></div>";
        
                $('#nanopubInfo').html(placeholderInfoCard);
                $('#nanopubInfo').show();






          });
                                

        
    });


        }
    
    function translateTextToCoords(text)
    {
      transform_translate = text.replace("translate(","");
      transform_translate = transform_translate.replace(")","");
      let translate_values = transform_translate.split(",");
      let translate_x_coord = translate_values[0];
      let translate_y_coord = translate_values[1];
      let coords = new Array();
        
    coords[0] = translate_x_coord;
    coords[1] = translate_y_coord;
        
        return coords;
     
    }
    
    function TextWithoutSpaces(text)
    {
        text = text.replace(/ /g,'');
        text = text.replace(/[^a-zA-Z0-9]/g, "")
        return text;
    }
    
    function isAlreadyInNanopubGraph(node_text)
    {
        for(node_j of nanopub_graph["nodes"] )
            {
                if(node_text == node_j['id'])
                    {
                        return true;
                    }
            }
        
        return false;
        
    }
        
    function sign(){
        return timesOneOrMinusOne();
    }
    
    function timesOneOrMinusOne()
    {
        
        let number = getRandomInt(2);
        
        if(number == 0)
            {
                //console.log('return -1');
                return -1;
            }
        else{
            //console.log('return 1');
            return 1;
        }
    }
    
    
    function degrees_to_radians(degrees)
    {
      var pi = Math.PI;
      return degrees * (pi/180);
    }
    
    function getNewX(x_c, d, angle)
    {
        let x_c_1 = x_c + d*Math.cos(degrees_to_radians(angle));
        
        return x_c_1;
    }
    function getNewY(y_c, d, angle)
    {
        let y_c_1 = y_c + d*Math.sin(degrees_to_radians(angle));
        
        return y_c_1;
    }
    
      function createNode(id, group, px, py, r, color, links, dataStruct, parent, node_type)
    {
            let node = {"id": id, "group": group, "px": px, "py": py, "color": color, "parent":parent, "node_type": node_type};

            dataStruct["nodes"].push(node);

            for (targetLink of links)
            {
                dataStruct["links"].push({"source": id, "target": targetLink["target"], "value": 1, "type": targetLink["predicate"]});
            }   

            console.dir(dataStruct);
            d3.selectAll('circle').remove();
            d3.selectAll('line').remove();


            return dataStruct;

    }
    
    
    function isTheParentNode(nodeID,candidateParentNodeID, graph){
        
        let nodes_g = graph["nodes"];
        
        for(node_g of nodes_g )
            {
                if(node_g["id"] == nodeID && node_g["parent"] == candidateParentNodeID)
                    {
                        return true;
                    }
            }
        
        return false;
    }
    
       function getChildrenOfNode(node, graph){
        
        let nodes_g = graph["nodes"];
        let links_g = graph["links"];
           
        let children_list = new Array();
        
        for(link_g of links_g )
            {
                console.log('entered getCHildrenOfnode '+"link_g: "+link_g["source"]+"  "+node);
                if(link_g["source"]["id"] == node)
                    {
                        console.log('entered getCHildrenOfnode primo if '+node);
                        
                        if(!children_list.includes(link_g["target"]))
                            {
                                 console.log('entered getCHildrenOfnode secondo if '+link_g["target"]);
                                children_list.push(link_g["target"]);        
                            }
                    }
            }
        
        return children_list;
    }

    function getChildrenOfNodeType(node, graph, type){

        let nodes_g = graph["nodes"];
        let links_g = graph["links"];

        let children_list = new Array();



        for(link_g of links_g )
        {
            console.log('entered getCHildrenOfnode '+"link_g: "+link_g["source"]+"  "+node);

            if(type == "GENE")
            {

                if(link_g["source"]["id"] == node)
                {
                    console.log('entered getCHildrenOfnode primo if (padre):'+node);

                    if(!children_list.includes(link_g["target"]))
                    {
                        console.log('entered getCHildrenOfnode secondo if (figlio):'+link_g["target"]);
                        children_list.push(link_g["target"]);
                    }
                }
            }
            else
            {
                if(link_g["target"]["id"] == node)
                {
                    console.log('entered getCHildrenOfnode primo if (padre):'+node);

                    if(!children_list.includes(link_g["source"]))
                    {
                        console.log('entered getCHildrenOfnode secondo if (figlio):'+link_g["source"]);
                        children_list.push(link_g["source"]);
                    }
                }
            }
        }

        return children_list;
    }
    
    function getParent(node, graph)
    {
        let nodes_g = graph["nodes"];
        let links_g = graph["links"];
           
        let anchestors_list = new Array();
        
        for(node_g of nodes_g )
            {
                if(node_g["id"] == node)
                    {
                        return node_g["parent"];
                    }
            }
        
        return "noParentFound";
    }
    
       function getParentNode(node, graph)
    {
        
        let parentID = getParent(node, graph);
        
        if(parentID != "noParentFound")
            {
                let nodes_g = graph["nodes"];
                let links_g = graph["links"];

                let anchestors_list = new Array();

                for(node_g of nodes_g )
                    {
                        if(node_g["id"] == parentID)
                            {
                                return node_g;
                            }
                    }

                
            }
        
        return "noParentFound";
    }
    
    function getAnchestorsOfNode(node, graph){
        
        let nodes_g = graph["nodes"];
        let links_g = graph["links"];
           
        let anchestors_list = new Array();
        
        for(link_g of links_g )
            {
                console.log('entered getAnchestorsOfNode '+"link_g: "+link_g["source"]["id"]+"  "+node);
                if(link_g["target"]["id"] == node)
                    {
                        console.log('entered getAnchestorsOfNode (primo if) with: '+node);
                        
                        
                        console.log("getParent: "+getParent(node, graph));
                        
                        if(!anchestors_list.includes(link_g["source"]["id"]) && getParent(node, graph)!=link_g["source"]["id"])
                            {
                                 console.log('entered getAnchestorsOfNode (secondo if) with:  '+link_g["source"]["id"]);
                                anchestors_list.push(link_g["source"]);        
                            }
                    }
            }
        
        return anchestors_list;
    }
    
    function removeChildrenAndAnchestors(node, graph){
        
        let cliccked_node_id = node;
        
        console.log("cliccked node id: "+cliccked_node_id);
        
        let cliccked_node = getNodeFromID(cliccked_node_id, graph);
        
        console.dir(cliccked_node);
        
        let children_list = getChildrenOfNode(node, graph);
        
        
        
       let anchestors_list = getAnchestorsOfNode(node, graph);
        
        
        getParentsList(getNodeFromID(node, graph), graph);
        
        console.log("*********** removeChildrenAndAnchestors *************");
        
        //console.log(children_list);
        //console.log("------------");
       // console.log(anchestors_list);
        
        /*if(list_of_parents_not_to_exclude == undefined)
            {
                list_of_parents_not_to_exclude = new Array();
            }
            */
        console.log("list_of_parents_not_to_exclude:");
        console.dir(list_of_parents_not_to_exclude);
        
        for(child of children_list)
            {
                console.log("CHILD: "+child);
                console.dir(child);
                removeChildrenAndAnchestorsRec(child, graph, cliccked_node);
            }
        
        for(anchestor of anchestors_list)
            {
                console.log("ANCHESTOR: "+anchestor);
                console.dir(anchestor);
                removeChildrenAndAnchestorsRec(anchestor, graph, cliccked_node);
            }
    }
    
    function removeChildrenAndAnchestorsRec(node, graph, global_node)
    {
        
        
        let parents_list = new Array();
        
        getParentsListData(node, graph, parents_list);
        
        console.log('parent list of node: '+node["id"]);
        console.dir(parents_list);
        
        if(!nodeIsAlreadyInList(node, list_of_nodes_to_exclude) && !nodeIsInParentList(node, list_of_parents_not_to_exclude) && nodeIsInParentList(global_node, parents_list))
            {
                list_of_nodes_to_exclude.push(node);
                removeNodeFromExpandedList(node["id"]);
                console.log("*********** removeChildrenAndAnchestorsRec *************");
                console.log(list_of_nodes_to_exclude);
                let anchestors_list = getAnchestorsOfNode(node["id"], graph);

                let children_list = getChildrenOfNode(node["id"], graph);


                console.log(children_list);
                console.log("------------");
                console.log(anchestors_list);




                for(child of children_list)
                    {
                        if(child["id"] != node["parent"])
                        {
                            removeChildrenAndAnchestorsRec(child, graph, global_node);
                        }
                    }

                for(anchestor of anchestors_list)
                    {
                        if(anchestor["id"] != node["parent"])
                        {
                            removeChildrenAndAnchestorsRec(anchestor, graph, global_node);
                        }
                    }
            }
       
    }
    
     function getNodeFromID(nodeID, graph)
    {
        let nodes_g = graph["nodes"];
        
        for ( node_g of nodes_g)
            {
                if(node_g["id"] == nodeID)
                    {
                        return node_g;
                    }
            }
        return "noNode";
    }
    
    function removeDescEdges(list_of_links_to_exclude, graph){
        
         for(link_j of graph["links"])
            {
                if( nodeHasToBeExcluded(getNodeFromID(link_j['source']['id'], graph) ,list_of_nodes_to_exclude) || nodeHasToBeExcluded(getNodeFromID(link_j['target']['id'], graph),list_of_nodes_to_exclude) )
                    {
                            list_of_links_to_exclude.push(link_j);
                    }
            }
        
        return list_of_links_to_exclude;
        
    }
    
    function hasToBeExcluded(link, list_of_links_to_exclude)
    {
        let flag_exclude = false;
        for(let link_c = 0; link_c<list_of_links_to_exclude.length; link_c++)
            {
                
                console.log("list_of_links_to_exclude[link_c]: "+list_of_links_to_exclude[link_c]["source"]["id"]);
                
                if(list_of_links_to_exclude[link_c]["source"]["id"] == link["source"]["id"] && list_of_links_to_exclude[link_c]["target"]["id"] == link["target"]["id"])
                    {
                        flag_exclude = true;
                        return flag_exclude;            
                    }
            }
        return flag_exclude;
    }
    
     function nodeHasToBeExcluded(node, list_of_nodes_to_exclude)
    {
        let flag_exclude = false;
        for(let node_c = 0; node_c < list_of_nodes_to_exclude.length; node_c++)
            {
                
                console.log("list_of_nodes_to_exclude[node_c]: "+list_of_nodes_to_exclude[node_c]["id"]);
                
                if(list_of_nodes_to_exclude[node_c]["id"] == node["id"])
                    {
                        flag_exclude = true;
                        return flag_exclude;            
                    }
            }
        return flag_exclude;
    }

    
    function nodeIsAlreadyInList(node, list_of_nodes_to_exclude)
    {
       let flag_state = false;
        for(let node_c = 0; node_c < list_of_nodes_to_exclude.length; node_c++)
            {
                
               
                
                if(list_of_nodes_to_exclude[node_c]["id"] == node["id"])
                    {
                        flag_state = true;
                        return flag_state;            
                    }
            }
        return flag_state;
    }
    
     function nodeIsInParentList(node, list_of_parents_not_to_exclude)
    {
        
        
       let flag_state = false;
        
        if(list_of_parents_not_to_exclude != undefined )
            {
               



                        if(list_of_parents_not_to_exclude.includes(node["id"]))
                            {
                                flag_state = true;
                                return flag_state;            
                            }
                    
            }
        else
            {
                list_of_parents_not_to_exclude = new Array();
            }
        return flag_state;
    }
    
    function removeNodeFromExpandedList(nodeID)
    {
    
        let new_expandend_nodes_list = new Array();
        
        for(nodeID_i of expanded_nodes_list)
            {
                if(nodeID_i != nodeID)
                {
                    new_expandend_nodes_list.push(nodeID_i);
                }
            }
        
        expanded_nodes_list = new_expandend_nodes_list;
        
    }
    
    function getParentsList(node, graph)
    {
        console.log("getParentsList > node");
        console.dir(node);
        
        let parent = getParentNode(node["id"], graph);
        
        console.log("getParentsList > parent");
        console.dir(parent);

        console.log("getParentsList > list_of_parents_not_to_exclude");
        console.dir(list_of_parents_not_to_exclude);
        
        if(parent != "noParentFound")
            {
                if(!nodeIsInParentList(parent, list_of_parents_not_to_exclude))
                {
                    list_of_parents_not_to_exclude.push(parent["id"]);
                    getParentsList(parent, graph);
                }
            }
        
    }
    
    function getParentsListData(node, graph, parents_list)
    {
        
        
        console.log("getParentsListData > node");
        console.dir(node);
        
        let parent = getParentNode(node["id"], graph);
        
        console.log("getParentsListData > parent");
        console.dir(parent);

        console.log("getParentsListData > parents_list");
        console.dir(parents_list);
        
        if(parent != "noParentFound")
            {
                if(!nodeIsInParentList(parent, parents_list))
                {
                    parents_list.push(parent["id"]);
                    getParentsListData(parent, graph, parents_list);
                }
            }
        
    }


    function translateGraphDownY(graph, offset)
    {
        for(let i=0; i < graph["nodes"].length;i++)
        {
            let id_i = TextWithoutSpaces(graph["nodes"][i]["id"]);


            let circle_transform_text = $('#circle-'+id_i).attr('transform');

            let circle_translate_coords = translateTextToCoords(circle_transform_text);

            console.dir(circle_translate_coords);

            let g_transform_text = $('#circle-'+id_i).parent().attr('transform');

            let g_translate_coords = translateTextToCoords(g_transform_text);

            console.dir(g_translate_coords);


            let new_x = parseFloat(circle_translate_coords[0]);
            let new_y = parseFloat(circle_translate_coords[1]) + offset;

            $('#circle-'+id_i).attr('transform',"translate("+new_x+","+new_y+")");
            //console.log(translate_x+" "+translate_y)


            console.log("before adding offset: [i: "+i+"] "+graph["nodes"][i]["py"]);
            graph["nodes"][i]["py"] =  graph["nodes"][i]["py"] + offset;
            console.log("After adding offset: [i: "+i+"] "+graph["nodes"][i]["py"]);
        }

        return graph;
    }


    function translateGraphRightX(graph, offset)
    {
        for(let i=0; i < graph["nodes"].length;i++)
        {
            let id_i = TextWithoutSpaces(graph["nodes"][i]["id"]);


            let circle_transform_text = $('#circle-'+id_i).attr('transform');

            let circle_translate_coords = translateTextToCoords(circle_transform_text);

            console.dir(circle_translate_coords);

            let g_transform_text = $('#circle-'+id_i).parent().attr('transform');

            let g_translate_coords = translateTextToCoords(g_transform_text);

            console.dir(g_translate_coords);


            let new_x = parseFloat(circle_translate_coords[0])+ offset;
            let new_y = parseFloat(circle_translate_coords[1]);

            $('#circle-'+id_i).attr('transform',"translate("+new_x+","+new_y+")");
            //console.log(translate_x+" "+translate_y)


            console.log("before adding offset: [i: "+i+"] "+graph["nodes"][i]["px"]);
            graph["nodes"][i]["px"] =  graph["nodes"][i]["px"] + offset;
            console.log("After adding offset: [i: "+i+"] "+graph["nodes"][i]["px"]);
        }

        return graph;
    }
    
    function clickked(d){
/*
	$('#infoModalBody').html(d.id);
	$('#infoModalTitle').html(d.id);
	$('#infoModal').modal({backdrop: true});
    
    */
        let translate_x;
        let translate_y;
        let cliccked_node_d3 = d3.select(this.parentNode);
        for (child_ii of cliccked_node_d3["_groups"][0][0]["children"])
            {
                //cliccked_node_d3["_groups"][0][0]["children"][0]["children"][1]["_data_"]["id"]

                let id_ii = child_ii["children"][1]["__data__"]["id"];
                if(id_ii == d.id)
                    {
                        translate_x = child_ii["transform"]["animVal"][0]["matrix"]["e"];
                        translate_y = child_ii["transform"]["animVal"][0]["matrix"]["f"];
                    }
            }
        //let translate_x = cliccked_node_d3["_groups"][0][0]["children"][0]["transform"]["animVal"][0]["matrix"]["e"];
        //let translate_y = cliccked_node_d3["_groups"][0][0]["children"][0]["transform"]["animVal"][0]["matrix"]["f"];
        
        
        console.dir("translate_x: "+translate_x+", translate_y: "+translate_y);
        
        $('.mytooltip').hide();
    
    if(expanded_nodes_list.includes(d.id))
        {
            //alert('Node: '+d.id+' is already expanded');
            
            var new_list_of_links = new Array();
            list_of_nodes_to_exclude = new Array();
            var new_list_of_nodes = new Array();
            var list_of_links_to_exclude = new Array();
            list_of_parents_not_to_exclude = new Array();
            
            removeChildrenAndAnchestors(d.id, nanopub_graph);
            
            console.log("LAST list_of_nodes_to_exclude: ");
            console.dir(list_of_nodes_to_exclude);
            
            for(node of nanopub_graph["nodes"])
                {
                    if(!nodeHasToBeExcluded(node,list_of_nodes_to_exclude))
                        {
                            new_list_of_nodes.push(node);   
                        }
                }
            
            list_of_links_to_exclude = removeDescEdges(list_of_links_to_exclude, nanopub_graph);
            
            console.log("list_of_links_to_exclude");
            console.log(list_of_links_to_exclude);
            
             for(link of nanopub_graph["links"])
                {
                    if(!hasToBeExcluded(link, list_of_links_to_exclude))
                        {
                            console.log('!hasToBeExcluded entered with: '+link["source"]["id"]+" "+link["target"]["id"]);
                            new_list_of_links.push(link);   
                        }
                }
            
            

            nanopub_graph["nodes"] = new_list_of_nodes;
            nanopub_graph["links"] = new_list_of_links;
            graph = nanopub_graph;
            console.log(graph);
            
            let new_expanded_nodes_list = new Array();
            
            for(item of expanded_nodes_list)
                {
                    if(item != d.id)
                        {
                            new_expanded_nodes_list.push(item);
                        }
                }
            expanded_nodes_list = new_expanded_nodes_list;


            updateD3Graph();

            console.log(graph);


            let root = findRootNode(graph);
            let list_of_nodes_processed = new Array();



            console.log(graph);
            setTimeout(function(){
                graph=rearrangeChildrenRecursive(graph,root,list_of_nodes_processed);console.log(list_of_nodes_processed);
                graph = rearrangeNodes(graph);
                //updateD3Graph();
                },2000);


            console.log(graph);
            nanopub_graph["nodes"]=graph["nodes"];


        }
    else
    {
            
       // Expand node
    
    showModalLoadGraphData();
    
    
    
    
            // Clean canvas
          $(".nodes").remove();
          $(".links").remove();
          $("text").remove();
    
    let list_of_linked_nodes_id = new Array();
    
    let html = "";
    let click_x = d3.event.pageX;
    let click_y = d3.event.pageY;
        
        console.log(encodeURIComponent(d.id.replace("/","§")));
    
          $.ajax({
              //url: "http://exa.dei.unipd.it:8000/node_linked_elements/"+encodeURIComponent(d.id.replace("/","§")),
              url: "http://"+domain+":8000/node_linked_elements/"+encodeURIComponent(d.id.replace("/","§")),
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(function( data ) {
              let list_of_linked_elements = data["list_of_linked_elements"];
              console.log(list_of_linked_elements);
              
  
              setTimeout(function(){hideModal("modalLoadGraphData");},500);
              
              expanded_nodes_list.push(d.id);
              
              console.log("list_of_linked_elements.length:  "+list_of_linked_elements.length);
              
              // number of expanded nodes contained in list_of_linked_elements
              let n_o_e_n_c = 0;
              
              for(node_i of list_of_linked_elements)
                  {
                      if(expanded_nodes_list.includes(node_i["text"]))
                           {
                               n_o_e_n_c++;
                           }
                  }
              
              let n_o_e = list_of_linked_elements.length-n_o_e_n_c + 1;
              let step_degree = 180/n_o_e;
              
              console.log('step_degree: '+step_degree);
              
              let start_angle = 90;
              let angle_counter_i = 1;
               
              for(node_i of list_of_linked_elements)
                  {
                      console.log("node_i[\"text\"]: "+node_i["text"]);
                      if(!expanded_nodes_list.includes(node_i["text"]))
                           {
                      let angle_i = start_angle - angle_counter_i * step_degree;
                      let node_text = node_i["text"];
                      let node_predicate = node_i["predicate"];
                      let node_role = node_i["role"];
                      

                           
                      list_of_linked_nodes_id.push(TextWithoutSpaces(node_i["text"]));
                      //let node_x = d.px+getRandomInt(300)*timesOneOrMinusOne();
                      //let node_y = d.py+getRandomInt(300)*timesOneOrMinusOne();
                      
                      let radius = Math.min((250+expanded_nodes_list.length*30),400);

                      console.log("n_o_e: "+n_o_e);

                       if(n_o_e == 2)
                       {
                           radius = 600;
                       }

                       console.log('radius: '+radius);
                       let node_x = getNewX(d.px, radius, angle_i);
                       let node_y = getNewY(d.py, radius, angle_i);




                      console.log("node_text: "+node_text+", angle: "+angle_i+", node_x: "+node_x+", node_y: "+node_y);
                      
                      angle_counter_i++;
                      
                      if(node_role=="object")
                          {
                                if(!isAlreadyInNanopubGraph(node_text))
                                    {
                                        nanopub_graph = createNode(node_text, 1, node_x, node_y, 15, colors["DISEASE"], [], nanopub_graph, d.id, "DISEASE");
                                    }
                                nanopub_graph["links"].push({"source": d.id, "target": node_text, "value": 1, "type": node_predicate});
                          }
                      else{
                           if(!isAlreadyInNanopubGraph(node_text))
                                    {
                          nanopub_graph = createNode(node_text, 1, node_x, node_y, 15, colors["GENE"],  [{"target":d.id,"predicate":node_predicate}], nanopub_graph, d.id, "GENE");
                                    }
                          
                            }


                               
                           }



                      //html += node_text+" "+node_predicate+" "+node_role+"<br/>";
                                                 
                      graph = nanopub_graph;                 
                                                 
                       //break;
                                                 
                
                  }
              
               var link = svg.append("g")
                          .attr("class", "links")
                          .attr("transform", "translate(-200,-200)")
                        .selectAll("line")
                        .data(graph.links)
                        .enter().append("line")
                        .attr("stroke", "#222")
                        //.attr('data-toggle',"tooltip")
                      //.attr('data-placement', 'right')
                      .attr('source', function (d) {return d.source;})
                      .attr('target', function (d) {return d.target;})
                      .attr('title', function (d) {return d.type})
                      .attr('marker-end','url(#arrowhead)')
                          .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
                      
               link.on('click', function (d) {showLinkInfo(d.source["id"],d.target["id"]);});
              


                      var node = svg.append("g")
                          .attr("class", "nodes")
                          .attr("transform", "translate(-200,-200)")
                        .selectAll("g")
                        .data(graph.nodes)
                        .enter().append("g")
                        .attr("transform", function(d) { return "translate("+translate_x+","+translate_y+")"; })
                        .on("click", clickked)
                        .on("contextmenu", function (d) {
                           d3.event.preventDefault();
                                  d3.event.preventDefault();
                               // react on right-clicking
                            
                           let modal_body = "<center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>";
      
                            showModal("loadingInfoNodeModal","Loading entity information",modal_body);
      
                            $.ajax({
                                //url: "http://exa.dei.unipd.it:8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                                url: "http://"+domain+":8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                                 type: 'GET',
                                 async: true,
                                 timeout: 10000})
                            .done(function( data ) {
                                
                                //alert("d.id: "+d.id+"\n"+data["description"]);
                                
                                setTimeout(function(){hideModal('loadingInfoNodeModal');},500);
                                
                                let id_entity = data["id_entity"];
                                let type = data["type"];
                                let description = data["description"];

                                showModalNodeInfo(d.id, id_entity, type, description);
                            })
                            .fail(function(){
                                
                                alert("an error occurred!");
                                
                            });
                                

                            });
              
              //d3.selectAll("g").attr("transform", function(d) { return "translate("+translate_x+","+translate_y+")"; })
                        //.on("click", clickked);

                      var circles = node.append("circle")
                          .attr("r", circles_size)
                          .attr('x', function(d) { return (d.px); })
                          .attr('y', function(d) { return (d.py); })
                          .attr('id', function(d) { return "circle-"+TextWithoutSpaces(d.id); })
                          .attr("transform", function(d) { return "translate("+d.px+","+d.py+")"; })
                          .attr("fill", function(d) { return d.color; })
                          .call(d3.drag()
                              .on("start", dragstarted)
                              .on("drag", dragged)
                              .on("end", dragended));



                      var lables = node.append("text")
                          .text(function(d) {
                              //console.log('d.id: '+d.id);
                            return d.id;
                          })
                          .attr('x', function(d) { return (d.px+15); })
                          .attr('y', function(d) { return (d.py); })
                          .attr('fill','#222')
                          .on("click", clickked);


                        edgepaths = svg.selectAll(".edgepath")
                                .data(graph.links)
                                .enter()
                                .append('path')
                                //.attr("transform", "translate(-200,-200)")
                                .attrs({
                                    'class': 'edgepath',
                                    'fill-opacity': 0,
                                    'stroke-opacity': 0,
                                    'id': function (d, i) {return 'edgepath' + i}
                                })
                                .style("pointer-events", "none");

                            edgelabels = svg.selectAll(".edgelabel")
                                .data(graph.links)
                                .enter()
                                .append('text')
                                .style("pointer-events", "none")
                                .attrs({
                                    'class': 'edgelabel',
                                    'id': function (d, i) {return 'edgelabel' + i},
                                    'font-size': 10,
                                    'fill': '#aaa'
                                });

                            edgelabels.append('textPath')
                                .attr('xlink:href', function (d, i) {return '#edgepath' + i})
                                .style("text-anchor", "middle")
                                .style("pointer-events", "none")
                                .attr("startOffset", "50%")
                                .text(function (d) {return "";});

                        /*for (label of labels_array)
                            {
                                if(label['predicate_flag'])
                                    {
                                        console.log('entered in predict flag true');
                                         svg.append("text")
                                          .text(label["label_text"])
                                          .attr('x', label["x"])
                                          .attr('y', label["y"])
                                          .attr('label_text',label["label_text"])
                                          .attr('style','fill:'+colors["assertion"]["predicate"]);
                                    }
                                else
                                    {
                                         svg.append("text")
                                          .text(label["label_text"])
                                          .attr('x', label["x"])
                                          .attr('y', label["y"])
                                          .attr('label_text',label["label_text"])
                                          .attr('fill','white');
                                    }


                            }*/



                          //.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })


                      node.append("title")
                          .text(function(d) { return d.id; });

                      simulation
                          .nodes(graph.nodes)
                          .on("tick", ticked);

                      simulation.force("link")
                          .links(graph.links);


                    var dragStart = false;

                     function ticked() {
                         
                         lables
                          .attr('x', function(d) { return (d.px+15); })
                          .attr('y', function(d) { return (d.py); })
                          .attr('fill','#222');
                         
                         
                        link
                            .attr("x1", function(d) { 
                            return d.source.px+d.source.x; })
                            .attr("y1", function(d) { 
                            return d.source.py+d.source.y; })
                            .attr("x2", function(d) { 
                            return d.target.px+d.target.x; })
                            .attr("y2", function(d) { 
                            return d.target.py+d.target.y; });


                        node
                            .attr("transform", function(d) {
                                    return "translate(" + (d.x) + "," + (d.y) + ")";
                            })


                          edgepaths.attr('d', function (d) {
                                return 'M ' + (d.source.px+d.source.x) + ' ' + (d.source.py+d.source.y) + ' L ' + (d.target.px+d.target.x) + ' ' +(d.target.py+d.target.y);
                            });

                            edgelabels.attr('transform', function (d) {

                                    return 'rotate(0)';

                            });

                          $('[data-toggle="tooltip"]').tooltip();   
                      }


                    function dragstarted(d) {
                      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                      //console.log('drag started '+d.x);
                      dragStart=true;

                      d.fx = d.x;
                      d.fy = d.y;
                    }

                    function dragged(d) {

                      d.fx = d3.event.x;
                      d.fy = d3.event.y;
                    }

                    function dragended(d) {
                      /*if (!d3.event.active) simulation.alphaTarget(0);
                      d.fx = null;
                      d.fy = null;
                    */
                    }                           
              /*
                $('#infoModalBody').html(html);
                $('#infoModalTitle').html(d.id);
                $('#infoModal').modal({backdrop: true});*/
              
              
              console.log(" ---------- list_of_linked_nodes_id ----------");
        console.dir(list_of_linked_nodes_id);
        
               setTimeout(function(){
                   
                         for (let i=0;i<list_of_linked_nodes_id.length;i++)
                        {
                            let id_i =  list_of_linked_nodes_id[i];
                            console.log(id_i);
                            
                            let circle_transform_text = $('#circle-'+id_i).attr('transform');
                            
                            let circle_translate_coords = translateTextToCoords(circle_transform_text);
                            
                            console.dir(circle_translate_coords);
                            
                            let g_transform_text = $('#circle-'+id_i).parent().attr('transform');
                            
                            let g_translate_coords = translateTextToCoords(g_transform_text);
                            
                            console.dir(g_translate_coords);
                            
                            let delta_x = translate_x - g_translate_coords[0];
                            let delta_y = translate_y - g_translate_coords[1];
                            
                            console.log("delta_x: "+delta_x+", delta_y: "+delta_y);
                            
                            let new_x = parseFloat(circle_translate_coords[0]) + parseFloat(delta_x);
                            let new_y = parseFloat(circle_translate_coords[1]) + parseFloat(delta_y);
                            
                            $('#circle-'+id_i).attr('transform',"translate("+new_x+","+new_y+")");
                            //console.log(translate_x+" "+translate_y)

                            console.log("circle_transform_text: "+circle_transform_text);
                            console.log("g_transform_text: "+g_transform_text);
                            
                            for(let n_i=0;n_i<graph["nodes"].length;n_i++)
                                {
                                    if(TextWithoutSpaces(graph["nodes"][n_i]["id"])==id_i)
                                        {
                                            graph["nodes"][n_i]["px"] = new_x;
                                            graph["nodes"][n_i]["py"] = new_y;

                                            console.log("Before translateGraphDownY function:");
                                            console.dir(graph);

                                           
                                            
                                            let real_y = (parseFloat(g_translate_coords[1]) + new_y -200);
                                            let real_x = (parseFloat(g_translate_coords[0]) + new_x -200);

                                            console.log("real_x: "+ real_x +", real_y: "+ real_y);
                                            if(real_y < 10)
                                            {
                                                console.log('entered in if translateGraphDownY');
                                                graph = translateGraphDownY(graph, 200);

                                                console.log("After translateGraphDownY function:");
                                                console.dir(graph);
                                            }

                                            if(real_x < 100)
                                            {
                                                console.log('entered in if translateGraphRightX');
                                                graph = translateGraphRightX(graph, 100);

                                                console.log("After translateGraphRightX function:");
                                                console.dir(graph);
                                            }


                                        }
                                }
                        }
                   
                   list_of_linked_nodes_id = new Array();

                   
               }, 2000);

            let root = findRootNode(graph);
            let list_of_nodes_processed = new Array();



            console.log(graph);
            setTimeout(function(){
                graph=rearrangeChildrenRecursive(graph,root,list_of_nodes_processed);
                //updateD3Graph();
            },2000);

            nanopub_graph["nodes"]=graph["nodes"];
            
              
              console.log(nanopub_graph);

              
          })
        .fail(
              function(){
                  
                  hideModalLoadGraphData();
                  graphRequestTimeout();
                  console.log('Error occurred during the retrieval of relevant related nodes!');
              }
          );



    }

}

    function updateD3GraphV2(graph){

        // Clean canvas
        $(".nodes").remove();
        $(".links").remove();
        $("text").remove();

        svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");


        svg.append('defs').append('marker')
            .attrs({'id':'arrowhead',
                'viewBox':'-0 -5 10 10',
                'refX':15,
                'refY':0,
                'orient':'auto',
                'markerWidth':13,
                'markerHeight':13,
                'xoverflow':'visible'})
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');



        color = d3.scaleOrdinal(d3.schemeCategory20);

        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));




// Asssertion rectangle
        /*var rectangleData = [
            { "rx": 10, "ry": 10, "height": 800, "width": 800, "color" : colors["assertion"]["background"] }];

        var rectangles = svg.selectAll("rect")
                                     .data(rectangleData)
                                     .enter()
                                     .append("rect");
        var rectangleAttributes = rectangles
                                   .attr("x", function (d) { return d.rx; })
                                   .attr("y", function (d) { return d.ry; })
                                   .attr("height", function (d) { return d.height; })
                                   .attr("width", function (d) { return d.width; })
                                   .style("fill", function(d) { return d.color; });*/

        var link = svg.append("g")
            .attr("class", "links")
            .attr("transform", "translate(-200,-200)")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke", "#222")
            .attr('source', function (d) {return d.source;})
            .attr('target', function (d) {return d.target;})
            //.attr('data-toggle',"tooltip")
            //.attr('data-placement', 'right')
            .attr('title', function (d) {return d.type})
            .attr('marker-end','url(#arrowhead)')
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        link.on('click', function(d) {showLinkInfo(d.source["id"],d.target["id"]);});


        var node = svg.append("g")
            .attr("class", "nodes")
            .attr("transform", "translate(-200,-200)")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            //.attr("transform", function(d) { return "translate("+d.px+","+d.py+")"; })
            .on("click", clickked)
            .on("contextmenu", function (d) {
                d3.event.preventDefault();
                // react on right-clicking

                let modal_body = "<center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>";

                showModal("loadingInfoNodeModal","Loading entity information",modal_body);

                $.ajax({
                    //url: "http://exa.dei.unipd.it:8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                    url: "http://"+domain+":8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                    type: 'GET',
                    async: true,
                    timeout: 10000})
                    .done(function( data ) {

                        //alert("d.id: "+d.id+"\n"+data["description"]);

                        $('#loadingInfoNodeModal').modal('hide');

                        let id_entity = data["id_entity"];
                        let type = data["type"];
                        let description = data["description"];

                        showModalNodeInfo(d.id, id_entity, type, description);
                    })
                    .fail(function(){

                        alert("an error occurred!");

                    });


            });


        var circles = node.append("circle")
            .attr("r", circles_size)
            .attr('x', function(d) { return (d.px); })
            .attr('y', function(d) { return (d.py); })
            .attr('id', function(d) { return "circle-"+TextWithoutSpaces(d.id); })
            .attr("transform", function(d) { return "translate("+d.px+","+d.py+")"; })
            .attr("fill", function(d) { return d.color; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));



        var lables = node.append("text")
            .text(function(d) {
                //console.log('d.id: '+d.id);
                return d.id;
            })
            .attr('x', function(d) { return (d.px+15); })
            .attr('y', function(d) { return (d.py); })
            .attr('fill','#222')
            .on("click", clickked);


        edgepaths = svg.selectAll(".edgepath")
            .data(graph.links)
            .enter()
            .append('path')
            //.attr("transform", "translate(-200,-200)")
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(graph.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return "";});





        //.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })


        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);


        var dragStart = false;

        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.px+d.source.x; })
                .attr("y1", function(d) {
                    return d.source.py+d.source.y; })
                .attr("x2", function(d) {
                    return d.target.px+d.target.x; })
                .attr("y2", function(d) {
                    return d.target.py+d.target.y; });


            node
                .attr("transform", function(d) {
                    return "translate(" + (d.x) + "," + (d.y) + ")";
                })


            edgepaths.attr('d', function (d) {
                return 'M ' + (d.source.px+d.source.x) + ' ' + (d.source.py+d.source.y) + ' L ' + (d.target.px+d.target.x) + ' ' +(d.target.py+d.target.y);
            });

            edgelabels.attr('transform', function (d) {

                return 'rotate(0)';

            });

        }

        $('[data-toggle="tooltip"]').tooltip();


        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            //console.log('drag started '+d.x);
            dragStart=true;

            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {

            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            /*if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          */
        }

    }
    
    
    function updateD3Graph(){
        
     // Clean canvas
          $(".nodes").remove();
          $(".links").remove();
          $("text").remove();
        
    svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    
    
     svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':15,
            'refY':0,
            'orient':'auto',
            'markerWidth':13,
            'markerHeight':13,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
        


color = d3.scaleOrdinal(d3.schemeCategory20);

simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
	



// Asssertion rectangle
/*var rectangleData = [
    { "rx": 10, "ry": 10, "height": 800, "width": 800, "color" : colors["assertion"]["background"] }];

var rectangles = svg.selectAll("rect")
                             .data(rectangleData)
                             .enter()
                             .append("rect");
var rectangleAttributes = rectangles
                           .attr("x", function (d) { return d.rx; })
                           .attr("y", function (d) { return d.ry; })
                           .attr("height", function (d) { return d.height; })
                           .attr("width", function (d) { return d.width; })
                           .style("fill", function(d) { return d.color; });*/
     
      var link = svg.append("g")
      .attr("class", "links")
	  .attr("transform", "translate(-200,-200)")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
	.attr("stroke", "#222")
    .attr('source', function (d) {return d.source;})
    .attr('target', function (d) {return d.target;})
    //.attr('data-toggle',"tooltip")
  //.attr('data-placement', 'right')
  .attr('title', function (d) {return d.type})
  .attr('marker-end','url(#arrowhead)')
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    
        link.on('click', function(d) {showLinkInfo(d.source["id"],d.target["id"]);});
      

  var node = svg.append("g")
      .attr("class", "nodes")
	  .attr("transform", "translate(-200,-200)")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
	//.attr("transform", function(d) { return "translate("+d.px+","+d.py+")"; })
	.on("click", clickked)
  .on("contextmenu", function (d) {
                           d3.event.preventDefault();
                               // react on right-clicking
                            
                           let modal_body = "<center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center>";
      
                            showModal("loadingInfoNodeModal","Loading entity information",modal_body);
      
                            $.ajax({
                                //url: "http://exa.dei.unipd.it:8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                                url: "http://"+domain+":8000/entity_properties/"+encodeURIComponent(d.id.replace("/","§")),
                                 type: 'GET',
                                 async: true,
                                 timeout: 10000})
                            .done(function( data ) {
                                
                                //alert("d.id: "+d.id+"\n"+data["description"]);
                                
                                $('#loadingInfoNodeModal').modal('hide');
                                
                                let id_entity = data["id_entity"];
                                let type = data["type"];
                                let description = data["description"];

                                showModalNodeInfo(d.id, id_entity, type, description);
                            })
                            .fail(function(){
                                
                                alert("an error occurred!");
                                
                            });
                                

                            });
              
    
   var circles = node.append("circle")
                          .attr("r", circles_size)
                          .attr('x', function(d) { return (d.px); })
                          .attr('y', function(d) { return (d.py); })
                          .attr('id', function(d) { return "circle-"+TextWithoutSpaces(d.id); })
                          .attr("transform", function(d) { return "translate("+d.px+","+d.py+")"; })
                          .attr("fill", function(d) { return d.color; })
                          .call(d3.drag()
                              .on("start", dragstarted)
                              .on("drag", dragged)
                              .on("end", dragended));



  var lables = node.append("text")
      .text(function(d) {
          //console.log('d.id: '+d.id);
        return d.id;
      })
      .attr('x', function(d) { return (d.px+15); })
      .attr('y', function(d) { return (d.py); })
	  .attr('fill','#222')
	  .on("click", clickked);
    
    
    edgepaths = svg.selectAll(".edgepath")
            .data(graph.links)
            .enter()
            .append('path')
            //.attr("transform", "translate(-200,-200)")
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(graph.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return "";});
    
    
            


	  //.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
	  

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


var dragStart = false;

 function ticked() {
    link
        .attr("x1", function(d) { 
		return d.source.px+d.source.x; })
        .attr("y1", function(d) { 
		return d.source.py+d.source.y; })
        .attr("x2", function(d) { 
		return d.target.px+d.target.x; })
        .attr("y2", function(d) { 
		return d.target.py+d.target.y; });

	
    node
        .attr("transform", function(d) {
				return "translate(" + (d.x) + "," + (d.y) + ")";
        })
     
     
      edgepaths.attr('d', function (d) {
            return 'M ' + (d.source.px+d.source.x) + ' ' + (d.source.py+d.source.y) + ' L ' + (d.target.px+d.target.x) + ' ' +(d.target.py+d.target.y);
        });

        edgelabels.attr('transform', function (d) {
            
                return 'rotate(0)';
            
        });
     
 }
     
      $('[data-toggle="tooltip"]').tooltip(); 
        
        
        function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //console.log('drag started '+d.x);
  dragStart=true;

  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {

  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  /*if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
*/
}

    }
    
    /* END of D3 functions */
    
    
    /* END of D3 variables */
    
   
    
    
    //console.log("initialTimestamp: "+initialTimestamp+", lastTimestamp: "+lastTimestamp);
    

    var query = $('#queryText').html();
    
    var text_dimension_threshold = 300;
    
    $('[data-toggle="tooltip"]').tooltip();
    
    function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
    
    function encodeHTMLString(str){
        
        if(str != undefined)
            {
                    str = str.replace("\"", "&quot;");
                    str = str.replace(/'/g, "&apos;");
                    str = str.replace(/[^a-zA-Z0-9+<>=,.:;%()\[\]&/ ]/g, "")
            }
      else
          {
              str = "";
          }
        
        console.log("str: "+str);
        
        return str;
    }
    
    function encodeAllUrlInText(text)
    {
        URL_occurrences = text.match(/http|https/g);
        
        for (url of URL_occurrences)
            {
                console.log("url occurrency: "+url);
                let initialPos = text.indexOf(url);
                let endPos = initialPos;
                
                while(text[endPos]!=' ' && endPos<1000)
                    {
                        endPos++;
                    }
                
                
                let url_full = text.substr(initialPos,endPos);
                
                
                
                text = text.replace(url_full,getShortUrlWithLink(url_full));
                
                
                
            }
        
        
        return text;
    }
    function updateNanoListContainerHeight()
    {
        
        let nanopubInfoHeight = $('#nanopubInfo').height();
        let nanoListHeight = $('#nanoList').height();
        //console.log("tick -  nanopubInfoHeight: "+nanopubInfoHeight);
        
        // Se la lista delle nanopub (in altezza) è superiore a quella delle info
        if(nanoListHeight>=nanopubInfoHeight)
            {
                let nanoListContainerHeight = nanopubInfoHeight;

                if(nanoListContainerHeight<nanoListContainerMaxHeight)
                    {
                        nanoListContainerHeight = nanoListContainerMaxHeight;
                    }
                else{
                    // Devo ridurlo di 10px altrimenti il codice va in loop e la dimensione cresce all'infinito
                    nanoListContainerHeight = nanoListContainerHeight - 10;
                    }

                $('#nanoListContainer').css({"max-height":nanoListContainerHeight});
            }
        
        if(nanopubs_id_list.length >= 10)
            {
                let nanoListContainerHeight = Math.max(nanoListContainerMaxHeight,nanopubInfoHeight);
                
                nanoListContainerHeight = nanoListContainerHeight - 10;
                
                $('#nanoListContainer').css({"max-height":nanoListContainerHeight});
            }
        
        
         
        
    }
    
    setInterval(updateNanoListContainerHeight,500);
    
    
    function getDomainFromURL(url)
    {
        let domain = url.substr(7,url.indexOf("/",7)-7);
        
        return domain;
    }
    
    function getShortUrl(url)
    {
        let protocol = url.substr(0,url.indexOf("/")+2);
        //console.log('getShortUrl(url) -> protocol: '+protocol);
        let domain = protocol+getDomainFromURL(url)+"...";
        return domain;
    }
    
    function getShortUrlWithLink(url)
    {
        let protocol = url.substr(0,url.indexOf("/")+2);
        //console.log('getShortUrl(url) -> protocol: '+protocol);
        let url_short = protocol+getDomainFromURL(url)+"...";
        
        let link_formatted = "<a href='"+url+"' rel=\"noopener noreferrer\" target=\"_blank\">"+url_short+"</a>";
        return link_formatted;
    }
    
    
    function getShortText(text)
    {
        
        let short_text = "";
        if(text != undefined)
            {


                    short_text = text.substr(0,text_dimension_threshold);

                    console.log("short_text: "+short_text);

                    short_text = encodeHTMLString(short_text);

                    short_text += "...";

            }
        
        return short_text;
    }
    
    function getShortLabel(label)
    {
        
        
         let short_label = label.substr(0,15);
        
       
        
        short_label = encodeHTMLString(short_label);
        
        short_label += "...";
        
        return short_label;
        
    }
    
    
   
    
 
        $('#expand-nanoInfo').click(function (){
            console.log('expand-nanoInfo');
           
            $('#nanoListContainer').removeClass('col-md-12');
            $('#nanoListContainer').addClass('col-md-6');
                    
            $('#nanoListContainer').hide('slow');
                    if(!graph_mode_flag)
                        {
                             
                            $('#nanopubInfo').show('slow');
                           
                        }
                    else{
                            $('#graphAnalysis').show('slow');
                            $('svg').attr('width',3000);
                            $('svg').attr('height',3000);
                            $('#graphAnalysis').css({'max-height':$(window).height(),'max-width':$(window).width(), 'overflow-y':'scroll','overflow-x':'scroll'});
                        
                      
                            
                           
                        }
                    
                    
            
            
        });
        $('#expand-nanoList').click(function (){
            console.log('expand-nanoList');
            $('#nanopubInfo').hide('slow');
            $('#graphAnalysis').hide('slow');
            $('#nanoListContainer').show('slow');
            
            $('#nanoListContainer').removeClass('col-md-6');
            $('#nanoListContainer').addClass('col-md-12');
            
        });
    
      $('#display-both').click(function (){
          
          
                    console.log('display-both');
                    $('#nanoListContainer').removeClass('col-md-12');
                    $('#nanoListContainer').addClass('col-md-6');
                    
                    
                    if(!graph_mode_flag)
                        {
                            $('#graphAnalysis').hide('slow');
                            $('#nanopubInfo').show('slow');
                            
                        }
                    else{
                            $('#graphAnalysis').show('slow');
                            $('#nanopubInfo').hide('slow');
                            $('svg').attr('width',3000);
                            $('#graphAnalysis').css({'max-height':$(window).height(),'max-width':$(window).width()/2, 'overflow-y':'scroll','overflow-x':'scroll'});
                            
                            
                        }
                    $('#nanoListContainer').show('slow');
                    
                
            
            
        });
    
    setInterval(function(){
        
        let query = $('#query').val().trim();
        
        let suggestionsList = "";
        
        if( query.length > 3 )
            {
                    //console.log("Query: '"+query+"'");
                
                    $.ajax({
                        //url: "http://exa.dei.unipd.it:8000/querysuggestions/"+query,
                        url: "http://"+domain+":8000/querysuggestions/"+query,
                        type: 'GET',
                        async: true,
                        timeout: 15000})
                        .done(function( data ) {
                        
                            let suggestionsList = data["suggestionsList"];
                    
                            
                            /*
                            $("#query").easyAutocomplete(options);
                           console.log($("#query").position().top+$("#query").innerHeight());
                           */
                    
                            $( "#query" ).autocomplete({
                                  source: suggestionsList
                                });
                        
                            $(".ui-helper-hidden-accessible").hide();
                    
                            /*$(".easy-autocomplete").css({'position':'relative','top':$("#query").position().top+$("#query").innerHeight()});*/
                        
                           /* for (list_item of suggestionsList)
                                {
                                    console.log("list_item: "+list_item);
                                    $('#suggestionsList').append("<li class=\"list-group-item\">"+list_item+"</li>");
                                }
                            
                            $('#suggestionsListDiv').show();
                            */

                        }).fail(function() {


                        // Error

                        //console.log("No suggestions for the query: '"+query+"'");




                        });
                    
               
                
                
                
            }
        

    },500);
    
    $("#thumbstack").click(function(){
        
        $("#"+this.id).toggleClass("thumbstack-pinned", 200);
        $(".inner").toggleClass("inner-pos-relative", 200);
        
    });
    
    

    //$( "#nanoListContainer" ).resizable();
    
    function requestTimedOut()
    {
        $("#spinner").hide();

         $("#closeButtonModal").show();

         $("#message").html("<div class=\"alert alert-danger\" role=\"alert\">An error occurred: request timeout reached</div>");

         setTimeout(function (){$("#modalLoadNanopub").modal('hide')}, 10000);
    }
    
    function requestTimedOut2(){
            $("#load-more-nanopub-spinner").hide();
                                             
             $("#modalLoadNanopub").modal('show');

             $("#spinner").hide();

             $("#closeButtonModal").show();

             $("#message").html("<div class=\"alert alert-danger\" role=\"alert\">An error occurred: request timeout reached</div>");
    }

    function graphRequestTimeout(){
        
        let modal = "<div class=\"modal fade\" id=\"modalGraphRequestTimedOut\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Loading graph analysis<\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\">   <div class=\"alert alert-danger\" role=\"alert\">An error occurred: request timeout reached</div>     <\/div>      <\/div>  <\/div><\/div>";
        
        $("body").append(modal);
        
        $('#modalGraphRequestTimedOut').modal('show');
        
        
    }
    
    function showModalLoadGraphData(){
        
        
        
         let modal = "<div class=\"modal fade\" id=\"modalLoadGraphData\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">  <div class=\"modal-dialog\" role=\"document\">    <div class=\"modal-content\">      <div class=\"modal-header\">        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Loading graph data<\/h5>        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">          <span aria-hidden=\"true\">&times;<\/span>        <\/button>      <\/div>      <div class=\"modal-body\"><center><div class=\"spinner-border\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></center><\/div><\/div><\/div><\/div>";
        
        $("body").append(modal);
        
        $('#modalLoadGraphData').modal('show');
    }
    
    
    

    
    function hideModalLoadGraphData(){
        $('#modalLoadGraphData').modal('hide');
    }
    
    
    
    
    
    
    
    var counter = 0;
    var nanopubs_id_list = new Array();
    
    var nanopubs_data_array = new Array();
    
    var nanopubsProcessed = 0;
    var bucketCurrentNumber = 1;

    var numberOfBuckets = 0;
    
    async function resolveAllNanopubsData() {
        
        $('#modalLoadNanopub').modal({backdrop:'static', keyboard:false});
        
        //console.log("rg.22: "+query);
        
          var nanopubs_id_list = await $.ajax({
                         //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/query/",
                         url: "http://"+domain+":8080/nanocitationandindexing/rest/query/",
                         type: 'POST',
                         data: ""+query,
                         dataType: "json",
                         contentType: "text/plain",
                         async: true
                         })
                    .done(function( data ) {
                        //console.log("data: "+data);
                        //console.log(data);
                    var ID_list = data;
                        

                        
                    console.dir("ID_list:\n");
                    console.dir(ID_list);
                    ID_list = Object.values(ID_list);
                    console.dir(ID_list);
                    console.dir("ID_list length: "+ID_list.length);
                        
                    nanopubs_id_list = new Array();
                    
                    if(ID_list.length > 0)
                        {
                            
                        
                        
                            for (let i=0; ((i < bucketSize) && (i<ID_list.length)); i++)
                                {
                                    nanopubs_id_list.push(ID_list[i]);
                                }
                            
                        }
                        else
                            {
                                
                                 // No nanopub available
                                
                                $("#modalLoadNanopub").modal('show');
                                
                                 $("#spinner").hide();
                         
                                 $("#closeButtonModal").show();

                                 $("#message").html("<div class=\"alert alert-warning\" role=\"alert\">No suitable nanopublication founded for query: \""+query+"\"</div>");

                                 $(".subtitle").html("No suitable nanopublication founded for query: \""+query+"\"");

                                 setTimeout(function (){$("#modalLoadNanopub").modal('hide')}, 10000);
                            }
                    
               
              
                    }).fail(function() {
                        console.log("error");
                    });
              
        nanopubs_id_list = Object.values(nanopubs_id_list);
        console.log(nanopubs_id_list);
        
        
        numberOfBuckets = Math.floor(nanopubs_id_list.length / bucketSize);
        
        //console.log("numberOfBuckets: "+numberOfBuckets);
        
       
        
        if(nanopubs_id_list.length > 0)
            {
                console.log("INPUT OF getNanopubBucket: ");
                console.log(nanopubs_id_list.slice(0,bucketSize));

                nanopubs_data_array = await getNanopubBucket(nanopubs_id_list.slice(0,bucketSize));

                hideModalLight("modalLoadNanopub");

               
                /*.catch(
                    function (){
                        console.log('Error catched after getNanopubBucket()');
                    });
                    */
                
                
                
            }


        console.log(nanopubs_data_array);

              return nanopubs_data_array;

        }
    
  async function asyncCall() {
      console.log('Resolving all nanopubs data');
      var nanopubs = await resolveAllNanopubsData();
      console.log(`Nanopubs: ${nanopubs.length} \n`);

      
      if(nanopubs.length>0)
          {
              $("#modalLoadNanopub").modal('hide');
        
      
     
      
      //console.log($("#modalLoadNanopub").html());
      
      console.log(`Nanopubs: ${nanopubs.length} \n`);
      console.dir(nanopubs);
      
      var html = $("#nanoList").html();
    
    for (nanopub of nanopubs)
        {
            console.log("identifier: "+nanopub.identifier+" platform: "+nanopub.platform+", assertion: "+nanopub.content.description+", subject: "+nanopub.content.subject);
            counter++;
              
              let platform = nanopub.platform;
              let description = nanopub.content.description;
              let entities = nanopub.content.entities;
              let subject = nanopub.content.subject;
            
              let assertion_items = description.split(" - ");
            
              let assertion_items_string = "";
            
              let disease = "";
              let gene = "";
          
                 
              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          } 

                  }
                  
            let URL_platform_search = "";
            
            if(platform == "DisGeNET")
                {
                    
                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
              
            if(!html.includes(nanopub.identifier))
                {
                    html = html + "<span id=\"nanopubListItem-"+nanopub.identifier+"\" class=\"list-group-item\"><div class='flx-container'><span class='platform_hidden'>"+nanopub.platform+"</span><h5 class='nanopub_title'>"+nanopub.content.description+"</h5><span><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer' class='platform'>"+nanopub.platform+"</a></span></div><small class='nanopub_subject'>"+nanopub.content.subject+"<i class=\"fas fa-project-diagram diagram-toggle-button\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Show Graph Analysis\" data-target='"+nanopub.identifier+"' id='graphButton-"+nanopub.identifier+"'></i></small></span>";
                }
            else
                {
                    console.log('Already present: '+nanopub.identifier);
                }
            
            //console.log(html);
        }
    
     
    $("#nanoList").html(html);
              
    $('[data-toggle="tooltip"]').tooltip();  
              

              
      
              
    /* *********** Graph analysis ************* */
              
     $('.diagram-toggle-button').click(async function (event){
         
         
           console.log('diagram-toggle-button');
         
           event.stopPropagation();
         
           $("#initial-message-graphAnalysis").hide();
           $("#svg-canvas").removeClass("noDisplay");
           $("#expand-nanoInfo").html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Graph Layer");
           
               
           graph_mode_flag = true;
          
          $('svg').attr('width',1000);
          $('svg').attr('height',800);
        $('#graphAnalysis').css({'max-width':$(window).width(),'max-height':$(window).height(), 'overflow-y':'scroll','overflow-x':'scroll'});
            //$('svg').attr('width',550);
            //$('rect').attr('width',800);
                    
            $('#nanopubInfo').hide('slow');
            $('#graphAnalysis').show('slow');
                          
            
            $('#nanoListContainer').removeClass('col-md-12');
            $('#nanoListContainer').addClass('col-md-6');
          
          
          
          
          // ****************** D3 code ************************
         
         nanopub_graph = {
        "nodes": [],

        "links":[]};
          
          $(".nodes").remove();
          $(".links").remove();
          $("text").remove();
          
          nanoID = $("#"+this.id).attr("data-target");
          
          await $.ajax({
                             //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/dbslim/"+nanoID,
                             url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/dbslim/"+nanoID,
                             type: 'GET',
                             async: true,
                             timeout: 15000})
                        .done(
function( data ) 
{
        
    
    var nanopub = data;

 


						   

              
function generateGraphFromNanopub(nanopubData)
{
	  console.log("entered in generateGraphFromNanopub");
	  var description = nanopubData.content.description;
      var entities = nanopubData.content.entities;
      var subject = nanopubData.content.subject;
	  var creationDate = nanopubData.creation_date;
	  var creators = nanopubData.creators;
	  var collaborators = nanopubData.collaborators;
	  var platform = nanopubData.platform;
	  var rights_holder = nanopubData.rights_holder;
	  var rights_holder_id = nanopubData.rights_holder_id;
	  var nanopub_url = nanopubData.url_np;
	  var identifier = nanopubData.identifier;
	  var text_snippet = nanopubData["text-snippet"];

	  console.log("text_snippet: " +text_snippet);

	 /* begin */
    
       if(nanopubData.evidenceReferences!= undefined)
          {
                evidence_authors = nanopubData.evidenceReferences[0]["authors"];
	            evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
                evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
	            evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
          }
	 
	  var assertion_generated_by = nanopubData["generated_by"];
	  var assertion_generationComment = nanopubData["generationComment"];
	  var assertion_subject;
	  var assertion_object;
	  var assertion_predicate;
                
            
            
            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);
              
              var creators_string = "[";
            
            if(creators != undefined )
                {
                  for(let j=0;j<creators.length;j++)
                      {
                          let name_creator = creators[j]["name"];
                          let family_name_creator = creators[j]["family_name"];
                          let id_agent_creator = creators[j]["id_agent"];

                          if(j<creators.length-1)
                              {
                                 creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                              }
                          else{
                              creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                          }
                      }
                }
            
            creators_string += "]";
            
             var collaborators_string = "[";
    
             if(collaborators != undefined )
                {
            
                  for(let j=0;j<collaborators.length;j++)
                      {
                          let name_collaborator = collaborators[j]["name"];
                          let family_name_collaborator = collaborators[j]["family_name"];
                          let id_agent_collaborator = collaborators[j]["id_agent"];

                          if(j<collaborators.length-1)
                              {
                                 collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                              }
                          else{
                              collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                          }
                      }
                }
            
            collaborators_string += "]";
            
            
            var evidence_authors_string = "[";
    
            if(evidence_authors != undefined )
                {    
        
              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];
                      
                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
                }
            
            evidence_authors_string += "]";
            
            
              var assertion_items = description.split(" - ");
            
              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }
                         
                      }
                  
                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {
                                  
                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }
                  
                  counter++;
                  
                  
              }
    
    
    /* end */
              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/
                
            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion\"><h5 class=\"card-header\" id=\"cardAssertionHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion\">"+subject+" between: ["+assertion_items_string+"]</div></div>";
            
              let disease = "";
              let gene = "";
			  let association = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = {"id":entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1),"name":entities[i]["name"],"url":entities[i]["id_entity"]};
                              console.log("disease:"+ disease);
							  console.dir(disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             //gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                             gene = {"id":entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1),"name":entities[i]["name"], "url":entities[i]["id_entity"]};
							 console.log("gene:");
							 console.dir(gene);
                          }
					 else if(entities[i]["entity_type"]=="OBJECT2")
							{
								association = entities[i]["name"];
								console.log("association:"+ association);
							}

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
				
			assertion_subject = gene["name"];
			assertion_object = disease["name"];
			assertion_predicate = association;


			nanopub_graph = createNode(assertion_subject, 1, 200, 200, 15, colors["GENE"],  [{"target":assertion_object,"predicate":assertion_predicate}], nanopub_graph, assertion_subject, "GENE");
			nanopub_graph = createNode(assertion_object, 1, 250, 300, 15, colors["DISEASE"],  [], nanopub_graph, assertion_subject, "DISEASE");
    
    
            // Make a copy of the nanopub graph
            nanopub_graph_copy = createNode(assertion_subject, 1, 200, 200, 15, colors["GENE"],  [{"target":assertion_object,"predicate":assertion_predicate}], nanopub_graph_copy, assertion_subject, "GENE");
            nanopub_graph_copy = createNode(assertion_object, 1, 250, 300, 15, colors["DISEASE"],  [], nanopub_graph_copy, assertion_subject, "DISEASE");
    
    
            let x_label_pos = (50+250)/2;
            let y_label_pos = (100+300)/2;
    
            let predicate_label = {"label_text":assertion_predicate,"x":x_label_pos,"y":y_label_pos, "predicate_flag": true};
            labels_array.push(predicate_label);
    
             //nanopub_graph = createNode("nodo prova", 1, 450, 300, 15, colors["assertion"]["object"],  [{"target":assertion_subject,"predicate":"prova 2"}], nanopub_graph);
			
}


graph = nanopub_graph;
generateGraphFromNanopub(nanopub);
    
console.log('labels_array:');
console.dir(labels_array);
    

function closestPoint(pathNode, point) {
  var pathLength = pathNode.getTotalLength(),
      precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);
  return best;

  function distance2(p) {
      
      let transform_translate = $('.links').attr('transform');
      transform_translate = transform_translate.replace("translate(","");
      transform_translate = transform_translate.replace(")","");
      let translate_values = transform_translate.split(",");
      let translate_x = translate_values[0];
      let translate_y = translate_values[1];
      //console.log('transform: '+translate_x+", "+translate_y);
    var dx = p.x+parseFloat(translate_x) - point[0],
        dy = p.y+parseFloat(translate_y) - point[1];
    return dx * dx + dy * dy;
  }
}


    updateD3Graph();


    
svg.on('mousemove', function() {
      //console.log( d3.event.pageX, d3.event.pageY ); // log the mouse x,y position
        
      let lines = d3.selectAll("line");
    
    //console.dir(lines);
    
    let lines_number = lines["_groups"][0].length;
    //console.log('lines number: '+lines_number);

    if(lines_number > 0)
    {


        let line_counter = 0;

        let distances_array = [];

        for (line_counter = 0; line_counter < lines_number; line_counter++) {
            let pnt = d3.mouse(this);
            distances_array[line_counter] = closestPoint(lines["_groups"][0][line_counter], pnt);
        }

        let min_distance = 2000;
        let min_distance_index = 0;
        for (let ii = 0; ii < distances_array.length; ii++) {
            if (distances_array[ii]["distance"] < min_distance) {
                min_distance = distances_array[ii]["distance"];
                min_distance_index = ii;
            }
        }


        //console.dir(distances_array);
        //console.log("min distance: "+min_distance+", min_distance_index: "+min_distance_index);

        let text = lines["_groups"][0][min_distance_index]["attributes"]["title"]["value"];

        //console.dir(lines["_groups"][0][min_distance_index]);

        let x1 = lines["_groups"][0][min_distance_index]["x1"]["animVal"]["valueAsString"];
        let x2 = lines["_groups"][0][min_distance_index]["x2"]["animVal"]["valueAsString"];
        let y1 = lines["_groups"][0][min_distance_index]["y1"]["animVal"]["valueAsString"];
        let y2 = lines["_groups"][0][min_distance_index]["y2"]["animVal"]["valueAsString"];

        let m = (x2 - x1) / (y2 - y1);

        let y_pred = (m * (d3.event.pageX - 200) + parseFloat(y1) - 200);

        //console.log(y_pred,d3.event.pageY);

        if (min_distance < 5) {

            d3.selectAll(".mytooltip").remove();

            var div = d3.select("body").append("div")
                .attr("class", "mytooltip")
                .style("visibility", "visible")
                .html(text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        } else {
            d3.selectAll(".mytooltip")
                .style("visibility", "hidden");
        }

        //console.log(x1,x2,y1,y2);
        // Define the div for the tooltip


    }
    });

let minX = 3000;
let minY = 3000;

$(document).ready(function(){
var children = $(".nodes").children();
let child_c = 0;
for (child of children){

	let x_value = child["attributes"]["transform"]["value"].replace("translate(","");
	x_value = x_value.replace(")","");
	let temp = x_value.substr(0, x_value.indexOf(","));
	
	y_value = x_value.substr(x_value.indexOf(",")+1);
	x_value = temp;
	if(minX>x_value)
	{
		minX = x_value;
	}
	
	if(minY>y_value)
	{
		minY = y_value;
	}
	console.log(x_value+","+y_value);
	
	child_c++;
}

console.log("minX: "+minX);
console.log("minY: "+minY);
$(".nodes").attr("transform","translate(-"+minX+",-"+minY+")");
$(".links").attr("transform","translate(-"+minX+",-"+minY+")");

});



                        }).fail(function() {


                            // Request Timed Out Error

                            //requestTimedOut();
                            graphRequestTimeout();
                            



                          });
          
              
             $('#toggle-graph-nanoinfo-text').html("Show Nanopub Info&nbsp;");
             $('#toggle-graph-nanoinfo-text-copy').html("Show Nanopub Info&nbsp;");
        });
                
              
    
              
              
    /* ************ END of Graph analysis ************* */
    
              
              
              
              
              
              
              
              
              
              
    
        $('.list-group-item').click(function (){
        
        console.log('click done');
            
        $('#nanoListContainer').removeClass('col-md-12');
        $('#nanoListContainer').addClass('col-md-6');
        
        $('#graphAnalysis').hide('slow');
        $('#nanopubInfo').show('slow');
            
        $('#expand-nanoInfo').html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Nanopub Info");
            
        $('#toggle-graph-nanoinfo-text').html("Show Graph Layer&nbsp;");
        $('#toggle-graph-nanoinfo-text-copy').html("Show Graph Layer&nbsp;");
        
            
        graph_mode_flag = false;
                            
    
                                
        let nanopubID = this.id.replace("nanopubListItem-","");
        nanoID = nanopubID;
        
         let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Loading Nanopub Data</h5><div class=\"card-body\"><div class=\"spinner-border text-primary\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></div></div>";
        
        $('#nanopubInfo').html(placeholderInfoCard);
        
        $('#nanopubInfo').show();
                
                                
        $.ajax({
            //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
            url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(function( data ) {

             
            
             var nanopubData = data;
            
              var description = nanopubData.content.description;
              var entities = nanopubData.content.entities;
              var subject = nanopubData.content.subject;
              var creationDate = nanopubData.creation_date;
              var creators = nanopubData.creators;
              var collaborators = nanopubData.collaborators;
              var platform = nanopubData.platform;
              var rights_holder = nanopubData.rights_holder;
              var rights_holder_id = nanopubData.rights_holder_id;
              var nanopub_url = nanopubData.url_np;
              var identifier = nanopubData.identifier;
              var text_snippet = nanopubData["text-snippet"];
            
              console.log("text_snippet: " +text_snippet);
            
              var evidence_authors = nanopubData.evidenceReferences[0]["authors"];
              var evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
              var evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
              var evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
              var assertion_generated_by = nanopubData["generated_by"];
              var assertion_generationComment = nanopubData["generationComment"];
                
            
            
            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);
              
              var creators_string = "[";
            
              for(let j=0;j<creators.length;j++)
                  {
                      let name_creator = creators[j]["name"];
                      let family_name_creator = creators[j]["family_name"];
                      let id_agent_creator = creators[j]["id_agent"];
                      
                      if(j<creators.length-1)
                          {
                             creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                          }
                      else{
                          creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                      }
                  }
            
            creators_string += "]";
            
             var collaborators_string = "[";
            
              for(let j=0;j<collaborators.length;j++)
                  {
                      let name_collaborator = collaborators[j]["name"];
                      let family_name_collaborator = collaborators[j]["family_name"];
                      let id_agent_collaborator = collaborators[j]["id_agent"];
                      
                      if(j<collaborators.length-1)
                          {
                             collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                          }
                      else{
                          collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                      }
                  }
            
            collaborators_string += "]";
            
            
            var evidence_authors_string = "[";
            
              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];
                      
                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
            
            evidence_authors_string += "]";
            
            
              var assertion_items = description.split(" - ");
            
              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }
                         
                      }
                  
                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {
                                  
                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }
                  
                  counter++;
                  
                  
              }
              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/
                
            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion\"><h5 class=\"card-header\" id=\"cardAssertionHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion\">"+subject+" between: ["+assertion_items_string+"]</div></div>";
            
              let disease = "";
              let gene = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          } 

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
            
            let nanopub_url_short = getShortUrl(nanopub_url);
            
            var NanoPublicationInfoCard = "<div class=\"card\" id=\"cardPublicationInfo\"><h5 class=\"card-header\" id=\"cardPublicationInfoHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Publication Info</h5><div class=\"card-body\" id=\"collapsePublicationInfo\"><label class=\"blackLabel\">Creation date:&nbsp;</label>"+creationDate+"<br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+creators_string+"<br/><label class=\"blackLabel\">Collaborators:&nbsp;</label>"+collaborators_string+"<br/><label class=\"blackLabel\">Platform (Link to database data):&nbsp;</label><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer'>"+platform+"</a>&nbsp;<i class=\"fas fa-database\"></i><br/><label class=\"blackLabel\">Rights holder:&nbsp;</label><a href='"+rights_holder_id+"' target='_blank' rel='noopener noreferrer'>"+rights_holder+"</a><br/><label class=\"blackLabel\">Nanopub URL:&nbsp;</label><a href='http://np.inn.ac/"+ identifier+"' target='_blank' rel='noopener noreferrer'>"+nanopub_url_short+"</a><br/></div></div>";
            
            var NanoPublicationProvenanceCard;
            
            if(evidence_abstract != "")
                {
                    NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract'>"+getShortText(evidence_abstract)+"</span><span class='moreText' id='moreText-textAbstract' target-id='textAbstract' target-text='"+encodeHTMLString(evidence_abstract)+"' dimension='300'>more</span><br/></div></div>";
                    
                }
            else
                {
                     NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract'>"+"-"+"</span><span class='moreText' id='moreText-textAbstract' target-id='textAbstract' target-text='"+"-"+"' dimension='300'>more</span><br/></div></div>";
                }
            
              var textSnippetCard = "<div class=\"card\" id=\"cardTextSnippet\"><h5 class=\"card-header\" id=\"cardTextSnippetHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Cite this nanopub</h5><div class=\"card-body\" id=\"collapseTextSnippet\">"+encodeAllUrlInText(text_snippet)+"</div></div>";
            
            
            console.log("Nanopub Data after GET request: "+data);
            console.dir(data);
            
            $('#nanopubInfo').html(basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard);
            
 
     $('.moreText').click(function(){
                    
                    
        let label_text = $('#'+this.id).text();
        console.log('click on '+label_text);
         
        let target_id = $('#'+this.id).attr("target-id");
        let target_text = $('#'+this.id).attr("target-text");
         
         console.log("target_text rg.1152: "+target_text);
        
         console.log("target_id: "+target_id);
         //target_text = target_text.replace(/[^a-zA-Z ]/g, "");
                    console.log(target_text);
        let text_dimension = parseInt($('#'+this.id).attr("dimension"));
                    console.log(text_dimension);
       
        if(text_dimension>text_dimension_threshold)
            {
                short_text = getShortText(target_text);
                
                console.log("short_text rg.1164: "+short_text);
                
                $('#'+this.id).attr("dimension",text_dimension_threshold);
                $('#'+this.id).text("more");
                
                $('#'+target_id).html(short_text);
            
            }
        
        else if(label_text == "more" )
        {
            long_text = target_text;
            
           
            $('#'+this.id).attr("dimension",target_text.length);
            $('#'+this.id).text("less");
            
            console.log("long_text rg.1181: "+long_text);
            
            
            $('#'+target_id).html(long_text+"&nbsp;");
        }
         else
             {
                 $('#'+this.id).attr("dimension",text_dimension_threshold);
                 $('#'+this.id).text("");
                 $('#'+target_id).html(target_text);
             }


    });
            
            $('.card-header').click(function()
                    {
                        console.log('card click: '+this.id);
                
                         let card_body =  $('#'+this.id).parent().find('.card-body');
                
                        card_body.toggle('fast');
                
                    });
            $('#nanopubInfo').show();

           
            $('[data-toggle="tooltip"]').tooltip();   


        }).fail(function() {


           
              
            
                 let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Nanopub Data</h5><div class=\"card-body\"><div class=\"alert alert-danger\" role=\"alert\">No data retrieved!</div></div></div>";
        
                $('#nanopubInfo').html(placeholderInfoCard);
                $('#nanopubInfo').show();






          });
                                

        
    
    });
    
    console.log("counter: "+counter);
              
    }
      else
          {
                        $("#spinner").hide();
                         
                         $("#closeButtonModal").show();
                         
                         $("#message").html("<div class=\"alert alert-warning\" role=\"alert\">No suitable nanopublication founded for query: \""+query+"\"</div>");
              
                         $(".subtitle").html("No suitable nanopublication founded for query: \""+query+"\"");
                         
                         setTimeout(function (){$("#modalLoadNanopub").modal('hide')}, 10000);
          }
      
nanopubsProcessed+=bucketSize;      
}

    
asyncCall();
$("#closeButtonModal").show();

var last_scroll = 0;
var highest_scroll = 0;

    
$('#nanoListContainer').scroll(async function() {
    
    $('.tooltip').hide(); 
    //$('[data-toggle="tooltip"]').tooltip('disable');
    //console.log("scrolltop: "+$(window).scrollTop()+" "+$(window).height()+" "+$(document).height());
    
    console.log("scroll tentative");
    
    if($('#modalLoadNanopub').css("display")=="none")
        {
            //console.log("last_scroll: "+last_scroll+", highest_scroll: "+highest_scroll);
    
    /*if($('#nanoListContainer').scrollTop() > last_scroll && $('#nanoListContainer').scrollTop() >=  highest_scroll){*/
    let currentTime = Math.floor(Date.now() / 1000);
    if((currentTime>lastTimestamp+2) && ($('#nanoListContainer').scrollTop() > last_scroll))
    {
        
            
        highest_scroll = last_scroll = $('#nanoListContainer').scrollTop();
            
    //console.log("scrolltop: "+$('#nanoListContainer').scrollTop()+", innerHeight: "+$('#nanoListContainer').innerHeight()+", scrollHeight: "+$('#nanoListContainer')[0].scrollHeight+", spinner height: "+$('#load-more-nanopub-spinner').innerHeight() );
    
    /*
    if($(window).scrollTop()>=400)
        {
            $('.card').addClass('floating');
        }
    else
        {
            $('.card').removeClass('floating');
        }
   
    if((Math.round($(window).scrollTop()) >= highest_scroll) && (Math.round($(window).scrollTop()) + $(window).height() >= ($(document).height()-2))) {
       
       */
    
    
    if($('#nanoListContainer').scrollTop() + 
                    $('#nanoListContainer').innerHeight() >=  
                    ($('#nanoListContainer')[0].scrollHeight+15)){
       
       
       // Bottom reached
             if(!(nanopubs_id_list.length>0))
                 {
                     
                     nanopubs_id_list = await $.ajax({
                                 //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/query/",
                                 url: "http://"+domain+":8080/nanocitationandindexing/rest/query/",
                                 type: 'POST',
                                 data: ""+query,
                                 dataType: "json",
                                 contentType: "text/plain",
                                 async: true
                                 })
                            .done(function( data ) {
                                console.log("data: "+data);
                                console.log(data);
                            var ID_list = data;   

                            console.log("ID_list: "+ID_list);

                            console.log("start i: "+bucketCurrentNumber*bucketSize);

                            for (let i=bucketCurrentNumber*bucketSize; i < ID_list.length; i++)
                                {
                                    nanopubs_id_list.push(ID_list[""+i]);


                                }



                            }).fail(function() {
                                console.log("error");
                            });

                 }
        
        nanopubs_id_list = Object.values(nanopubs_id_list);
        
        var nanopubs_data_array = new Array();
        
        //$("#modalLoadNanopub").modal('show');
        
        
        // Show spinner for more nanopubs
        
        $("#load-more-nanopub-spinner").show();
        
        console.log("nanopubs_id_list:");
        console.log(nanopubs_id_list);

        console.log(`nanopubsProcessed:${nanopubsProcessed}`);
        
        if(numberOfBuckets >= bucketCurrentNumber)
            {
                
                
                
                        
                            if(nanopubsProcessed < nanopubs_id_list.length)
                                {
                                            

                                           /* var nanopubID = nanopubs_id_list[nanopubsProcessed];
                                            console.log(nanopubID);
                                            let nanodata = await getNanopubData(nanopubID);

                                            console.dir(nanodata);

                                            if(nanodata["identifier"] != undefined)
                                            {
                                                console.log("Insertion into nanopubs_data_array");
                                                nanopubs_data_array.push(nanodata);
                                                
                                            }
                                            else
                                            {
                                                // Request Timed Out Error
                                                console.log("Error");
                                                requestTimedOut();
                                            }
                                            */

                                           console.log(nanopubs_id_list.slice(nanopubsProcessed,nanopubsProcessed+bucketSize));
                                            nanopubs_data_array = await getNanopubBucket(nanopubs_id_list.slice(nanopubsProcessed,nanopubsProcessed+bucketSize));
                                    
                                            Promise.resolve()
                                              .then(getNanopubBucket)
                                              .catch(err => {
                                                console.error(err);
                                                return err; 
                                              })
                                              .then(ok => {
                                                console.log(ok.message)
                                              });
                                    
                                            console.log(nanopubs_data_array);

                                            console.log(nanopubsProcessed);
                                            nanopubsProcessed+=bucketSize;
                                            console.log(nanopubsProcessed);
                                            //console.log(nanopubs_data_array.length);



                                            console.log("nanopubs_data_array.length: "+ nanopubs_data_array.length);
                                            console.log(nanopubs_data_array);


                                }
                    
                    bucketCurrentNumber++;
                
                
                   var html = $("#nanoList").html();
                
                   var nanopubs = nanopubs_data_array;
                
                    if(nanopubs.length > 0)
                        {
    
                                for (nanopub of nanopubs)
                                    {
                                         console.log("identifier: "+nanopub.identifier+" platform: "+nanopub.platform+", assertion: "+nanopub.content.description+", subject: "+nanopub.content.subject);
            counter++;
              
              let platform = nanopub.platform;
              let description = nanopub.content.description;
              let entities = nanopub.content.entities;
              let subject = nanopub.content.subject;
            
              let assertion_items = description.split(" - ");
            
              let assertion_items_string = "";
            
              let disease = "";
              let gene = "";
          
                 
              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          } 

                  }
                  
            let URL_platform_search = "";
            
            if(platform == "DisGeNET")
                {
                    
                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
              
            if(!html.includes(nanopub.identifier))
                {
                    html = html + "<span id=\"nanopubListItem-"+nanopub.identifier+"\" class=\"list-group-item\"><div class='flx-container'><span class='platform_hidden'>"+nanopub.platform+"</span><h5 class='nanopub_title'>"+nanopub.content.description+"</h5><span><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer' class='platform'>"+nanopub.platform+"</a></span></div><small class='nanopub_subject'>"+nanopub.content.subject+"<i class=\"fas fa-project-diagram diagram-toggle-button\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Show Graph Analysis\" data-target='"+nanopub.identifier+"' id='graphButton-"+nanopub.identifier+"'></i></small></span>";
                }
            else
                {
                    console.log('Already present: '+nanopub.identifier);
                }
                                        //console.log(html);
                                    }
                             $("#nanoList").html(html);
                            
                             $('[data-toggle="tooltip"]').tooltip();  
              
      $('[data-toggle="tooltip"]').tooltip();  
              
     $('.diagram-toggle-button').click(async function (event){
         
         
           console.log('diagram-toggle-button');
         
           event.stopPropagation();
         
           $("#initial-message-graphAnalysis").hide();
           $("#svg-canvas").removeClass("noDisplay");
           $("#expand-nanoInfo").html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Graph Layer");
           
               
           graph_mode_flag = true;
          
          $('svg').attr('width',1000);
          $('svg').attr('height',800);
          $('#graphAnalysis').css({'max-height':$(window).height(),'max-width':$(window).width(), 'overflow-y':'scroll','overflow-x':'scroll'});
            //$('svg').attr('width',550);
            //$('rect').attr('width',800);
                    
            $('#nanopubInfo').hide('slow');
            $('#graphAnalysis').show('slow');
                          
            
            $('#nanoListContainer').removeClass('col-md-12');
            $('#nanoListContainer').addClass('col-md-6');
          
          
          
          
          // ****************** D3 code ************************
         
         nanopub_graph = {
        "nodes": [],

        "links":[]};
          
          $(".nodes").remove();
          $(".links").remove();
          $("text").remove();
          
          nanoID = $("#"+this.id).attr("data-target");
          
          await $.ajax({
                             //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/dbslim/"+nanoID,
                             url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/dbslim/"+nanoID,
                             type: 'GET',
                             async: true,
                             timeout: 15000})
                        .done(
function( data ) 
{
        
    
    var nanopub = data;

 


						   

              
function generateGraphFromNanopub(nanopubData)
{
	  console.log("entered in generateGraphFromNanopub");
	  var description = nanopubData.content.description;
      var entities = nanopubData.content.entities;
      var subject = nanopubData.content.subject;
	  var creationDate = nanopubData.creation_date;
	  var creators = nanopubData.creators;
	  var collaborators = nanopubData.collaborators;
	  var platform = nanopubData.platform;
	  var rights_holder = nanopubData.rights_holder;
	  var rights_holder_id = nanopubData.rights_holder_id;
	  var nanopub_url = nanopubData.url_np;
	  var identifier = nanopubData.identifier;
	  var text_snippet = nanopubData["text-snippet"];

	  console.log("text_snippet: " +text_snippet);

	 /* begin */
    
       if(nanopubData.evidenceReferences!= undefined)
          {
                evidence_authors = nanopubData.evidenceReferences[0]["authors"];
	            evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
                evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
	            evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
          }
	 
	  var assertion_generated_by = nanopubData["generated_by"];
	  var assertion_generationComment = nanopubData["generationComment"];
	  var assertion_subject;
	  var assertion_object;
	  var assertion_predicate;
                
            
            
            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);
              
              var creators_string = "[";
            
            if(creators != undefined )
                {
                  for(let j=0;j<creators.length;j++)
                      {
                          let name_creator = creators[j]["name"];
                          let family_name_creator = creators[j]["family_name"];
                          let id_agent_creator = creators[j]["id_agent"];

                          if(j<creators.length-1)
                              {
                                 creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                              }
                          else{
                              creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                          }
                      }
                }
            
            creators_string += "]";
            
             var collaborators_string = "[";
    
             if(collaborators != undefined )
                {
            
                  for(let j=0;j<collaborators.length;j++)
                      {
                          let name_collaborator = collaborators[j]["name"];
                          let family_name_collaborator = collaborators[j]["family_name"];
                          let id_agent_collaborator = collaborators[j]["id_agent"];

                          if(j<collaborators.length-1)
                              {
                                 collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                              }
                          else{
                              collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                          }
                      }
                }
            
            collaborators_string += "]";
            
            
            var evidence_authors_string = "[";
    
            if(evidence_authors != undefined )
                {    
        
              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];
                      
                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
                }
            
            evidence_authors_string += "]";
            
            
              var assertion_items = description.split(" - ");
            
              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }
                         
                      }
                  
                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {
                                  
                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }
                  
                  counter++;
                  
                  
              }
    
    
    /* end */
              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/
                
            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion\"><h5 class=\"card-header\" id=\"cardAssertionHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion\">"+subject+" between: ["+assertion_items_string+"]</div></div>";
            
              let disease = "";
              let gene = "";
			  let association = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = {"id":entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1),"name":entities[i]["name"],"url":entities[i]["id_entity"]};
                              console.log("disease:"+ disease);
							  console.dir(disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             //gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                             gene = {"id":entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1),"name":entities[i]["name"], "url":entities[i]["id_entity"]};
							 console.log("gene:");
							 console.dir(gene);
                          }
					 else if(entities[i]["entity_type"]=="OBJECT2")
							{
								association = entities[i]["name"];
								console.log("association:"+ association);
							}

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
				
			assertion_subject = gene["name"];
			assertion_object = disease["name"];
			assertion_predicate = association;


			nanopub_graph = createNode(assertion_subject, 1, 200, 200, 15, colors["GENE"],  [{"target":assertion_object,"predicate":assertion_predicate}], nanopub_graph, assertion_subject, "GENE");
			nanopub_graph = createNode(assertion_object, 1, 250, 300, 15, colors["DISEASE"],  [], nanopub_graph, assertion_subject, "DISEASE");
    
    
            // Make a copy of the nanopub graph
            nanopub_graph_copy = createNode(assertion_subject, 1, 200, 200, 15, colors["GENE"],  [{"target":assertion_object,"predicate":assertion_predicate}], nanopub_graph_copy, assertion_subject, "GENE");
            nanopub_graph_copy = createNode(assertion_object, 1, 250, 300, 15, colors["DISEASE"],  [], nanopub_graph_copy, assertion_subject, "DISEASE");
    
    
            let x_label_pos = (50+250)/2;
            let y_label_pos = (100+300)/2;
    
            let predicate_label = {"label_text":assertion_predicate,"x":x_label_pos,"y":y_label_pos, "predicate_flag": true};
            labels_array.push(predicate_label);
    
             //nanopub_graph = createNode("nodo prova", 1, 450, 300, 15, colors["assertion"]["object"],  [{"target":assertion_subject,"predicate":"prova 2"}], nanopub_graph);
			
}


graph = nanopub_graph;
generateGraphFromNanopub(nanopub);
    
console.log('labels_array:');
console.dir(labels_array);
    

function closestPoint(pathNode, point) {
  var pathLength = pathNode.getTotalLength(),
      precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);
  return best;

  function distance2(p) {
      
      let transform_translate = $('.links').attr('transform');
      transform_translate = transform_translate.replace("translate(","");
      transform_translate = transform_translate.replace(")","");
      let translate_values = transform_translate.split(",");
      let translate_x = translate_values[0];
      let translate_y = translate_values[1];
      //console.log('transform: '+translate_x+", "+translate_y);
    var dx = p.x+parseFloat(translate_x) - point[0],
        dy = p.y+parseFloat(translate_y) - point[1];
    return dx * dx + dy * dy;
  }
}


    updateD3Graph();


    
svg.on('mousemove', function() {
      //console.log( d3.event.pageX, d3.event.pageY ); // log the mouse x,y position
        
      let lines = d3.selectAll("line");
    
    //console.dir(lines);
    
    let lines_number = lines["_groups"][0].length
    //console.log('lines number: '+lines_number);
    
    let line_counter = 0;
    
    let distances_array = [];
    
    for(line_counter = 0;line_counter<lines_number;line_counter++ )
        {
              let pnt = d3.mouse(this);
                  distances_array[line_counter] = closestPoint(lines["_groups"][0][line_counter], pnt);
        }
    
    let min_distance = 2000;
    let min_distance_index = 0;
    for(let ii=0;ii<distances_array.length;ii++)
        {
            if(distances_array[ii]["distance"]<min_distance)
                {
                    min_distance = distances_array[ii]["distance"];
                    min_distance_index = ii;
                }
        }
        

                //console.dir(distances_array);
                //console.log("min distance: "+min_distance+", min_distance_index: "+min_distance_index);

                let text = lines["_groups"][0][min_distance_index]["attributes"]["title"]["value"];

                //console.dir(lines["_groups"][0][min_distance_index]);

                let x1 = lines["_groups"][0][min_distance_index]["x1"]["animVal"]["valueAsString"];
                let x2 = lines["_groups"][0][min_distance_index]["x2"]["animVal"]["valueAsString"];
                let y1 = lines["_groups"][0][min_distance_index]["y1"]["animVal"]["valueAsString"];
                let y2 = lines["_groups"][0][min_distance_index]["y2"]["animVal"]["valueAsString"];

                let m = (x2-x1)/(y2-y1);

                let y_pred = (m*(d3.event.pageX-200)+parseFloat(y1)-200);

                //console.log(y_pred,d3.event.pageY);

                if(min_distance < 5)
                    {

                         d3.selectAll(".mytooltip").remove();
                        

                         var div = d3.select("body").append("div")	
                        .attr("class", "mytooltip")				
                        .style("visibility", "visible")	
                        .html(text)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");
                    }
                else
                    {
                        d3.selectAll(".mytooltip")	
                        .style("visibility", "hidden");
                    }

                  //console.log(x1,x2,y1,y2);
                             // Define the div for the tooltip
        
    
   
        
    });

let minX = 3000;
let minY = 3000;

$(document).ready(function(){
var children = $(".nodes").children();
let child_c = 0;
for (child of children){

	let x_value = child["attributes"]["transform"]["value"].replace("translate(","");
	x_value = x_value.replace(")","");
	let temp = x_value.substr(0, x_value.indexOf(","));
	
	y_value = x_value.substr(x_value.indexOf(",")+1);
	x_value = temp;
	if(minX>x_value)
	{
		minX = x_value;
	}
	
	if(minY>y_value)
	{
		minY = y_value;
	}
	console.log(x_value+","+y_value);
	
	child_c++;
}

console.log("minX: "+minX);
console.log("minY: "+minY);
$(".nodes").attr("transform","translate(-"+minX+",-"+minY+")");
$(".links").attr("transform","translate(-"+minX+",-"+minY+")");

});



                        }).fail(function() {


                            // Request Timed Out Error

                            //requestTimedOut();
                            graphRequestTimeout();
                            



                          });
          
              
             $('#toggle-graph-nanoinfo-text').html("Show Nanopub Info&nbsp;");
             $('#toggle-graph-nanoinfo-text-copy').html("Show Nanopub Info&nbsp;");
         
            
        });
                            

        $('.list-group-item').click(function (){
        console.log('click done');
            
        $('#nanoListContainer').removeClass('col-md-12');
        $('#nanoListContainer').addClass('col-md-6');
        
        $('#graphAnalysis').hide('slow');
        $('#nanopubInfo').show('slow');
            
        $('#expand-nanoInfo').html("<i class=\"fas fa-angle-left\"></i>&nbsp;Expand Nanopub Info");
            
        $('#toggle-graph-nanoinfo-text').html("Show Graph Layer&nbsp;");
        $('#toggle-graph-nanoinfo-text-copy').html("Show Graph Layer&nbsp;");
        
            
        graph_mode_flag = false;
                            
    
                                
        let nanopubID = this.id.replace("nanopubListItem-","");
            
            nanoID = nanopubID;
        
         let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Loading Nanopub Data</h5><div class=\"card-body\"><div class=\"spinner-border text-primary\" role=\"status\"><span class=\"sr-only\">Loading...</span></div></div></div>";
        
        $('#nanopubInfo').html(placeholderInfoCard);
        
        $('#nanopubInfo').show();
                
                                
        $.ajax({
            //url: "http://exa.dei.unipd.it:8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
            url: "http://"+domain+":8080/nanocitationandindexing/rest/jsonmeta/db/"+nanopubID,
             type: 'GET',
             async: true,
             timeout: 10000})
        .done(function( data ) {

             
            
             var nanopubData = data;
            
              var description = nanopubData.content.description;
              var entities = nanopubData.content.entities;
              var subject = nanopubData.content.subject;
              var creationDate = nanopubData.creation_date;
              var creators = nanopubData.creators;
              var collaborators = nanopubData.collaborators;
              var platform = nanopubData.platform;
              var rights_holder = nanopubData.rights_holder;
              var rights_holder_id = nanopubData.rights_holder_id;
              var nanopub_url = nanopubData.url_np;
              var identifier = nanopubData.identifier;
              var text_snippet = nanopubData["text-snippet"];
            
              console.log("text_snippet: " +text_snippet);
            
              var evidence_authors = nanopubData.evidenceReferences[0]["authors"];
              var evidence_abstract = nanopubData.evidenceReferences[0]["abstract_text"];
              var evidence_source = nanopubData.evidenceReferences[0]["id_evid"];
              var evidence_name_type = nanopubData.evidenceReferences[0]["name_type"];
              var assertion_generated_by = nanopubData["generated_by"];
              var assertion_generationComment = nanopubData["generationComment"];
                
            
            
            console.log("nanopubData:");
            console.dir(nanopubData);
            console.log(evidence_authors);
              
              var creators_string = "[";
            
              for(let j=0;j<creators.length;j++)
                  {
                      let name_creator = creators[j]["name"];
                      let family_name_creator = creators[j]["family_name"];
                      let id_agent_creator = creators[j]["id_agent"];
                      
                      if(j<creators.length-1)
                          {
                             creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>, &nbsp;tele";
                          }
                      else{
                          creators_string+="<a href='"+id_agent_creator+"' target='_blank' rel='noopener noreferrer'>"+name_creator+" "+family_name_creator+"</a>";
                      }
                  }
            
            creators_string += "]";
            
             var collaborators_string = "[";
            
              for(let j=0;j<collaborators.length;j++)
                  {
                      let name_collaborator = collaborators[j]["name"];
                      let family_name_collaborator = collaborators[j]["family_name"];
                      let id_agent_collaborator = collaborators[j]["id_agent"];
                      
                      if(j<collaborators.length-1)
                          {
                             collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>,&nbsp;";
                          }
                      else{
                          collaborators_string+="<a href='"+id_agent_collaborator+"' target='_blank' rel='noopener noreferrer'>"+name_collaborator+" "+family_name_collaborator+"</a>";
                      }
                  }
            
            collaborators_string += "]";
            
            
            var evidence_authors_string = "[";
            
              for(let j=0;j<evidence_authors.length;j++)
                  {
                      let name_evidence_author = evidence_authors[j]["name"];
                      let family_name_evidence_author = evidence_authors[j]["family_name"];
                      let id_agent_evidence_author = evidence_authors[j]["id_agent"];
                      
                      if(j<evidence_authors.length-1)
                          {
                             evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>,&nbsp;";
                          }
                      else{
                          evidence_authors_string+="<a href='"+id_agent_evidence_author+"' target='_blank' rel='noopener noreferrer'>"+name_evidence_author+" "+family_name_evidence_author+"</a>";
                      }
                  }
            
            evidence_authors_string += "]";
            
            
              var assertion_items = description.split(" - ");
            
              var assertion_items_string = "";
              let counter = 0;
              for (assertion_item of assertion_items)
              {
                  let i = 0;
                  let flag_presence = false;
                  for(i=0;i<entities.length;i++)
                      {
                          if(assertion_item == entities[i]["name"])
                              {
                                  let index_item = assertion_items.indexOf(assertion_item);
                                  assertion_items[index_item] = "<a href='"+entities[i]["id_entity"]+"' target='_blank' rel='noopener noreferrer'>"+assertion_item+"</a>";
                                  if(counter<assertion_items.length-1)
                                    {
                                        assertion_items_string += assertion_items[index_item]+", ";
                                    }
                                  else
                                  {
                                      assertion_items_string += assertion_items[index_item];
                                  }
                                  flag_presence = true;
                              }
                         
                      }
                  
                  if(!flag_presence)
                      {
                          if(counter<assertion_items.length-1)
                              {
                                  
                                    assertion_items_string += assertion_item+", ";
                              }
                          else
                              {
                                  assertion_items_string += assertion_item;
                              }
                      }
                  
                  counter++;
                  
                  
              }
              /*var basicInfoCard = "<div class=\"card\"><h5 class=\"card-header\" data-toggle=\"collapse\" href=\"#collapseAssertion\">Assertion</h5><div class=\"card-body\" id=\"collapseAssertion\">"+data+"</div></div>";*/
                
            var basicInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardAssertion\"><h5 class=\"card-header\" id=\"cardAssertionHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">"+description+"</h5><div class=\"card-body\" id=\"collapseAssertion\">"+subject+" between: ["+assertion_items_string+"]</div></div>";
            
              let disease = "";
              let gene = "";


              for(i=0;i<entities.length;i++)
                  {
                      if(entities[i]["type"]=="DISEASE")
                          {
                             disease = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("disease:"+ disease);
                          }
                      else if(entities[i]["type"]=="GENE")
                          {
                             gene = entities[i]["id_entity"].substr(entities[i]["id_entity"].lastIndexOf("/")+1);
                              console.log("gene:"+ gene);
                          } 

                  }

            let URL_platform_search = "";

            if(platform == "DisGeNET")
                {

                    URL_platform_search = "http://www.disgenet.org/browser/0/1/0/"+disease+"/0/25/geneid__"+gene+"-source__ALL/_b./";
                }
            
            let nanopub_url_short = getShortUrl(nanopub_url);
            
            var NanoPublicationInfoCard = "<div class=\"card\" id=\"cardPublicationInfo\"><h5 class=\"card-header\" id=\"cardPublicationInfoHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Publication Info</h5><div class=\"card-body\" id=\"collapsePublicationInfo\"><label class=\"blackLabel\">Creation date:&nbsp;</label>"+creationDate+"<br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+creators_string+"<br/><label class=\"blackLabel\">Collaborators:&nbsp;</label>"+collaborators_string+"<br/><label class=\"blackLabel\">Platform (Link to database data):&nbsp;</label><a href='"+URL_platform_search+"' target='_blank' rel='noopener noreferrer'>"+platform+"</a>&nbsp;<i class=\"fas fa-database\"></i><br/><label class=\"blackLabel\">Rights holder:&nbsp;</label><a href='"+rights_holder_id+"' target='_blank' rel='noopener noreferrer'>"+rights_holder+"</a><br/><label class=\"blackLabel\">Nanopub URL:&nbsp;</label><a href='http://np.inn.ac/"+ identifier+"' target='_blank' rel='noopener noreferrer'>"+nanopub_url_short+"</a><br/></div></div>";
            
            var NanoPublicationProvenanceCard = "<div class=\"card\" id=\"cardPublicationProvenance\"><h5 class=\"card-header\" id=\"cardPublicationProvenanceHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Provenance</h5><div class=\"card-body\" id=\"collapsePublicationProvenance\"><label class=\"blackLabel\">Assertion generated by:&nbsp;</label>"+assertion_generated_by+"<br/><label class=\"blackLabel\">Assertion Generation Description:&nbsp;</label>"+assertion_generationComment+"<br/><label class=\"blackLabel\">Evidence Source:&nbsp;</label><a href='"+evidence_source+"' target='_blank' rel='noopener noreferrer'>"+evidence_source+"</a><br/><label class=\"blackLabel\">Creators:&nbsp;</label>"+evidence_authors_string+"<br/><label class=\"blackLabel\">Abstract:&nbsp;</label><span id='textAbstract'>"+getShortText(evidence_abstract)+"</span><span class='moreText' id='moreText-textAbstract' target-id='textAbstract' target-text='"+encodeHTMLString(evidence_abstract)+"' dimension='300'>more</span><br/></div></div>";
            
              var textSnippetCard = "<div class=\"card\" id=\"cardTextSnippet\"><h5 class=\"card-header\" id=\"cardTextSnippetHeader\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to Expand/Collapse\">Cite this nanopub</h5><div class=\"card-body\" id=\"collapseTextSnippet\">"+encodeAllUrlInText(text_snippet)+"</div></div>";
            
            
            console.log("Nanopub Data after GET request: "+data);
            console.dir(data);
            
            $('#nanopubInfo').html(basicInfoCard+NanoPublicationInfoCard+NanoPublicationProvenanceCard+textSnippetCard);
            
 
     $('.moreText').click(function(){
                    
                    
        let label_text = $('#'+this.id).text();
        console.log('click on '+label_text);
         
        let target_id = $('#'+this.id).attr("target-id");
        let target_text = $('#'+this.id).attr("target-text");
         
         console.log("target_text rg.1152: "+target_text);
        
         console.log("target_id: "+target_id);
         //target_text = target_text.replace(/[^a-zA-Z ]/g, "");
                    console.log(target_text);
        let text_dimension = parseInt($('#'+this.id).attr("dimension"));
                    console.log(text_dimension);
       
        if(text_dimension>text_dimension_threshold)
            {
                short_text = getShortText(target_text);
                
                console.log("short_text rg.1164: "+short_text);
                
                $('#'+this.id).attr("dimension",text_dimension_threshold);
                $('#'+this.id).text("more");
                
                $('#'+target_id).html(short_text);
            
            }
        
        else if(label_text == "more" )
        {
            long_text = target_text;
            
           
            $('#'+this.id).attr("dimension",target_text.length);
            $('#'+this.id).text("less");
            
            console.log("long_text rg.1181: "+long_text);
            
            
            $('#'+target_id).html(long_text+"&nbsp;");
        }
         else
             {
                 $('#'+this.id).attr("dimension",text_dimension_threshold);
                 $('#'+this.id).text("");
                 $('#'+target_id).html(target_text);
             }


    });
            
            $('.card-header').click(function()
                    {
                        console.log('card click: '+this.id);
                
                         let card_body =  $('#'+this.id).parent().find('.card-body');
                
                        card_body.toggle('fast');
                
                    });
            $('#nanopubInfo').show();

           
            $('[data-toggle="tooltip"]').tooltip();   


        }).fail(function() {


           
              
            
                 let placeholderInfoCard = "<div class=\"card zeroTopMargin\" id=\"cardPlaceHolder\"><h5 class=\"card-header\" id=\"cardPlaceHolderHeader\">Nanopub Data</h5><div class=\"card-body\"><div class=\"alert alert-danger\" role=\"alert\">No data retrieved!</div></div></div>";
        
                $('#nanopubInfo').html(placeholderInfoCard);
                $('#nanopubInfo').show();






          });
                                

        
    });

                            $("#modalLoadNanopub").modal('hide');
                            
                            $("#load-more-nanopub-spinner").hide();

                            //console.log("bucketCurrentNumber: "+bucketCurrentNumber);
                        }
                
                    if(bucketCurrentNumber > numberOfBuckets){
                                
                          let currentTime = Math.floor(Date.now() / 1000);
                                if(($('#modalLoadNanopub').css("display")=="none") && (currentTime>lastTimestamp+1))
                                {
                                    console.log("entered in No nanopub available 1");
                                     // No nanopub available

                                     $("#spinner").hide();

                                     $("#modalLoadNanopub").modal('show');

                                     $("#load-more-nanopub-spinner").hide();

                                     $("#closeButtonModal").show();

                                     $("#message").html("<div class=\"alert alert-warning\" role=\"alert\">No more suitable nanopublication founded for query: \""+query+"\"</div>");

                                     $(".subtitle").html("No suitable nanopublication founded for query: \""+query+"\"");
                                    
                                    // Update timestamp
                                    lastTimestamp = Math.floor(Date.now() / 1000);
                                    //console.log("lastTimestamp: "+lastTimestamp);
                                }
                                else
                                    {
                                        console.log("alert nanopubs already displayed");
                                        //console.log("currentTime: "+currentTime);
                                        //console.log("lastTimestamp: "+lastTimestamp);
                                        
                                    }
                                 /*setTimeout(function (){$("#modalLoadNanopub").modal('hide')}, 10000);*/
                            
                    }
    
            }
        else
                    {
                        let currentTime = Math.floor(Date.now() / 1000);
                                if(($('#modalLoadNanopub').css("display")=="none") && (currentTime>lastTimestamp+1))
                                {
                                    console.log("entered in No nanopub available 2");        

                                     // No nanopub available

                                     $("#spinner").hide();

                                     $("#load-more-nanopub-spinner").hide();

                                     $("#modalLoadNanopub").modal('show');

                                     $("#closeButtonModal").show();

                                     $("#message").html("<div class=\"alert alert-warning\" role=\"alert\">No more suitable nanopublication founded for query: \""+query+"\"</div>");

                                     $(".subtitle").html("No suitable nanopublication founded for query: \""+query+"\"");
                                    
                                    // Update timestamp
                                    lastTimestamp = Math.floor(Date.now() / 1000);
                                    //console.log("lastTimestamp: "+lastTimestamp);
                                }
                                else
                                    {
                                        console.log("alert nanopubs already displayed");
                                        //console.log("currentTime: "+currentTime);
                                        //console.log("lastTimestamp: "+lastTimestamp);
                                        
                                    }

                                 /*setTimeout(function (){$("#modalLoadNanopub").modal('hide')}, 10000);*/
                            
                    }
   }
        }
    else
        {
            last_scroll = $('#nanoListContainer').scrollTop();
        }
            
        }
    
    //$('[data-toggle="tooltip"]').tooltip('enable');
    
    //$('.tooltip').show();
    
});

    /*
$(".tooltip").mouseout(function (){
    
     $('.tooltip').hide(); 
    
});
   */ 
    
    
});
