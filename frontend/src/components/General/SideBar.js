import React, {useContext, useEffect} from 'react'
import Nav from "react-bootstrap/Nav";
import Figure from "react-bootstrap/Figure";
import './sideBar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Slide from '@material-ui/core/Slide';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import BaseIndex from "../../BaseIndex";
import Tutorial from "../SideComponents/Tutorial";
import Credits from "../SideComponents/Credits";
import About from "../SideComponents/About";


function SideBar(props){

    const { showbar,username } = useContext(AppContext);
    const [ShowBar, SetShowBar] = showbar;
    const [Username, SetUsername] = username;
    const height = document.documentElement.scrollHeight

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        console.log('height',height)
        console.log('height123',ShowBar)

        if(document.getElementById('sidenav') !== null){
            document.getElementById('sidenav').style.height = height.toString() + 'px'

        }
    },[ShowBar])


    return (
        <Slide direction="right" in={ShowBar} mountOnEnter unmountOnExit>

                <div className="sidenav" id='sidenav' style={{'text-align':'center'}}>
                    <button onClick={()=>SetShowBar(false)} className='closeButtonMenu'><FontAwesomeIcon icon={faTimes} size='2x'/></button>
                        {/*<div style={{'width':'125px','height':'125px','margin-left':'75px','margin-top':'10%','border-radius':'50%','background-color':'white'}}></div>*/}

                    <div style={{'text-align':'center','margin-top':'20%','margin-bottom':'10%'}}><h3>ExaTAG</h3>
                    </div>
                    <div style={{'text-align':'center','font-size':'1.25rem','font-weight':'bold'}}><span>{ Username }</span> </div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold'}}>Tech</div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold'}}><button
                        style={{'border':'none','background-color':'#E25886'}}
                     type='button' ><a style={{'font-size':'1rem','color':'black'}} href="http://examode.dei.unipd.it/exatag/logout"> Logout <FontAwesomeIcon icon={faSignOutAlt}/></a></button></div>
                <hr />
                    <Link onClick={()=>SetShowBar(false)} to="/exatag/index">Home</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/exatag/about">About</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/exatag/tutorial">Tutorial</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/exatag/credits">Credits</Link>

                    {/*<Link onClick={()=>SetShowBar(false)} to="/index">Home</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/about">About</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/tutorial">Tutorial</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/credits">Credits</Link>*/}


                </div>
        </Slide>

    );
}

export default SideBar
