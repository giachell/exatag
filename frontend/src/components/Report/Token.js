import React, {Component, useEffect,useRef, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from 'react-bootstrap/Overlay';
import {AppContext} from "../../App";



function Token(props){
    const { tokens,mentionSingleWord,reportString,mentionToAdd,allMentions,action,mentionsList,color,report,finalcount,reached } = useContext(AppContext);
    const [Color,SetColor] = color
    const [ReportString, SetReportString] = reportString;
    const [Action,SetAction] = action
    const [Report,SetReport] = report
    const [ShowAlert1,SetShowAlert1] = useState(false)
    const [ShowAlert2,SetShowAlert2] = useState(false)
    const [ShowAlert3,SetShowAlert3] = useState(false)
    const [FinalCount, SetFinalCount] = finalcount;
    const [Reached,SetReached] = reached;
    const [AllMentions,SetAllMentions] = allMentions
    const [mentions_to_show,SetMentions_to_show] = mentionsList
    const [MentionWordsList,SetMentionWordsList] = mentionSingleWord // questo è un array con le singole parole della mention! Nome un po' infelice
    const [ReportWords, SetReportWords] = tokens; //buttons che sono le singole parole del report
    const target = useRef(null);
    const [MentionToAdd, SetMentionToAdd] = mentionToAdd;
    const [LastWordMention, SetLastWordMention] = useState(true);
    const [LastWord, SetLastWord] = useState('');

    useEffect(()=>{ //Cambio azione e inizializzo tutto
        if(props.action === 'mentions' || props.action === 'concept-mention'){
            console.log('PASSO DI QUA, TOKENS')
            var array = Array.from(document.getElementsByName('butt'))
            //console.log('ARRARRA',array)
            array.map(child=>{
                child.removeAttribute('style')
                child.setAttribute('class','token')

            });
            // if(ReportString['final_count'] > 0){
            //     console.log(array.length)
            //     console.log(ReportString['final_count'])
            //     if(array.length === ReportString['final_count']){
            //         console.log('DATADATA')
            //         SetReached(true)
            //     }
            // }


            //console.log('ARR',array)
            SetReportWords(array)
            SetMentionWordsList('')
            SetLastWord('')

            // console.log('RISPOSTA4')
            // SetAllMentions([])
            // SetMentions_to_show([])
        }

    },[Action,Report])

    const handleVisible1 = () => {
        SetShowAlert1(true)
        setTimeout(() => {
            SetShowAlert1(false)
        }, 2000);
    }
    const handleVisible2 = () => {
        SetShowAlert2(true)
        setTimeout(() => {
            SetShowAlert2(false)
        }, 2000);
    }
    const handleVisible3 = () => {
        SetShowAlert3(true)
        setTimeout(() => {
            SetShowAlert3(false)
        }, 2000);
    }



    const handleClick = (e) => {
        e.preventDefault();
        SetLastWordMention(false)
        SetShowAlert1(false)
        SetShowAlert2(false)
        SetShowAlert3(false)
        if(Action === 'concept-mention' && document.getElementById("linked-list") !== null){
            document.getElementById("linked-list").scroll(0, 0)

        }
        if(Action === 'mentions' && document.getElementById("mentions_list") !== null){
            document.getElementById("mentions_list").scroll(0, 0)

        }
        console.log('target', ReportWords)
        console.log('target',e.target.className.toString())
        if(e.target.className.toString() === 'notSelected' ){
            SetShowAlert1(true)
            // alert('NOT ALLOWED!')
            handleVisible1();

        }
        else if(e.target.className.toString() === 'token-selected'){
            //alert('ALREADY SELECTED!')
            SetShowAlert2(true)
            handleVisible2();

        }
        else if(e.target.className.toString() === 'notSelectedMention'){
            //alert('ALREADY SELECTED!')
            SetShowAlert3(true)
            handleVisible3();

        }
        else {
            var array = []
            var obj = ''
            obj = props.start_token + ' ' + props.stop_token + ' ' + props.words[props.index].word
            //alert(obj)
            if(MentionWordsList.length===0 && document.getElementsByClassName('token-selected').length>0){
                ReportWords.map(child=>{
                    child.setAttribute('class','token')

                })
            }

            var array_words = Array.from(document.getElementsByName("butt"))
            SetReportWords(array_words)
            array_words.map((child,index) => {
                if(child.getAttribute('class') !== 'token-adj-dx' && child.getAttribute('class') !== 'token-adj-sx' && child.getAttribute('class')!== 'token-selected'&& child.getAttribute('class')!== 'notSelectedMention'){
                    child.setAttribute('class','notSelected')


                }
                if((child.id).toString() === (props.start_token).toString()){
                    if(child.getAttribute('class')==='token-adj-dx'){
                        SetMentionWordsList(prevState => [...prevState,props.words[props.index]])

                    }
                    else if(child.getAttribute('class') ==='token-adj-sx'){
                        SetMentionWordsList(prevState => [props.words[props.index],...prevState])


                    }
                    else{
                        SetMentionWordsList(prevState => [...prevState,props.words[props.index]])

                    }

                    child.setAttribute('class','token-selected')
                    child.style.cursor = 'default'


                    var brother = props.words[props.index+1]

                    if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                        if(array_words[index + 1].getAttribute('class') !==  'token-selected' && array_words[index + 1].getAttribute('class') !==  'notSelectedMention') {
                            // console.log('class_attr_next',array_words[index + 1])
                            // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                            array_words[index + 1].setAttribute('class', 'token-adj-dx')
                        }
                    }
                    if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                        if(array_words[index - 1].getAttribute('class') !==  'token-selected' && array_words[index - 1].getAttribute('class') !==  'notSelectedMention'){
                            // console.log('class_attr_prev',array_words[index - 1])
                            // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                            array_words[index - 1].setAttribute('class', 'token-adj-sx')

                         }

                    }






                }

            })
            // SetReportWords(ReportWords1)



        }
    }
    // useEffect(()=>{
    //     SetLastWord('')
    //     SetLastWordMention(false)
    //     if(mentions_to_show.length>0){
    //         mentions_to_show.map((mention)=>{
    //             var text = mention.mention_text
    //             var arraySplit = text.split(' ')
    //             //console.log('last',arraySplit.slice(-1))
    //             var lastWord = arraySplit.slice(-1)[0]
    //             var lastChar = lastWord.slice(-1)
    //             console.log('last',lastChar)
    //             const chars = [',',';','.',':']
    //             if(chars.indexOf(lastChar) !== -1){
    //                 SetLastWordMention(true)
    //                 SetLastWord(lastWord)
    //             }
    //         })
    //     //     console.log('last',last_word)
    //     //     var last_char = last_word.word.slice(- 1)
    //     //     console.log('last',last_char)
    //     //
    //     //     const chars = [',',';','.',':']
    //     //     if(chars.indexOf(last_char) !== -1){
    //     //         SetLastWordMention(false)
    //     //     }
    //      }
    //
    // },[mentions_to_show])



    {if(props.action === 'mentions' || props.action === 'concept-mention'){
        return (
        <>
            {/*<button ref={target} name = "butt" id={props.start_token} className="token" onClick={handleClick} value={props.word}><span>{props.word.slice(0,-1)}</span><span id={props.stop_token}>{props.word.slice(-1)}</span></button>*/}
            <button ref={target} name = "butt" id={props.start_token} className="token" onClick={handleClick} value={props.word}>{props.word}</button>



        <Overlay target={target.current} show={ShowAlert1} placement="top">
            {(props) => (
                <Tooltip  {...props}>
                    Not allowed
                </Tooltip>
            )}
        </Overlay>
        <Overlay target={target.current} show={ShowAlert2} placement="top">
            {(props) => (
                <Tooltip {...props}>
                    Already selected
                </Tooltip>
            )}
        </Overlay>
        <Overlay target={target.current} show={ShowAlert3} placement="top">
            {(props) => (
                <Tooltip {...props}>
                    It is a mention
                </Tooltip>
            )}
        </Overlay>
        </>

        );

    }

    else if(props.action === 'mentionsList' && Color !== ''){ //Colora nella lista a destra
        return (
            // <span id={props.start_token} style={{color: Color[props.index_mention]}}>{props.word}</span>
            <span id={props.start_token}>{props.word}</span>
        // <span id={props.start_token} style={Color[props.index_mention] === undefined ? {color: Color[props.index_mention - Color.length]} : {color: Color[props.index_mention]}}>{props.word}</span>

        );

    }

        return (
            <span id={props.start_token}>{props.word}</span>
        );
    }

}



export default Token;