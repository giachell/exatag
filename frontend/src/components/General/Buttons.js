import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './buttons.css';
import './first_row.css';

import {AppContext} from "../../App";


function Buttons(props){
    const { report, disButton,labelsToInsert, selectedconcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [SavedGT,SetSavedGT] = save;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [DisButtonLabels,SetDisButtonLabels] = useState(false)
    const [DisButtonMention,SetDisButtonMention] = useState(false)
    const [DisButtonConcept,SetDisButtonConcept] = useState(false)
    const [DisButtonConceptMention,SetDisButtonConceptMention] = useState(false)
    const [Disable_Buttons, SetDisable_Buttons] = disButton;

    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [Report, setReport] = report;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [UserLabels, SetUserLables] = userLabels;

    const [Action, SetAction] = action
    const [Clicked, SetClicked] = useState(false)
    const [WordMention, SetWordMention] = mentionSingleWord
    const [ID,SetID] = useState(false)

    useEffect(()=>{
        if(Action === 'labels'){
            console.log('disabilito labels')
            SetDisButtonLabels(true)
            SetDisButtonConcept(false)
            SetDisButtonMention(false)
            SetDisButtonConceptMention(false)
        }
        else if(Action === 'mentions'){
            SetDisButtonLabels(false)
            SetDisButtonConcept(false)
            SetDisButtonMention(true)
            SetDisButtonConceptMention(false)
        }
        else if(Action === 'concepts'){
            SetDisButtonLabels(false)
            SetDisButtonConcept(true)
            SetDisButtonMention(false)
            SetDisButtonConceptMention(false)
        }
        else if(Action === 'concept-mention'){
            SetDisButtonLabels(false)
            SetDisButtonConcept(false)
            SetDisButtonMention(false)
            SetDisButtonConceptMention(true)
        }


    },[Action])

    const submit1 = (event,token) => {

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
            //var mentions = Array.from(document.getElementsByName('mention'))
            // var array_ment = []
            // mentions.map(mention => {
            //     console.log(mention.value)
            //     array_ment.push(mention.value)
            // })
            var data_to_ret = {'mentions': mentions_to_show}
            console.log('mentions: ' ,mentions_to_show)

            axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
                mentions: data_to_ret['mentions'],
                report_id: Reports[Index].id_report
            })
                .then(function (response) {
                    //alert('OK')

                    SetAction(id)

                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    SetSavedGT(prevState => !prevState)
                    console.log('RISPOSTA',response);
                })
                .catch(function (error) {
                    //alert('ATTENTION')
                    console.log(error);
                });

        } else if (token.startsWith('annotation')) {
            //const data = new FormData(document.getElementById("annotation-form"));
            console.log('labtoinsert',LabToInsert)
            axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/insert', {
                //labels: data.getAll('labels'),
                labels: LabToInsert,
                report_id: Reports[Index].id_report,
            })
                .then(function (response) {
                    console.log(response);
                    SetAction(id)

                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    if (LabToInsert.length === 0) {
                        SetRadioChecked(false)

                    }
                    SetLabToInsert([])
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
                        SetAction(id)

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
                    SetAction(id)

                })
                .catch(function (error) {

                    console.log(error);
                });
        }

        var id = event.target.id
        console.log('ID',id)
        //SetIndex(0)
        SetWordMention('')
        SetClicked(true)

    }


    useEffect(()=>{
        if(Action !== undefined && Action !== '' && Action !== 'none' && Action !== false){
            //document.getElementById(Action).focus()
            document.getElementById(Action).setAttribute('class','act btn btn-primary active_button')
            // console.log('ACTION123',Action)
            var arr = Array.from(document.getElementsByClassName('act'))
            arr.map(el=>{
                if(el.id !== Action) {
                    el.setAttribute('class', 'act btn btn-primary')
                }
            })

            // document.getElementById(Action).style.backgroundColor = 'orange'
            // document.getElementById(Action).style.borderColor ='orange'

        }

    },[Action])



    const handleAction = (e) => {
        var id = e.target.id
        SetID(id)
        console.log('bottone', e.target)
        if(Action === 'labels'){
            submit1(e,'annotation')
        }
        else if(Action === 'mentions'){
            submit1(e,'mentions')
        }
        else if(Action === 'concepts'){
            submit1(e,'concepts')
        }
        else if(Action === 'concept-mention'){
            submit1(e,'linked')
        }
        else{
            SetAction(id)
        }
        // SetAction(id)
        //SetIndex(0)
        SetWordMention('')
        SetClicked(true)


    }


    return(

        <div className="first_row_container">

            <Button type='button' disabled={DisButtonLabels} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='labels' className="act" onClick={(e)=>handleAction(e)} >Labels</Button>

           <Button type='button' disabled={DisButtonConceptMention} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='concept-mention' className="act" onClick={(e)=>handleAction(e)} >Linking</Button>

           <Button type='button' disabled={DisButtonMention} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='mentions' className="act" onClick={(e)=>handleAction(e)}  >Mentions</Button>

           <Button type='button' disabled={DisButtonConcept} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='concepts' className="act" onClick={(e)=>handleAction(e)} >Concepts</Button>


    </div>
    );



}

export default Buttons