import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faLink,faEye, faTimesCircle,faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../BaseIndex'
import 'bootstrap/dist/css/bootstrap.min.css';
import './linked.css';
import Select from 'react-select';
import axios from "axios";



function LinkDialog(props){
    const { tokens, color, allMentions, disButton, semanticArea,associations,concepts,linkingConcepts } = useContext(AppContext);
    const { mountForm,stateButton,show } = useContext(LinkedContext);
    const [LinkConcepts,SetLinkConcepts] = linkingConcepts;
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [SemanticArea,SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [ConceptsToShow, SetConceptsToShow] = useState([]);
    const [Area, SetArea] = useState('')
    const [ConceptChosen, SetConceptChosen] = useState('')
    const [Show,SetShow] = show;
    const [Disable_Button,SetDisable_Buttons] = disButton;

    const [Exist,SetExist] = useState(false);
    // const [SemanticArea,SetSemanticArea] = useState([]);
    // const [Concepts, SetConcepts] = useState([]);
    //
    // const [ConceptsToShow, SetConceptsToShow] = useState([]);
    // const [Area, SetArea] = useState('');
    // const [ConceptChosen, SetConceptChosen] = useState('');
    const [Enable, SetEnable] = useState(false);

    const [Enable_Area, SetEnable_Area] = useState(true)
    const [options_concepts,Setoptions_concepts] = useState([])
    const [Options_area, SetOptions_area] = useState([])

    useEffect(()=>{
        var options_area = []
        if(SemanticArea.length>0 && Concepts !== undefined){
            // console.log('areaq',SemanticArea)
            // console.log('concccc',Concepts)
            SemanticArea.map(area =>{
                var dis = false
                if(Concepts[area.toString()].length === 0){
                    dis = true
                }
                options_area.push({value: area, label: area, isDisabled:dis})
            })
            SetOptions_area(options_area)
        }

    },[Concepts,SemanticArea])
    // console.log('Area',Area)
    // console.log('Area',props.text)
    // console.log('Area',Options_area)


    useEffect(()=>{
        SetExist(false)
        var button = document.getElementById('addbottone1')
        if(button) {
            button.setAttribute('disabled', true)
        }
    },[])

    const handleChange_concept = (option) => {
        console.log(`Option selected:`, option.value);
        var concept = {'concept_name':option.label,'concept_url':option.value}
        SetConceptChosen(concept)
        console.log(concept)
        var button = document.getElementById('addbottone1')
        button.disabled = false
    };
    const handleChange_area = (option) => {
        console.log(`Option selected:`, option.value);
        SetArea(option.value.toString())
        var button = document.getElementById('addbottone1')
        button.disabled = true
    };

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

    const handleClose = () => SetShow(false);
    const onAddAssociation = (e) =>{
        SetDisable_Buttons(false)

        // var concept = ConceptChosen['concept']
        var concept = ConceptChosen
        var concept_name = concept['concept_name']
        var concept_url = concept['concept_url']
        var association = {
            'mention_text': props.mention.mention_text,
            'start': props.mention.start,
            'stop': props.mention.stop,
            'semantic_area': Area,
            'concept_name': concept_name,
            'concept_url': concept_url
        }
        console.log('association',association)
        var exist = false
        associations_to_show.map(ass => {
            console.log(ass)
            console.log(props.mention.mention_text)
            if ((ass['mention_text'] === props.text && ass['start'] === props.mention.start && ass['stop'] === props.mention.stop
                && ass['concept_name'] === concept_name && ass['concept_url'] === concept_url && ass['semantic_area'] === Area)) {
                // alert('This association already exists!')
                exist = true

            }
        })
        if (exist === false) {
            SetAssociations_to_show([...associations_to_show, association])
            SetArea('')
            SetEnable(false)
            SetConceptChosen('')
            SetShow(false)
        }
        else{
            SetExist(true)

        }
    }

    return(
        <div>

            <Modal show={Show} onHide={handleClose}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title><span>New Association for: </span><span style={{'color':'royalblue'}}>{props.mention.mention_text}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Exist && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> This association already exists <FontAwesomeIcon icon={faTimesCircle}/></div>}

                    <div><span>Please, select the </span><span style={{'font-weight':'bold'}}>semantic area</span>:</div>
                        <div>
                            <Select
                            onChange={(option)=>handleChange_area(option)}
                            className='selection'
                            options={Options_area}
                            value = {Area === '' ? null : Area.value}
                             />

                           {Enable_Area === true && ConceptsToShow.length>0 && Enable === true && <div className="addForm">
                               <span> Now, select a </span><span style={{'font-weight':'bold'}}>concept</span>:
                            <Select
                               className='selection'
                               onChange={(option)=>handleChange_concept(option)}
                               options={options_concepts}

                            /></div>}

                       </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} >
                        Close
                    </Button>
                    <Button id='addbottone1' onClick={(e)=>onAddAssociation(e)} variant="primary" >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*<Modal*/}
            {/*    isOpen={true}*/}
            {/*    animation={false}*/}
            {/*    onHide={SetShow(false)}*/}
            {/*    show={Show}*/}
            {/*       size="lg"*/}
            {/*       aria-labelledby="contained-modal-title-vcenter"*/}
            {/*       centered*/}
            {/*>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        <Modal.Title>New Association for: <div style={{'color':'royalblue'}}>{props.text}</div></Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body><div>Please, select the semantic area:</div>*/}
            {/*    <div>*/}
            {/*        <Select*/}
            {/*        onChange={(option)=>handleChange_area(option)}*/}
            {/*        className='selection'*/}
            {/*        options={options_area}*/}
            {/*        value = {Area === '' ? null : Area.value}*/}
            {/*         />*/}

            {/*        {Enable_Area === true && ConceptsToShow.length>0 && Enable === true && <div className="addForm">*/}
            {/*            Now, select a concept:*/}
            {/*        <Select*/}
            {/*            className='selection'*/}
            {/*            onChange={(option)=>handleChange_concept(option)}*/}
            {/*            options={options_concepts}*/}

            {/*        />*/}
            {/*        </div>}*/}

            {/*    </div>*/}
            {/*    </Modal.Body>*/}
            {/*    <Modal.Footer>*/}
            {/*        <Button id="addbottone2" variant="secondary" onClick={SetShow(false)}>*/}
            {/*            No*/}
            {/*        </Button>*/}
            {/*        <Button id="addbottone1" disabled={false} variant="primary" onClick={() => handleClick_1()}>*/}
            {/*            Yes*/}
            {/*        </Button>*/}
            {/*    </Modal.Footer>*/}
            {/*</Modal>*/}
        </div>
    );



}


// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
// export default confirmable(LinkDialog);
export default (LinkDialog);