""" Define URLs pattern for groundtruth_app """
from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import views as auth_views


app_name='groundtruth_app'
urlpatterns = [

    path('', views.login, name='login'),
    path('index', views.index, name='index'),
    path('login', views.login, name='login'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('about', views.about, name='about'),
    path('credits', views.credits, name='credits'),
    path('registration', views.registration, name='registration'),
    path('logout', views.logout, name='logout'),
    path('get_report_string', views.get_report_string, name='get_report_string'),
    path('select_options', views.select_options, name='select_options'),

    path('mentions', views.mentions, name='mentions'),
    path('mention_insertion/<slug:action>', views.mention_insertion, name='mention_insertion'),
    path('mention_insertion', views.mention_insertion, name='mention_insertion'),

    path('annotation', views.annotation, name='annotation'),
    path('annotationlabel/<slug:action>', views.annotationlabel, name='annotationlabel'),
    path('annotationlabel', views.annotationlabel, name='annotationlabel'),

    path('link', views.link, name='link'),
    path('insert_link/<slug:action>', views.insert_link, name='insert_link'),

    path('get_reports', views.get_reports, name='get_reports'),
    path('new_credentials', views.new_credentials, name='new_credentials'),
    path('get_usecase_inst_lang', views.get_usecase_inst_lang, name='get_usecase_inst_lang'),
    path('report_start_end', views.report_start_end, name='report_start_end'),
    path('get_reports_from_action', views.get_reports_from_action, name='get_reports_from_action'),
    path('get_reports_byID', views.get_reports_byID, name='get_reports_byID'),
    path('get_reports_pure', views.get_reports_pure, name='get_reports_pure'),
    path('report/<report_id>/<language>', views.report, name='report'),

    path('contains', views.contains, name='contains'),
    path('contains/<slug:action>', views.contains, name='contains'),
    path('test/<slug:table>', views.test, name='test'),


    path('conc_view',views.conc_view,name='conc_view'),
    path('get_semantic_area',views.get_semantic_area,name='get_semantic_area'),
    path('get_last_gt', views.get_last_gt, name='get_last_gt'),
    path('get_last_gt_menutype', views.get_last_gt_menutype, name='get_last_gt_menutype'),

]


