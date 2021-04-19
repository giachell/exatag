import psycopg2
import re
import json
from groundtruth_app.models import *

def get_labels1():
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="ornella",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")

        cursor = connection.cursor()
        query = ("SELECT label,seq_number FROM annotation_label WHERE name = 'Colon';")
        cursor.execute(query)
        ans = cursor.fetchall()
        labels = []
        for el in ans:
            labels.append(el)
        return labels


    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
    # closing database connection.
        if (connection):
            cursor.close()
            connection.close()



def get_report1(usecase):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")

        cursor = connection.cursor()
        query = ("SELECT id_report,report_json FROM report WHERE name = %s;")
        cursor.execute(query,(usecase,))
        ans = cursor.fetchall()
        return ans[0:]


    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        # closing database connection.
        if (connection):
            cursor.close()
            connection.close()



def get_labels(usecase):
    labels1 = AnnotationLabel.objects.filter(name=usecase).values('label','seq_number')
    labels = []
    for e in labels1:

        labels.append((e['label'], e['seq_number']))
    return labels
def get_report(usecase):
    reports = Report.objects.filter(name = usecase).values('id_report','report_json')
    objects = []
    for report in reports:
        objects.append((report['id_report'], report['report_json']))
    return objects

def insert_associate(username,seq_number, label,report_id):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")

        cursor = connection.cursor()
        query = ("INSERT INTO associate (username, id_report, seq_number, label, insertion_time)VALUES(%s,%s,%s,%s,now());")
        values = (username, report_id, seq_number, label)
        try:
            cursor.execute(query,values)
        except psycopg2.IntegrityError:
            connection.rollback()
        else:
            connection.commit()

        return True

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return False
    finally:
    # closing database connection.
        if (connection):
            cursor.close()
            connection.close()

def insert_in_logfiles(jsonDict, gt_type, username, report_id):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")
        cursor = connection.cursor()
        query1 = ("SELECT id_report, username, gt_type FROM ground_truth_log_file WHERE id_report = %s AND username = %s AND gt_type = %s;")
        values1 = (report_id,username,gt_type)
        cursor.execute(query1,values1)
        result = cursor.fetchall()
        if len(result) > 0:
            query2 = ("UPDATE ground_truth_log_file SET gt_json = %s, insertion_time = now() WHERE username = %s AND id_report = %s AND gt_type = %s; ")
            values2 = (jsonDict,username,report_id,gt_type)
            cursor.execute(query2,values2)
            connection.commit()

        else:
            query = ("INSERT INTO ground_truth_log_file (username, id_report, gt_json, gt_type, insertion_time)VALUES(%s,%s,%s,%s,now());")
            values = (username, report_id, jsonDict, gt_type)
            cursor.execute(query,values)
            connection.commit()

        return True

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return False
    finally:
        # closing database connection.
        if (connection):
            cursor.close()
            connection.close()

def get_already_ann1(username,report_id):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")
        cursor = connection.cursor()
        query = ("SELECT label,seq_number FROM associate WHERE username = %s AND id_report = %s; ")
        values = (username, report_id)
        cursor.execute(query,values)
        ans = cursor.fetchall()
        print(ans)
        ret = []
        for el in ans:
            ret.append((el[0],el[1]))
        return ret



    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
    # closing database connection.
        if (connection):
            cursor.close()
            connection.close()





def serialize_gt(gt_type,use_case,username,id_report):
    user = User.objects.get(username = username)
    report1 = Report.objects.get(id_report = id_report)
    jsonDict = {}
    jsonErr = {'error': 'Errors in the creation of the ground_truth!'}
    jsonDict['username'] = username
    jsonDict['id_report'] = id_report
    jsonDict['use_case'] = use_case
    jsonDict['gt_type'] = gt_type
    if gt_type == 'concept-mention':
        couples = Linked.objects.filter(username=user, id_report=report1.id_report).values('start','stop','concept_url', 'name')

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
        concepts1 = Contains.objects.filter(username=user, id_report=report1).values('concept_url', 'name')
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
        lab1 = Associate.objects.filter(username=user, id_report=report1).values('label', 'seq_number')
        lab = []
        jsonDict ={}
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
        ment = Annotate.objects.filter(username = user, id_report = report1.id_report).values('start','stop')
        mentions = []
        jsonDict['mentions'] = []

        for el in ment:

            mention_text = Mention.objects.get(start = int(el['start']),stop = int(el['stop']),id_report = report1)
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


def get_one_report(report_id):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")

        cursor = connection.cursor()
        query = ("SELECT report_json FROM report WHERE name = 'Colon' AND id_report = %s;")
        values = (report_id,)
        cursor.execute(query,values)
        ans = cursor.fetchone()
        print(ans)
        return ans[0]


    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        # closing database connection.
        if (connection):
            cursor.close()
            connection.close()

def show_last(username, gt_type):
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="postgres",
                                      host="localhost",
                                      port="5432",
                                      database="ground_truth")

        cursor = connection.cursor()
        query = ("SELECT gt_json FROM ground_truth_log_file WHERE username = %s AND gt_type = %s ORDER BY insertion_time DESC;")
        values = ( username, gt_type)
        cursor.execute(query,values)
        ans = cursor.fetchone()
        print(ans[0])
        return ans[0]


    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
    # closing database connection.
        if (connection):
            cursor.close()
            connection.close()


def prove():
    ss = Concept.objects.values_list('concpet_url', flat=True)
    print(ss)



def get_last_gt(username,type):
    gt = GroundTruthLogFile.objects.filter(username = username,gt_type = type).values('id_report','gt_json').order_by('-insertion_time')
    gt = gt.first()
    tup = (gt['id_report'], gt['gt_json'])
    return tup


def get_general_info(reports,report_id):

    reps = dict(reports)
    report = reps.get(report_id)
    index = reports.index([report_id,report])
    prev_index = index
    next_index = index
    try:
        next_rep_id = reports[next_index+1][0]
    except:
        next_rep_id = reports[0][0]

    try:
        prev_rep_id = reports[prev_index-1][0]
    except:
        prev_rep_id = reports[len(reports)-1][0]

    return next_rep_id,prev_rep_id,report
