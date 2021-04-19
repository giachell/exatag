import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../App";
import { confirm } from '../Dialog/confirm'
import regeneratorRuntime from "regenerator-runtime";
import { useCallback } from "react";
import { debounce } from "lodash";

function NextPrevButtons(props){

    const { removedConcept,clickedCheck,conceptOption,loadingReport,reportArray,loadingReportList,loadingLabels,loadingAssociations,loadingColors,loadingConcepts,loadingMentions,report,orderVar,indexList,disButton,reportString, selectedconcepts,labelsToInsert, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    const [selectedOption, setSelectedOption] = conceptOption;

    const [associations_to_show,SetAssociations_to_show] = associations;
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const [OrderVar, SetOrderVar] = orderVar;
    const [SavedGT,SetSavedGT] = save;
    const [ReportString, SetReportString] = reportString;
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [LoadingLabels, SetLoadingLabels] = loadingLabels;
    const [LoadingConcepts, SetLoadingConcepts] = loadingConcepts;
    const [LoadingMentions, SetLoadingMentions] = loadingMentions;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [LoadingAssociations, SetLoadingAssociations] =loadingAssociations;
    const [LoadingReport, SetLoadingReport] = loadingReport;
    const [LoadingReportList, SetLoadingReportList] = loadingReportList;
    const [Action, SetAction] = action;
    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [TokenNextPrev, SetTokenNextPrev] = useState([])
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [DisNext, SetDisNext] = useState(false)
    const [SelectOptions,SetSelectOptions] = reportArray;
    const [Checks, setChecks] = checks;
    const [labels, setLabels] = labelsList;
    const [RemovedConcept,SetRemovedConcept] = removedConcept;





    useEffect(()=>{
        var arr = []
        if(Action === 'labels'){
            arr.push('annotation_next')
            arr.push('annotation_prev')
        }else if(Action === 'mentions'){
            arr.push('mentions_next')
            arr.push('mentions_prev')
        }else if(Action === 'concepts'){
            arr.push('concepts_next')
            arr.push('concepts_prev')
        }else if(Action === 'concept-mention'){
            arr.push('linked_next')
            arr.push('linked_prev')
        }else if(Action === 'none'){
            arr.push('none_next')
            arr.push('none_prev')
        }
        SetTokenNextPrev(arr)
    },[Action])

    // useEffect(()=>{
    //     console.log('dentro bottoni',Checks)
    // },[Checks])
    // useEffect(()=>{
    //     console.log('dentro bottoni',LabToInsert)
    // },[LabToInsert])
    // useEffect(()=>{
    //     console.log('clickedcheck',ClickedCheck)
    // },[ClickedCheck])

    function submit(event,token){
        event.preventDefault();
        console.log('clickedcheck',ClickedCheck)
        var but_dx = document.getElementById('but_dx')
        var but_sx = document.getElementById('but_sx')
        if(LoadingReportList === false && LoadingReport === false){

            if (token.startsWith('mentions') && LoadingMentions === false && LoadingMentionsColor === false) {
                SetWordMention('')
                Children.map(child=>{
                    if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
                        child.setAttribute('class','token')
                    }
                })
                var data_to_ret = {'mentions': mentions_to_show}
                console.log('mentions: ' ,mentions_to_show)

                axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
                    mentions: data_to_ret['mentions'],
                    report_id: Reports[Index].id_report
                })
                    .then(function (response) {

                        SetSavedGT(prevState => !prevState)
                        console.log('RISPOSTA',response);
                    })
                    .catch(function (error) {
                        //alert('ATTENTION')
                        console.log(error);
                    });

            }else if (token.startsWith('annotation') && LoadingLabels === false && ClickedCheck === true) {
                //const data = new FormData(document.getElementById("annotation-form"));
                // var toInsert = []
                // Checks.map((val,ind)=>{
                //     if(val === true){
                //         var label = ''
                //         labels.map((lab,index)=>{
                //             if(lab['seq_number'].toString() === ind.toString()){
                //                 label = lab['label']
                //             }
                //         })
                //         toInsert.push({'label':label,'seq_number':ind})
                //     }
                // })
                console.log('labtoinsert',LabToInsert)
                console.log('MODIFICATO')
                axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/insert', {
                    //labels: data.getAll('labels'),
                    // labels: LabToInsert,
                    labels: LabToInsert,
                    report_id: Reports[Index].id_report,
                })
                    .then(function (response) {
                        console.log(response);

                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        if (LabToInsert.length === 0) {
                            SetRadioChecked(false)

                        }
                        SetLabToInsert([])
                        SetSavedGT(prevState => !prevState)
                    })
                    .catch(function (error) {

                        console.log(error);
                    });

            } else if (token.startsWith('linked') && LoadingAssociations === false) {
                //const data = new FormData(document.getElementById("linked-form"));
                //var data_to_ret = {'linked': data.getAll('linked')}


                data_to_ret = {'linked': associations_to_show}
                if (data_to_ret['linked'].length >= 0) {
                    axios.post('http://examode.dei.unipd.it/exatag/insert_link/insert', {
                        linked: data_to_ret['linked'],
                        report_id: Reports[Index].id_report
                    })
                        .then(function (response) {
                            console.log(response);
                            // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                            SetWordMention('')
                            console.log('aggiornato concepts');

                            SetSavedGT(prevState => !prevState)
                        })
                        .catch(function (error) {

                            console.log(error);
                        });
                }
            } else if (token.startsWith('concepts') && LoadingConcepts === false && (selectedOption !== '' || RemovedConcept === true)) {
                console.log(selectedConcepts);

                let concepts_list = []
                let sem_areas = ["Anatomical Location", "Diagnosis", "General Entity", "Procedure", "Test"]

                for (let area of sem_areas) {
                    for (let concept of selectedConcepts[area]) {
                        concepts_list.push(concept);
                    }
                }

                console.log(concepts_list);

                axios.post('http://examode.dei.unipd.it/exatag/contains/update', {
                        concepts_list: concepts_list,
                        report_id: Reports[Index].id_report,
                    },
                )
                    .then(function (response) {
                        console.log(response);
                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetSavedGT(prevState => !prevState)

                    })
                    .catch(function (error) {

                        console.log(error);
                    });
            }


            if (token.endsWith('_prev')) {
                getPrev()
            } else if (token.endsWith('_next')) {
                getNext()

            }
        }

    }

    const getNext = () => {
        if(OrderVar === 'lexic'){
            var a = Index
            if (Index === Reports.length - 1) {
                a = 0
                setIndex(0)
            } else {
                setIndex(a + 1)
                a = a + 1
            }
            // console.log('A', a + 1)
            // console.log(Index)
            setReport(Reports[a])
            console.log('report',Reports[Index])
            console.log('report',Reports[a])
        }
        else if(OrderVar === 'annotation'){
            var actual_report = AnnotatedIndexList.indexOf(Index)
            if (actual_report === Reports.length - 1) {
                setIndex(AnnotatedIndexList[0])
                a = AnnotatedIndexList[0]

            } else {
                setIndex(AnnotatedIndexList[actual_report+1])
                a = AnnotatedIndexList[actual_report+1]
            }
            setReport(Reports[a])
            console.log('report_ann',Reports[Index])
            console.log('report_ann',Reports[a])
        }


    }

    const getPrev = () => {
        console.log(Index)
        // submit(event,'annotation')
        if(OrderVar === 'lexic'){
            var a = Index
            if (Index === 0) {
                a = Reports.length
                setIndex(a - 1)
                a = a -1
            } else {
                setIndex(a - 1)
                a = a -1
            }
            setReport(Reports[a])
            // console.log('report',Reports[Index])
            console.log('report',Reports[a])
        }

        else if(OrderVar === 'annotation'){
            var actual_report = AnnotatedIndexList.indexOf(Index)
            if (actual_report === 0) {
                setIndex(AnnotatedIndexList.slice(-1)[0])
                a = AnnotatedIndexList.slice(-1)[0]

            } else {
                setIndex(AnnotatedIndexList[actual_report-1])
                a = AnnotatedIndexList[actual_report-1]
            }
            setReport(Reports[a])
            // console.log('report_ann',Reports[Index])
            console.log('report_ann',Reports[a])
        }

    }

    // useEffect(()=>{
    //     if(Action === 'none'){
    //         SetDisNext(true)
    //     }
    //     else{
    //         SetDisNext(false)
    //     }
    // },[Action])

    useEffect(()=>{

        console.log('bottone dis',DisNext)
    },[DisNext])

    useEffect(() => {
        window.addEventListener('keydown', keyPress);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', keyPress);
        };
    }, [LabToInsert,ClickedCheck,mentions_to_show,selectedConcepts,associations_to_show,SelectOptions,RemovedConcept])

    function keyPress(e){
        // if(token === 'left'){
        if(e.keyCode === 39){
            console.log('destra',TokenNextPrev[0])
            submit(e,TokenNextPrev[0])
            // onSubDx(e)
        }

    // }
    // else if(token === 'right'){
        if(e.keyCode === 37){
            console.log('destra2',TokenNextPrev[1])
            // onSubSx(e)
            submit(e,TokenNextPrev[1])
        }
        // }

    }
    return(

            <span  className='two_buttons_div_rep'>

                        <Button id='but_dx'  size='sm' className="btn prevbtn" type="submit" onClick={(e)=>submit(e,TokenNextPrev[1])} name = "prev"  variant="info"><FontAwesomeIcon icon={faChevronLeft} /></Button>&nbsp;&nbsp;
                {/*<Button  size='sm' className="btn prevbtn" type="submit" onClick={(e)=>onSubSx(e)} name = "prev"  variant="info"><FontAwesomeIcon icon={faChevronLeft} /></Button>&nbsp;&nbsp;*/}
                {/*<Button  size='sm' className="btn nextbtn"  type="submit" onClick={(e)=>onSubDx(e)}  name = "next"  variant="info"><FontAwesomeIcon icon={faChevronRight} /></Button>*/}
                        <Button id='but_sx'  size='sm' className="btn nextbtn"  type="submit" onClick={(e)=>submit(e,TokenNextPrev[0])}  name = "next"  variant="info"><FontAwesomeIcon icon={faChevronRight} /></Button>
            </span>

    );
}


