from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login as auth_login,authenticate,logout as auth_logout
from django.contrib.auth.models import User as User1
from groundtruth_app.utils_ornella import *
from groundtruth_app.utils_fabio import *
from django.contrib.auth.decorators import login_required
import hashlib
from groundtruth_app.decorators import *


# ExaMode Ground Truth views here.
def index(request):
    """Home page for app (and project)"""
    username = request.session.get('username', False)
    if(username):
        context = {'username': username}
        return render(request, 'groundtruth_app/index.html', context)
    else:
        return redirect('groundtruth_app:logout')
#

def new_credentials(request):
    error_resp = {'error':'something went wrong with these options'}
    if request.method == 'POST':
        request_body_json = json.loads(request.body)
        usecase = request_body_json['usecase']
        request.session['usecase'] = usecase
        language = request_body_json['language']
        request.session['language'] = language
        institute = request_body_json['institute']
        request.session['institute'] = institute
        print('new_cred')
        json_resp ={'message':'ok'}
        return JsonResponse(json_resp)

    return JsonResponse(error_resp)

def logout(request):
    try:
        del request.session['username']
        del request.session['usecase']
        del request.session['language']
        del request.session['institute']
        request.session.flush()

        return redirect('groundtruth_app:login')
    except KeyError:
        pass

    return redirect('groundtruth_app:login')

def registration(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password')

        profile = request.POST.get('profile',None)
        if(profile is None):
            context = {'errorMessage': "Please set your profile."}
            return render(request, 'groundtruth_app/registration.html', context)

        if User.objects.filter(username = username).exists():
            context = {'errorMessage': "This username is not available. Please, choose another one."}
            return render(request, 'groundtruth_app/registration.html', context)
        try:
            with transaction.atomic():
                password = hashlib.md5(password1.encode()).hexdigest()
                user_ours = User.objects.create(username = username,profile=profile,password = password)
                print(user_ours)
                request.session['username'] = username

                return redirect('groundtruth_app:index')
        except (Exception) as error:
            print(error)
            context = {'errorMessage': "Something went wrong, probably you did not set any profile"}
            return render(request, 'groundtruth_app/registration.html', context)
    return render(request, 'groundtruth_app/registration.html')

#@login_required(login_url='/login')
def select_options(request):
    username = request.session.get('username', False)
    if(username):
        if(request.method == 'POST'):
            request_body_json = json.loads(request.body)
            usecase = request_body_json['usecase']
            language = request_body_json['language']
            institute = request_body_json['institute']
            # usecase = 'Colon'
            # language = 'English'
            # institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
            if language is not None and usecase is not None and institute is not None:
                request.session['usecase'] = usecase
                request.session['language'] = language
                request.session['institute'] = institute
                jsonresp = {'message':'ok'}
                return JsonResponse(jsonresp)
                # return redirect('groundtruth_app:index')
            else:
                context = {'errorMessage': "Something went wrong! Please try to select your options again or contact us!"}
                return render(request, 'groundtruth_app/index.html', context)
        else:
            #jsonDict = get_distinct()
            print('nada')
            context = {'username': username}
            return render(request, 'groundtruth_app/index.html',context)

    else:
        print('esco')
        return redirect('groundtruth_app:logout')

#@login_required(login_url='/login')
def credits(request):
    username = request.session.get('username', False)
    if(username):
        context = {'username': username}
        return render(request, 'groundtruth_app/index.html', context)
    else:
        return redirect('groundtruth_app:login')

#@login_required(login_url='/login')
def tutorial(request):
    username = request.session.get('username', False)
    if(username):
        context = {'username': username}
        return render(request, 'groundtruth_app/index.html', context)
    else:
        return redirect('groundtruth_app:login')

#@login_required(login_url='/login')
def about(request):
    username = request.session.get('username', False)
    if(username):
        context = {'username': username}
        return render(request, 'groundtruth_app/index.html', context)
    else:
        return redirect('groundtruth_app:login')


def login(request):
    if request.method == 'POST':
        md5_pwd = ''
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)
        if username:
            username = username.replace("\"", "").replace("'", "")
        if password:
            password = password.replace("\"", "").replace("'", "")
            md5_pwd = hashlib.md5(password.encode()).hexdigest()
        if (username != False and password != False):
            user = User.objects.filter(username = username, password = md5_pwd)
            if user.exists():
                print('LOGGATO')

                print("username: " + username)
                request.session['username'] = username

                return redirect('groundtruth_app:index')
                #return redirect('groundtruth_app:select_options')

        context = {'errorMessage': "Your username and password didn't match."}
        return render(request, 'groundtruth_app/login.html', context)

    else:
        username = request.session.get('username', False)
        print('user',username)
        if username:
            return redirect('groundtruth_app:index')

        return render(request, 'groundtruth_app/login.html')


# LABELS ANNOTATION WITH AJAX

#@login_required(login_url='/login')
def annotation(request):
    ###
    # request.session['usecase'] = 'Colon'
    # request.session['language'] = 'English'
    # request.session['institute'] = 'AOEC - Azienda Ospedaliera Cannizzaro'
    ###
    username = request.session['username']
    usecase = request.session['usecase']
    language = request.session['language']
    labels = get_labels(usecase)

    context = {'username':username,'labels':labels}
    return render(request, 'groundtruth_app/annotation1.html', context)

