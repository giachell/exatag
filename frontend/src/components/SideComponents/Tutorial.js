import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";

import '../General/first_row.css';

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Button from "react-bootstrap/Button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle,
    faGlasses, faHospital,
    faList, faMicroscope, faUser, faCogs, faBars, faFlag, faCircle,
    faPalette,faChevronLeft,
    faPencilAlt,
    faPlusCircle, faSave,
    faTimesCircle, faCheckSquare, faMousePointer, faProjectDiagram, faTimes, faDownload, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {green} from "@material-ui/core/colors";
import Spinner from "react-bootstrap/Spinner";


function Tutorial() {


    const { showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);

    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;

    const [ShowConceptsTutorial,SetShowConceptsTutorial] = useState(false)
    const [ShowLabelsTutorial,SetShowLabelsTutorial] = useState(false)
    const [ShowMentionsTutorial,SetShowMentionsTutorial] = useState(false)
    const [ShowLinkingTutorial,SetShowLinkingTutorial] = useState(false)

    useEffect(()=>{
        console.log('SHOWBAR',ShowBar)

        axios.get("http://examode.dei.unipd.it/exatag/get_usecase_inst_lang").then(response => {
            SetUseCaseList(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })
        var username = window.username
        console.log('username', username)
        SetUsername(username)

    },[])

    return (
        <div className="App">




            <div >
                {/*<div style={{'float':'left','padding':'10px','padding-left':'250px'}}><button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></div>*/}
                <Container>
                    {ShowBar && <SideBar />}
                    {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) ? <div><SelectMenu />
                        <div><hr/></div>


                    <div className='Tutorial'>
                        <div style={{'text-align':'center'}}><h2>TUTORIAL</h2>
                        <h6>In this section we explain in details how ExaTAG works, its main components and how you can create your own ground-truths.</h6>
                        <div>In the video below Gianmaria Silvello introduces you ExaTAG and its features.</div>
                        <video style={{'margin-top':'20px'}} width="60%"  controls src="http://examode.dei.unipd.it/exatag/static/videos/exatag_tutorial_brief.mp4" />

                        <hr/>
                        </div>
                        <div>
                        <div>When you log in you are asked to choose: the <i>Language</i>, the <i>Use case</i> and the <i>Institute</i>. Then, according
                        to this configuration, you will be provided with a set of reports to annotate.</div>
                        <div>If it is the first time you log in, you will be asked to choose an action between <i>Labels, Linking, Mentions, Concepts.</i></div>
                        <div>If you have already annotated some reports for the configuration you selected, you will display the last ground-truth you created.</div>
                        <hr/>
                        <div>In the home screen you can find three main components explained below.</div>
                            <h5>The Menu</h5>
                            <div>This is located at the top of the page and it includes:
                                <ul className="fa-ul">
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faBars}/></span>
                                        The side menu where you can find the <i>About, Credits, Tutorial, Home</i> sections.
                                    </li>
                                    <li>
                                        The actual configuration which includes the actual <FontAwesomeIcon icon={faMicroscope}/>&nbsp;<i>Use case</i>, the&nbsp;
                                        <FontAwesomeIcon icon={faFlag}/>&nbsp;<i>Language</i> and the <FontAwesomeIcon icon={faHospital}/>&nbsp;<i>Institute</i>. The actual
                                        configuration is changeble clicking on <span className='configuration_btn '> <Button id='conf' style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='success'> <FontAwesomeIcon icon={faCogs} /> Change</Button></span>.&nbsp;
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faUser}/></span>
                                        Your username and the <i>Logout</i> button.
                                    </li>
                                    <li>Clicking on <span > <Button id='conf' style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='info'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>&nbsp;
                                        you can download your JSON ground-truths according to the configuration you prefer.
                                    </li>

                                </ul>

                            </div>
                            <hr/>
                            <h5>The Report</h5>
                            <div>On your left you can find the report to annotate. If you want to change report you can click on the left (previous report) and right (next report) arrows in your keyboard or click on <Button  size='sm' className="btn nextbtn"   variant="info"><FontAwesomeIcon icon={faChevronLeft} /></Button> and <Button id='but_sx'  size='sm' className="btn nextbtn"  type="submit"   name = "next"  variant="info"><FontAwesomeIcon icon={faChevronRight} /></Button> buttons. Each report has the following sections:
                            <ul>
                                <li><span className='tutorial_li'>Reports' order</span>: You can choose the order of the list of reports located next to REPORT. If you choose <i>Lexicographical</i> your list will be ordered by reports' id. If you choose <i>Annotated reports</i> instead, on the top of the list you will have all the reports you have not annotated yet. At the end all the annotated reports will be placed.</li>
                                <li><span className='tutorial_li'>Last update</span>: the date and the time related to the creation of the ground-truth for a specidic action and report.</li>
                                <li><span className='tutorial_li'>ID</span>: the report's identifier</li>
                                {/*<li><span className='tutorial_li'>Diagnosis - Internal ID (AOEC) / Block number (RADBOUD)</span>: This is an index which identifies what the diagnosis to annotate is (our <i>Target diagnosis</i>) among all the diagnoses*/}
                                {/*reported in the <i>Raw diagnoses</i>.</li>*/}
                                <li><span className='tutorial_li'>Diagnosis</span>: this section includes the diagnosis to annotate (the <i>Target Diagnosis</i> and some relative information.</li>
                                {/*<li><span className='tutorial_li'>Diagnosis - Materials</span>: This is the other part you can annotate and it indicates </li>*/}
                                <li><span className='tutorial_li'>General information</span>: this section includes some information about the patient, such as the <i>age</i> and the <i>gender</i></li>
                                <li><span className='tutorial_li'>Raw diagnoses</span>: it is usually subdivided into one or more diagnoses associated to different images. The raw diagnoses
                                was automatically parsed in order to extract the <i>Target Diagnosis</i> which corresponds to the <i>Internal ID / Block number</i>.
                                    We reported this field in order to allow you to let us know whether we extract the <i>Target diagnosis</i> correctly.
                                 </li>
                            </ul>
                            <div>If you want to jump to a precise report, go to the bar next to the REPORT title and select the one you prefer. The reports you have not annotated yet are in bold face.</div>
                            </div>
                            <hr/>

                            <h5>The Actions</h5>
                            <div>You can annotate the reports in four different ways (which we usually call <i>actions</i>):</div>

                            <div>
                                <ul>
                                    <li>
                                        <span className='tutorial_li'>Labels</span>: You are asked to choose one or more labels that can
                                        correctly categorize the report examined. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowLabelsTutorial(prev=>!prev)}>Click here</Button> to see how to associate one or more labels to a report.
                                        {ShowLabelsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                                    Read the report on your left
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of labels is displayed. Each label identifies a category which can be associated to the report.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faCheckSquare}/></span>Click on the labels you prefer.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove all the labels you found.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                                    going to the previous or next report.
                                                </li>
                                            </ul>
                                        <hr/>
                                        </div>}
                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Linking</span>: You are asked to associate to each mention you found a concept. If it is the case,
                                         you can also add new mentions. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowLinkingTutorial(prev=>!prev)}>Click here</Button> to see how to perform <i>Linking</i>.
                                        {ShowLinkingTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                                    Read the report on your left.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of mentions is displayed (if any). You can also select new mentions if you want:
                                                    the elements preceded by the pencil identify the clickable text portions. Click on the words that compose your mention and add the mention to the list.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faProjectDiagram}/></span>Click on LINK: a draggable window is displayed.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span> Choose a semantic area and then a concept / you can select a concet also without pre-selecting a semantic area. Add the linked concept clicking on “Add”. The concept will be automatically displayed under its mention. Click on the concept to have some information about it.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a linked concept click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a mention (and its concepts) press to the <FontAwesomeIcon icon={faTimes}/> next to LINK button.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete all the linked concepts click on the <span style={{'color':'red'}}>CLEAR</span> button.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the concepts you link (or remove) are automatically added (or removed) to the list of concepts
                                                    viewable in Concepts section. The removal of the mention will affect not only the Concepts list but also the Mentions list of Mentions section.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                                    going to the previous or next report.
                                                </li>
                                            </ul><hr/>
                                        </div>}

                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Mentions</span>: You are asked to find new mentions in the report you are reading. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowMentionsTutorial(prev=>!prev)}>Click here</Button> to see how to find new mentions.
                                        {ShowMentionsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                                    Read the report on your left.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of mentions is displayed (if any).
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>The report's section you can extract the mentions from are preceded by a <FontAwesomeIcon icon={faPencilAlt}/>.
                                                    Click on the words which compose your mention. Once you selected a word you can click exclusively on the next or previous words.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>On the right side, above the mentions list, you can visualize the words you selected for your mention. Click on
                                                    "Add" in order to add the mention to the list.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faPalette}/></span>Once you added the mention this will have a color. In the textual report the words which characterize a mention of the list
                                                    will be colored and they will not be selectable any more. The punctuation has been removed from all the mentions in the mentions list on your right.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a mention press to the <FontAwesomeIcon icon={faTimesCircle}/> next to the mention.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove all the mentions you found.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the removal of a mention removes also the concepts that were linked to it.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                                    going to the previous or next report.
                                                </li>
                                            </ul>
                                        <hr/></div>}
                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Concepts</span>: You are asked to find a set of concepts which can be associated to the report you are reading. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowConceptsTutorial(prev=>!prev)}>Click here</Button> to see how to associate one or more concepts to a report.
                                        {ShowConceptsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
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
                                            </ul><hr/>
                                        </div>}
                                    </li>

                                </ul>
                            </div>
                            <hr/>
                            <h5>Please, pay attention to the following points.</h5>
                            <div>
                                <ul>
                                    {/*<li>*/}
                                    {/*    The mentions that you annotate and that you can visualize in the mentions list in <i>Mentions</i>*/}
                                    {/*    and <i>Linking</i> actions <span style={{'text-decoration':'underline'}}>include</span> the punctuation.*/}
                                    {/*    By the way, in the JSON serialization of your ground-truths the punctuation has been removed from the mentions' texts.*/}
                                    {/*</li>*/}
                                    <li>
                                        If you do not logout before leaving ExaTAG, the next time you visit exaTAG the last configuration will be restored. If you do not want to be provided with your previous configuration, please log out before leaving.
                                    </li>
                                    <li>
                                        Use Chrome to have the best experience.
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    </div> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                </Container>
            </div>




            {/*</AppContext.Provider>*/}


        </div>
    );
}


export default Tutorial;
