import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import WindowedSelect from "react-windowed-select";
import Select from "react-select";
import ListSelectedConcepts from "./ListSelectedConcepts";
import {AppContext}  from "../../App";
import {ConceptContext} from '../../BaseIndex'
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {Container,Row,Col} from "react-bootstrap";



export default function ConceptList(props) {
    let concepts_list = [];
    let semanticArea = props.semanticArea;

    const [options, setOptions] = useState([]);
    const [grouped, SetGrouped] = useState([])
    // const [selectedOption, setSelectedOption] = useState('');
    const {currentSemanticArea, setCurrentSemanticArea} = useContext(ConceptContext);
    const [AllConcepts, SetAllConcepts] = useState(false)
    const { index, action, selectedconcepts, concepts, disButton ,changeConceots,conceptOption} = useContext(AppContext);
    const [selectedOption, setSelectedOption] = conceptOption;

    const [change, setChange] = changeConceots;
    const [Action, SetAction] = action;
    const [Concepts, SetConcepts] = concepts;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [show, setShow] = useState(false);
    //const [reload, setReload] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log(semanticArea);
    console.log('option',selectedOption);
    console.log('option',options);

    // useEffect(()=>{
    //     setReload(true)
    // },[index,Action])

    function getObjectKeys(selectedConcepts, semanticArea)
    {
        console.log(selectedConcepts);
        console.log(semanticArea);
        let keys = new Array();
        if(selectedConcepts[semanticArea] !== undefined)
        {
            for (let concept of selectedConcepts[semanticArea])
            {
                console.debug(concept);
                keys.push(concept["concept_url"]);

            }
        }
        // else if(semanticArea === 'All'){
        //     var sem_area = ['Diagnosis','Anatomical Location','Procedure','Test','General Entity']
        //     sem_area.map(area=>{
        //         selectedConcepts[area].map(concept=>{
        //             keys.push(concept["concept_url"]);
        //
        //         })
        //     })
        // }
        console.log(keys);

        return keys;
    }

    function handleChange(selectedOption) {
        console.log(`Option selected:`, selectedOption);
        console.log(`selectedConcepts:`, selectedConcepts);
        //setReload(false)

        SetDisable_Buttons(false)
        let selectedConcept = {"concept_name":selectedOption["label"], "concept_url":selectedOption["value"], "semantic_area":selectedOption["semantic_area"]}
        let keys = getObjectKeys(selectedConcepts, semanticArea);

        console.log(`keys:`, keys);

        if(keys!== undefined)
        {
            if(!keys.includes(selectedConcept["concept_url"]))
            {

                //ADDED BY ORNELLA
                var sem_area = ['General Entity','Anatomical Location','Procedure','Test','Diagnosis']
                var array = {}
                sem_area.map(area=>{
                    array[area] = selectedConcepts[area]
                    if(area === semanticArea){
                        array[area].push(selectedConcept)
                    }
                    console.log('totale',array)
                })
                setSelectedConcepts(array)
                // setSelectedConcepts((selectedConcepts) => {selectedConcepts[semanticArea].push(selectedConcept); return selectedConcepts;});
            }
            else
            {
                //alert(`The concept: ${selectedOption["label"]} already added to the list of relevant concepts!`);
                handleShow(selectedConcept);
            }
        }
        setSelectedOption(selectedOption);
        setChange(true);
    }


    useEffect(() =>
    {
        if(semanticArea !== 'All'){
            console.log('concepts',Concepts[semanticArea])
            setSelectedOption('')
            if(Concepts[semanticArea].length > 0) {
                Concepts[semanticArea].map(item => {
                    //console.log(item);

                    concepts_list.push({
                        label: item["concept_name"],
                        value: item["concept_url"],
                        semantic_area: item["semantic_area"]
                    })
                })

                setOptions((options) => (concepts_list));
            }
        }
        else{
            var group = []
            var sem_area = ['General Entity','Anatomical Location','Procedure','Test','Diagnosis']
            sem_area.map(area=>{
                var opt_area =[]
                Concepts[area].map(concept=> {
                    opt_area.push({
                        label: concept['concept_name'],
                        value: concept['concept_url'],
                        semantic_area: concept["semantic_area"]
                    })
                })
                group.push({label:area,options:opt_area})
            })
            SetGrouped(group)
        }




    },[]);

    const handleChange_concept = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);
        console.log(`selectedConcepts:`, selectedConcepts);
        console.log(`selectedArea`, semanticArea);
        //setReload(false)
        SetDisable_Buttons(false)
        var areaToInsert = ''
        // var concept = ConceptChosen['concept']
        var sem_area = ['General Entity','Anatomical Location','Procedure','Test','Diagnosis']
        if(semanticArea === 'All'){
            sem_area.map(area=>{
                Concepts[area].map(con=>{
                    if(con['concept_url'] === selectedOption['value'] && con['concept_name'] === selectedOption['label']){
                        areaToInsert = area
                    }
                })
            })

        }
        else{
            areaToInsert = semanticArea
        }

        let selectedConcept = {"concept_name":selectedOption["label"], "concept_url":selectedOption["value"], "semantic_area":selectedOption["semantic_area"]}
        console.log('areatoinsert',areaToInsert)
        let keys = getObjectKeys(selectedConcepts, selectedOption["semantic_area"]);

        console.log(`keys:`, keys);

        if(keys!== undefined)
        {
            if(!keys.includes(selectedConcept["concept_url"]))
            {

                //ADDED BY ORNELLA

                var array = {}
                sem_area.map(area=>{
                    array[area] = selectedConcepts[area]
                    if(area === selectedOption["semantic_area"]){
                        array[area].push(selectedConcept)
                    }
                    console.log('totale',array)
                })
                setSelectedConcepts(array)
                // setSelectedConcepts((selectedConcepts) => {selectedConcepts[semanticArea].push(selectedConcept); return selectedConcepts;});
            }
            else
            {
                //alert(`The concept: ${selectedOption["label"]} already added to the list of relevant concepts!`);
                handleShow(selectedConcept);
            }
        }
        setSelectedOption(selectedOption);
        setChange(true);
    }


    const styles = {
        menuList: (base) => ({
            ...base,
            "::-webkit-scrollbar":{
                width: "6px"
                },
            "::-webkit-scrollbar-track":{
                boxShadow: "inset 0 0 3px darkgrey",
                borderRadius: "10px"
            },
             "::-webkit-scrollbar-thumb": {
                background: "dodgerblue",
                borderRadius: "10px"
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "dodgerblue"
            }
        })
    }
    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };
    const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
    };
    const formatGroupLabel = grouped => (
        <div style={groupStyles}>
            <span>{grouped.label}</span>
            <span style={groupBadgeStyles}>{grouped.options.length}</span>
        </div>
    );
        return (
            <div>
                {currentSemanticArea === 'All' && <Row>
                    <Col md={1}></Col><Col md={10}>
                    <Select styles={styles}
                            maxMenuHeight="180px"
                            options={grouped}
                            value = {''}
                            placeholder="Select or search for a concept"
                            onChange={(option)=>handleChange_concept(option)}
                            formatGroupLabel={formatGroupLabel}
                    /></Col><Col md={1}></Col>
                </Row>}

                {currentSemanticArea !== 'All' && <Row ><Col md={1}></Col><Col md={10}><WindowedSelect styles={styles}
                maxMenuHeight="180px"
                isSearchable={true}
                options={options}
                onChange={handleChange}
                onClick={handleChange}
                value={''}
                placeholder="Select or search for a concept"
                /></Col><Col md={1}></Col>
            </Row>}
                {semanticArea !== 'All' ? <p className="numberOfConceptsIdentifiedParagraph">Number of concepts identified: <b>{selectedConcepts[semanticArea].length}</b></p>
                : <p className="numberOfConceptsIdentifiedParagraph">Number of concepts identified: <b>{selectedConcepts['Diagnosis'].length + selectedConcepts['Anatomical Location'].length
                + selectedConcepts['Procedure'].length + selectedConcepts['Test'].length + selectedConcepts['General Entity'].length}</b></p>}
                <div className="concept-list" id ="concept-list">

                    <ListSelectedConcepts semanticArea={semanticArea}/>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Concept <em>{selectedOption === undefined ? " " : selectedOption["label"]}</em> already present!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><b>{selectedOption === undefined ? " " : selectedOption["label"]}</b> is already present in the list</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );

}