#@login_required(login_url='/login')
def annotationlabel(request,action=None):
    username = request.session['username']
    usecase = request.session['usecase']
    language = request.session['language']
    print('username',username)
    print('usecase',usecase)
    print('language',language)
    # username = 'ornella_irrera'
    # usecase = 'Colon'
    # language = 'English'
    #type = request.session['type']
    type = 'labels'
    labels = get_labels(usecase)
    json_response = {}

    # GET the labels annotated by the user for the report report_id
    if request.method == 'GET' and action.lower() == 'user_labels':
        # report_id = action
        report_id = request.GET.get('report_id')
        print(report_id)
        #report_id = 'd47d8d63cf3b9f4f4a51c85030ff5e2f'
        report1 = Report.objects.get(id_report = report_id,language = language)
        labels = Associate.objects.filter(username=username, id_report=report1,language = language).values('seq_number', 'label')
        json_dict = {}
        json_dict['labels'] = []

        if len(labels) > 0:
            for el in labels:
                json_val = {}
                json_val['label'] = (el['label'])
                json_val['seq_number'] = (el['seq_number'])
                json_dict['labels'].append(json_val)


        return JsonResponse(json_dict)

    elif request.method == 'GET' and action.lower() == 'all_labels':
        # report_id = action
        labels = AnnotationLabel.objects.filter(name=usecase).values('seq_number','label')
        json_dict = {}
        if len(labels) > 0:
            json_dict['labels'] = []
            for el in labels:
                json_val = {}
                json_val['label'] = (el['label'])
                json_val['seq_number'] = (el['seq_number'])
                json_dict['labels'].append(json_val)

        else:
            json_dict = {'error': 'No entries found for usecase :'+usecase+'.'}

        return JsonResponse(json_dict)


    elif request.method == 'POST' and action.lower() == 'delete':
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username)
        language = request.session['language']
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return json_response
        try:
            with transaction.atomic():
                to_del = Associate.objects.filter(username=user, id_report=report1,language = language)
                json_response = delete_all_annotation(to_del, user, report1,language, type)
                return JsonResponse(json_response)
        except (Exception) as error:
            print(error)
            json_response = {'error': 'An error occurred saving the ground_truth and the labels'}
            return JsonResponse(json_response)

    if request.method == 'POST' and action.lower() == 'insert':
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username)
        language = request.session['language']
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)
        labels_to_save = request_body_json['labels']
        if len(labels_to_save) == 0:
            rows = Associate.objects.filter(username = user, id_report = report1, language = language)
            if rows.exists():
                json_response = delete_all_annotation(rows,user,report1,language,type)
            else:
                json_response = {'message': 'Nothing to save.'}
            return JsonResponse(json_response)

        if len(labels_to_save) == 0 and Associate.objects.filter(username = user, id_report =report1,language =language).exists():
            try:
                with transaction.atomic():
                    # json_response = delete_all_mentions(user, report1, type)
                    json_response = delete_all_annotation(user, report1,language, type)
                    return JsonResponse(json_response)
            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred.'}
                return JsonResponse(json_response, status=500)

        elif len(labels_to_save) == 0 and not Associate.objects.filter(username = user, id_report =report1,language =language).exists():
                json_response = {'message':'Nothing to do'}
                return JsonResponse(json_response)

        update = True
        existing_rows = Associate.objects.filter(username = user, id_report =report1,language =language)
        if existing_rows.exists():
            if existing_rows.count() == len(labels_to_save):
                print(labels_to_save)
                lab_saved = []

                for label in labels_to_save:
                    label1 = AnnotationLabel.objects.get(name=usecase, label=label['label'], seq_number=label['seq_number'])


                    if not Associate.objects.filter(username=user, seq_number=label1.seq_number, label=label1,
                                                    id_report=report1, language=language).exists():
                        update = True
                        break
                    else:
                        update = False

        if update == True:

            try:
                with transaction.atomic():
    # Remove all the existing labels inserted by the user for that report. The existing ground truth is kept untile the deletion is successful
                    to_del = Associate.objects.filter(username=user, id_report=report1,language = language)
                    json_resp_delete = delete_all_annotation(to_del,user,report1,language,type)
                    print(json_resp_delete)

                    json_resp_labels = update_annotation_labels(labels_to_save,usecase,user,report1,language)
                    print(json_resp_labels)

                    #type = 'll'
                    jsonDict = serialize_gt(type, usecase, username, report_id,language)
                    gt = GroundTruthLogFile.objects.create(username=user, id_report=report1, language = language, gt_json=jsonDict, gt_type=type,
                                                          insertion_time=Now())
                    print('salvo gt')
                    print(gt)


            except (Exception) as error:
                print(error)
                print('rolled back')
                json_response = {'error': 'An error occurred saving the ground_truth and the labels, the transaction rolledback'}
                return JsonResponse(json_response)

            json_response = {'message': 'Labels and Ground truth saved.'}

            return JsonResponse(json_response)
        else:
            json_response = {'message':'no changes detected'}
            return JsonResponse(json_response)


#END LABELS ANNOTATION

# MENTIONS WITH AJAX


#@login_required(login_url='/login')
def mentions(request):
    username = request.session.get('username')
    if username:
        context = {'username':username}
        return render(request, 'groundtruth_app/mention1.html', context)
    else:
        json_resp = {'error':'authentication needed'}
        return JsonResponse(json_resp)

