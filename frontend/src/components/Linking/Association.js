import Token from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle,faEye, faInfoCircle,faUser} from '@fortawesome/free-solid-svg-icons';
import './linked.css';
import '../General/first_row.css';
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../BaseIndex'
import {Container,Row,Col} from "react-bootstrap";
import Zoom from "@material-ui/core/Zoom";

// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import LinkForm from "./LinkForm";
import AddAssociation from "./AddAssociation";
import {confirm, confirm_link} from "../Dialog/confirm";
import LinkDialogNew from "./LinkDialogNew";
import LinkingDialog from "./LinkingDialog";
import SnackBar from "../General/SnackBar";
// import {Container,Row,Col} from "react-bootstrap";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function Association(props){
    const [WordsMention, SetWordsMention] = useState([])
    const { tokens, color, language,disButton,showSnackMention,showSnackMessage, allMentions, associations,action,highlightMention,reports,index } = useContext(AppContext);
    const { mountForm,area,conceptchosen,enable_select,show} = useContext(LinkedContext);
    //const [WordsMention, SetWordsMention] = mentionSingleWord;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [ShowSnackMention,SetShowSnackMention] = showSnackMention;
    const [SnackMessage,SetSnackMessage] = showSnackMessage;
    const [Language, SetLanguage] = language;
    const [Action,SetAction] = action;
    const [AllMentions,SetAllMentions] = allMentions;
    const [Children, SetChildren] = tokens;
    const [Color, SetColor] = color
    const [Area, SetArea] = area;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    const [Linked, SetLinked] = useState(false)
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [MountForm, SetMountForm] = mountForm;
    //const [MentionConceptsList, SetMentionConceptList] = useState([])
    const [Show, SetShow] = show;
    const [Reports,setReports] = reports;
    const [Index,SetIndex] = index;

    useEffect(()=>{
        var arr_link = []

        console.log('ASS1',associations_to_show)
        associations_to_show.map((association,index)=>{
            if(props.text === association['mention_text'] && props.start === association['start'] && props.stop === association['stop']){
                arr_link.push(association)

            }
        })
        if(arr_link.length > 0){
            SetLinked(true)
        }
        else{
            SetLinked(false)
        }

    },[props.mention,associations_to_show])



    useEffect(()=>{
        var array = new Array(AllMentions.length).fill(false)
        SetMountForm(array)

    },[AllMentions])


    const handleHighlight = (WordsMention,style) =>{
        SetHighlightMention(false)
        var bottone_linked = (document.getElementsByClassName('butt_linked'))
        var scroll = false

        var font = ''
        var index = AllMentions.indexOf(props.mention)
        bottone_linked[props.id].style.fontWeight === 'bold' ? bottone_linked[props.id].style.fontWeight = '' : bottone_linked[props.id].style.fontWeight = 'bold'
        bottone_linked[props.id].style.fontWeight === 'bold' ? font = 'bold' : font = ''
        Children.map(child => {
            WordsMention.map(word => {
                if (child.id.toString() === word.startToken.toString()) {
                    if(scroll === false){
                        scroll = true
                        child.scrollIntoView({ behavior: 'smooth',block: "nearest"})
                    }
                    // child.style.fontWeight === 'bold' ? child.style.fontWeight = '' : child.style.fontWeight = 'bold'
                    child.style.fontWeight = font


                }
            })
        })

    }



    function fromMentionToArray(text,start1){
        var array = []
        var words = []
        var stringa = text.toString() //The age is considered an integer!!
        if(stringa.indexOf(' ')){
            words = stringa.split(' ')

        }
        else{
            words.push(stringa)
        }
        // console.log('startpassato',props.startSectionChar)
        var start = start1
        var last = words.slice(-1)[0]
        words.map((word,index) =>{
            var apostrofo = false
            var end = start + word.length - 1
            word = word.replace(/[.,#!$%\^&\*;:{}=`~()]/g,"");
            if(word.includes("'") && Language === 'Italian'){
                apostrofo = true
                //word = word.split("'")[1]

            }
            //word = word.replace("'",' ')
            // if(last === word){
            //     var last_char = word.slice(-1)
            //console.log('last',last_char)
            // if(chars.indexOf(last_char)>=0) {
            //     end = end - 1
            //     word = word.replace(last_char, '')
            //     //console.log('word', word)
            // }

            //}
            var obj = {'word':word,'startToken':start,'stopToken':end}

            array.push(obj)
            start = end + 2 //tengo conto dello spazio
            // console.log('obj',obj)

        })
        console.log('modified',array)
        return array
    }


    useEffect(()=>{
        var array = fromMentionToArray(props.text,props.start)
        SetWordsMention(array)

    },[props.text,props.start,props.stop])


    function ShowDialog(e){
        var index = AllMentions.indexOf(props.mention)
        var array = new Array(AllMentions.length).fill(false)
        array[index] = true
        SetMountForm(array)

        //SetShow(true)
        SetShow(prev => !prev)
    }


    function removeMention(e, mention){
        var ment = []
        SetShowSnackMention(true)

        var mentions_to_keep = AllMentions.filter(item => item !== mention)
        ment.push(props.mention)
        var data_to_ret = {'mentions':mentions_to_keep}

        axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
            mentions: data_to_ret['mentions'],
            report_id: Reports[Index].id_report
        })
            .then(function (response) {

                console.log('RISPOSTA',response);
                SetDisable_Buttons(false)
                var array_to_show = []
                var colors = Color
                var col = colors[props.id]
                //console.log('col',col)
                colors.splice(props.id,1)
                //colors.push(col)
                SetAssociations_to_show(associations_to_show.filter(item => item.start !== mention.start && mention.stop !== item.stop))
                if(AllMentions.length <= colors.length){
                    colors.splice(AllMentions.length-1, 0, col);

                }
                else{
                    colors.push(col)
                }
                //console.log('colors',colors)
                var arr_to_black = fromMentionToArray(mention.mention_text,mention.start)
                Children.map(child=>{
                    arr_to_black.map(word=>{
                        if(child.id.toString() === word.startToken.toString()){
                            child.setAttribute('class','token')
                            child.removeAttribute('style')

                        }

                    })
                })
                AllMentions.map(m =>{
                    if((m['start'] !== mention.start) || (m['stop'] !== mention.stop)){
                        array_to_show.push(m)
                    }

                })
                SetAllMentions(array_to_show)
                SetColor(colors)
            })
            .catch(function (error) {
                //alert('ATTENTION')
                console.log(error);
            });


    }

    return(

        <div>

            <div className="mentAndButt">
                <Row >
                    <Col md={8} className='right'>

                         <span>
                    <button style={{'text-align':'left'}} id={props.id} className="butt_linked" name={props.index} type="button" onClick={()=>handleHighlight(WordsMention,'')}>
                    {Color !== '' && WordsMention.map((word,index)=>

                        <div style={{'float':'left'}}><Token index_mention={props.id} action='mentionsList' words={WordsMention} start_token={word.startToken}
                                     stop_token={word.stopToken} word={word.word} index={index}/>&nbsp;</div>
                    )}
                        </button>


                </span>

                    </Col>

                    <Col md={4} className='right'>
                                <span>
                                    <Button style={{'float':'right'}} className='linkCo' size="sm"  variant="danger" onClick={(e)=>removeMention(e,props.mention)}><FontAwesomeIcon icon={faTimesCircle}/></Button>
                                    <Button style={{'float':'right'}} className="button_link" size="sm" value="Link" variant="primary" onClick={(e)=> ShowDialog(e)}>Link</Button>
                                    { (MountForm[props.id] && Show) ? <LinkDialogNew mention = {props.mention} text = {props.text}/> : <div></div>}

                                </span>
                    </Col>
                </Row>
            </div>


            <div>
                {Linked && <div>is linked with:</div>

                    }
                {/*{associations_to_show.length >0 && associations_to_show.map((association,index)=>  <div>*/}
                {/*    {association['mention_text'] === props.text && association['start'] === props.start && association['stop'] === props.stop &&*/}
                {/*    <div>is linked with:</div>*/}

                {/*    }</div>)}*/}

                <ul>
                    {associations_to_show.length >0 && associations_to_show.map((association,index)=>  <div>
                        {association['mention_text'] === props.text && association['start'] === props.start && association['stop'] === props.stop && <div>
                        <input type="hidden" value={JSON.stringify(association)}  name="linked"/>
                        <AddAssociation association = {association} area = {association['semantic_area']} concept = {association['concept_name']} />
                        </div>}
                    </div>)}

                </ul>

        </div>

    </div>
    );


}

export default Association