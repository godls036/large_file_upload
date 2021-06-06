from django.shortcuts import render

# Create your views here.


def intro_view(request):

    if request.method == "GET":
        return render(request, "core/intro.html")