#@login_required(login_url='/login_view')
def mention_insertion(request,action=None):
    print('ENTRO MENTION IDENTIFICATION')
    # username = 'ornella_irrera'
    # language = 'English'
    # usecase = 'Colon'

    username = request.session['username']
    language = request.session['language']
    usecase = request.session['usecase']
    type = 'mentions'
    #reports = (request.session['reports'])
    json_response = {}
    if request.method == 'GET':
        report_id = request.GET.get('report_id')
        report1 = Report.objects.get(id_report=report_id,language=language)

        try:
            a = Annotate.objects.filter(username=username, id_report=report1,language = language).values('start', 'stop')
            json_dict = {}
            json_dict['mentions'] = []
            for el in a:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,language = language)

                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_dict['mentions'].append(json_val)

            return JsonResponse(json_dict)
        except (Exception) as error:
            print(error)
            json_response = {'error': 'Sorry, an erorr occurred during the GET request.'}
            return JsonResponse(json_response,status=500)

    elif request.method == 'POST' and action.lower() == 'delete':
        #report_id = request.POST.get('report_id')
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return JsonResponse(json_response,status=500)

        ass = Annotate.objects.filter(username=user, id_report=report1.id_report,language = language).values('start', 'stop')
        print(len(ass))
        if len(ass) == 0:
            json_response = {'message': 'Nothing to delete.'}
            return JsonResponse(json_response)
        try:
            with transaction.atomic():
                json_response = delete_all_mentions(user, report1,language, type,usecase)
                return JsonResponse(json_response)

        except (Exception) as error:
            print(error)
            json_response = {'error': 'An error occurred.'}
            return JsonResponse(json_response, status=500)


    elif request.method == 'POST' and action.lower() == 'insert':
        json_response = {'message':'Mentions and Ground truth saved.'}
        #report_id = request.POST.get('report_id')
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username = username)
        report1 = Report.objects.get(id_report = report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response,status=500)



        #mentions = request.POST.getlist('mentions')
        #mentions = ['{"mention_text":"Colon Tubular Adenoma","start":375,"stop":395}','{"mention_text":"Right Colon","start":501,"stop":511}']
        mentions = request_body_json['mentions']
        if len(mentions) == 0 and Annotate.objects.filter(username = user, id_report =report1,language =language).exists():
            try:
                with transaction.atomic():
                    # json_response = delete_all_mentions(user, report1, type)
                    json_response = delete_all_mentions(user, report1,language, type,usecase)
                #js = clean_mentions(user, report1, language)
                return JsonResponse(json_response)
            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred.'}
                return JsonResponse(json_response, status=500)

        elif len(mentions) == 0 and not Annotate.objects.filter(username = user, id_report =report1,language =language).exists():
                json_response = {'message':'Nothing to do'}
                return JsonResponse(json_response)

        update = True
        existing_rows = Annotate.objects.filter(username = user, id_report =report1,language =language)
        if existing_rows.exists():
            if existing_rows.count() == len(mentions):

                for ment in mentions:
                    #ment = json.loads(mention)
                    mentionDB = Mention.objects.filter(start=int(ment['start']),stop=int(ment['stop']),mention_text=ment['mention_text'],
                                                       id_report = report1,language = language)


                    if mentionDB.exists():
                        if mentionDB.count() > 1:
                            json_response = {'error': 'something is wrong in mentions!'}
                            return JsonResponse(json_response, status=500)

                        mentionDB = mentionDB.first()
                        anno = Annotate.objects.filter(username = user, id_report =report1,language =language,
                                                        start = mentionDB,stop = mentionDB.stop)
                        if anno.exists():
                            if anno.count() > 1:
                                json_response = {'error': 'something is wrong in annotations!'}
                                return JsonResponse(json_response, status=500)

                            update = False
                        else:
                            update = True
                            break
                    else: #Se anche una sola instanza ?? differente allora faccio update
                        update = True
                        break



        if update == True:
            try:
                with transaction.atomic():
                    # json_resp_delete = delete_all_mentions(user, report1,language, type, usecase)
                    # print(json_resp_delete)
                    json_response = update_mentions(mentions,report1,language,user,usecase)
                    print(json_response)
                    if GroundTruthLogFile.objects.filter(username = user, language = language, id_report = report1, gt_type = 'mentions').exists():
                        GroundTruthLogFile.objects.filter(username=user, language=language, id_report=report1,
                                                          gt_type='mentions').delete()
                    jsonDict = serialize_gt(type, usecase, username, report_id,language)
                    c = GroundTruthLogFile.objects.create(username=user, id_report=report1,language = language, gt_json=jsonDict, gt_type=type,
                                                          insertion_time=Now())
                    print('salvo gt')
            except (Exception) as error:
                print(error)
                json_response = {'error':'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response, status=500)
        else:
            json_response = {'message':'Nothing changed'}

       # print('risposta insert',json_response)
        return JsonResponse(json_response)

# END MENTIONS WITH AJAX

# CONCEPT - MENTIONS WITH AJAX
#@login_required(login_url='/login')
def link(request):
    username = request.session['username']
    concepts_diagnosis = get_list_concepts('Diagnosis')
    concepts_antaomical = get_list_concepts('Anatomical Location')
    concepts_Procedure = get_list_concepts('Procedure')
    concepts_test = get_list_concepts('Test')
    concepts_general = get_list_concepts('General Entity')
    context = {'username':username,'diagnosis_concepts':concepts_diagnosis,'location_concepts':concepts_antaomical,
               'Procedure_concepts':concepts_Procedure,'Test_concepts':concepts_test,'General_concepts':concepts_general}
    return render(request, 'groundtruth_app/linked.html', context)


def insert_link(request,action=None):
    print('ENTRO INSERT LINK')
    username = request.session['username']
    language = request.session['language']
    usecase = request.session['usecase']
    # username = 'ornella_irrera'
    # language = 'English'
    # usecase = 'Colon'
    type = 'concept-mention'

    if request.method == 'GET' and action.lower() == 'linked':
        try:
            report_id = request.GET.get('report_id')
            report1 = Report.objects.get(id_report=report_id,language = language )
            associations = Linked.objects.filter(username=username,language = language, id_report=report1.id_report).values('name','start', 'stop', 'concept_url')
            json_dict = {}
            json_dict['associations'] = []
            for el in associations:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,language =language)
                json_val = {}
                concept_name = Concept.objects.get(concept_url = el['concept_url'])
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_val['semantic_area'] = el['name']
                json_val['concept_name'] = concept_name.name.replace('\n','') #Rimuovo il replace
                json_val['concept_url'] = el['concept_url']
                json_dict['associations'].append(json_val)
            print(json_dict)
            return JsonResponse(json_dict)
        except (Exception) as error:
            print(error)
            json_response = {'error': 'An error occurred during the GET request.'}
            return JsonResponse(json_response, status=500)

    if request.method == 'GET' and action.lower() == 'mentions':
        report_id = request.GET.get('report_id')
        report1 = Report.objects.get(id_report=report_id,language = language)
        try:
            a = Annotate.objects.filter(username=username, id_report=report1, language=language).values('start', 'stop')
            json_dict = {}
            json_dict['mentions1'] = []
            for el in a:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)

                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_dict['mentions1'].append(json_val)

            return JsonResponse(json_dict)
        except (Exception) as error:
            print(error)
            json_response = {'error': 'Sorry, an erorr occurred during the GET request.'}
            return JsonResponse(json_response, status=500)

    elif request.method == 'POST' and action.lower() == 'insert_mention':
        json_response = {'message': 'Your mentions were correctly inserted'}
        user = User.objects.get(username=username)
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        print(report_id)

        mentions = request_body_json['mentions']
        report1 = Report.objects.get(id_report=report_id, language=language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)

        if len(mentions) > 0:
            try:
                with transaction.atomic():
                    mention = mentions[0]
                    m = Mention.objects.filter(start = mention['start'], stop = mention['stop'], id_report = report1, language = language)
                    if not Mention.objects.filter(start = mention['start'], stop = mention['stop'], id_report = report1, language = language).exists():
                        Mention.objects.create(start = mention['start'], stop = mention['stop'],mention_text = mention['mention_text'], id_report = report1, language = language)
                    menti = Mention.objects.get(start = mention['start'], stop = mention['stop'], id_report = report1, language = language)
                    Annotate.objects.create(username = user, insertion_time = Now(),start = menti, stop = menti.stop, id_report = report1, language = language)
                # json_response = update_mentions(mentions, report1, language, user,usecase)
                    type = 'mentions'
                    if GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                         gt_type=type).exists():
                        GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                          gt_type=type).delete()

                    jsonDict = serialize_gt(type, usecase, username, report_id, language)
                    groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                                    gt_json=jsonDict,
                                                                    gt_type=type, insertion_time=Now())
                    print('salvo gt')
                    # print(groundtruth)
                    return JsonResponse(json_response)


            except (Exception) as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response, status=500)
        else:
            json_response = {'message': 'nothing to save'}
            return JsonResponse(json_response)



    elif request.method == 'POST' and action.lower() == 'delete':
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return json_response

        to_del = Linked.objects.filter(username=user, id_report=report1.id_report,language = language)
        if len(to_del) == 0:
            json_response = {'message': 'Nothing to delete.'}
            return JsonResponse(json_response)

        try:
            with transaction.atomic():
                json_response = delete_all_associations(user, report1, language, type,usecase)
            return JsonResponse(json_response)
        except (Exception) as error:
            print(error)
            json_response = {'error': 'Sorry, an erorr occurred, rolled back.'}
            return JsonResponse(json_response,status=500)

    elif request.method == 'POST' and action.lower() == 'insert':

        json_response = {'message': 'Associations and Ground truth saved.'}
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)

        concepts = request_body_json['linked']
        #print(concepts)
        #concepts = ['{"semantic_area":"Diagnosis", "concept_url":"http://purl.obolibrary.org/obo/MONDO_0006498", "mention_text":"tubular adenoma", "start":1620, "stop":1634}',
        #'{"semantic_area":"Test", "concept_url":"http://purl.obolibrary.org/obo/MONDO_0006498", "mention_text":"moderate dysplasia.", "start":1641, "stop":1659}']

        #In this case the user manually deletes all the associations (NOT WITH CLEAR BUTTON) and saves.
        if len(concepts) == 0 and Linked.objects.filter(username=user, id_report=report1, language=language).exists():
            try:
                with transaction.atomic():
                    json_response = delete_all_associations(user, report1,language, type,usecase)
                #js = clean_mentions(user,report1,language)
                return JsonResponse(json_response)
            except (Exception) as error:
                print(error)
                json_response = {'error': 'Sorry, an erorr occurred, rolled back.'}
                return JsonResponse(json_response, status=500)

        elif len(concepts) == 0 and not Linked.objects.filter(username=user, id_report=report1, language=language).exists():
            json_response ={'message':'Nothing to do'}
            return JsonResponse(json_response)

        update = True
        existing_rows = Linked.objects.filter(username=user, id_report=report1, language=language)
        if existing_rows.exists():
            if existing_rows.count() == len(concepts):

                for concept in concepts:
                    #conc = json.loads(concept)
                    conc = concept
                    ment = Mention.objects.filter(start=conc['start'], stop=conc['stop'],
                                                       mention_text=conc['mention_text'],
                                                       id_report=report1, language=language)

                    if ment.exists():
                        ment = ment.first()
                        concept_model = Concept.objects.get(concept_url=conc['concept_url'])
                        area = SemanticArea.objects.get(name=conc['semantic_area'])
                        anno = Linked.objects.filter(username=user, id_report=report1, language=language,
                                                       start=ment, stop=ment.stop,concept_url = concept_model,name=area)
                        if anno.exists():
                            update = False
                        else:
                            update = True
                            break
                    else:
                        update = True
                        break


        if update == True:

            try:
                with transaction.atomic():
                    # json_resp_delete = delete_all_associations(user, report1,language, type,usecase)
                    # print(json_resp_delete)
                    json_response = update_associations(concepts, user, report1,language,usecase)
                    print(json_response)
                    if GroundTruthLogFile.objects.filter(username=user, language = language,id_report=report1, gt_type='concept-mention').exists():
                        obj = GroundTruthLogFile.objects.filter(username=user, language = language,id_report=report1, gt_type='concept-mention')
                        obj.delete()
                    jsonDict = serialize_gt(type, usecase, username, report_id,language)
                    groundtruth = GroundTruthLogFile.objects.create(username=user, language = language,id_report=report1, gt_json=jsonDict, gt_type=type,
                                                          insertion_time=Now())
                    print('salvo gt')
                    #print(groundtruth)

            except (Exception) as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response,status=500)
        else:
            json_response = {'message': 'Nothing changed'}



        return JsonResponse(json_response)



    elif request.method == 'POST' and action.lower() == 'update_concepts':


        user = User.objects.get(username = username)
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        report1 = Report.objects.get(id_report=report_id, language=language)
        print(report_id)
        prev_ass = Linked.objects.filter(username = user, language = language, id_report = report1)
        prev_cont = Contains.objects.filter(username = user, language = language, id_report = report1)
        prev_concepts = []
        prev_cont_concepts = []
        concepts = request_body_json['concepts']
        print(concepts)
        if len(concepts)>0:
            next_ass_concepts = []
            update = False
            try:
                with transaction.atomic():
                    for concept in concepts:
                        concept = json.loads(concept)

                        print(concept)
                        concept_db = Concept.objects.get(concept_url=concept['concept_url'])
                        area_db = SemanticArea.objects.get(name=concept['semantic_area'])
                        contains = Contains.objects.filter(username = user, language = language, id_report = report1, concept_url=concept_db,name=area_db)
                        if not contains.exists():
                            update = True
                            c = Contains.objects.create(username = user,language = language, id_report = report1, concept_url=concept_db,name=area_db,insertion_time = Now() )


                    if update == True:
                        if GroundTruthLogFile.objects.filter(username=user, id_report=report1, language=language,
                                                             gt_type='concepts').exists():
                            GroundTruthLogFile.objects.filter(username=user, id_report=report1, language = language, gt_type='concepts').delete()

                        jsonDict = serialize_gt(type, usecase, username, report_id,language)
                        groundtruth = GroundTruthLogFile.objects.create(username=user, id_report=report1, language = language, gt_json=jsonDict,
                                                                                gt_type='concepts',insertion_time=Now())
                        print('salvo gt')
                        #print(groundtruth)
                        json_response = {'message':'update successful'}
                        return JsonResponse(json_response)
                    else:
                        json_response = {'message': 'nothing to update'}
                        return JsonResponse(json_response)
            except (Exception) as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response,status=500)
        else:

            json_response = {'message': 'Empty list.'}

            return JsonResponse(json_response)


