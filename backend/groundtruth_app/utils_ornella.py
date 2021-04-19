import psycopg2
import re
import json
from groundtruth_app.models import *
#from groundtruth_app.utils import *
from django.db import transaction


# LABELS FUNCTIONS
def get_labels(usecase):
    labels1 = AnnotationLabel.objects.filter(name=usecase).values('label','seq_number')
    labels = []
    for e in labels1:
        labels.append((e['label'], e['seq_number']))
    print(labels)
    return labels


def update_annotation_labels(labels_to_save,usecase,user,report1,language):
    lab_saved = []
    json_response = {'message':'labels updated!'}

    for label in labels_to_save:
        print(label)
        label1 = AnnotationLabel.objects.get(name=usecase, label=label['label'], seq_number=label['seq_number'])
        if label1 is None:
            json_response = {
                'error': 'An error occurred accessing the database, looking for the correct annotation label.'}
            return json_response

        if not Associate.objects.filter(username = user,seq_number=label1.seq_number, label=label1,
                                         id_report=report1,language = language).exists():
            label = Associate.objects.create(username=user, seq_number=label1.seq_number, label=label1,
                                             id_report=report1,language = language, insertion_time=Now())
            print('salvato', label)
        else:
            json_response = {'message': 'Some labels were already insert in the database. This should not be possible'}
            print('this label was already inserted')

    return json_response

def delete_all_annotation(to_del,user, report1,language,type):
    a = True
    json_response = {'message':'OK,deletion done.'}
    if len(to_del) > 0:
            ass = Associate.objects.filter(username=user, id_report=report1,language = language)
            ass.delete()
            print('Labels deleted with success')
            obj = GroundTruthLogFile.objects.filter(username=user, id_report=report1, gt_type=type,language = language)
            obj.delete()
            print('GT deleted with success')

    else:
        json_response = {'message': 'Nothing to delete.'}

    return json_response

def clean_mentions(user,report1,language):
    mentions = Mention.objects.filter(id_report=report1, language=language)
    for mention in mentions:
        ann = Annotate.objects.filter(start=mention.start, stop=mention.stop, id_report=report1,
                                      language=language)
        link = Linked.objects.filter(start=mention.start, stop=mention.stop,
                                     id_report=report1, language=language)




        print(ann.count())
        print(link.count())
        if(ann.count() == 0 and link.count() == 0):
            mention.delete()
    print('Mentions deleted with success')
    json_response={'message':'mention deleted'}
    return json_response
# MENTION FUNCTIONS
def delete_all_mentions(user,report1,language,type,usecase):

    json_response = {'message':'OK,deletion done.'}
    # if len(to_del) > 0:
    ass = Annotate.objects.filter(username=user, id_report=report1,language = language).values('start','stop')
    print(len(ass))
    rem_contains = False

    for el in ass:

        mention_el = Mention.objects.get(start = el['start'],stop = el['stop'], id_report = report1,language = language)

        toDel = Annotate.objects.filter(username=user, start=mention_el.start, stop=mention_el.stop,
                                        id_report=report1,language = language)
        if(toDel.exists()):
            toDel.delete()

        toDel_Linked = Linked.objects.filter(username=user,start=mention_el.start, stop=mention_el.stop,
                                        id_report=report1,language = language)
        if toDel_Linked.exists():
            concept_obj = Concept.objects.get(concept_url = toDel_Linked.first().concept_url_id)
            area_obj = SemanticArea.objects.get(name = toDel_Linked.first().name_id)
            contains_obj = Contains.objects.filter(username = user,id_report=report1,language = language,concept_url = concept_obj,
                                               name = area_obj)
            toDel_Linked.delete()

            if contains_obj.exists():
                contains_obj.delete()
                rem_contains = True
        print(toDel)

        if(toDel.count() > 1 and toDel_Linked.count() > 1):
            json_response = {'error': 'FATAL ERROR DATABASE'}
            return json_response
        else:
            ann = Annotate.objects.filter(start=mention_el.start,stop=mention_el.stop, id_report=report1,language = language)
            link = Linked.objects.filter(start=mention_el.start, stop=mention_el.stop,
                                        id_report=report1,language = language)
            print(ann.count())
            print(link.count())
    print('Mentions deleted with success')

    if rem_contains == True:
        obj2 = GroundTruthLogFile.objects.filter(username=user, id_report=report1,language = language, gt_type='concepts')
        if obj2.exists():
            obj2.delete()
            if(Contains.objects.filter(username = user, id_report = report1,language = language).exists()):
                jsonDict = serialize_gt(type, usecase, user.username, report1.id_report, language)
                groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                                gt_json=jsonDict,
                                                                gt_type='concepts', insertion_time=Now())

    obj = GroundTruthLogFile.objects.filter(username=user, id_report=report1,language = language, gt_type=type)
    obj1 = GroundTruthLogFile.objects.filter(username=user, id_report=report1,language = language, gt_type='concept-mention')
    if obj.exists() or obj1.exists():
        if obj.exists():
            obj.delete()
            print('GT mention deleted with success')
        if obj1.exists():
            obj1.delete()
            print('GT concept-mention deleted with success')

    else:
        print('nothing to delete')

    return json_response

