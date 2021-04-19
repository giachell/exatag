import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../App";
import { confirm } from '../Dialog/confirm'
import regeneratorRuntime from "regenerator-runtime";


function SubmitButtons(props){

    const { report, disButton,labelsToInsert, selectedconcepts,linkingConcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [SavedGT,SetSavedGT] = save;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;


    const [Disable_Buttons, SetDisable_Buttons] = disButton;

    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Report, setReport] = report;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [UserLabels, SetUserLables] = userLabels;
    const [Action, SetAction] = action;
    const [Disabled,SetDisabled] = useState(true); //PER CLEAR




    useEffect(()=>{
        SetDisabled(true)
        console.log('disabledbutt',Disable_Buttons)

        if(Action === 'labels' && RadioChecked){

            SetDisabled(false)

        }
        else if(Action === 'mentions' && (mentions_to_show.length > 0 )){
            SetDisabled(false)
        }
        else if(Action === 'concepts' && (selectedConcepts['Diagnosis'].length > 0 || selectedConcepts['Anatomical Location'].length > 0
        || selectedConcepts['Procedure'].length > 0 || selectedConcepts['Test'].length > 0 || selectedConcepts['General Entity'].length >0)){
            SetDisabled(false)
        }
        else if(Action === 'concept-mention' && (associations_to_show.length > 0)){
            SetDisabled(false)

        }

    },[associations_to_show,mentions_to_show,selectedConcepts,RadioChecked])



    const submit = (event,token) => {
        event.preventDefault();
        // if(Saved === false){
        //     SetSaved(true)
        if (token.startsWith('mentions')) {
            SetWordMention('')
            Children.map(child=>{
                if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
                    child.setAttribute('class','token')
                }
            })
            var data_to_ret = {'mentions': mentions_to_show}
            console.log('mentions: ' ,mentions_to_show)

            axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
                mentions: data_to_ret['mentions'],
                report_id: Reports[Index].id_report
            })
                .then(function (response) {

                    SetSavedGT(prevState => !prevState)
                    console.log('RISPOSTA',response);
                })
                .catch(function (error) {
                    //alert('ATTENTION')
                    console.log(error);
                });

        }else if (token.startsWith('annotation')) {
            //const data = new FormData(document.getElementById("annotation-form"));
            console.log('labtoinsert',LabToInsert)
            axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/insert', {
                //labels: data.getAll('labels'),
                labels: LabToInsert,
                report_id: Reports[Index].id_report,
            })
                .then(function (response) {
                    console.log(response);

                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    if (LabToInsert.length === 0) {
                        SetRadioChecked(false)

                    }
                    // SetLabToInsert([])
                    SetSavedGT(prevState => !prevState)
                })
                .catch(function (error) {

                    console.log(error);
                });

        } else if (token.startsWith('linked')) {
            const data = new FormData(document.getElementById("linked-form"));
            //var data_to_ret = {'linked': data.getAll('linked')}


            data_to_ret = {'linked': associations_to_show}
            if (data_to_ret['linked'].length >= 0) {
                axios.post('http://examode.dei.unipd.it/exatag/insert_link/insert', {
                    linked: data_to_ret['linked'],
                    report_id: Reports[Index].id_report
                })
                    .then(function (response) {
                        console.log(response);
                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetWordMention('')
                        console.log('aggiornato concepts');

                        SetSavedGT(prevState => !prevState)
                    })
                    .catch(function (error) {

                        console.log(error);
                    });
            }
        } else if (token.startsWith('concepts')) {
            console.log(selectedConcepts);

            let concepts_list = []
            let sem_areas = ["Anatomical Location", "Diagnosis", "General Entity", "Procedure", "Test"]

            for (let area of sem_areas) {
                for (let concept of selectedConcepts[area]) {
                    concepts_list.push(concept);
                }
            }

            console.log(concepts_list);

            axios.post('http://examode.dei.unipd.it/exatag/contains/update', {
                    concepts_list: concepts_list,
                    report_id: Reports[Index].id_report,
                },
            )
                .then(function (response) {
                    console.log(response);
                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    SetSavedGT(prevState => !prevState)

                })
                .catch(function (error) {

                    console.log(error);
                });
        }



    }




    const deleteEntries = (event,token)=>{
        event.preventDefault()
        if(token === 'mentions'){
            console.log('WORD',WordMention)

            axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/delete', {report_id: Reports[Index].id_report})
                .then (function (response) {
                    console.log(response);
                    //SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    SetMentions_to_show([]);
                    SetWordMention('')
                    Children.map(child =>{

                        child.setAttribute('class', 'token')
                        child.removeAttribute('style')



                    })
                })
                .catch(function (error) {

                    console.log(error);
                });
            console.log('delete')
        }
        else if(token === 'annotation') {



            axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/delete', {report_id: Reports[Index].id_report})
                .then(function (response) {
                    console.log(response);
                    //SetSavedGT(false)
                    SetRadioChecked(false)
                    SetSavedGT(prevState => !prevState)
                    const newItemsArr = new Array(labels.length).fill(false)
                    setChecks(newItemsArr);
                    SetLabToInsert([])
                })
                .catch(function (error) {

                    console.log(error);
                });
            console.log('delete')

        }
        else if(token === 'linked'){
            axios.post('http://examode.dei.unipd.it/exatag/insert_link/delete', {report_id: Reports[Index].id_report})
                .then (function (response) {
                    console.log(response);
                    //SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    SetAssociations_to_show([]);
                })
                .catch(function (error) {

                    console.log(error);
                });
            console.log('delete')
        }
        else if(token === 'concepts'){
            axios.post('http://examode.dei.unipd.it/exatag/contains/delete', {report_id: Reports[Index].id_report})
                .then (function (response) {
                    console.log(response);
                    // SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    setSelectedConcepts({"Diagnosis":[], "Anatomical Location":[], "Test":[], "Procedure":[], "General Entity":[] });

                })
                .catch(function (error) {

                    console.log(error);
                });
            console.log('delete')
        }

    }

    const ClickForDelete = async (e,token) => {
        var confirm_string = ''
        if(token === 'annotation'){
            confirm_string = 'This action will remove ALL the selected labels. This is irreversible. Are you sure?'
        }
        else if(token === 'mentions'){
            confirm_string = 'This action will remove ALL the selected mentions. If you linked these mentions with some concepts they will be removed as well. This is irreversible. Are you sure?'

        }
        else if(token === 'concepts'){
            confirm_string = 'This action will remove ALL the selected concepts. This is irreversible. Are you sure?'

        }
        else if(token === 'linked'){
            confirm_string = 'This action will remove ALL the linked concepts. This is irreversible. Are you sure?'

        }

        if (await confirm({
            confirmation: confirm_string
        })) {
            deleteEntries(e,token)
            console.log('yes');
        } else {
            console.log('no');
        }
    }
    return(

        // <div style={{'position':'absolute', 'width':'100%','padding':'10px','bottom':'0%'}}>
        <div style={{'position':'absolute','text-align':'center', 'width':'100%','padding':'0px','bottom':'0%'}}>
            <div className='two_buttons_div' >
                <span style={{'float':'left','width':'40%'}}>
                    {/*<Button disabled={Disabled} size='md' className="btn btn-block"  onClick={(e)=>deleteEntries(e,props.token)}  type="submit" variant="danger">Clear</Button>*/}
                    <Button size='sm' disabled={Disabled}  style={{'width':'80%'}} className="btn save"  onClick={(e)=>ClickForDelete(e,props.token)}  type="submit" variant="danger">Clear</Button>
                </span>
                <span style={{'float':'right','width':'40%'}}> <Button size='sm' disabled={Disable_Buttons}   style={{'width':'80%'}} className="btn clear" type="submit"  onClick={(e)=>submit(e,props.token)} variant="success">Save</Button>
                </span>
            </div>


            {/*<div  className='two_buttons_div'>*/}
            {/*        <span style={{'float':'left','width':'40%'}}>*/}
            {/*            <Button size='sm' style={{'width':'80%'}} className="btn prevbtn"  type="submit" onClick={(e)=>submit(e,props.token_prev)} name = "prev"  variant="info"><span><FontAwesomeIcon icon={faChevronLeft} /></span> <span>Previous</span></Button>*/}
            {/*        </span>*/}

            {/*    <span style={{'float':'right','width':'40%'}}>*/}
            {/*            <Button size='sm' style={{'width':'80%'}} className="btn nextbtn" type="submit" onClick={(e)=>submit(e,props.token_next)}  name = "next"  variant="info"><span>Next</span>  <span><FontAwesomeIcon icon={faChevronRight} /></span> </Button>*/}
            {/*        </span>*/}
            {/*</div>*/}
        </div>


    );
}


export default SubmitButtons