# END CONCEPT - MENTIONS WITH AJAX

#CONTAINS
#@login_required(login_url='/login')
def concepts(request):
    username = request.session.get('username',False)
    context = {'username':username}
    return render(request, 'groundtruth_app/test/test-contains.html', context)

def contains(request, action=None):
    username = request.session.get('username', False)
    language = request.session.get('language', False)
    # print("username: "+username)

    error_json = {"Error": "No user authenticated"}

    if (username):
        response_json = {}
        context = {'username': username}
        if request.method == 'GET':
            report = request.GET.get('report_id')
            report1 = Report.objects.get(id_report=report, language = language)
            user = username
            user = User.objects.get(username = username)
            response_json = get_contains_records(report=report1, language=language, user=user)
            return JsonResponse(response_json)

        elif request.method == 'POST' and action.lower() == 'insert':
            request_body_json = json.loads(request.body)
            concepts_list = request_body_json['concepts_list']
            report = request_body_json['report_id']
            report1 = Report.objects.get(id_report=report)

            username = request.session.get('username', False)
            user1 = User.objects.get(username=username)
            usecase = request.session.get('usecase',False)
            type = 'concepts'

            if report is not None and concepts_list is not None:
                user = username
                count = 0
                already_inserted_list = []
                try:
                    with transaction.atomic():
                        for concept in concepts_list:

                            concept = json.loads(concept)
                            print(concept)
                            concept_url = concept['concept_url']
                            semantic_area = concept['semantic_area']
                            if not check_concept_report_existance(report, concept_url, user, semantic_area,language):
                                # Insert a new record
                                if populate_contains_table(report, concept_url, user, semantic_area,language):
                                    count += 1
                                else:
                                    error_json = {"error message": "insert in table 'contains' failed"}
                                    return JsonResponse(error_json)
                            else:
                                already_inserted_list.append(concept)
                        jsonDict = serialize_gt(type, usecase, username, report,language)
                        groundtruth = GroundTruthLogFile.objects.create(username=user1, id_report=report1,
                                                                        language = language,
                                                                        gt_json=jsonDict,
                                                                        gt_type=type, insertion_time=Now())
                        print(groundtruth)
                except (Exception) as error:
                    print(error)
                    print('rolled back')

                if count == len(concepts_list):
                    response_json = {"message": "All concepts inserted successfully"}
                else:
                    response_json = {"message": "Some concepts have been already inserted: ["+ ", ".join(already_inserted_list)+"]"}
            else:
                response_json = {"error": "Missing data"}

        elif request.method == 'POST' and action.lower() == 'update':
            request_body_json = json.loads(request.body)
            concepts_list = request_body_json['concepts_list']
            report = request_body_json['report_id']
            report1 = Report.objects.get(id_report = report,language = language)
            username = request.session.get('username',False)
            user1 = User.objects.get(username = username)
            usecase = request.session.get('usecase',False)
            #usecase = 'Colon' #fase test
            type = 'concepts'


            if report is not None and concepts_list is not None:
                user = username
                #semantic_area = request.POST.get("semantic_area")
                count = 0




                rows = Contains.objects.filter(username = user1, id_report = report1, language = language)
                if rows.exists() and len(concepts_list) == 0:
                    with transaction.atomic():
                        json_response=delete_contains_record(report1, language, None, user, None)
                        return JsonResponse(json_response,safe=False)
                elif not rows.exists() and len(concepts_list) == 0:
                    json_response = {'message':'nothing to do'}
                    return JsonResponse(json_response)

                update = True
                if rows.exists():
                    if rows.count() == len(concepts_list):
                        for concept in concepts_list:
                            #print('concetto',concept)

                            concept_url = concept['concept_url']
                            semantic_area = concept['semantic_area']
                            concept_model = Concept.objects.get(concept_url = concept_url)
                            concepts = Contains.objects.filter(name=semantic_area, username = user1, id_report = report1, language = language, concept_url = concept_model)
                            if concepts.exists():
                                update = False
                            else:
                                update = True
                                break