def update_mentions(mentions,report1,language,user,usecase):
        json_response = {'message':'Mentions and Ground truth saved'}
        print(mentions)
        var_link = False
        var_conc = False
        user_annot = Annotate.objects.filter(username = user, language = language, id_report=report1)
        for single_ann in user_annot:
            mention_cur = Mention.objects.get(start = int(single_ann.start_id),stop = int(single_ann.stop),id_report = report1,language = language)
            print(mention_cur)
            print(mentions)
            ment_deleted = True
            for mention in mentions:
                print(type(mention))
                print((mention['start']))
                print(single_ann.start_id)
                if single_ann.start_id == int(mention['start']) and single_ann.stop == int(mention['stop']):
                    ment_deleted = False

            if ment_deleted:
                annotation = Annotate.objects.filter(username = user,start = mention_cur,stop = mention_cur.stop, language = language, id_report = report1)
                if annotation.exists():
                    annotation.delete()
                link = Linked.objects.filter(username = user,start = mention_cur,stop = mention_cur.stop, language = language, id_report = report1)
                for elem in link:
                    conc = Concept.objects.get(concept_url = elem.concept_url_id)
                    area = SemanticArea.objects.get(name = elem.name_id)
                    conc_obj = Contains.objects.filter(username = user, language = language, id_report=report1,concept_url = conc,
                                                       name = area)
                    if conc_obj.exists():
                        conc_obj.delete()
                        var_conc = True

                if link.exists():
                    link.delete()
                    var_link = True

        if var_link:
            obj1 = GroundTruthLogFile.objects.filter(username=user,id_report=report1,language = language, gt_type='concept-mention')
            if obj1.exists():
                obj1.delete()
                if Linked.objects.filter(username = user, language = language, id_report = report1).exists():
                    jsonDict = serialize_gt('concept-mention', usecase, user.username, report1.id_report, language)
                    c = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                          gt_json=jsonDict, gt_type='concept-mention',
                                                          insertion_time=Now())

        if var_conc:
            obj1 = GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                     gt_type='concepts')
            if obj1.exists():
                obj1.delete()
                if Contains.objects.filter(username = user, language = language, id_report = report1).exists():
                    jsonDict = serialize_gt('concepts', usecase, user.username, report1.id_report, language)
                    c = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                          gt_json=jsonDict, gt_type='concepts',
                                                          insertion_time=Now())

        for mention in mentions:
            json_val = {}
            print(mention)

            start_char = int(mention['start'])
            end_char = int(mention['stop'])
            mention_text = mention['mention_text']
            if not Mention.objects.filter(start=start_char, stop=end_char,id_report=report1,language = language).exists():
                obj_ment = Mention.objects.create(language = language,start=start_char, stop=end_char, mention_text=mention_text, id_report=report1)
                print('created: ',obj_ment)

            obj = Mention.objects.get(start=start_char, stop=end_char,id_report=report1, language=language)
            if not Annotate.objects.filter(username=user,language = language, id_report=report1,start=obj, stop=obj.stop).exists() :
                b = Annotate.objects.create(username=user,language = language, id_report=report1,start=obj, stop=obj.stop, insertion_time=Now())
                print('saved ', b)
            else:
                json_response = {'message':'You tried to save the same element twice. This is not allowed. We saved only once.'}
                print('Some annotations previously existed! (why?) ERROR OF THE USER')


        return json_response

