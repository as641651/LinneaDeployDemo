from linnea.web_interface import run_linnea, dependent_dimensions
from django.shortcuts import render
from django.http import JsonResponse
from .models import SResult, FResult
import pkg_resources
import json
import subprocess
import pathlib
import os
 
def execute_shell_command(cmd, work_dir):
    pipe = subprocess.Popen(cmd, shell=True, cwd=work_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    (out, error) = pipe.communicate()
    pipe.wait()
    return out
 
 
def git_rev_parse(repo_dir):    
    cmd = 'git rev-parse --verify HEAD'
    linnea_latest_commit = execute_shell_command(cmd, repo_dir)
    return linnea_latest_commit
    

def create_input(request):
    response_data = {}
    currentDirectory = os.path.dirname(os.path.realpath(__file__))
    baseDirectory = currentDirectory.split("linnea_demo_app",1)[0]
    print(baseDirectory)
    # print(git_rev_parse('/home/sinahk/Dropbox/6. Workspace/Linnea/LinneaDeployDemo/linnea'))
    # linnea_dir = '/home/sinahk/Dropbox/6. Workspace/Linnea/LinneaDeployDemo/linnea'
    linnea_dir = baseDirectory+'linnea_web'
    
    linnea_last_commit = git_rev_parse(linnea_dir)
    linnea_last_commit = linnea_last_commit[2:-3]
    #linnea_last_commit = "afd75b10321488f3e3c8721215d35090c6"
    if request.POST.get('action') == 'post':
        description = request.POST.get('description')
        print('The .la input is: ' + description)
        event = request.POST.get('event')
        print('The event type is: ' + event)
        response_data['description'] = description

        if event == 'submit':
            try:
                
                answer = run_linnea(description)
                SResult.objects.create(
                    description = description,
                    result = answer,
                    #git_version = pkg_resources.get_distribution("linnea").version,
                    git_version = linnea_last_commit,
                )
                response_data['answer'] = answer
            except Exception as e:
                print(e)
                FResult.objects.create(
                    description = description,
                    result = e,
                    reason = 'Expression Error!!!',
                    #git_version = pkg_resources.get_distribution("linnea").version,
                    git_version = linnea_last_commit,
                )
                response_data['answer'] = e

            response_data['git_version'] = pkg_resources.get_distribution("linnea").version
        elif event == 'keyup':
            try:
                answer = dependent_dimensions(description)
                
                response_data['answer'] = str(answer)

                
                print('The dimensions suggested are: ' + dependent_dimensions(description))

            except Exception as e:
            
                response_data['answer'] = e
                


        return JsonResponse(response_data)

        # return render(request, 'create_input.html', {'posts':posts})
    return render(request, 'create_input.html' )

# input1 = """
#     n = 1500
#     m = 1000

#     Matrix X(n, m) <FullRank>
#     ColumnVector y(n) <>
#     ColumnVector b(m) <>

#     b = inv(trans(X)*X)*trans(X)*y
#     """


# input2 = """
#     n = 100

#     ColumnVector y(n) <>
#     ColumnVector z(n) <>
#     Matrix S(n, n) <>
#     Matrix X(n, n) <>

#     z = (inv((trans(X) * inv(S) * X)) * trans(X) * inv(S) * y)


# """

 ########
        # Post.objects.create(
        #     description = description,
        #     answer = response_data['answer'],
        #     git_version = response_data['git_version'],
        #     )