# Delete previous data for the specified user and report
                if update == True:
                    try:
                        with transaction.atomic():
                            js = delete_contains_record(report1,language, None, user, None)
                            # Insert new data
                            for concept in concepts_list:
                                    # Insert a new record
                                    concept_url = concept['concept_url']
                                    semantic_area = concept['semantic_area']
                                    if populate_contains_table(report, concept_url, user, semantic_area,language):
                                        count += 1
                                    else:
                                        error_json = {"error message": "insert in table 'contains' failed"}
                                        return JsonResponse(error_json)
                            jsonDict = serialize_gt(type, usecase, username, report,language)
                            if GroundTruthLogFile.objects.filter(username=user1, id_report=report1,language = language, gt_type=type).exists():
                                GroundTruthLogFile.objects.filter(username=user1, id_report=report1, language=language,gt_type=type).delete()

                            groundtruth = GroundTruthLogFile.objects.create(username=user1, id_report=report1,
                                                                            gt_json=jsonDict,language = language,
                                                                            gt_type=type, insertion_time=Now())
                            #print(groundtruth)

                    except (Exception) as error:
                        print(error)
                        print('rolled back')

                    if count == len(concepts_list):
                        response_json = {"message": "Update successfull"}
                    else:
                        response_json = {"error": "Update unsuccessfull"}
            else:
                response_json = {"error": "Missing data"}


        elif request.method == 'POST' and action.lower() == 'delete':

            request_body_json = json.loads(request.body)
            report = request_body_json['report_id']
            report1 = Report.objects.get(id_report=report,language = language)
            username = request.session.get('username', False)
            user1 = User.objects.get(username=username)
            usecase = request.session.get('usecase',False)
            type = 'concepts'

            if report is not None and language is not None:
                response_json = delete_contains_record(report, language, None, user1, None)
            else:
                response_json = {"Error": "Missing data"}

        return JsonResponse(response_json)

    else:
        return JsonResponse(error_json)

# TEST AND OTHER FUNCTIONS
# This view allows to test the four actions a user can perform.
def test(request, table):
    username = request.session.get('username', False)
    print("username: "+username)

    error_json = {"Error": "No user authenticated"}

    if (username):
        context = {'username': username}
        if table == "contains":
            return render(request, 'groundtruth_app/test/test-contains.html', context)
        elif table == "associate":
            return render(request, 'groundtruth_app/test/test-annotation.html', context)
        elif table == "annotate":
            return render(request, 'groundtruth_app/test/test-mentions.html', context)
        elif table == 'linked':
            return render(request, 'groundtruth_app/test/test-linked.html', context)


    return JsonResponse(error_json)



# This view returns the list of reports related to a single usecase and language selected by the user.
def get_reports(request):
    # institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    # usecase = 'Colon'
    # language = 'English'
    # username = 'ornella_irrera'
    usecase = request.session.get('usecase',None)
    language = request.session.get('language',None)
    institute = request.session.get('institute',None)
    username = request.session['username']
    token = request.GET.get('configure',None)
    # usecase = 'Lung'
    # language = 'Italian'
    jsonError = {'error':'something wrong with params!'}
    if usecase is not None and language is not None and institute is not None:
        reports1 = Report.objects.filter(name = usecase, language = language, institute = institute)
        json_resp = {}
        json_resp['report'] = []
        if reports1.exists():
            reports = reports1.values('id_report','report_json')
            for report in reports:
                json_rep = {}
                json_rep['id_report'] = report['id_report']
                json_rep['report_json'] = report['report_json']
                json_resp['report'].append(json_rep)

            if token is not None:
                # usecase = 'Lung'
                # language = 'Italian'
                gt = get_last_groundtruth(username, usecase, language, institute)

            else:
                gt = get_last_groundtruth(username)

            if gt is not None:
                id_report = gt['id_report']
                use = gt['use_case']
                lang = gt['language']
                institute = gt['institute']
                report_json = Report.objects.get(id_report = id_report, name = use, language = lang, institute = institute)
                rep_json = report_json.report_json
                index = json_resp['report'].index({'id_report':id_report,'report_json':rep_json})
                print('index',str(index))
                arr1 = json_resp['report'][0:index]
                arr2 = json_resp['report'][index:]

                arr3 = arr2 + arr1


                json_resp['report'] = arr3
                print(json_resp['report'][0])

        # if json_resp['report'].length==0:
        #     json_resp['message'] = 'No reports found.'

        return JsonResponse(json_resp)
    else: return JsonResponse(jsonError,status=500)


from datetime import datetime, timezone
def get_reports_from_action(request):
    username = request.session['username']
    usecase = request.session['usecase']
    language = request.session['language']


    report_to_ret = []
    action = request.GET.get('action',None)
    user = User.objects.get(username = username)
    gt = GroundTruthLogFile.objects.filter(username = user, language = language, gt_type = action)
    if gt.exists():
        id = ''
        for element in gt:

            #print(element.insertion_time.replace(tzinfo=timezone.utc).astimezone(tz=None))
            val = (element.id_report_id,element.insertion_time.replace(tzinfo=timezone.utc).astimezone(tz=None))

            report_to_ret.append(val)


    jsonDict = {}
    jsonDict['reports_presence'] = report_to_ret
    return JsonResponse(jsonDict)



