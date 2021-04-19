import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faLink,faEye,faProjectDiagram, faMicroscope,faTimesCircle,faLanguage,faLocationArrow,faCogs, faHospital } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Linking/linked.css';
import Select from 'react-select';
import axios from "axios";


function DownloadGT(props){
    const { showDownload,action,reportString,institute,language,usecase,updateMenu,usecaseList,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [ShowModalDownload, SetShowModalDownload] = showDownload;
    const [Institute, SetInstitute] = institute;
    const [Language, SetLanguage] = language;
    const [UseCase, SetUseCase] = usecase;
    const [Action,SetAction] = action;
    const [ShowErrorReports,SetShowErrorReports] = useState(false)
    const [repString,SetRepString] = reportString;
    const [Ins,SetIns] = useState('')
    const [Use,SetUse] = useState('')
    const [Lang,SetLang] = useState('')
    const [Act,SetAct] = useState('')
    const [ShowNotDownload,SetShowNotDownload] = useState(false)
    const [ShowError,SetShowError] = useState(false)
    const handleClose = () => SetShowModalDownload(false);
    const [Options_usecases, Setoptions_usecases] = useState([])
    const [Options_language, Setoptions_language] = useState([])
    const [Options_institute, Setoptions_institute] = useState([])
    const [Options_actions, Setoptions_actions] = useState([])
    var FileDownload = require('js-file-download');


    useEffect(()=>{

        if(UseCaseList.length > 0 && InstituteList.length > 0 && LanguageList.length > 0){
            var options_usecases = []
            var options_institute = []
            var options_language = []
            UseCaseList.map((uc)=>{
                options_usecases.push({value: uc, label: uc})
            })
            InstituteList.map((inst)=>{
                options_institute.push({value: inst, label: inst})
            })
            LanguageList.map((lang)=>{
                var nome = ''
                if(lang === 'English'){
                    nome = 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png'
                }
                else if(lang === 'Dutch'){
                    nome = 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg'
                }
                else if(lang === 'Italian'){
                    nome = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png'
                }
                options_language.push({value: lang, label: <div>{lang}&nbsp;<img style={{'height':'12px','width':'20px','vertical-align':'baseline'}} src={nome}/></div>})
            })
            // options_usecases.push({value: 'Lung', label: 'Lung'})
            // options_language.push({value: 'Italian', label: 'English'})
            Setoptions_institute(options_institute)
            Setoptions_language(options_language)
            Setoptions_usecases(options_usecases)
            var options_actions = [{value:'labels',label:'Labels'},{value:'concepts',label:'Concepts'},{value:'mentions',label:'Mentions'},{value:'concept-mention',label:'Linking'},{value:'all',label:'All'}]
            Setoptions_actions(options_actions)
        }


    },[])


    function onSave(e,token){
        console.log('save')
        console.log(Ins)
        console.log(Lang)
        SetShowError(false)
        SetShowNotDownload(false)
        if(token === 'conf' && Act !== '' && Ins !== '' && Lang !== '' && Use !== ''){

            axios.get('http://examode.dei.unipd.it/exatag/download_ground_truths', {params: {institute:Ins,usec:Use,lang:Lang,action:Act}})
                .then(function (response) {
                    console.log('message', response.data);
                    if(response.data['ground_truth'].length > 0){
                        FileDownload(JSON.stringify(response.data), 'ground_truth.json');
                        SetShowNotDownload(false)
                        SetShowModalDownload(false)
                        SetIns('')
                        SetUse('')
                        SetLang('')
                        SetAct('')

                    }
                    else{
                        SetShowNotDownload(true)

                    }
                })
                .catch(function (error) {

                    console.log('error message', error);
                });

        }
        if(token === 'all'){
            SetShowError(false)

            axios.get('http://examode.dei.unipd.it/exatag/download_ground_truths')
                .then(function (response) {
                    console.log('message', response.data);
                    if(response.data['ground_truth'].length > 0){
                        FileDownload(JSON.stringify(response.data), 'ground_truth.json');
                        SetShowNotDownload(false)
                        SetShowModalDownload(false)
                        SetIns('')
                        SetUse('')
                        SetLang('')
                        SetAct('')

                    }
                    else{
                        SetShowNotDownload(true)
                    }

                })
                .catch(function (error) {

                    console.log('error message', error);
                });

        }
        else if((Ins === '' || Lang === '' || Use === '' || Act === '') ){
            console.log('ACT')
            SetShowError(true)

        }


    }
    function handleChangeLanguage(option){
        console.log(`Option selected:`, option.value);
        SetLang(option.value.toString())
    }

    function handleChangeUseCase(option){
        console.log(`Option selected:`, option.value);
        SetUse(option.value.toString())
    }

    function handleChangeInstitute(option){
        console.log(`Option selected:`, option.value);
        SetIns(option.value.toString())
    }
    function handleChangeAction(option){
        console.log(`Option selected:`, option.value);
        SetAct(option.value.toString())
    }

    return(
        <Modal show={ShowModalDownload} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Download JSON ground-truths</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {ShowError === true && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> Please fill all the fields <FontAwesomeIcon icon={faTimesCircle}/></div>}
                {ShowNotDownload === true && <h5>You have not any ground-truth for the required configuration. </h5>}
                <div>

                    <span >Set an action, a language, an institute and a use case and download your JSON ground-truths. If you want all the ground-truths you created, please click on <i>Download All</i> button</span>

                    <div>
                        <div><FontAwesomeIcon icon={faProjectDiagram} /> Actions</div>
                        <Select
                            className='selection'
                            onChange={(option)=>handleChangeAction(option)}
                            options={Options_actions}

                        />
                        <hr/>
                        <div><FontAwesomeIcon icon={faLanguage}  /> Language</div>
                        <Select
                            className='selection'
                            onChange={(option)=>handleChangeLanguage(option)}
                            options={Options_language}

                        />
                        <hr/>
                        <div><FontAwesomeIcon icon={faMicroscope}  /> Use Case</div>
                        <Select

                            className='selection'
                            onChange={(option)=>handleChangeUseCase(option)}
                            options={Options_usecases}
                        />
                        <hr/>

                        <div><FontAwesomeIcon icon={faHospital} /> Institute</div>
                        <Select
                            className='selection'
                            onChange={(option)=>handleChangeInstitute(option)}
                            options={Options_institute}

                        />

                    </div>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button onClick={(e)=>onSave(e,'all')} variant="warning" >
                    Download All
                </Button>
                <Button variant="secondary" onClick={handleClose} >
                    Close
                </Button>

                <Button onClick={(e)=>onSave(e,'conf')} variant="primary" >
                    Download
                </Button>
            </Modal.Footer>





        </Modal>


    );



}


// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
// export default confirmable(LinkDialog);
export default (DownloadGT);