def check_mentions_for_linking(mentions, report1,language,user,usecase):
    json_response = {'message': 'Mentions and Ground truth saved'}
    print(mentions)
    for i in range(len(mentions)):
        json_val = {}
        mention = mentions[i]
        start_char = int(mention['start'])
        end_char = int(mention['stop'])
        mention_text = mention['mention_text']
        mention_el = Mention.objects.get(start= start_char,stop=end_char,id_report = report1,language = language)
        toDel_Linked = Linked.objects.filter(start=mention_el.start, stop=mention_el.stop,
                                             id_report=report1, language=language)
        toDel_anno = Annotate.objects.filter(start=mention_el.start, stop=mention_el.stop,
                                             id_report=report1, language=language)

        if((not toDel_anno.exists()) and toDel_anno.count() ==1 and toDel_Linked.exists() and toDel_Linked.count() == 1):
            toDel_Linked.delete()
            mention_el.delete()

            type = 'concept-mention'
            if GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                 gt_type=type).exists():
                GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                  gt_type=type).delete()

                jsonDict = serialize_gt(type, usecase, user.username, report1.id_report, language)
                groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                            gt_json=jsonDict,
                                                            gt_type=type, insertion_time=Now())
                print('salvo gt per association!')
                print(groundtruth)

        else:
            json_response = {'message':'nothing to do with associations'}


    return json_response

# LINK FUNCTIONS
def delete_all_associations(user, report1,language,type,usecase):
        json_response = {'message':'OK,deletion done.'}
        ass = Linked.objects.filter(username=user, id_report=report1,language = language)
        modifyconc = False
        for association in ass:
            concept = Concept.objects.get(concept_url = association.concept_url_id)
            semarea = SemanticArea.objects.get(name=association.name_id)
            concepts_user = Contains.objects.filter(username = user, id_report = report1,language = language, concept_url = concept,
                                                    name=semarea)
            for con in concepts_user:
                if con.concept_url == association.concept_url and con.name == association.name:
                    con.delete()
                    modifyconc = True

        if modifyconc:
            if GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                 gt_type='concepts').exists():
                GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                  gt_type='concepts').delete()
                if Contains.objects.filter(username = user, id_report = report1, language = language).exists():
                    jsonDict = serialize_gt(type, usecase, user.username, report1.id_report, language)
                    groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                                    gt_json=jsonDict, gt_type='concepts', insertion_time=Now())


        ass.delete()
        print('Labels deleted with success')
        obj = GroundTruthLogFile.objects.filter(username=user, id_report=report1, language = language,gt_type=type)
        obj.delete()
        print('GT deleted with success')
        return json_response

