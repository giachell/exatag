import Token from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle,faEye, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import './linked.css';
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../BaseIndex'
import Select from 'react-select';
//import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import {Container,Row,Col} from "react-bootstrap";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function LinkForm(props){
    const { tokens, color, allMentions,disButton, semanticArea,associations,concepts } = useContext(AppContext);
    const { mountForm,stateButton } = useContext(LinkedContext);
    const [Disable_Button,SetDisable_Buttons] = disButton;
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [SemanticArea,SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [ConceptsToShow, SetConceptsToShow] = useState([]);
    const [Area, SetArea] = useState('')
    const [ConceptChosen, SetConceptChosen] = useState('')
    const [MountForm,SetMountForm] = mountForm;
    const options_area = []
    const [Enable, SetEnable] = useState(false)
    const [Enable_Area, SetEnable_Area] = useState(true)
    const [options_concepts,Setoptions_concepts] = useState([])
    const [StateButton, SetStateButton] = stateButton;


    useEffect(()=>{
        var button = document.getElementById('addbottone')
        if(button) {
            button.setAttribute('disabled', true)
        }
    },[])




    console.log('Area',Area)
    SemanticArea.map(area =>{
        var dis = false
        if(Concepts[area.toString()].length === 0){
            dis = true
        }
        options_area.push({value: area, label: area, isDisabled:dis})
    })


    // const onReset = () =>{
    //     SetArea('')
    //     //SetEnable_Area(false)
    //     SetEnable(false)
    //     var button = document.getElementById('addbottone')
    //     button.setAttribute('disabled', true)
    //
    // }
    const onAddAssociation = (e) =>{
        var concept = ConceptChosen['concept']
        var concept_name = concept['concept_name']
        var concept_url = concept['concept_url']
        var association = {
            'mention_text': props.text,
            'start': props.start,
            'stop': props.stop,
            'semantic_area': Area,
            'concept_name': concept_name,
            'concept_url': concept_url
        }
        // console.log('association',association)
        var exist = false
        associations_to_show.map(ass => {
            console.log(ass)
            console.log(props.text)
            if ((ass['mention_text'] === props.text && ass['start'] === props.start && ass['stop'] === props.stop
                && ass['concept_name'] === concept_name && ass['concept_url'] === concept_url && ass['semantic_area'] === Area)) {
                alert('This association already exists!')
                exist = true

            }
        })
        if (exist === false) {
            SetAssociations_to_show([...associations_to_show, association])
        }
        SetArea('')
        SetEnable(false)

        SetDisable_Buttons(false)
        console.log('disabled,onadd',Disable_Button)
        var button = document.getElementById('addbottone')
        button.setAttribute('disabled', true)

        props.onLink(props.mention)
    }


     const handleChange_area = (option) => {
         console.log(`Option selected:`, option.value);
         SetArea(option.value.toString())
         var button = document.getElementById('addbottone')
         button.disabled = true
     };
    const handleChange_concept = (option) => {
        console.log(`Option selected:`, option.value);
        var concept = {'concept_name':option.label,'concept_url':option.value}
        SetConceptChosen({concept})
        var button = document.getElementById('addbottone')
        button.disabled = false
    };


    useEffect(()=>{
        console.log('Area',Area)
        SetEnable_Area(true)
        if(Area !== ''){
            SetConceptsToShow(Concepts[Area])
            Setoptions_concepts([])
            //SetConceptChosen([])
            SetConceptChosen('')
            SetEnable(false)
            console.log('CAMBIATO')
        }

    },[Area])

    useEffect(()=>{
        //var conce = Concepts['Diagnosis']
        var options = []
        if(ConceptsToShow.length>0){
            ConceptsToShow.map(concept =>{

                options.push({value: concept['concept_url'], label: concept['concept_name']})
            })
            Setoptions_concepts(options)
            SetEnable(true)
        }

    },[ConceptsToShow,ConceptChosen])


    return(

        <div >
            <hr/>
            {/*<div><span>The mention</span> <span style={{'font-weight':'bold'}}>{props.text}</span> <span>is linked with:</span> </div>*/}
            <div style={{'font-weight':'bold'}}>NEW ASSOCIATION</div>
            <div><span> Select the</span> <spna style={{'font-weight':'bold'}}>semantic area</spna> <span> and then the</span> <span style={{'font-weight':'bold'}}>concept</span>:</div>
                    <div className="addForm">
                        Select a semantic area:
                        <Select
                            onChange={(option)=>handleChange_area(option)}
                            className='selection'
                            options={options_area}
                            value = {Area === '' ? null : Area.value}
                        />
                    </div>


            {Enable_Area === true && ConceptsToShow.length>0 && Enable === true && <div className="addForm">
                        Select a concept:
                        <Select
                            className='selection'
                            onChange={(option)=>handleChange_concept(option)}
                            options={options_concepts}

                        />
                    </div>}

                <div className="confirmButtons">
                    {/*{ConceptChosen !== '' ? <Button id="addbottone" className="add_but" onClick={(e)=>onAddAssociation(e)} size="md" variant="primary" >Add</Button> :*/}
                    {/*    <Button id="addbottone" className="add_but" onClick={(e)=>onAddAssociation(e)} size="md" variant="primary" disabled>Add</Button>}*/}
                    <Button id="addbottone" className="add_but" onClick={(e)=>onAddAssociation(e)} size="sm" variant="primary" disabled={false}>Add</Button>
                       {/*<Button size='sm' id="reset" className="add_but" onClick={(e)=>onReset(e)}  variant ="danger"  >Reset</Button>*/}
                </div>

            <hr/>

        </div>
    );



}

export default LinkForm