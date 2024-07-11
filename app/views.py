import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render

from app.models import Task

# Create your views here.
def index(request):
    context = dict()
    tasks= Task.objects.all().order_by("done", "-time_added")
    context["tasks"] = tasks
    return render(request, "index.html", context)

def save(request):
    try:
        if(request.method == "POST" and request.headers.get("X-Requested-With", False) == "XMLHttpRequest"):
            if not request.POST["label"] or len(request.POST) < 1:
                return JsonResponse({"success": False, "message": "Input something!"})
            task = Task(label=request.POST["label"])
            task.save()
        else:
            return JsonResponse({"success": False, "message": "Something went wrong!"})
    except BaseException as e:
        print(str(e))
        return JsonResponse({"success": False, "message": "Something went wrong!"})

    else:
        return JsonResponse({"success": True, "message": "Saved!"})

@csrf_exempt
def modify(request):
    try:
        inp = json.loads(request.body.decode("utf-8"))
        print(inp)
        if(request.method == "POST" and request.headers.get("X-Requested-With", False) == "XMLHttpRequest"):
            if not inp["id"] or not isinstance(inp["id"], int) or inp["done"] not in [True, False]:
                return JsonResponse({"success": False, "message": "Something went wrong!"})
            try:
                Task.objects.filter(id=inp["id"]).update(done=inp["done"])
            except Task.DoesNotExist:
                return JsonResponse({"success": False, "message": "Task does not exist!"})

        else:
            return JsonResponse({"success": False, "message": "Something went wrong!"})
    except BaseException as e:
        print(str(e))
        return JsonResponse({"success": False, "message": "Something went wrong!"})

    else:
        return JsonResponse({"success": True, "message": "Marked as done!"})

def refresh(request):
    try:
        if(request.method == "GET" and request.headers.get("X-Requested-With", False) == "XMLHttpRequest"):
            context = dict()
            tasks_ = Task.objects.all().values().order_by("done", "-time_added")
            tasks = list()
            for t in tasks_:
                del t["time_added"]
                tasks.append(t)

        else:
            return JsonResponse({"success": False, "message": "Something went wrong!"})

    except BaseException as e:
        print(str(e))
        return JsonResponse({"success": False, "message": "Something went wrong!"})

    else:
        return JsonResponse({"success": True, "tasks": json.dumps(tasks)})

@csrf_exempt
def delete(request):
    try:
        inp = json.loads(request.body.decode("utf-8"))
        if(request.method == "POST" and request.headers.get("X-Requested-With", False) == "XMLHttpRequest"):
            if not inp["id"] or not isinstance(inp["id"], int):
                return JsonResponse({"success": False, "message": "Something went wrong!"})
            try:
                Task.objects.filter(id=inp["id"]).delete()
            except Task.DoesNotExist:
                return JsonResponse({"success": False, "message": "Task does not exist!"})

        else:
            return JsonResponse({"success": False, "message": "Something went wrong!"})
    except BaseException as e:
        print(str(e))
        return JsonResponse({"success": False, "message": "Something went wrong!"})

    else:
        return JsonResponse({"success": True, "message": "Task deleted successfully!"})
