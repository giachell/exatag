import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import '../General/first_row.css';
import Carousel from "react-bootstrap/Carousel";
import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";


function About() {


    const { showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);

    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)

    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;

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
                <Container>
                    {ShowBar && <SideBar />}
                    {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) ? <div><SelectMenu />
                        <div><hr/></div>





                    <div style={{'text-align':'center'}}><h2>ABOUT</h2></div>
                    <div>
                        ExaTAG is a tool developed by the Department of Information Engineering of the University of Padua for the ExaMode Project.
                        Its goal is to provide a mean to create different types of ground-truths about medical reports.
                    </div><hr/>
                    <div style={{'display':'flex','justify-content':'center'}}>
                    <div style={{'text-align':'center','width':'80%','display':'flex','justify-content':'center'}}>
                        <Carousel fade style={{'width':'inherit'}} >
                            <Carousel.Item style={{'color':'black'}}>
                                {/*<img*/}
                                {/*    className="d-block w-100"*/}
                                {/*    src="http://examode.dei.unipd.it/exatag/static/images/about/menu.PNG"*/}
                                {/*    alt="First slide"*/}
                                {/*/>*/}
                                <div style={{'height':'inherit','width':'inherit'}}>
                                    <div style={{'height':'inherit','width':'inherit'}}>
                                        <img style={{'width':'inherit','height':'inherit'}}
                                             src="http://examode.dei.unipd.it/exatag/static/images/about/menu.png"
                                             alt="First slide"
                                        />
                                    </div>
                                </div>
                                <div style={{'height':'130px'}}>
                                <Carousel.Caption style={{'color':'black'}}>
                                    <h3>Start!</h3>
                                    <p>Choose your configuration.</p>
                                </Carousel.Caption>
                                </div>

                            </Carousel.Item>
                            <Carousel.Item style={{'color':'black'}}>
                                {/*<img*/}
                                {/*    className="d-block w-100"*/}
                                {/*    src="http://examode.dei.unipd.it/exatag/static/images/about/menu.PNG"*/}
                                {/*    alt="First slide"*/}
                                {/*/>*/}
                                <div style={{'height':'inherit','width':'inherit'}}>
                                    <div style={{'height':'inherit','width':'inherit'}}>
                                        <img style={{'width':'inherit','height':'inherit'}}
                                             src="http://examode.dei.unipd.it/exatag/static/images/about/labels.png"
                                             alt="First slide"
                                        />
                                    </div>
                                </div>
                                <div style={{'height':'130px'}}>
                                    <Carousel.Caption style={{'color':'black'}}>
                                        <h3>Labels Annotation</h3>
                                        <p>Find the labels which characterize the reports.</p>
                                    </Carousel.Caption>
                                </div>

                            </Carousel.Item>
                            <Carousel.Item style={{'color':'black'}}>
                                {/*<img*/}
                                {/*    className="d-block w-100"*/}
                                {/*    src="http://examode.dei.unipd.it/exatag/static/images/about/menu.PNG"*/}
                                {/*    alt="First slide"*/}
                                {/*/>*/}
                                <div style={{'height':'inherit','width':'inherit'}}>
                                    <div style={{'height':'inherit','width':'inherit'}}>
                                        <img style={{'width':'inherit','height':'inherit'}}
                                             src="http://examode.dei.unipd.it/exatag/static/images/about/linking.png"
                                             alt="First slide"
                                        />
                                    </div>
                                </div>
                                <div style={{'height':'130px'}}>
                                    <Carousel.Caption style={{'color':'black'}}>
                                        <h3>Linking</h3>
                                        <p>Find some mentions and link them with concepts of the Examode Ontology.</p>
                                    </Carousel.Caption>
                                </div>

                            </Carousel.Item>
                            <Carousel.Item style={{'color':'black'}}>
                                {/*<img*/}
                                {/*    className="d-block w-100"*/}
                                {/*    src="http://examode.dei.unipd.it/exatag/static/images/about/menu.PNG"*/}
                                {/*    alt="First slide"*/}
                                {/*/>*/}
                                <div style={{'height':'inherit','width':'inherit'}}>
                                    <div style={{'height':'inherit','width':'inherit'}}>
                                        <img style={{'width':'inherit','height':'inherit'}}
                                             src="http://examode.dei.unipd.it/exatag/static/images/about/mentions.png"
                                             alt="First slide"
                                        />
                                    </div>
                                </div>
                                <div style={{'height':'130px'}}>
                                    <Carousel.Caption style={{'color':'black'}}>
                                        <h3>Mentions</h3>
                                        <p>Read the report and find the most important mentions.</p>
                                    </Carousel.Caption>
                                </div>

                            </Carousel.Item>
                            <Carousel.Item style={{'color':'black'}}>
                                {/*<img*/}
                                {/*    className="d-block w-100"*/}
                                {/*    src="http://examode.dei.unipd.it/exatag/static/images/about/menu.PNG"*/}
                                {/*    alt="First slide"*/}
                                {/*/>*/}
                                <div style={{'height':'inherit','width':'inherit'}}>
                                    <div style={{'height':'inherit','width':'inherit'}}>
                                        <img style={{'width':'inherit','height':'inherit'}}
                                             src="http://examode.dei.unipd.it/exatag/static/images/about/concepts.png"
                                             alt="First slide"
                                        />
                                    </div>
                                </div>
                                <div style={{'height':'130px'}}>
                                    <Carousel.Caption style={{'color':'black'}}>
                                        <h3>Concepts</h3>
                                        <p>Read the report and select the concepts belonging to the Examode Ontology.</p>
                                    </Carousel.Caption>
                                </div>

                            </Carousel.Item>



                        </Carousel>
                    </div>
                    </div></div> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                </Container>
            </div>




            {/*</AppContext.Provider>*/}


        </div>
    );
}


export default About;

