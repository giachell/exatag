import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
    faLink,
    faEye,
    faMicroscope,
    faTimesCircle,
    faLanguage,
    faLocationArrow,
    faCogs,
    faHospital,
    faUser, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext, LinkedContext} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Linking/linked.css';
import Select from 'react-select';
import axios from "axios";
import Buttons from "../General/Buttons";
import {Container,Row,Col} from "react-bootstrap";


function StartingMenu(props){
    const { start,showOptions,username,action,reportString,institute,language,usecase,updateMenu,usecaseList,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [ShowModal, SetShowModal] = showOptions;
    const [Institute, SetInstitute] = institute;
    const [Language, SetLanguage] = language;
    const [UseCase, SetUseCase] = usecase;
    const [Action,SetAction] = action;
    const [repString,SetRepString] = reportString;
    const [Ins,SetIns] = useState('')
    const [Use,SetUse] = useState('')
    const [Lang,SetLang] = useState('')
    const [Start,SetStart] = start;
    const [ShowErrorReports,SetShowErrorReports] = useState(false)

    const [ShowError,SetShowError] = useState(false)
    const handleClose = () => SetShowModal(false);
    const [Options_usecases, Setoptions_usecases] = useState([])
    const [Options_language, Setoptions_language] = useState([])
    const [Options_institute, Setoptions_institute] = useState([])
    const [Username,SetUsername] = username;



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
        }


    },[])


    function onSave(e){
        console.log('save')
        console.log(Ins)
        console.log(Lang)
        if(Ins === '' || Lang === '' || Use === ''){
            SetShowError(true)

        }
        else { //Salvo solo se tutti e tre i campi sono stati riempiti
            var count = 0
            axios.get('http://examode.dei.unipd.it/exatag/get_reports', {
                params: {
                    institute: Ins,
                    usec: Use,
                    lang: Lang
                }
            }).then(function (response) {
                count = response.data['count']

                if (count === 0) {
                    SetShowErrorReports(true)
                }
                else if(count >0) {
                    SetShowModal(false)
                    SetShowErrorReports(false)


                    axios.post("http://examode.dei.unipd.it/exatag/new_credentials", {
                        usecase: Use, language: Lang, institute: Ins,
                    })
                        .then(function (response) {
                            SetUseCase(Use)
                            SetLanguage(Lang)
                            SetInstitute(Ins)
                            // sessionStorage.setItem('inst', Ins)
                            // sessionStorage.setItem('lang', Lang)
                            // sessionStorage.setItem('use', Use)
                            SetIns('')
                            SetUse('')
                            SetLang('')
                            //SetStart(false)
                            console.log('abcdresp', response);


                        })
                        .catch(function (error) {
                            SetIns('')
                            SetUse('')
                            SetLang('')
                            console.log('abcd', error);
                        });
                }
            })
                .catch(function (error) {
                    SetUpdateMenu(true)
                    SetIns('')
                    SetUse('')
                    SetLang('')
                    console.log('abcd', error);
                });
            console.log('count1234', count)

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

    return(
        <div>
        <Row>
            <Col md={8}></Col>
            <Col md={4} style={{'text-align':'right'}}>
                <span className='userInfo'><span > {Username} </span><FontAwesomeIcon icon={faUser} size='2x'/> <a href="http://examode.dei.unipd.it/exatag/logout" className="badge badge-secondary" >Logout <FontAwesomeIcon icon={faSignOutAlt}/></a></span>

            </Col>
        </Row>
        <div style={{'text-align':'center','margin-top':'20px'}}>
            <div><h4><span>Welcome </span><span style={{'color':'royalblue'}}>{Username}</span><span>!</span></h4> Select a language, a use case and an institute before starting.</div>
            {ShowError === true && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> Please fill all the fields <FontAwesomeIcon icon={faTimesCircle}/></div>}
            {ShowErrorReports === true && <h5>There are not reports for this configuration, please change it. </h5>}

            <div style={{'text-align':'center','margin-top':'40px'}}>
                <div><FontAwesomeIcon icon={faLanguage}  /> Language</div>
                <div style={{'width':'80%','margin-left':'10%','margin-right':'10%'}}><Select
                    className='selection'
                    onChange={(option)=>handleChangeLanguage(option)}
                    options={Options_language}

                /></div>
                <hr/>
                <div>
                    <FontAwesomeIcon icon={faMicroscope}  /> Use Case</div>
                <div style={{'width':'80%','margin-left':'10%','margin-right':'10%'}}><Select

                    className='selection'
                    onChange={(option)=>handleChangeUseCase(option)}
                    options={Options_usecases}
                /></div>
                <hr/>

                <div>
                    <FontAwesomeIcon icon={faHospital} /> Institute</div>
                <div style={{'width':'80%','margin-left':'10%','margin-right':'10%'}}><Select
                    className='selection'
                    onChange={(option)=>handleChangeInstitute(option)}
                    options={Options_institute}

                /></div>
            </div>
            <hr/>
            <div>                    <Button variant='primary' type='button' onClick={(e)=>onSave(e)}>Start</Button>
            </div>

        </div>

        </div>


    );



}


// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
// export default confirmable(LinkDialog);
export default (StartingMenu);