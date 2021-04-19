import React, {Component, useEffect, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import {
    faLanguage,
    faUser,
    faSignOutAlt,
    faMicroscope,
    faCogs,
    faHospital,
    faBars,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import {AppContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import './selectMenu.css';
import OptionsModal from "./OptionsModal";
import Modal from "react-bootstrap/Modal";
import DownloadGT from "./DownloadGT";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function SelectMenu(props){
    const { reports, index,username,showbar, report,action,showOptions,showDownload, insertionTimes,institute,language,usecase } = useContext(AppContext);
    const [ShowModalDownload, SetShowModalDownload] = showDownload;

    const [UseCase,SetUseCase] = usecase;
    const [Username,SetUsername] = username;
    const [ShowBar,SetShowBar] = showbar;
    const [ShowModal, SetShowModal] = showOptions;
    const [Institute,SetInstitute] = institute;
    const [Language,SetLanguage] = language;
    const [Reports,SetReports] = reports
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [IndexSel, SetIndexSel] = useState(0)
    const [ArrayBool,SetArrayBool] = useState([])
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [LangFlag,SetLangFlag] = useState('')

    function handleChange(e){
        SetShowModal(prevState => !prevState)
    }
    function handleChangeDownload(e){
        SetShowModalDownload(prevState => !prevState)
    }
    function handleBar(e){
        SetShowBar(prevState => !prevState)
    }
    useEffect(()=>{
        console.log('bar',ShowBar)

    },[ShowBar])

    useEffect(()=>{
        if(Language === 'English'){
            SetLangFlag('https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png')
        }
        else if(Language === 'Italian'){
            SetLangFlag('https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png')

        }
        else if (Language === 'Dutch'){
            SetLangFlag('https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png')

        }
    },[Language])


    return(
                <div className='selection_menu'>
                    <Row>
                        <Col md={1}>
                        <span> <button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></span>

                        </Col>

                        <Col md={7} style={{'text-align':'center'}}>
                            <div>
                                <span className='configuration' style={{'font-weight':'bold'}}>Configuration:</span>

                                <span className='configuration'><FontAwesomeIcon icon={faMicroscope} />: </span> <span > {UseCase}</span>

                                {Language === 'English' && <span className='configuration'><img style={{'height':'12px','width':'20px','vertical-align':'baseline'}} src='https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png'/> : <span>{Language}</span></span>}
                                {Language === 'Italian' && <span className='configuration'><img style={{'height':'12px','width':'20px','vertical-align':'baseline'}} src='https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png'/> : <span>{Language}</span></span>}
                                {Language === 'Dutch' && <span className='configuration'><img style={{'height':'12px','width':'20px','vertical-align':'baseline'}} src='https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg'/> : <span>{Language}</span></span>}


                                <span className='configuration'><FontAwesomeIcon icon={faHospital} /> <span>{Institute}</span></span>

                                <span className='configuration_btn '> <Button id='conf' onClick={(e)=>handleChange(e)} style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='success'> <FontAwesomeIcon icon={faCogs} /> Change</Button></span>
                                <span > <Button id='conf' onClick={(e)=>handleChangeDownload(e)} style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='info'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>
                                {ShowModal ? <OptionsModal show={ShowModal}/> : <div></div>}
                                {ShowModalDownload ? <DownloadGT show={ShowModalDownload}/> : <div></div>}
                            </div>
                            {/*/!*<span> - </span>*!/*/}
                            {/*/!*<span> - </span>*!/*/}




                        </Col>
                        <Col md={4} style={{'text-align':'right'}}>
                                <span className='userInfo'><span > {Username} </span><FontAwesomeIcon icon={faUser} size='2x'/> <a  href="http://examode.dei.unipd.it/exatag/logout" className="badge badge-secondary" >Logout <FontAwesomeIcon icon={faSignOutAlt}/></a></span>

                        </Col>

                    </Row>
                </div>








);




}
export default SelectMenu