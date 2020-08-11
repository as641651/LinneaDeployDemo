from linnea.web_interface import run_linnea, dependent_dimensions
from django.shortcuts import render
from django.http import JsonResponse
from .models import SResult, FResult
import pkg_resources
import json

def create_input(request):
    response_data = {}

    if request.POST.get('action') == 'post':
        description = request.POST.get('description')
        print(description)
        event = request.POST.get('event')
        print(event)
        response_data['description'] = description

        if event == 'submit':
            try:
                
                answer = run_linnea(description)
                SResult.objects.create(
                    description = description,
                    result = answer,
                    git_version = pkg_resources.get_distribution("linnea").version,
                )
                response_data['answer'] = answer
            except Exception as e:
                print(e)
                FResult.objects.create(
                    description = description,
                    result = e,
                    reason = 'Expression Error!!!',
                    git_version = pkg_resources.get_distribution("linnea").version,
                )
                response_data['answer'] = e

            response_data['git_version'] = pkg_resources.get_distribution("linnea").version
        elif event == 'keyup':
            try:
                print('hello')
                answer = dependent_dimensions(description)
                
                response_data['answer'] = str(answer)

                
                print(dependent_dimensions(description))

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