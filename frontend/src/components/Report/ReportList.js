import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import {AppContext, MentionContext} from "../../App";
import Button from "react-bootstrap/Button";
import { faTimesCircle} from '@fortawesome/free-solid-svg-icons';

import ReportSection from "./ReportSection";
import ReportSelection from "./ReportSelection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function ReportList(props) {

    const { index, reports, reportString, insertionTimes } = useContext(AppContext);

    const [Reports,SetReports] = reports
    const [Index,SetIndex] = index
    const [ReportString, SetReportString] = reportString;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes
    //Report sections
    const [Age, SetAge] = useState('')
    const [Gender, SetGender] = useState('')
    const [Diagnosis, SetDiagnosis] = useState('')
    const [Outcomes, SetOutcomes] = useState([])


    useEffect(()=>{
        console.log('REPORT',ReportString)

    },[ReportString])
    useEffect(()=>{
        console.log('date',ArrayInsertionTimes[Index])

    },[ReportString])
    return (
        <div>

            {ReportString !== undefined && <div >
                <Row>
                    <Col md={4} className="titles no-click">
                       <div>last update:</div>
                    </Col>
                    <Col md={8}><div>{ArrayInsertionTimes[Index] !== 0 ? ArrayInsertionTimes[Index] : <div></div>}</div></Col>
                    <Col md={4} className="titles no-click">
                        <div>ID:</div>
                    </Col>
                    <Col md={8}><div>{props.report_id}</div></Col>
                </Row>
                <hr/>



              <Row className="report_sec">
                    <Col md={12} className="titles no-click">
                     <div>PATIENT</div>
                    </Col>
                    {/*<Col md={6}><div><br/></div></Col>*/}
                </Row>

                {ReportString.Age !== undefined && <Row>
                  <Col md={4} className="titles no-click"><div>Age:</div></Col>
                    <Col md={8}><ReportSection action={props.action} start={ReportString.Age.start} text={ReportString.Age.text} report = {props.report}/></Col>

                </Row>}


                {ReportString.Gender !== undefined && <Row>
                  <Col md={4} className="titles no-click"><div>Gender:</div></Col>
                    <Col md={8}><ReportSection action={props.action} start={ReportString.Gender.start} text={ReportString.Gender.text} report = {props.report}/></Col>

               </Row>}
                <hr/>

                {ReportString.Diagnosis !== undefined && <Row className="report_sec">
                    <Col md={4} className="titles no-click"><div>DIAGNOSIS</div></Col>
                    <Col md={8}><ReportSection action={props.action} start={ReportString.Diagnosis.start} text={ReportString.Diagnosis.text} report = {props.report} /></Col>
                </Row>}
                <hr/>
                {ReportString.outcomes !== undefined && ReportString.outcomes.map((outcome, index)=><div><Row>
                    <Col md={12} className="titles no-click"><div>OUTCOME {index+1}</div></Col>
                    {/*<Col md={6}><div><br/></div></Col>*/}
                </Row>
                    {outcome.Type !== undefined && <Row><Col md={4} className="titles no-click"><div>Type:</div></Col>
                    <Col md={8}><ReportSection action={props.action} start={outcome.Type.start} text={outcome.Type.text} report = {props.report} /></Col></Row>}
                    {outcome.Location !== undefined && <Row><Col md={4} className="titles no-click"><div>Location:</div></Col>
                        <Col md={8}><ReportSection action={props.action} start={outcome.Location.start} text={outcome.Location.text} report = {props.report} /></Col></Row>}
                    {outcome.Dysplasia !== undefined && <Row>
                        <Col md={12} className="titles no-click dysplasia"><div>Dysplasia</div></Col>
                        {/*<Col md={6}><div><br/></div></Col>*/}
                    </Row>}
                    {outcome.Dysplasia !== undefined && outcome.Dysplasia.map((dysplasia, index)=> <Row><Col md={4} className="titles no-click"><div>{index+1}</div></Col>
                        <Col md={8}><ReportSection action={props.action} start={dysplasia.start} text={dysplasia.text} report = {props.report} /></Col></Row>)}

                    {outcome.Interventions !== undefined && outcome.Interventions.map((intervention, index)=> <div><Row><Col md={6} className="titles no-click intervention"><div>Intervention {index+1}</div></Col>
                        <Col md={6}><div><br/></div></Col></Row>
                        {intervention.Type !== undefined && <Row><Col md={4} className="titles no-click"><div>Type:</div></Col>
                        <Col md={8}><ReportSection action={props.action} start={intervention.Type.start} text={intervention.Type.text} report = {props.report} /></Col></Row>}
                        {intervention.Topography !== undefined && <Row><Col md={4} className="titles no-click"><div>Topography:</div></Col>
                            <Col md={8}><ReportSection action={props.action} start={intervention.Topography.start} text={intervention.Topography.text} report = {props.report} /></Col></Row>}

                    </div>)}
                <hr/></div>)}



            </div>}
        </div>
    );
        {/*    </div>}*/}

}



export default ReportList