def get_last_gt(request):
    print('LAST GT')
    #
    # username = 'ornella_irrera'
    # usecase = 'Colon'
    # language = 'English'
    # institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    username = request.session['username']
    language = request.session['language']
    usecase = request.session['usecase']
    institute = request.session['institute']
    print('language123',language)
    print('usecase123',usecase)
    print('institute123',institute)
    #language = request.session['language']

    user = User.objects.get(username = username)
    jsonDict = {}
    gt_json = ''
    token = request.GET.get('configure',None)
    # msg_json = {'message':'No groundtruth associated to this user!'}
    if token is None:
        gt_json = get_last_groundtruth(username)

    else:
        # usecase = 'Lung'
        # language = 'Italian'
        gt_json = get_last_groundtruth(username,usecase,language,institute)
        print(get_last_groundtruth(username,usecase,language,institute))

    if gt_json is None:
        jsonDict['groundtruth'] = ''
        jsonDict['report'] = ''
        jsonDict['report_id'] = ''
    else:
        jsonDict['groundtruth'] = gt_json
        id_report = gt_json['id_report']
        language = gt_json['language']
        report = Report.objects.get(id_report=id_report, language=language)
        jsonDict['report'] = report.report_json
        jsonDict['report_id'] = id_report
    return JsonResponse(jsonDict)


# This view return a json response containing all the concept_urls related to a semantic_area.
from django.db import connection

def conc_view(request):
    usecase = request.session['usecase']
    #usecase = 'Colon'
    diagnosis = get_concepts_by_usecase_area(usecase, 'Diagnosis')
    anatomical = get_concepts_by_usecase_area(usecase, 'Anatomical Location')
    procedure = get_concepts_by_usecase_area(usecase, 'Procedure')
    test = get_concepts_by_usecase_area(usecase, 'Test')
    general = get_concepts_by_usecase_area(usecase, 'General Entity')

    # diagnosis = get_list_concepts('Diagnosis')
    # anatomical = get_list_concepts('Anatomical Location')
    # procedure = get_list_concepts('Procedure')
    # test = get_list_concepts('Test')
    # general = get_list_concepts('General Entity')
    jsonDict = {}
    jsonDict['Diagnosis'] = diagnosis
    jsonDict['Anatomical Location'] = anatomical
    jsonDict['Procedure'] = procedure
    jsonDict['Test'] = test
    jsonDict['General Entity'] = general
    return JsonResponse(jsonDict)

def get_semantic_area(request):
    json_dict = {}
    arr = []
    arr_sem = SemanticArea.objects.all().values('name')
    for area in arr_sem:
        arr.append(area['name'])
    json_dict['area'] = arr
    return JsonResponse(json_dict)




# This view returns the json of a specific report defined by its id and its language.
def report(request,report_id,language):
    json_resp = {}
    error_json = {'error':'the report does not exist!'}

    if Report.objects.filter(id_report = report_id, language = language).exists():
        report = Report.objects.get(id_report = report_id, language = language)
        json_resp['report_json'] = report.report_json
        # report1 = json.dumps(report.report_json)
        # json_resp['report_json'] = report1
        # print(json_resp['report_json'])
        # print(type(report1))
        return JsonResponse(json_resp['report_json'])

    return error_json


def get_report_string(request):
    count_words = 0
    report = request.GET.get('report_id')
    #report = '354e63b48b0cb3f2c8af29a1ecda1d64'
    #language = request.session['language']
    language = 'English'
    # institute = request.session['institute']
    # usecase = request.session['usecase']
    json_dict = {}
    report_json = Report.objects.get(id_report = report, language = language)
    report_json = report_json.report_json
    #convert to string
    report_string = json.dumps(report_json)
    #print(report_string)
    try:
        patient = report_json['patient']

        age = patient['hasAge']

        before_hasAge = report_string.split('hasAge')[0]
        after_hasAge = report_string.split('hasAge')[1]
        before_age = len(before_hasAge) + len('hasAge') + len(after_hasAge.split(str(age))[0])
        start_age = before_age + 1
        end_age = start_age + len(str(age)) - 1
        #print(start_age, end_age)
        age = {'text':age, 'start':start_age,'end':end_age}
        json_dict['Age'] = age
        count_words = count_words + 1
    except:
        pass

    try:
        patient = report_json['patient']

        gender = patient['hasGenderLiteral']
        before_hasGender = report_string.split('hasGenderLiteral')[0]
        after_hasGender = report_string.split('hasGenderLiteral')[1]
        before_gender = len(before_hasGender) + len('hasGenderLiteral') + len(after_hasGender.split(str(gender))[0])
        start_gender = before_gender + 1
        end_gender = start_gender + len(str(gender)) - 1
        gender = {'text': gender, 'start': start_gender, 'end': end_gender}
        json_dict['Gender'] = gender
        count_words = count_words + 1
    except:
        pass
    #print(start_gender, end_gender)
    try:
        diagnosis = report_json['hasDiagnosisText']
        before_diagnosis = report_string.split(diagnosis)[0]
        start_diagnosis = len(before_diagnosis) + 1
        end_diagnosis = start_diagnosis + len(diagnosis) -1
        diagnosis_json = {'text': diagnosis, 'start': start_diagnosis, 'end': end_diagnosis}
        json_dict['Diagnosis'] = diagnosis_json
        array_words_diag = diagnosis.split(' ')
        count_words = count_words + len(array_words_diag)
    except:
        pass
    #print(start_diagnosis,end_diagnosis)

    out = []

    try:
            outcomes = report_json['outcomes']
            index = 0
            for outcome in outcomes:
                print('OUTCOME123',outcome)
                index = index + 1
                dysplasia = ''
                interventions = ''
                type_out = ''
                location = ''
                type_json = {}
                location_json = {}

                outcome_string = json.dumps(outcome)
                before_outcome = report_string.split(outcome_string)[0] #prima di outcome interessato
                after_outcome = report_string.split(outcome_string)[1]  #dopo outcome interessato

                dysp_array = []

                try:
                    type_out = outcome['type']
                    before_type = outcome_string.split(type_out)[0]
                    start_type = len(before_outcome) + len(before_type) + 1
                    end_type = start_type + len(type_out) -1
                    type_json = {'text':type_out,'start':start_type,'end':end_type}
                    array_words_typeOut = type_out.split(' ')
                    count_words = count_words + len(array_words_typeOut)

                except:
                    pass
                try:
                    location = outcome['hasLocation']
                    before_location = outcome_string.split(location)[0]
                    start_location = len(before_outcome) + len(before_location) + 1
                    end_location = start_location + len(location) -1
                    location_json = {'text':location,'start':start_location,'end':end_location}
                    array_words_locOut = location.split(' ')
                    count_words = count_words + len(array_words_locOut)
                except:
                    pass
                try:
                    value = {}
                    dysplasia = outcome['hasDysplasia']
                    dysplasia_string = json.dumps(dysplasia)
                    before_dysplasia = outcome_string.split(dysplasia_string)[0]

                    for dysp in dysplasia:
                        before_dysp = dysplasia_string.split(dysp)[0]
                        start_dysp_el = len(before_outcome) + len(before_dysplasia) + len(before_dysp) + 1
                        end_dysp_el = start_dysp_el - 1 + len(dysp)
                        value = {'text':dysp, 'start':start_dysp_el,'end':end_dysp_el}
                        dysp_array.append(value)
                        array_words_dysp = dysp.split(' ')
                        count_words = count_words + len(array_words_dysp)



                except:
                    pass
                try:
                    interventions = outcome['interventions']
                except:
                    pass

                inter = []

                index_inter = 0
                if interventions != '':
                    topography = ''

                    inter_type = ''
                    for intervention in interventions:
                        intervention_string = json.dumps(intervention)
                        before_intervention = outcome_string.split(intervention_string)[0]
                        top = {}
                        intertype = {}
                        try:
                            topography = intervention['hasTopography']
                            before_top = intervention_string.split(topography)[0]
                            start_topog = len(before_outcome) + len(before_intervention) + len(before_top) + 1
                            end_topog = start_topog + len(topography)- 1
                            top = {'text':topography,'start':start_topog,'end':end_topog}
                            array_words_topo = topography.split(' ')
                            count_words = count_words + len(array_words_topo)
                        except:
                            pass
                        try:
                            inter_type = intervention['intervention_type']
                            before_type = intervention_string.split(inter_type)[0]
                            start_intertype = len(before_outcome) + len(before_intervention) + len(before_type) + 1
                            end_intertype = start_intertype + len(inter_type) - 1
                            intertype = {'text': inter_type, 'start': start_intertype, 'end': end_intertype}
                            array_words_inter = inter_type.split(' ')
                            count_words = count_words + len(array_words_inter)

                        except:
                            pass

                        if(inter_type != '' and topography != ''):
                            inter_single = {'Type':intertype, 'Topography':top}
                            inter.append(inter_single)
                            print(inter)
                value = {}
                if type_out != '' and location != '' and dysplasia != '' and interventions != '':
                    value = {'Type':type_json, 'Location':location_json, 'Dysplasia':dysp_array, 'Interventions':inter}
                elif type_out != '' and location != '' and interventions != '':
                    value = {'Type':type_json, 'Location':location_json, 'Interventions':inter}
                elif type_out != '' and location != '' and dysplasia != '':
                    value = {'Type':type_json, 'Location':location_json, 'Dysplasia':dysp_array}
                elif type_out != '' and location != '' :
                    value = {'Type':type_json, 'Location':location_json}
                elif type_out != '':
                    value = {'Type':type_json}
                elif location != '':
                    value = {'Location':location_json}

                out.append(value)

                json_dict['outcomes'] = out
    except:
        pass
    json_dict['final_count'] = count_words
    print(count_words)
    return JsonResponse(json_dict)

