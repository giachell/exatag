import './App.css';
import ReactDOM from "react-dom";
import React, {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import './App.css';
import { useHistory } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';

import './components/General/first_row.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import StartingMenu from "./components/SelectMenu/StartingMenu";
import BaseIndex from "./BaseIndex";
import Tutorial from "./components/SideComponents/Tutorial";
import Credits from "./components/SideComponents/Credits";
import About from "./components/SideComponents/About";
import Spinner from "react-bootstrap/Spinner";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";


export const AppContext = createContext('')

function App() {
    const [selectedOption, setSelectedOption] = useState('');
    const [AnnotatedIndexList,SetAnnotatedIndexList] = useState([])
    const [ShowSnack, SetShowSnack] = useState(false)
    const [ShowSnackMention, SetShowSnackMention] = useState(false)
    const [SnackMessage, SetSnackMessage] = useState('This action removes this concept from concepts list. If you want to keep this concept go to Concepts and' +
        ' add it manually.')
    const [SnackMessageMention, SetSnackMessageMention] = useState('This action removes also the concepts you linked to this mention. If you want to keep these concepts go to Concepts and' +
        ' add them manually.')
    const [LabToInsert,SetLabToInsert] = useState([])
    const [LinkingConcepts,SetLinkingConcepts] = useState([])
    const [change, setChange] = useState(false)
    const [useCase,SetUseCase] = useState('')
    const [Language,SetLanguage] = useState('')
    const [Institute,SetInstitute] = useState('')
    const [UseCaseList,SetUseCaseList] = useState(false);
    const [LanguageList,SetLanguageList] = useState(false);
    const [InstituteList,SetInstituteList] = useState(false);
    const [ShowModal,SetShowModal] = useState(false)
    const [ShowModalDownload,SetShowModalDownload] = useState(false)
    const [UpdateMenu,SetUpdateMenu] = useState(false)
    const [Action, SetAction] = useState(false)
    const [WordMention, SetWordMention] = useState([])
    const [Mention, SetMention] = useState('')
    const [Outcomes,SetOutcomes] = useState([])
    const [labels, setLabels] = useState([])
    const [index, setIndex] = useState(0)
    const [report, setReport] = useState('')
    const [reports, setReports] = useState(false)
    const [ReportsString, setReportsString] = useState(false)
    const [Children, SetChildren] = useState([])
    const colori = ['red','green','orange','blue','#3be02c', '#B71C1C','#4db6ac','#FF6D00','#0091EA','#fbc02d','#b80073','#64dd17','#880E4F','#0094cc','#4A148C','#7E57C2','#3F51B5','#2196F3','#c75b39','#0097A7','#00695C','#ec407a','#2196f3','#00695c','#F50057','#00E5FF','#c600c7','#00d4db',
        '#388E3C','#aa00ff','#558b2f','#76FF03','#69F0AE','#e259aa','#CDDC39','royalblue','#EEFF41','#ea7be6','#d05ce3','#1DE9B6','#F06292','#F57F17','#BF360C','#7781f4','#795548','#607D8B','#651fff','#8d6e63'];
    const [Color,SetColor] = useState(colori)
    //const [Color,SetColor] = useState(['red','green'])
    const [labels_to_show, setLabels_to_show] = useState([])
    const [mentions_to_show, SetMentions_to_show] = useState([])
    const [associations_to_show,SetAssociations_to_show] = useState([])
    const [AllMentions, SetAllMentions] = useState([])
    const [checks, setChecks] = useState([])
    const [FinalCount, SetFinalCount] = useState(0)
    const [FinalCountReached, SetFinalCountReached] = useState(false)
    const [RadioChecked, SetRadioChecked] = useState(false)
    const [SemanticArea, SetSemanticArea] = useState([])
    const [Concepts, SetConcepts] = useState([])
    const [HighlightMention, SetHighlightMention] = useState(false)
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = useState([])
    const [SavedGT,SetSavedGT] = useState(false)
    const [ShowBar,SetShowBar] = useState(false)
    const [Disabled_Buttons, SetDisable_Buttons] = useState(false)
    const [Username, SetUsername] = useState('')
    const [OrderVar, SetOrderVar] = useState('lexic');
    const [SelectOptions,SetSelectOptions] = useState([]);

    const [LoadingLabels, SetLoadingLabels] = useState(false);
    const [LoadingConcepts, SetLoadingConcepts] = useState(false)
    const [LoadingMentions, SetLoadingMentions] = useState(false)
    const [LoadingMentionsColor, SetLoadingMentionsColor] = useState(true)
    const [LoadingAssociations, SetLoadingAssociations] = useState(false)
    const [LoadingReport, SetLoadingReport] = useState(false)
    const [LoadingReportList, SetLoadingReportList] = useState(false)
    // State for each ConceptList
    const [ShowErrorSnack, SetShowErrorSnack] = useState(false);
    const [ShowConceptModal, SetShowConceptModal] = useState(false)
    const [selectedConcepts, setSelectedConcepts] = useState({"Diagnosis":[], "Anatomical Location":[], "Test":[], "Procedure":[], "General Entity":[] })
    const [Start,SetStart] = useState(false)
    const [LoadingMenu, SetLoadingMenu] = useState(false)
    const [ClickedCheck, SetClickedCheck] = useState(false)
    const [RemovedConcept,SetRemovedConcept] = useState(false);

    useEffect(()=>{
        if(ShowBar){
            SetShowBar(false)
        }
        SetLoadingMenu(true)
        axios.get("http://examode.dei.unipd.it/exatag/get_usecase_inst_lang").then(response => {
            SetUseCaseList(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })
        //SetLoadingMenu(false)
        SetOrderVar('lexic')
        var username = window.username
        console.log('username', username)
        SetUsername(username)

    },[])

    useEffect(()=>{
        console.log('prima entrata in parametri')
        axios.get("http://examode.dei.unipd.it/exatag/get_session_params").then(response => {
            SetInstitute(response.data['institute']);
            SetLanguage(response.data['language']);
            SetUseCase(response.data['usecase']);
            console.log((response.data['institute']));
            console.log((response.data['language']));
            console.log((response.data['usecase']));
            SetLoadingMenu(false)


        })
    },[])

    // useEffect(()=>{
    //     console.log('lista1',LanguageList)
    //     console.log('lista2',InstituteList)
    //     console.log('lista3',UseCaseList)
    // },[UseCaseList,LanguageList,InstituteList])

    // useEffect(()=>{
    //     if(useCase && Language && Institute){
    //         localStorage.setItem('institute',Institute)
    //         localStorage.setItem('language',Language)
    //         localStorage.setItem('usecase',useCase)
    //     }
    //
    // },[useCase,Language,Institute])
    useEffect(()=>{
        console.log('cambio varorder',OrderVar)

    },[OrderVar])

    return (

        <div className="App">
            <AppContext.Provider value={{conceptOption:[selectedOption, setSelectedOption],removedConcept:[RemovedConcept,SetRemovedConcept],

                reportArray:[SelectOptions,SetSelectOptions],clickedCheck:[ClickedCheck, SetClickedCheck],
                loadingLabels:[LoadingLabels, SetLoadingLabels],loadingMentions:[LoadingMentions, SetLoadingMentions],loadingColors:[LoadingMentionsColor, SetLoadingMentionsColor],loadingAssociations:[LoadingAssociations, SetLoadingAssociations],loadingConcepts:[LoadingConcepts, SetLoadingConcepts],loadingReport:[LoadingReport, SetLoadingReport],loadingReportList:[LoadingReportList, SetLoadingReportList],
                indexList:[AnnotatedIndexList,SetAnnotatedIndexList],orderVar:[OrderVar, SetOrderVar],showSnackMessage:[SnackMessage,SetSnackMessage],showSnack:[ShowSnack, SetShowSnack], labelsToInsert:[LabToInsert,SetLabToInsert],start:[Start,SetStart],changeConceots:[change,setChange],username:[Username,SetUsername],showOptions:[ShowModal,SetShowModal],language:[Language,SetLanguage],institute:[Institute, SetInstitute], usecase:[useCase,SetUseCase],outcomes:[Outcomes,SetOutcomes],semanticArea:[SemanticArea,SetSemanticArea],concepts:[Concepts,SetConcepts],reportString:[ReportsString,setReportsString],radio:[RadioChecked, SetRadioChecked],finalcount:[FinalCount,SetFinalCount],reached:[FinalCountReached,SetFinalCountReached],
                index:[index,setIndex],showbar:[ShowBar,SetShowBar], tokens:[Children,SetChildren],report:[report,setReport],reports:[reports, setReports],insertionTimes:[ArrayInsertionTimes,SetArrayInsertionTimes],userLabels:[labels_to_show, setLabels_to_show],labelsList:[labels,setLabels],checks:[checks,setChecks],highlightMention:[HighlightMention, SetHighlightMention],updateMenu:[UpdateMenu,SetUpdateMenu],usecaseList: [UseCaseList,SetUseCaseList],languageList:[LanguageList,SetLanguageList],
                instituteList: [InstituteList,SetInstituteList],save:[SavedGT,SetSavedGT],disButton:[Disabled_Buttons,SetDisable_Buttons],selectedconcepts:[selectedConcepts, setSelectedConcepts],conceptModal:[ShowConceptModal, SetShowConceptModal],linkingConcepts:[LinkingConcepts,SetLinkingConcepts],errorSnack:[ShowErrorSnack, SetShowErrorSnack],
                mentionToAdd:[Mention,SetMention],showDownload:[ShowModalDownload,SetShowModalDownload],showSnackMessageMention:[SnackMessageMention, SetSnackMessageMention],showSnackMention:[ShowSnackMention,SetShowSnackMention],associations:[associations_to_show,SetAssociations_to_show], mentionsList:[mentions_to_show,SetMentions_to_show], allMentions:[AllMentions, SetAllMentions],action:[Action,SetAction], mentionSingleWord:[WordMention, SetWordMention],color:[Color,SetColor]}}
            >
                <Router>
                    <div>

                        <Switch>

                            <Route path="/exatag/index">
                            {/*<Route path="/index">*/}
                                {(LoadingMenu) ? <div className='spinnerDiv'><Spinner animation="border" role="status"/></div> : <BaseIndex />}
                            </Route>

                            <Route path="/exatag/about">
                            {/*<Route path="/about">*/}
                                <About />
                            </Route>
                            <Route path="/exatag/credits">
                            {/*<Route path="/credits">*/}
                                <Credits />
                            </Route>
                            <Route path="/exatag/tutorial">
                            {/*<Route path="/tutorial">*/}

                                <Tutorial />
                            </Route>

                        </Switch>
                    </div>
                </Router>

            </AppContext.Provider>
        </div>
    );
}


export default App;
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);