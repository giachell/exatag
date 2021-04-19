import './App.css';
import LabelList from "./components/Labels/LabelList";
import {AppContext} from './App';
import React, {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import ReportList from "./components/Report/ReportList";
import Spinner from "react-bootstrap/Spinner";
import ReportSelection from "./components/Report/ReportSelection";
import LinkedList from "./components/Linking/LinkedList";
import MentionList from "./components/Mentions/MentionList";
import './components/General/first_row.css';
import Buttons from "./components/General/Buttons"
import SubmitButtons from "./components/General/SubmitButtons";
import SelectMenu from "./components/SelectMenu/SelectMenu";
import {faUser,faEllipsisH,faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SideBar from "./components/General/SideBar";
import ConceptsContainer from "./components/Concepts/ConceptsContainer";
import NextPrevButtons from "./components/General/NextPrevButtons";
import StartingMenu from "./components/SelectMenu/StartingMenu";
import NewSideBar from "./components/General/NewSideBar";
import SnackBar from "./components/General/SnackBar";
import ReportListUpdated from "./components/Report/ReportListUpdated";
import SnackBarMention from "./components/General/SnackBarMention";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
export const ReportContext = createContext('')
export const MentionContext = createContext('')
export const LinkedContext = createContext('')
export const LabelContext = createContext('')
export const ConceptContext = createContext('')

function BaseIndex() {


    const { removedConcept,clickedCheck,conceptOption,loadingReport,loadingReportList,loadingLabels,loadingAssociations,loadingColors,loadingConcepts,loadingMentions,checks,start,showbar,index,linkingConcepts,showSnackMention,mentionSingleWord,color,allMentions,mentionsList,mentionToAdd,associations,conceptModal,disButton,save,highlightMention,selectedconcepts,usecaseList,userLabels,labelsList,insertionTimes,tokens,report,reports,concepts,reached,finalcount,semanticArea,radio,changeConceots,labelsToInsert,showSnack,showSnackMessage,showOptions,username,action,reportString,outcomes,institute,language,usecase,updateMenu,languageList,instituteList } = useContext(AppContext);

    const [ShowSnackMention, SetShowSnackMention] =showSnackMention;
    const [ShowSnack, SetShowSnack] =showSnack;
    const [SnackMessage, SetSnackMessage] = showSnackMessage;
    const [LabToInsert,SetLabToInsert] =labelsToInsert;
    const [selectedOption, setSelectedOption] = conceptOption;
    const [LinkingConcepts,SetLinkingConcepts] = linkingConcepts;
    const [change, setChange] = changeConceots;
    const [useCase,SetUseCase] = usecase;
    const [Language,SetLanguage] = language;
    const [Institute,SetInstitute] = institute;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [ShowModal,SetShowModal] = showOptions;
    const [UpdateMenu,SetUpdateMenu] = updateMenu;
    const [Action, SetAction] = action;
    const [Area, SetArea] = useState('')
    const [ConceptChosen, SetConceptChosen] = useState('')
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Mention, SetMention] = mentionToAdd;
    const [Outcomes,SetOutcomes] = outcomes;
    const [Enable, SetEnable] = useState(false)
    const [GroundTruth, SetGroundTruth] = useState(-1)
    const [labels, setLabels] = labelsList;
    const [Index, setIndex] = index;
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [ReportsString, setReportsString] = reportString;
    const [Children, SetChildren] = tokens;
    const [MountForm,SetMountForm] = useState([])
    const colori = ['red','green','orange','blue','#3be02c', '#B71C1C','#4db6ac','#FF6D00','#0091EA','#fbc02d','#b80073','#64dd17','#880E4F','#0094cc','#4A148C','#7E57C2','#3F51B5','#2196F3','#c75b39','#0097A7','#00695C','#ec407a','#2196f3','#00695c','#F50057','#00E5FF','#c600c7','#00d4db',
        '#388E3C','#aa00ff','#558b2f','#76FF03','#69F0AE','#e259aa','#CDDC39','royalblue','#EEFF41','#ea7be6','#d05ce3','#1DE9B6','#F06292','#F57F17','#BF360C','#7781f4','#795548','#607D8B','#651fff','#8d6e63'];
    const [Color,SetColor] = color;
    //const [Color,SetColor] = useState(['red','green'])
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [mentions_to_show, SetMentions_to_show] = mentionsList;
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Checks, setChecks] = checks;
    const [LoadingLabels, SetLoadingLabels] = loadingLabels;
    const [LoadingConcepts, SetLoadingConcepts] = loadingConcepts;
    const [LoadingMentions, SetLoadingMentions] = loadingMentions;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [LoadingAssociations, SetLoadingAssociations] =loadingAssociations;
    const [LoadingReport, SetLoadingReport] = loadingReport;
    const [LoadingReportList, SetLoadingReportList] = loadingReportList;
    const [Show, SetShow] = useState(false)
    const [FinalCount, SetFinalCount] = finalcount;
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [RadioChecked, SetRadioChecked] = radio;
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [GTReport,SetGTreport] = useState(false)
    const [SavedGT,SetSavedGT] = save;
    const [ShowBar,SetShowBar] = showbar;
    const [Disabled_Buttons, SetDisable_Buttons] = disButton;
    const [Username, SetUsername] = username;
    const [Start,SetStart] = start;
    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    // State for each ConceptList
    const [RefPage,SetRefPage] = useState(false);
    const [ShowConceptModal, SetShowConceptModal] = conceptModal;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [upGroundTruth,SetupGroundTruth] = useState(false)
    const [currentSemanticArea, setCurrentSemanticArea] = useState("Diagnosis")
    const [RemovedConcept,SetRemovedConcept] = removedConcept;

    // Added by Fabio 20200218
    var csrf_token = "";
    /* const [selectedConceptsAnatomicalLocation, setSelectedConceptsAnatomicalLocation] = useState([])
    const [selectedConceptsProcedure, setSelectedConceptsProcedure] = useState([])
    const [selectedConceptsTest, setSelectedConceptsTest] = useState([])
    const [selectedConceptsGeneralEntity, setSelectedConceptsGeneralEntity] = useState([])*/
    // useEffect(()=>{
    //     //console.log('uc1',useCase)
    //     //console.log('uc1',Language)
    //     //console.log('uc1',Institute)
    //     //console.log('uc2',InstituteList)
    //     //console.log('uc2',LanguageList)
    //     //console.log('uc2',UseCaseList)
    // },[])



    function order_array(mentions){
        var ordered = []
        var texts = []
        mentions.map((item,i)=>{
            texts.push(item.mention_text)
        })
        texts.sort()
        texts.map((start,ind)=>{
            mentions.map((ment,ind1)=>{
                if(start === ment.mention_text){
                    if(ordered.indexOf(ment) === -1){
                        ordered.push(ment)

                    }
                }
            })
        })
        return ordered
    }


    useEffect(()=>{
        //console.log('setto colori')
        SetColor(colori)
        SetLoadingMentionsColor(true)

    },[Action,Index,Report,ReportsString])

    // useEffect(()=>{
    //
    //     axios.get("http://examode.dei.unipd.it/exatag/get_usecase_inst_lang").then(response => {
    //         SetUseCaseList(response.data['usecase']);
    //         SetLanguageList(response.data['language']);
    //         SetInstituteList(response.data['institute']);
    //
    //     })

        // console.log('seconda entrata in parametri')
        // axios.get("http://examode.dei.unipd.it/exatag/get_session_params").then(response => {
        //     SetInstitute(response.data['institute']);
        //     SetLanguage(response.data['language']);
        //     SetUseCase(response.data['usecase']);
        //     // if(response.data['institute'] !== undefined && response.data['language'] !== undefined && response.data['usecase']!== undefined){
        //     //     SetStart(false)
        //     //
        //     //
        //     // }
        //     // else{
        //     //     SetStart(true)
        //     //
        //     // }
        //})
    //     var username = window.username
    //     console.log('username', username)
    //     SetUsername(username)
    //
    // },[])


    useEffect(()=>{
        if(useCase !== '' && Language !== '' && Institute !== ''){
            axios.get("http://examode.dei.unipd.it/exatag/annotationlabel/all_labels").then(response => setLabels(response.data['labels']))
            axios.get("http://examode.dei.unipd.it/exatag/get_semantic_area").then(response => SetSemanticArea(response.data['area']))
            axios.get("http://examode.dei.unipd.it/exatag/conc_view").then(response => SetConcepts(response.data))


            // Added by Fabio 20200218
            csrf_token = document.getElementById('csrf_token').value;
            //console.log(`csfr_token: ${csrf_token}`);
            axios.get("http://examode.dei.unipd.it/exatag/get_last_gt",{params:{configure:'configure'}}
            ).then(response => {SetGroundTruth(response.data['groundtruth']);console.log('lastgt',response.data['groundtruth']);})

        }


    },[Institute, useCase,Language,upGroundTruth])

    useEffect(()=>{
        SetDisable_Buttons(true)
        setChange(false)
        SetLabToInsert([])
        //SetLabToInsert(0)
        SetClickedCheck(false)
        SetLinkingConcepts([])
        setSelectedOption('')
        SetRemovedConcept(false)
    },[Index,Report,Action])

    useEffect(()=>{

        if(UpdateMenu === true){
            setReportsString(false)
            SetChildren([])
            SetFinalCount(0)
            setIndex(0)
            setReports([])
            setReport('')
            SetAction(false)
            SetGTreport(false)
            SetUpdateMenu(false)

            axios.get("http://examode.dei.unipd.it/exatag/get_last_gt",{params: {configure:'configure'}}).then(response => {SetGroundTruth(response.data['groundtruth']);SetupGroundTruth(prev => !prev) })
        }

    },[UpdateMenu])

    useEffect(() => {
        if(useCase !== '' && Institute !== '' && Language !== '' ) {
            if (GroundTruth !== '') {

                // console.log('gtgt',GroundTruth)
                // console.log('gt',useCase)
                // console.log('gt',Language)
                // console.log('gt',Institute)
                var action = GroundTruth['gt_type']
                SetAction(action)


            } else {//DEFAULT
                SetAction('none')


            }
            SetLoadingReportList(true)
            axios.get("http://examode.dei.unipd.it/exatag/get_reports", {params: {configure: 'configure'}}).then(response => {
                setReports(response.data['report']);
                setIndex(response.data['index'])
                //console.log('index_changed',response.data['index'])
                setReport(Reports[0]);
                SetGTreport(true);
                SetLoadingReportList(false)
            })


        }


    }, [GroundTruth,upGroundTruth]);

    useEffect(()=>{
        if(Reports.length > 0 && Action ){
            SetSavedGT(prevState => !prevState) //Carico lista per select report
            SetLoadingReport(true)

            axios.get("http://examode.dei.unipd.it/exatag/report_start_end", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                setReportsString(response.data); SetFinalCount(response.data['final_count']);SetFinalCountReached(false); SetLoadingReport(false);

            })

            if (Action === 'labels') {
                SetLoadingLabels(true)
                axios.get("http://examode.dei.unipd.it/exatag/annotationlabel/user_labels", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    setLabels_to_show(response.data[Action.toString()]);
                    SetLabToInsert(response.data[Action.toString()])

                    //SetLoadingLabels(false)
                })
            }else if (Action === 'mentions') {
                SetLoadingMentions(true)
                axios.get("http://examode.dei.unipd.it/exatag/mention_insertion", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    // SetMentions_to_show(response.data[Action.toString()])
                    var mentions = response.data[Action.toString()]

                    var ordered = order_array(mentions)
                    SetMentions_to_show(ordered);
                    SetLoadingMentions(false);
                })
            } else if (Action === 'concept-mention'){
                SetLoadingAssociations(true)
                axios.get("http://examode.dei.unipd.it/exatag/insert_link/linked", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {SetAssociations_to_show(response.data['associations']);})
                axios.get("http://examode.dei.unipd.it/exatag/insert_link/mentions", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data['mentions1']);
                    var ordered = order_array(mentions)
                    SetAllMentions(ordered)
                    SetLoadingAssociations(false)})
            } else if (Action === 'concepts'){
                SetLoadingConcepts(true)
                axios.get("http://examode.dei.unipd.it/exatag/contains", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);SetLoadingConcepts(false)})

            }


        }
    },[GTReport])



    useEffect(()=>{

        if(Reports.length>0) {
            setSelectedConcepts({"Diagnosis":[], "Anatomical Location":[], "Test":[], "Procedure":[], "General Entity":[] })

            // SetSavedGT(prevState => !prevState)
            axios.get("http://examode.dei.unipd.it/exatag/report_start_end", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {SetFinalCount(response.data['final_count']);
                setReportsString(response.data); SetFinalCountReached(false); console.log('DATA',(response.data['final_count']));
            })

        }
    },[Report,Index])


    useEffect(() => {
        setSelectedConcepts({"Diagnosis":[], "Anatomical Location":[], "Test":[], "Procedure":[], "General Entity":[] })

        if (Reports.length>0 && Action === 'labels' ) {

            axios.get("http://examode.dei.unipd.it/exatag/annotationlabel/user_labels", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {setLabels_to_show(response.data[Action.toString()]);SetLabToInsert(response.data[Action.toString()]);


            })
        }
        else if (Reports.length >0 && Action === 'concepts'){
            axios.get("http://examode.dei.unipd.it/exatag/contains", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);})

        }
    }, [ReportsString]); //report, Index // C'era anche Action, se dà problemi mettiamo


    useEffect(() => {
        if(Reports.length>0 ) {
            SetSavedGT(prevState => !prevState)
            if (Action === 'labels') {
                SetLoadingLabels(true)

                axios.get("http://examode.dei.unipd.it/exatag/annotationlabel/user_labels", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    setLabels_to_show(response.data[Action.toString()]);
                    SetLabToInsert(response.data[Action.toString()])

                    //SetLoadingLabels(false)

                })

            }
            else if (Action === 'concepts'){
                SetLoadingConcepts(true)
                axios.get("http://examode.dei.unipd.it/exatag/contains", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);SetLoadingConcepts(false)})

            }
        }
    }, [Action]);

    useEffect(() => {
        //console.log(GTReport)
        SetMentions_to_show(false)
        SetAllMentions(false)
        SetAssociations_to_show(false)
        SetHighlightMention(false)
        SetColor(colori)
        //console.log('aggiornato1')
        if (Reports.length>0 && ReportsString !== false) {
            //console.log('reportString',reportsString)


            if (Action === 'mentions') {

                SetLoadingMentions(true)
                axios.get("http://examode.dei.unipd.it/exatag/mention_insertion", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data[Action.toString()])

                    var ordered = order_array(mentions)
                    SetMentions_to_show(ordered);
                    SetLoadingMentions(false);

                })
            } else if (Action === 'concept-mention'){
                SetLoadingAssociations(true)
                axios.get("http://examode.dei.unipd.it/exatag/insert_link/linked", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {SetAssociations_to_show(response.data['associations']);})
                axios.get("http://examode.dei.unipd.it/exatag/insert_link/mentions", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data['mentions1']);
                    var ordered = order_array(mentions)
                    SetAllMentions(ordered);
                    //console.log('allmentionsup',response.data['mentions1'])
                    SetLoadingAssociations(false)})
            }
        }


    }, [Action,ReportsString,Index]); //report, Index // C'era anche Action, se dà problemi mettiamo


    useEffect(()=>{
        if(Reports.length > 0 && document.getElementById("report_sel") !== null){
            document.getElementById("report_sel").scroll(0, 0)
            if(Action === 'concept-mention'){
                if(document.getElementById("linked-list") !== null) {
                    document.getElementById("report_sel").scroll(0, 0)
                    document.getElementById("linked-list").scroll(0, 0)
                }

            }
            if(Action === 'mentions'){
                if(document.getElementById("mentions_list") !== null){
                    document.getElementById("report_sel").scroll(0, 0)
                    document.getElementById("mentions_list").scroll(0, 0)
                }


            }
        }

    },[Action, Index, Report])


    useEffect(()=>{
        var user_checks = new Array(labels.length).fill(false)
        // SetLabToInsert(labels_to_show)
        SetLoadingLabels(false)
        if(labels_to_show.length>0){
            SetRadioChecked(true)
            labels_to_show.map(lab => {
                user_checks[lab.seq_number - 1] = true
            })}
        else{
            SetRadioChecked(false)

        }
        setChecks(user_checks)

    },[labels_to_show]);

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        //console.log('height',height)

        if(document.getElementById('spinnerDiv') !== null){
            //console.log('height',height)

            document.getElementById('spinnerDiv').style.height = height.toString() + 'px'

        }
    },[Start,LoadingReport,LoadingReportList])

    return (
        <div className="App">

            {/*<AppContext.Provider value={{showSnackMessage:[SnackMessage,SetSnackMessage],showSnack:[ShowSnack, SetShowSnack], labelsToInsert:[LabToInsert,SetLabToInsert],start:[Start,SetStart],changeConceots:[change,setChange],username:[Username,SetUsername],showOptions:[ShowModal,SetShowModal],language:[Language,SetLanguage],institute:[Institute, SetInstitute], usecase:[useCase,SetUseCase],outcomes:[Outcomes,SetOutcomes],semanticArea:[SemanticArea,SetSemanticArea],concepts:[Concepts,SetConcepts],reportString:[reportsString,setReportsString],radio:[RadioChecked, SetRadioChecked],finalcount:[FinalCount,SetFinalCount],reached:[FinalCountReached,SetFinalCountReached],*/}
            {/*    Index:[Index,setIndex],showbar:[ShowBar,SetShowBar], tokens:[Children,SetChildren],report:[report,setReport],reports:[reports, setReports],insertionTimes:[ArrayInsertionTimes,SetArrayInsertionTimes],userLabels:[labels_to_show, setLabels_to_show],labelsList:[labels,setLabels],checks:[checks,setChecks],highlightMention:[HighlightMention, SetHighlightMention],updateMenu:[UpdateMenu,SetUpdateMenu],usecaseList: [UseCaseList,SetUseCaseList],languageList:[LanguageList,SetLanguageList],*/}
            {/*    instituteList: [InstituteList,SetInstituteList],save:[SavedGT,SetSavedGT],disButton:[Disabled_Buttons,SetDisable_Buttons],selectedconcepts:[selectedConcepts, setSelectedConcepts],conceptModal:[ShowConceptModal, SetShowConceptModal],linkingConcepts:[LinkingConcepts,SetLoadingConcepts],errorSnack:[ErrorSnack, SetErrorSnack],*/}
            {/*    mentionToAdd:[Mention,SetMention],associations:[associations_to_show,SetAssociations_to_show], mentionsList:[mentions_to_show,SetMentions_to_show], allMentions:[AllMentions, SetAllMentions],action:[Action,SetAction], mentionSingleWord:[WordMention, SetWordMention],color:[Color,SetColor]}}*/}
            {/*>*/}


                {useCase === '' && Language === '' && Institute === '' && UseCaseList.length >= 0 && LanguageList.length >= 0 && InstituteList.length >=0 && <StartingMenu />}

                {(useCase !== '' && Language !== '' && Institute !== '' && (LoadingReport || LoadingReportList)) ? <div className='spinnerDiv'><Spinner animation="border" role="status"/></div> :

                    <div >
                        {/*<div style={{'float':'left','padding':'10px','padding-left':'250px'}}><button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></div>*/}
                        <Container>
                            {ShowBar && <SideBar />}
                            {ShowSnackMention && <SnackBarMention message = {SnackMessage} />}
                            {ShowSnack && <SnackBar message = {SnackMessage} />}
                            {Institute !== '' && Language !== '' && useCase !== '' && InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0 && Reports.length >= 0 && <div><SelectMenu />
                                <div><hr/></div></div>

                            }

                            {Institute !== '' && Language !== '' && useCase !== '' && Reports.length > 0 && <Row className='row_container'>
                                <Col md={6}>
                                    {/*<Row>*/}
                                    {/*    <Col md={9} className='first_row_container'>*/}
                                    {/*        {Reports.length >0 && <div><span className='reportListStyle'>REPORT: </span><span><ReportSelection /></span></div>}*/}

                                    {/*    </Col>*/}
                                    {/*        <Col md={3}>*/}
                                    {/*    <NextPrevButtons/>*/}

                                    {/*        </Col>*/}
                                    {/*</Row>*/}
                                    {Reports.length >0 && <div><div className='first_row_container'><span className='reportListStyle'>REPORT: </span><span><ReportSelection /></span>&nbsp;&nbsp;<span><NextPrevButtons /></span></div></div>}
                                    {/*{Reports.length >0 && <div><div className='first_row_container'><span className='reportListStyle'>REPORT: </span><span><ReportSelection /></span>&nbsp;&nbsp;<span><NextPrevButtons /></span></div><Row><Col md={2}  style={{'font-weight':'bold','padding-left':'20px'}}>Order:</Col><Col md={10}>Lexicographical || Annotation</Col></Row></div>}*/}

                                    {Reports.length >0 && <div id='report_sel' className='first_container'>
                                        {LoadingReport ? <Spinner animation="border" role="status"/> : <ReportListUpdated report_id = {Reports[Index].id_report} report = {Reports[Index].report_json} action={Action}/>}</div> }
                                </Col>



                                <Col md={1}></Col>

                                <Col md={5}>
                                    <div style={{'text-align':'center'}}><Buttons /></div>

                                    {Action === 'labels' && <div className='first_container_right'>
                                        {(LoadingLabels || LoadingReport) ? <Spinner animation="border" role="status"/> : <div>
                                            {Reports.length >0  &&

                                            <LabelList labels={labels} report_id = {Reports[Index].id_report} />

                                            }

                                        </div>}
                                        <SubmitButtons token={'annotation'} token_prev={'annotation_prev'} token_next = {'annotation_next'}/>

                                    </div>}
                                    {Action === 'mentions' && <div className='first_container_right'>
                                        {(LoadingMentions || LoadingReport) ? <Spinner animation="border" role="status"/> :
                                            <>
                                                {Reports.length > 0 && mentions_to_show !== false && <MentionList />}



                                            </>

                                        }
                                        <SubmitButtons token={'mentions'} token_prev={'mentions_prev'}
                                                       token_next={'mentions_next'}/>

                                    </div>}
                                    {Action === 'concept-mention' && <div className='first_container_right'>
                                        {(LoadingAssociations || LoadingReport) ? <Spinner animation="border" role="status"/> :
                                            <div>
                                                <LinkedContext.Provider value={{mountForm:[MountForm,SetMountForm], enable_select: [Enable, SetEnable], conceptchosen:[ConceptChosen, SetConceptChosen], area:[Area,SetArea], show:[Show,SetShow]}}>

                                                    {Reports.length >0 && AllMentions !== false && associations_to_show !== false && <LinkedList />}

                                                </LinkedContext.Provider>

                                            </div>

                                        }
                                        <SubmitButtons token={'linked'} token_prev={'linked_prev'} token_next={'linked_next'} />

                                    </div>}
                                    {Action === 'concepts' && <div className='first_container_right'>
                                        {(LoadingConcepts || LoadingReport) ? <Spinner animation="border" role="status"/> :
                                            <div>
                                                <ConceptContext.Provider value={{currentSemanticArea, setCurrentSemanticArea}}>

                                                    <ConceptsContainer />

                                                </ConceptContext.Provider>

                                            </div>

                                        }
                                        <SubmitButtons token={'concepts'} token_prev={'concepts_prev'} token_next={'concepts_next'} />

                                    </div>}





                                    {Action === '' && <h2>Please, choose an action.</h2>}
                                    {Action === 'none' && <div><h5>This is the default configuration. Choose an action and start the annotation.</h5></div>}


                                </Col>
                            </Row>}
                            {/*{!Start && Reports.length === 0 && <div><h5>There are not reports which correspond to this configuration. Please change it.</h5></div>}*/}


                        </Container>
                    </div>}




            {/*</AppContext.Provider>*/}


        </div>
    );
}


export default BaseIndex;