def update_associations(concepts,user,report1,language,usecase):

    json_response = {'message':'Associations and Ground Truth saved.'}

    modify_con = False

    user_link = Linked.objects.filter(username=user, language=language, id_report=report1)
    for single_link in user_link:
        mention_cur = Mention.objects.get(start=single_link.start_id, stop=single_link.stop, id_report=report1,
                                          language=language)
        sem_area = SemanticArea.objects.get(name=single_link.name_id)
        con = Concept.objects.get(concept_url=single_link.concept_url_id)
        concetto = Contains.objects.filter(username=user, language=language, id_report=report1,name = sem_area,concept_url=con)
        ass_deleted = True
        for concept in concepts:
            mention_con = Mention.objects.get(start=int(concept['start']), stop=int(concept['stop']), id_report=report1,
                                          language=language)
            sem_area_con = SemanticArea.objects.get(name=concept['semantic_area'])
            con_con = Concept.objects.get(concept_url=concept['concept_url'])

            if mention_con.start == mention_cur.start and mention_con.stop == mention_cur.stop and con.concept_url == con_con.concept_url and sem_area_con.name == sem_area.name:
                ass_deleted = False

        if ass_deleted:
            if concetto.exists():
                concetto.delete()
                modify_con = True

            single_link.delete()




    for concept1 in (concepts):
        #concept = json.loads(concept1)
        concept = concept1
        area = concept['semantic_area']
        concept_url = concept['concept_url']
        start_char = concept['start']
        end_char = concept['stop']


        obj = Mention.objects.get(start=start_char, stop=end_char, id_report=report1,language = language)
        print(obj)

        sem = SemanticArea.objects.get(name=area)
        concept_2 = Concept.objects.get(concept_url=concept_url)
        con = Contains.objects.filter(username = user,id_report = report1,language = language, name = sem,concept_url = concept_2)
        if not con.exists():
            modify_con = True
            Contains.objects.create(username = user,id_report = report1,language = language, name = sem, concept_url = concept_2,insertion_time=Now())

        if not Linked.objects.filter(username=user, id_report=report1, language = language, name=sem, concept_url=concept_2, start=obj, stop=obj.stop).exists():
            linkInsert = Linked.objects.create(username=user, id_report=report1,language = obj.language, insertion_time=Now(), name=sem,
                                concept_url=concept_2, start=obj, stop=obj.stop)
            print('salvato')
            print(linkInsert)
        else:
            json_response = {'message':'You tried to save the same element twice. This is not allowed. We saved it once'}
            print('the linked entry already exists!')

    if modify_con:
        if GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                             gt_type='concepts').exists():
            GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                              gt_type='concepts').delete()

        jsonDict = serialize_gt('concepts', usecase, user.username, report1.id_report, language)
        groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                        gt_json=jsonDict,
                                                        gt_type='concepts', insertion_time=Now())
        print('ok concept updated')

    return json_response

# CONTAINS
def get_list_concepts(semantic_area):
    concepts = BelongTo.objects.filter(name=semantic_area)
    conc = []
    for el in concepts:
        conc.append({'concept_name':el.concept_url.name, 'concept_url':el.concept_url.concept_url, 'semantic_area':el.name.name})
    return conc

from django.db import connection

def get_concepts_by_usecase_area(usecase,semantic_area):
    with connection.cursor() as cursor:
        cursor.execute("SELECT u.name,c.concept_url,c.name, b.name FROM concept AS c INNER JOIN concept_has_uc AS u ON c.concept_url = u.concept_url INNER JOIN belong_to AS b ON b.concept_url = c.concept_url WHERE u.name = %s AND b.name = %s", [usecase,semantic_area])
        rows = cursor.fetchall()
        conc = []
        for el in rows:
            name = el[2]
            if '\n' in el[2]:
                name = el[2].replace('\n','')
            conc.append({'concept_name': name, 'concept_url': el[1],
                         'semantic_area': el[3]})
        return conc
## END


