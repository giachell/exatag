import Token from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle,faEye, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import './mention.css';
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../BaseIndex'
import {Container,Row,Col} from "react-bootstrap";

// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'

import cookie from "react-cookies";

import LabelItem from "../Labels/LabelItem";
import SnackBar from "../General/SnackBar";
// import {Container,Row,Col} from "react-bootstrap";
//
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function Mention(props){
    const [WordsMention, SetWordsMention] = useState([])

    const { tokens,language,showSnackMessage,showSnackMention, disButton, highlightMention, color, showSnack, finalcount,reports, action,index,mentionSingleWord, mentionsList } = useContext(AppContext);
    //const [WordsMention, SetWordsMention] = mentionSingleWord;
    const [ShowSnackMention,SetShowSnackMention] = showSnackMention;
    const [SnackMessage,SetSnackMessage] = showSnackMessage;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [Index, SetIndex] = index;
    const [Language, SetLanguage] = language;

    //const { mentionsList } = useContext(MentionContext);
    // const [mentions_to_show, SetMentions_to_show] = mentions;
    // const [WordMention, SetWordMention] = mentionSingleWord;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [Children, SetChildren] = tokens;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    //var active_mentions = new Array(mentions_to_show.length).fill(false)
    //const [Active, SetActive] = useState(active_mentions)
    const [Color, SetColor] = color
    const [Reports, SetReports] = reports;



    const onDelete_Mention = (start,stop,text) => {
        //console.log('delete mention')
        SetShowSnackMention(true)


        SetDisable_Buttons(false)
        var array_to_show = []
        var colors = Color
        var col = colors[props.id]
        //console.log('col',col)
        colors.splice(props.id,1)
        //colors.push(col)
        if(mentions_to_show.length <= colors.length){
            colors.splice(mentions_to_show.length-1, 0, col);

        }
        else{
            colors.push(col)
        }
        //console.log('colors',colors)
        var arr_to_black = fromMentionToArray(text,start)
        Children.map(child=>{
            arr_to_black.map(word=>{
                if(child.id.toString() === word.startToken.toString()){
                    child.setAttribute('class','token')
                    child.removeAttribute('style')

                }

            })
        })
        mentions_to_show.map(mention =>{
            if((mention['start'] !== start) || (mention['stop'] !== stop)){
                array_to_show.push(mention)
            }

        })
        SetMentions_to_show(array_to_show)
        SetColor(colors)

    }






    const handleHighlight = (WordsMention) =>{
        console.log('highlight56')
        SetHighlightMention(false)
        var scroll = false
        Children.map(child=>{
            WordsMention.map(word=>{
                if(child.id.toString() === word.startToken.toString()){
                    if(scroll === false && (child.style.fontWeight === 'normal' || child.style.fontWeight === '')){

                        child.scrollIntoView({ behavior: 'smooth',block: "nearest"})
                        scroll = true
                    }

                    child.style.fontWeight === 'bold' ? child.style.fontWeight = '' : child.style.fontWeight = 'bold'


                }
            })
        })
        var bottone_mention = (document.getElementsByClassName('butt_mention'))
        bottone_mention[props.id].style.fontWeight === 'bold' ? bottone_mention[props.id].style.fontWeight = '' : bottone_mention[props.id].style.fontWeight = 'bold'

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
        var chars = [',','.',':',';']
        words.map((word,index) =>{
            var apostrofo = false
            var end = start + word.length - 1
            word = word.replace(/[.,#!$%\^&\*;:{}=`~()]/g,"");
            if(word.includes("'") && Language === 'Italian'){
                apostrofo = true
                //word = word.split("'")[1]
            }
            //word = word.replace("'",' ')            // if(last === word){
            //     var last_char = word.slice(-1)
            //     if(chars.indexOf(last_char)>=0) {
            //         end = end - 1
            //         word = word.replace(last_char, '')
            //     }
            //
            // }
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



    return(

        <div>
            <Row>
                <Col md={9} className='left_list'>

                    <button style={{'text-align':'left'}} className="butt_mention" name={props.index} type="button" onClick={()=>handleHighlight(WordsMention)}>
                        {Color !== '' && WordsMention.map((word,index)=>

                            <div style={{'float':'left'}}><Token index_mention={props.id} action='mentionsList' words={WordsMention} start_token={word.startToken}
                                         stop_token={word.stopToken} word={word.word} index={index}/>&nbsp;</div>
                        )}

                    </button>

                </Col>
                {/*<Col md={1}>*/}

                {/*</Col>*/}
                <Col md={3} className='right_remove'>
                    <Button  className = "button_x_concept btn btn-link btn-lg" variant="Link" onClick={()=>onDelete_Mention(props.start,props.stop,props.text)}><FontAwesomeIcon icon={faTimesCircle} /></Button>

                </Col>
            </Row>
            {/*    <span>*/}
            {/*        <button className="butt_mention" name={props.index} type="button" onClick={()=>handleHighlight(WordsMention)}>*/}
            {/*        {Color !== '' && WordsMention.map((word,index)=>*/}

            {/*        <span><Token index_mention={props.id} action='mentionsList' words={WordsMention} start_token={word.startToken}*/}
            {/*                     stop_token={word.stopToken} word={word.word} index={index}/> </span>*/}
            {/*    )}*/}

            {/*            </button>*/}

            {/*</span>*/}

            {/*<span>*/}

            {/*<Button  className = "button_x" variant="Link" onClick={()=>onDelete_Mention(props.start,props.stop,props.text)}><FontAwesomeIcon icon={faTimesCircle} /></Button>*/}
            {/*/!*<Button  className = "button_l" variant="Link" onClick={()=>handleHighlight(WordsMention)}><FontAwesomeIcon icon={faEye} /></Button>*!/*/}

            {/*</span>*/}
        </div>
    );



}
export default Mention