export default NextPrevButtons
// const handlerDx = useCallback(debounce(submitDx, 1000), [labels_to_show,mentions_to_show,associations_to_show,selectedConcepts]);
// const handlerSx = useCallback(debounce(submitSx, 1000), [Labe,mentions_to_show,associations_to_show,selectedConcepts]);
// //
// const onSubDx = (e) =>{
//     e.preventDefault()
//     handlerDx()
// }
// const onSubSx = (e) =>{
//     e.preventDefault()
//     handlerSx()
// }
// function submitSx(){
//     //event.preventDefault();
//     // if(Saved === false){
//     //     SetSaved(true)
//
//     if (Action === 'mentions') {
//         SetWordMention('')
//         Children.map(child=>{
//             if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
//                 child.setAttribute('class','token')
//             }
//         })
//         var data_to_ret = {'mentions': mentions_to_show}
//         console.log('mentions: ' ,mentions_to_show)
//
//         axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
//             mentions: data_to_ret['mentions'],
//             report_id: Reports[Index].id_report
//         })
//             .then(function (response) {
//
//                 SetSavedGT(prevState => !prevState)
//                 console.log('RISPOSTA',response);
//             })
//             .catch(function (error) {
//                 //alert('ATTENTION')
//                 console.log(error);
//             });
//
//     }else if (Action === 'labels') {
//         //const data = new FormData(document.getElementById("annotation-form"));
//         console.log('labtoinsert',LabToInsert)
//         axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/insert', {
//             //labels: data.getAll('labels'),
//             labels: LabToInsert,
//             report_id: Reports[Index].id_report,
//         })
//             .then(function (response) {
//                 console.log(response);
//
//                 // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                 if (LabToInsert.length === 0) {
//                     SetRadioChecked(false)
//
//                 }
//                 SetLabToInsert([])
//                 SetSavedGT(prevState => !prevState)
//             })
//             .catch(function (error) {
//
//                 console.log(error);
//             });
//
//     } else if (Action === 'concept-mention') {
//         //const data = new FormData(document.getElementById("linked-form"));
//         //var data_to_ret = {'linked': data.getAll('linked')}
//
//
//         data_to_ret = {'linked': associations_to_show}
//         if (data_to_ret['linked'].length >= 0) {
//             axios.post('http://examode.dei.unipd.it/exatag/insert_link/insert', {
//                 linked: data_to_ret['linked'],
//                 report_id: Reports[Index].id_report
//             })
//                 .then(function (response) {
//                     console.log(response);
//                     // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                     SetWordMention('')
//                     console.log('aggiornato concepts');
//
//                     SetSavedGT(prevState => !prevState)
//                 })
//                 .catch(function (error) {
//
//                     console.log(error);
//                 });
//         }
//     } else if (Action === 'concepts') {
//         console.log(selectedConcepts);
//
//         let concepts_list = []
//         let sem_areas = ["Anatomical Location", "Diagnosis", "General Entity", "Procedure", "Test"]
//
//         for (let area of sem_areas) {
//             for (let concept of selectedConcepts[area]) {
//                 concepts_list.push(concept);
//             }
//         }
//
//         console.log(concepts_list);
//
//         axios.post('http://examode.dei.unipd.it/exatag/contains/update', {
//                 concepts_list: concepts_list,
//                 report_id: Reports[Index].id_report,
//             },
//         )
//             .then(function (response) {
//                 console.log(response);
//                 // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                 SetSavedGT(prevState => !prevState)
//
//             })
//             .catch(function (error) {
//
//                 console.log(error);
//             });
//     }
//
//     getPrev()
//     // if (token.endsWith('_prev')) {
//     //     getPrev()
//     // } else if (token.endsWith('_next')) {
//     //     getNext()
//     //
//     // }
//
// }
// function submitDx(){
//     //event.preventDefault();
//     // if(Saved === false){
//     //     SetSaved(true)
//
//     if (Action === 'mentions') {
//         SetWordMention('')
//         Children.map(child=>{
//             if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
//                 child.setAttribute('class','token')
//             }
//         })
//         var data_to_ret = {'mentions': mentions_to_show}
//         console.log('mentions: ' ,mentions_to_show)
//
//         axios.post('http://examode.dei.unipd.it/exatag/mention_insertion/insert', {
//             mentions: data_to_ret['mentions'],
//             report_id: Reports[Index].id_report
//         })
//             .then(function (response) {
//
//                 SetSavedGT(prevState => !prevState)
//                 console.log('RISPOSTA',response);
//             })
//             .catch(function (error) {
//                 //alert('ATTENTION')
//                 console.log(error);
//             });
//
//     }else if (Action === 'labels') {
//         //const data = new FormData(document.getElementById("annotation-form"));
//         console.log('labtoinsert',LabToInsert)
//         axios.post('http://examode.dei.unipd.it/exatag/annotationlabel/insert', {
//             //labels: data.getAll('labels'),
//             labels: LabToInsert,
//             report_id: Reports[Index].id_report,
//         })
//             .then(function (response) {
//                 console.log(response);
//
//                 // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                 if (LabToInsert.length === 0) {
//                     SetRadioChecked(false)
//
//                 }
//                 SetLabToInsert([])
//                 SetSavedGT(prevState => !prevState)
//             })
//             .catch(function (error) {
//
//                 console.log(error);
//             });
//
//     } else if (Action === 'concept-mention') {
//         //const data = new FormData(document.getElementById("linked-form"));
//         //var data_to_ret = {'linked': data.getAll('linked')}
//
//
//         data_to_ret = {'linked': associations_to_show}
//         if (data_to_ret['linked'].length >= 0) {
//             axios.post('http://examode.dei.unipd.it/exatag/insert_link/insert', {
//                 linked: data_to_ret['linked'],
//                 report_id: Reports[Index].id_report
//             })
//                 .then(function (response) {
//                     console.log(response);
//                     // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                     SetWordMention('')
//                     console.log('aggiornato concepts');
//
//                     SetSavedGT(prevState => !prevState)
//                 })
//                 .catch(function (error) {
//
//                     console.log(error);
//                 });
//         }
//     } else if (Action === 'concepts') {
//         console.log(selectedConcepts);
//
//         let concepts_list = []
//         let sem_areas = ["Anatomical Location", "Diagnosis", "General Entity", "Procedure", "Test"]
//
//         for (let area of sem_areas) {
//             for (let concept of selectedConcepts[area]) {
//                 concepts_list.push(concept);
//             }
//         }
//
//         console.log(concepts_list);
//
//         axios.post('http://examode.dei.unipd.it/exatag/contains/update', {
//                 concepts_list: concepts_list,
//                 report_id: Reports[Index].id_report,
//             },
//         )
//             .then(function (response) {
//                 console.log(response);
//                 // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
//                 SetSavedGT(prevState => !prevState)
//
//             })
//             .catch(function (error) {
//
//                 console.log(error);
//             });
//     }
//
//     getNext()
//     // if (token.endsWith('_prev')) {
//     //     getPrev()
//     // } else if (token.endsWith('_next')) {
//     //     getNext()
//     //
//     // }
//
// }