def report_start_end(request):
    count_words = 0
    report = request.GET.get('report_id')
    #report = '354e63b48b0cb3f2c8af29a1ecda1d64'
    language = request.session['language']
    #language = 'English'
    # institute = request.session['institute']
    # usecase = request.session['usecase']
    json_dict = {}
    report_json = Report.objects.get(id_report = report, language = language)
    report_json = report_json.report_json
    #convert to string
    report_string = json.dumps(report_json)
    print(report_string)
    try:
        if(report_json.get('age') is not None and report_json.get('age') != ""):
            age = report_json['age']
            before_age = report_string.split('age')[0]
            after_age = report_string.split('age')[1]
            until_age_value = len(before_age) + len('age') + len(after_age.split(str(age))[0])
            start_age = until_age_value + 1
            end_age = start_age + len(str(age)) - 1
            age = {'text':age, 'start':start_age,'end':end_age}
            json_dict['age'] = age
            #count_words = count_words + 1


        if (report_json.get('gender') is not None and report_json.get('gender') != ""):
            gender = report_json['gender']
            before_gender = report_string.split('gender')[0]
            after_gender = report_string.split('gender')[1]
            until_gender_value = len(before_gender) + len('gender') + len(after_gender.split(str(gender))[0])
            start_gender = until_gender_value + 1
            end_gender = start_gender + len(str(gender)) - 1
            gender = {'text':gender, 'start':start_gender,'end':end_gender}
            json_dict['gender'] = gender
            #count_words = count_words + 1

        if(report_json.get('raw_diagnoses') is not None and report_json.get('raw_diagnoses') != ""):
            raw_diagnosis = report_json['raw_diagnoses']
            count = raw_diagnosis.split(' ')
            before_raw_diagnosis = report_string.split('raw_diagnoses')[0]
            after_raw_diagnosis = report_string.split('raw_diagnoses')[1]
            until_raw_diagnosis_value = len(before_raw_diagnosis) + len('raw_diagnoses') + len(after_raw_diagnosis.split(str(raw_diagnosis))[0])
            start_raw_diagnosis = until_raw_diagnosis_value + 1
            end_raw_diagnosis = start_raw_diagnosis + len(str(raw_diagnosis)) - 1
            raw_diagnosis = {'text':raw_diagnosis, 'start':start_raw_diagnosis,'end':end_raw_diagnosis}
            json_dict['raw_diagnoses'] = raw_diagnosis
            #count_words = count_words + len(count)


        if(report_json.get('target_diagnosis') is not None and report_json.get('target_diagnosis') != ""):
            target_diagnosis = report_json['target_diagnosis']
            print(target_diagnosis)
            count = target_diagnosis.split(' ')
            before_target_diagnosis = report_string.split('target_diagnosis')[0]
            after_target_diagnosis = report_string.split('target_diagnosis')[1]
            until_target_diagnosis_value = len(before_target_diagnosis) + len('target_diagnosis') + len(after_target_diagnosis.split(str(target_diagnosis))[0])
            start_target_diagnosis = until_target_diagnosis_value + 1
            end_target_diagnosis = start_target_diagnosis + len(str(target_diagnosis)) - 1
            target_diagnosis = {'text':target_diagnosis, 'start':start_target_diagnosis,'end':end_target_diagnosis}
            json_dict['target_diagnosis'] = target_diagnosis
            count_words = count_words + len(count)

        if(report_json.get('report_id') is not None and report_json.get('report_id') != ""):
            report_id = report_json['report_id']
            print(report_id)
            count = report_id.split(' ')
            before_report_id = report_string.split('report_id')[0]
            after_report_id = report_string.split('report_id')[1]
            until_report_id_value = len(before_report_id) + len('report_id') + len(after_report_id.split(str(report_id))[0])
            start_report_id = until_report_id_value + 1
            end_report_id = start_report_id + len(str(report_id)) - 1
            report_id = {'text':report_id, 'start':start_report_id,'end':end_report_id}
            json_dict['report_id'] = report_id
            #count_words = count_words + len(count)


        if(report_json.get('report_id_hashed') is not None and report_json.get('report_id_hashed') != ""):
            report_id_hashed = report_json['report_id_hashed']
            print(report_id_hashed)
            count = report_id_hashed.split(' ')
            before_report_id_hashed = report_string.split('report_id_hashed')[0]
            after_report_id_hashed = report_string.split('report_id_hashed')[1]
            until_report_id_hashed_value = len(before_report_id_hashed) + len('report_id_hashed') + len(after_report_id_hashed.split(str(report_id_hashed))[0])
            start_report_id_hashed = until_report_id_hashed_value + 1
            end_report_id_hashed = start_report_id_hashed + len(str(report_id_hashed)) - 1
            report_id_hashed = {'text':report_id_hashed, 'start':start_report_id_hashed,'end':end_report_id_hashed}
            json_dict['report_id_hashed'] = report_id_hashed
            #count_words = count_words + len(count)


        if(report_json.get('internalid') is not None and report_json.get('internalid') != ""):
            internalid = report_json['internalid']
            #count = internalid.split(' ')
            before_internalid = report_string.split('internalid')[0]
            after_internalid = report_string.split('internalid')[1]
            until_internalid_value = len(before_internalid) + len('internalid') + len(after_internalid.split(str(internalid))[0])
            start_internalid = until_internalid_value + 1
            end_internalid = start_internalid + len(str(internalid)) - 1
            internalid = {'text':internalid, 'start':start_internalid,'end':end_internalid}
            json_dict['internalid'] = internalid
            #count_words = count_words + len(count)

        if(report_json.get('materials') is not None and report_json.get('materials') != ""):
            materials = report_json['materials']
            count = materials.split(' ')
            before_materials = report_string.split('materials')[0]
            after_materials = report_string.split('materials')[1]
            until_materials_value = len(before_materials) + len('materials') + len(
                after_materials.split(str(materials))[0])
            start_materials = until_materials_value + 1
            end_materials = start_materials + len(str(materials)) - 1
            materials = {'text': materials, 'start': start_materials, 'end': end_materials}
            json_dict['materials'] = materials
            count_words = count_words + len(count)

    except Exception as error:
        print(error)
        pass

    json_dict['final_count'] = count_words
    print(count_words)
    return JsonResponse(json_dict)

