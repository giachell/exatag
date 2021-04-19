import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import {AppContext, MentionContext} from "../../App";
import Button from "react-bootstrap/Button";
import { faTimesCircle, faPencilAlt, faAngleRight} from '@fortawesome/free-solid-svg-icons';

import ReportSection from "./ReportSection";
import ReportSelection from "./ReportSelection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ErrorSnack from "./ErrorSnack";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function ReportListUpdated(props) {

    const { index,institute, orderVar,errorSnack,reports, reportString, insertionTimes } = useContext(AppContext);
    const [ShowErrorSnack, SetShowErrorSnack] = errorSnack;
    const [Reports,SetReports] = reports
    const [Institute,SetInstitute] = institute
    const [Index,SetIndex] = index
    const [ReportString, SetReportString] = reportString;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes
    //Report sections
    const [Age, SetAge] = useState('')
    const [Gender, SetGender] = useState('')
    const [Diagnosis, SetDiagnosis] = useState('')
    const [Outcomes, SetOutcomes] = useState([])
    const [Error,SetError] = useState(0)
    const [OrderVar,SetOrderVar] = orderVar;


    function ticketFunc(event){
        SetShowErrorSnack(true)
        event.preventDefault()
        axios.post('http://examode.dei.unipd.it/exatag/signals_malfunctions',{
            report_id_hashed: ReportString.report_id_hashed.text,report_id: ReportString.report_id.text, target_diagnosis: ReportString.target_diagnosis.text, internalid: ReportString.internalid.text, raw_diagnoses:ReportString.raw_diagnoses.text
        }).then(function (response) {
            SetShowErrorSnack(true)
            SetError(false)
        })
        .catch(function (error) {
            SetShowErrorSnack(true)
            SetError(true)

        });
    }

    function setOrder(e){
        e.preventDefault()
        SetOrderVar('lexic')
    }
    function setOrder1(e){
        e.preventDefault()
        SetOrderVar('annotation')
    }
    // useEffect(()=>{
    //     console.log('REPORT',ReportString)
    //
    // },[ReportString])
    // useEffect(()=>{
    //     console.log('date',ArrayInsertionTimes[Index])
    //
    // },[ReportString])
    //
    useEffect(()=>{
        if(OrderVar === 'lexic'){
            var el = document.getElementById('lexic')
            var el1 = document.getElementById('annot')
            el.style.fontWeight = 'bold';
            el1.style.fontWeight = 'normal';
        }
        else if(OrderVar === 'annotation'){
            var el1 = document.getElementById('lexic')
            var el = document.getElementById('annot')
            el.style.fontWeight = 'bold';
            el1.style.fontWeight = 'normal';
        }
    },[OrderVar])

    return (
        <div>

            {ReportString !== undefined && <div >
                <Row>
                    <Col md={4} className="titles no-click">
                        <div>Reports' order:</div>
                    </Col>
                    <Col md={8}><div><Button size='sm' id='lexic' style={{'margin-top':'5px'}} onClick={(e)=>setOrder(e)}>Lexicographical</Button>&nbsp;&nbsp;<Button id='annot' style={{'margin-top':'5px'}} onClick={(e)=>setOrder1(e)} size='sm' >Annotated reports</Button></div></Col>
                    <Col md={4} className="titles no-click">
                        <div>last update:</div>
                    </Col>
                    <Col md={8}><div>{ArrayInsertionTimes[Index] !== 0 ? ArrayInsertionTimes[Index] : <div></div>}</div></Col>

                    {/*<Col md={4} className="titles no-click">*/}
                    {/*    <div>ID:</div>*/}
                    {/*</Col>*/}
                    {/*<Col md={8}><div>{props.report_id}</div></Col>*/}
                </Row>
                <hr/>


                {/*<hr/>*/}
                <Row className="report_sec">
                    <Col md={12} className="titles no-click">
                        <div>DIAGNOSIS</div>
                    </Col>
                </Row>
                {ReportString.internalid !== undefined && <Row>
                    {Institute === 'AOEC' ? <Col md={4} className="titles no-click"><div>Internal ID:</div></Col> : <Col md={4} className="titles no-click"><div>Block number:</div></Col>}
                    <Col md={8}><ReportSection action='noAction' stop={ReportString.internalid.stop} start={ReportString.internalid.start} text={ReportString.internalid.text} report = {props.report}/></Col>

                </Row>}
                {ReportString.target_diagnosis !== undefined && <Row>
                    {(props.action === 'mentions' || props.action === 'concept-mention') ? <Col md={4} className="titles no-click"><div><FontAwesomeIcon style={{'width':'0.8rem'}} icon={faPencilAlt}/> Target diagnosis:</div></Col> : <Col md={4} className="titles no-click"><div>Target diagnosis:</div></Col>}
                    <Col md={8}><ReportSection action={props.action} stop={ReportString.target_diagnosis.stop} start={ReportString.target_diagnosis.start} text={ReportString.target_diagnosis.text} report = {props.report}/></Col>

                </Row>}
                {ReportString.materials !== undefined && <Row>
                    {(props.action === 'mentions' || props.action === 'concept-mention') ? <Col md={4} className="titles no-click"><div><FontAwesomeIcon style={{'width':'0.8rem'}} icon={faPencilAlt}/> Materials:</div></Col> : <Col md={4} className="titles no-click"><div>Materials:</div></Col>}
                    <Col md={8}><ReportSection action={props.action} stop={ReportString.materials.stop} start={ReportString.materials.start} text={ReportString.materials.text} report = {props.report}/></Col>

                </Row>}


                {(ReportString.age !== undefined || ReportString.gender !== undefined || ReportString.report_id !== undefined) && <div>
                    <hr/>
                    <Row className="report_sec">
                        <Col md={12} className="titles no-click">
                            <div>GENERAL INFORMATION</div>
                        </Col>
                    </Row>
                    {ReportString.report_id !== undefined && <Row>
                        <Col md={4} className="titles no-click"><div>ID report:</div></Col>
                        <Col md={8}><ReportSection action='noAction' stop={ReportString.report_id.stop} start={ReportString.report_id.start} text={ReportString.report_id.text} report = {props.report}/></Col>

                    </Row>}
                    {ReportString.age !== undefined && <Row>
                        <Col md={4} className="titles no-click"><div>Age:</div></Col>
                        <Col md={8}><ReportSection action='noAction' stop={ReportString.age.stop} start={ReportString.age.start} text={ReportString.age.text} report = {props.report}/></Col>

                    </Row>}
                    {ReportString.gender !== undefined && <Row>
                        <Col md={4} className="titles no-click"><div>Gender:</div></Col>
                        <Col md={8}><ReportSection action='noAction' stop={ReportString.gender.stop} start={ReportString.gender.start} text={ReportString.gender.text} report = {props.report}/></Col>

                    </Row>}
                </div>}


                {/*<hr/>*/}

                {/*{ReportString.materials !== undefined && ReportString.materials.map((material, index)=><div><Row>*/}
                {/*    <Col md={12} className="titles no-click"><div>{index+1}</div></Col>*/}
                {/*    /!*<Col md={6}><div><br/></div></Col>*!/*/}
                {/*</Row>*/}
                {/*    <Row>*/}
                {/*        <Col md={4} className="titles no-click"><div>{index+1}</div></Col>*/}
                {/*        <Col md={8}><ReportSection action={props.action} start={material.start} stop={material.stop} text={material.text} report = {props.report} /></Col>*/}
                {/*    </Row>*/}
                {/*    <hr/></div>)}*/}
                    <hr/>
                    <hr/>

                {ReportString.raw_diagnoses !== undefined && <Row className='raw_diagnoses'>
                    <Col md={4} className="titles no-click"><div>Raw diagnoses:</div></Col>
                    <Col md={8}><ReportSection action='noAction' stop={ReportString.raw_diagnoses.stop} start={ReportString.raw_diagnoses.start} text={ReportString.raw_diagnoses.text} report = {props.report}/></Col>

                </Row>}
                <Row>
                    <Col md={12} className="titles no-click raw_diagnoses"><div>Does the <span style={{'font-style':'italic'}}>target diagnosis</span> correspond to the one
                        whose index is the <span style={{'font-style':'italic'}}>internal id</span> in the <span style={{'font-style':'italic'}}>raw diagnoses</span> (note that if the internal ID/block number is 1 then it may be not reported, but it is not an error in this case)? If it does not, <Button className='errorNotify' size='sm' onClick={(event)=>ticketFunc(event)} variant='danger'>click here</Button>.</div></Col>
                </Row>


            </div>}
            {ShowErrorSnack && Error !== 0 && <ErrorSnack error ={Error}/>}
        </div>
    );

}


export default ReportListUpdated