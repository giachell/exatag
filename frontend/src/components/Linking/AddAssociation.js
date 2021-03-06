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
import {Container, Row, Col, Modal} from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import ConceptInfoModal from "../Concepts/ConceptInfoModal";
import SnackBar from "../General/SnackBar";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function AddAssociation(props){
    const [WordsMention, SetWordsMention] = useState([])

    const { tokens, conceptModal,showSnack, showSnackMessage,color, disabled,allMentions,disButton, semanticArea,associations,concepts } = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [SnackMessage,SetSnackMessage] = showSnackMessage;

    const [associations_to_show,SetAssociations_to_show] = associations;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [SemanticArea,SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [ConceptsToShow, SetConceptsToShow] = useState([]);
    const [Area, SetArea] = useState('')
    const [ConceptChosen, SetConceptChosen] = useState('')
    const options_area = []
    const [Enable, SetEnable] = useState(false)
    const [Enable_Area, SetEnable_Area] = useState(true)
    const [options_concepts,Setoptions_concepts] = useState([])
    const [ShowSnack,SetShowSnack] = showSnack;

    const handleClose = () => setShow(false);

    const onDelete_Association = (association) => {
        SetShowSnack(true)

        console.log('RIMUOVO1')
        SetDisable_Buttons(false)
        //console.log(association)
        //console.log(associations_to_show)
        var ass = []
        associations_to_show.map(asso =>{
            if(asso !== association){
                ass.push(asso)
            }
        })

        //console.log(ass)

        SetAssociations_to_show(ass)
    }

    return(

    <div className="association" >
        {ShowSnack && <SnackBar message={'This action will remove the concept also in the list of concepts. Go to Concepts and add it ' +
        'again if you want'}/>}

            <li>
                <Row>
                    <Col md={9}>
                        <Badge className="clickable" pill variant="dark" onClick={() => setShow(true)}>
                            {props.concept}
                        </Badge>
                    </Col>
                    <Col md={3}>
                        <span>
                            {/*<Button size="lg" className = "button_info_concept" variant="Link" onClick={() => showModal(concept_url,semantic_area)}><FontAwesomeIcon icon={faInfoCircle} /></Button>*/}
                            <Button size="lg" className = "button_x_concept" variant="Link" onClick={()=>onDelete_Association(props.association)}><FontAwesomeIcon icon={faTimesCircle} /></Button>

                        </span>
                    </Col>
                </Row>
                {/*{show && <ConceptInfoModal concept_name={props.concept} concept_url={props.concept_url} semantic_area={props.area} />}*/}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Concept Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><b>Concept name</b>: {props.concept}</p>
                        <p><b>Concept URL</b>: <a href={props.association['concept_url']}>{props.association['concept_url']}</a></p>
                        <p><b>Semantic area</b>: {props.area}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </li>

        </div>
    );



}

export default AddAssociation