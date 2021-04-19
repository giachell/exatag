import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import WindowedSelect from "react-windowed-select";
import ListSelectedConcepts from "./ListSelectedConcepts";
import {AppContext}  from "../../App";
import {ConceptContext} from '../../BaseIndex'
import {Col, Modal, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ConceptList from "./ConceptList";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle,faSave,faGlasses,faPlusCircle,faList,faMousePointer,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Zoom from "@material-ui/core/Zoom";


export default function ConceptsContainer(props) {

    const {currentSemanticArea, setCurrentSemanticArea} = useContext(ConceptContext);
    const { index, action,conceptOption } = useContext(AppContext);
    const [Index, setIndex] = index;
    const [Action, setAction] = action;
    const [selectedOption, setSelectedOption] = conceptOption;

    const [ShowInfoConcepts,SetShowInfoConcepts] = useState(false);
    useEffect(()=>{
        setCurrentSemanticArea('All')
        setSelectedOption('')
    },[Index,Action])



    function changeInfoConcepts(e){
        e.preventDefault()
        if(ShowInfoConcepts){
            SetShowInfoConcepts(false)

        }else{SetShowInfoConcepts(true)}

    }
    return (
        <>
            <div style={{'fontWeight':'bold','fontStyle':'italic'}}>Choose one or more concepts:&nbsp;&nbsp;
            <button className='butt_info' onClick={(e)=>changeInfoConcepts(e)}><FontAwesomeIcon icon={faInfoCircle} color='blue'/></button>
            </div>
            {ShowInfoConcepts && <Zoom in={ShowInfoConcepts}>
                <div className='quick_tutorial'>
                    <h5>Concepts: quick tutorial</h5>
                    <div>
                        You can associate to the report you are reading one (or more) concepts.
                        <div>
                            <ul className="fa-ul">
                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                    Read the report on your left.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>Choose a semantic area.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>Choose a concept.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span>When you select a semantic area you will be provided with the
                                    list of the concepts you chose for that area. If you select <i>All</i> you will see all the semantic areas.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faMousePointer}/></span>Click on a concept of the list to have more information about it.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                    going to the previous or next report.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>Click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept to remove it from the list.
                                    Click on <span style={{'color':'red'}}>CLEAR</span> to remove the entire list instead.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div></Zoom>}
            {!ShowInfoConcepts && <div>
            <Row>
                <Col md="5">
                    <label className="label" htmlFor="semanticAreaSelect">Semantic Area:</label>
                </Col>
                <Col md="7">
                    <select id="semanticAreaSelect" style={{'width': '90%'}} className="form-control"
                            value={currentSemanticArea} onChange={(e) => {
                        console.log(e.target.value);
                        setCurrentSemanticArea(e.target.value);
                    }}>
                        <option value="Diagnosis">Diagnosis</option>
                        <option value="Anatomical Location">Anatomical Location</option>
                        <option value="Procedure">Procedure</option>
                        <option value="Test">Test</option>
                        <option value="General Entity">General Entity</option>
                        <option value="All">All</option>
                    </select>
                </Col>
            </Row>

            {currentSemanticArea === 'Diagnosis' && <ConceptList semanticArea="Diagnosis"/>}

            {currentSemanticArea === 'Anatomical Location' && <ConceptList semanticArea="Anatomical Location"/>}

            {currentSemanticArea === 'Procedure' && <ConceptList semanticArea="Procedure"/>}

            {currentSemanticArea === 'Test' && <ConceptList semanticArea="Test"/>}

            {currentSemanticArea === 'General Entity' && <ConceptList semanticArea="General Entity"/>}

            {currentSemanticArea === 'All' && <ConceptList semanticArea="All"/>}


            </div>}


        </>
    );

}