def get_usecase_inst_lang(request):
    jsonDict = get_distinct()


    return JsonResponse(jsonDict)





#----------------------------------------------------------------------------------------------------------


def get_reports_byID(request): #SE HO QUESTO LA GT ESISTE!!
    institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    usecase = 'Colon'
    language = 'English'
    username = 'ornella_irrera'
    id_report = request.GET.get('id_report','')

    # usecase = request.session['usecase']
    # langauge = request.session['language']
    # institute = request.session['institute']

    #username = request.session['username']

    json_resp = {}
    json_resp['report'] = []

    if(id_report != '' and language != '' and institute != '' and usecase != ''):
        reports1 = Report.objects.filter(name=usecase, language=language, institute=institute)
        if reports1.exists():
            reports = reports1.values('id_report', 'report_json')
            for report in reports:
                json_rep = {}
                json_rep['id_report'] = report['id_report']
                json_rep['report_json'] = report['report_json']
                json_resp['report'].append(json_rep)
            rep_json = Report.objects.get(id_report = id_report, name = usecase, language = language, institute = institute)
            index = json_resp['report'].index({'id_report':id_report,'report_json':rep_json.report_json})
            print('index',str(index))
            arr1 = json_resp['report'][0:index]
            arr2 = json_resp['report'][index:]

            arr3 = arr2 + arr1
            json_resp['report'] = arr3
            print(json_resp['report'][0])
    elif(id_report == '' and language != '' and institute != '' and usecase != ''):
        reports1 = Report.objects.filter(name=usecase, language=language, institute=institute)
        if reports1.exists():
            reports = reports1.values('id_report', 'report_json')
            for report in reports:
                json_rep = {}
                json_rep['id_report'] = report['id_report']
                json_rep['report_json'] = report['report_json']
                json_resp['report'].append(json_rep)



    return JsonResponse(json_resp)
    # if json_resp['report'].length==0:
    #     json_resp['message'] = 'No reports found.'

def get_last_gt_menutype(request):
    #username = request.session['username']
    username = 'ornella_irrera'
    user = User.objects.get(username = username)

    # usecase = request.session['usecase']
    # language = request.session['language']
    # institute = request.session['institute']
    institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    usecase = 'Colon'
    language = 'English'

    jsonDict = {}
    # msg_json = {'message':'No groundtruth associated to this user!'}
    if GroundTruthLogFile.objects.filter(username =user).exists():
        gt = GroundTruthLogFile.objects.filter(username = user).order_by('-insertion_time')
        for groundtruth in gt:
            gt_json = groundtruth.gt_json
            if (gt_json['use_case'] == usecase & gt_json['language'] == language & gt_json['institute'] == institute):
                jsonDict['groundtruth'] = gt_json


    else:
        jsonDict['groundtruth'] = ''


    return JsonResponse(jsonDict)

def get_reports_pure(request):
    institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    usecase = 'Colon'
    langauge = 'English'
    username = 'ornella_irrera'
    # usecase = request.session['usecase']
    # langauge = request.session['language']
    # institute = request.session['institute']
    # username = request.session['username']
    json_resp = {}
    json_resp['report'] = []
    reports1 = Report.objects.filter(name = usecase, language = langauge, institute = institute)
    if reports1.exists():
        reports = reports1.values('id_report','report_json')

        for report in reports:
            json_rep = {}
            json_rep['id_report'] = report['id_report']
            json_rep['report_json'] = report['report_json']
            json_resp['report'].append(json_rep)




    return JsonResponse(json_resp)


def get_reports_fromMenu(request):
    institute = 'AOEC - Azienda Ospedaliera Cannizzaro'
    usecase = 'Colon'
    language = 'English'
    username = 'ornella_irrera'
    # usecase = request.session['usecase']
    # langauge = request.session['language']
    # institute = request.session['institute']
    # username = request.session['username']
    reports1 = Report.objects.filter(name = usecase, language = language, institute = institute)
    json_resp = {}
    json_resp['report'] = []
    if reports1.exists():
        reports = reports1.values('id_report','report_json')
        for report in reports:
            json_rep = {}
            json_rep['id_report'] = report['id_report']
            json_rep['report_json'] = report['report_json']
            json_resp['report'].append(json_rep)
        gt = get_last_groundtruth(username,usecase,language,institute)
        if gt is not None:
            id_report = gt['id_report']
            use = gt['use_case']
            lang = gt['language']
            institute = gt['institute']
            report_json = Report.objects.get(id_report = id_report, name = use, language = lang, institute = institute)
            rep_json = report_json.report_json
            index = json_resp['report'].index({'id_report':id_report,'report_json':rep_json})
            #print('index',str(index))
            arr1 = json_resp['report'][0:index]
            arr2 = json_resp['report'][index:]

            arr3 = arr2 + arr1
            json_resp['report'] = arr3
            #print(json_resp['report'][0])

    # if json_resp['report'].length==0:
    #     json_resp['message'] = 'No reports found.'

    return JsonResponse(json_resp)