# FUNCTIONS NEEDED
def serialize_gt(gt_type,use_case,username,id_report,language):
    user = User.objects.get(username = username)
    report1 = Report.objects.get(id_report = id_report,language = language)
    jsonDict = {}
    jsonErr = {'error': 'Errors in the creation of the ground_truth!'}
    jsonDict['username'] = username
    jsonDict['language'] = language
    jsonDict['id_report'] = id_report
    jsonDict['institute'] = report1.institute
    jsonDict['use_case'] = use_case
    jsonDict['gt_type'] = gt_type
    if gt_type == 'concept-mention':
        couples = Linked.objects.filter(username=user, id_report=report1.id_report,language = language).values('start','stop','concept_url', 'name')

        jsonDict['couples'] = []


        for el in couples:
            json_val = {}
            json_val['start'] = el['start']
            json_val['stop'] = el['stop']
            json_val['semantic_area'] = el['name']
            json_val['concept_url'] = el['concept_url']
            jsonDict['couples'].append(json_val)

        json_object = json.dumps(jsonDict)

        return jsonDict

    elif gt_type == 'concepts':
        concepts1 = Contains.objects.filter(username=user, id_report=report1,language = language).values('concept_url', 'name')
        concepts = []

        concept = {}

        areas = SemanticArea.objects.all().values('name')
        for el in areas:
            concept[el['name']] = []
        for el in concepts1:
            concepts.append((el['name'],el['concept_url']))

            name = el['name']
            concept[name].append(el['concept_url'])
        jsonDict['concepts'] = concept

        json_object = json.dumps(jsonDict)
        return jsonDict



    elif gt_type == 'labels':
        lab1 = Associate.objects.filter(username=user, id_report=report1,language = language).values('label', 'seq_number')
        lab = []
        jsonDict['labels'] = []
        for el in lab1:
            print(el['label'])
            lab.append((el['label'], el['seq_number']))

            jsonVal = {}
            jsonVal['seq_number'] = el['seq_number']
            jsonVal['label'] = el['label'].replace('\n','')
            jsonDict['labels'].append(jsonVal)
        json_object = json.dumps(jsonDict)
        return jsonDict

    elif gt_type =='mentions':
        ment = Annotate.objects.filter(username = user, id_report = report1.id_report,language = language).values('start','stop')
        mentions = []
        jsonDict['mentions'] = []

        for el in ment:

            mention_text = Mention.objects.get(start = int(el['start']),stop = int(el['stop']),id_report = report1,language = language)
            print(mention_text.mention_text)
            jsonVal = {}
            jsonVal['start'] = el['start']
            jsonVal['stop'] = el['stop']
            jsonVal['mention_text'] = mention_text.mention_text
            jsonDict['mentions'].append(jsonVal)
        json_object = json.dumps(jsonDict)

        return jsonDict
    else:
        json_object = json.dumps(jsonErr)

        return json_object

def get_report(usecase,language,institute):
    reports = Report.objects.filter(name = usecase,language = language,institute = institute).values('id_report','report_json')
    objects = []
    for report in reports:
        objects.append((report['id_report'], report['report_json']))
    return objects

def get_report_finale(usecase,language):
    reports = Report.objects.filter(name = usecase, language = language).values('id_report','report_json')
    objects = []
    for report in reports:
        objects.append((report['id_report'], report['report_json']))
    return objects


def get_last_groundtruth(username,use_case = None,language = None, institute = None):
    user = User.objects.get(username = username)
    if use_case is not None and language is not None and institute is not None:
        if GroundTruthLogFile.objects.filter(username=user).exists():
            gt = GroundTruthLogFile.objects.filter(username=user,language = language).order_by('-insertion_time')
            for groundtruth in gt:
                gt_json = groundtruth.gt_json
                if(gt_json['institute']==institute and gt_json['use_case'] == use_case and gt_json['language'] == language):
                    json_response = gt_json
                    return json_response
        else: return None


    elif GroundTruthLogFile.objects.filter(username = user).exists():
        gt = GroundTruthLogFile.objects.filter(username = user).order_by('-insertion_time')
        ground_truth = gt.first()
        json_response = ground_truth.gt_json
        return (json_response)



def get_distinct():
    jsonDict = {}
    language = Report.objects.all().distinct('language')
    languages = []
    for lang in language:
        languages.append(lang.language)
    jsonDict['language'] = languages

    institute = Report.objects.all().distinct('institute')
    institutes = []
    for inst in institute:
        institutes.append(inst.institute)
    jsonDict['institute'] = institutes

    usecase = Report.objects.all().distinct('name')
    usecases = []
    for uc in usecase:
        usecases.append(uc.name_id)
    jsonDict['usecase'] = usecases
    return jsonDict
