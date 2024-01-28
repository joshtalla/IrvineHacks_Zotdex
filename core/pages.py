from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.db import transaction
from django.core.exceptions import MultipleObjectsReturned
import requests, hashlib, random, datetime, io, os
from PIL import Image

from . import validators
from . import models
from zotdex import settings

RANKING_PAGE_SIZE = 10
MAX_CAPTURE_UPLOAD_BYTES = 5000000
ALLOW_USER_DEX_ENTRIES = True

def status_response(status = True, message = None):
    data = {"status": status}
    if message is not None:
        data["message"] = message
    return JsonResponse(data)

def sha256(data):
    device = hashlib.sha256()
    device.update(data.encode("utf-8"))
    return device.hexdigest()

def relay_photo_id(file_stream, lat = None, lon = None):
    headers = {"Api-Key": "SOmxl60bwbjppkGGbHlwzPlkNFpX2tkOvzfxZiwmtfXN6WrsdO"}
    data = {}
    if lat is not None:
        data["lat"] = lat
    if lon is not None:
        data["lon"] = lon
    resp = requests.post(
        "https://plant.id/api/v3/identification",
        data = data,
        headers = headers,
        files = {"images": file_stream}
    )
    return resp.json()

def level_point_threshold(level):
    return level * 100

def root(req):
    if validators.is_user(req):
        return redirect("/profile")
    else:
        return redirect("/login")

def login(req):
    if validators.is_user(req):
        return redirect("/profile")
    else:
        return render(req, "login.html")

def logout(req):
    if "user" in req.session:
        del req.session["user"]
    return redirect("/login")

def profile(req):
    if validators.is_user(req):
        return render(req, "main.html")
    else:
        return redirect("/login")

def leaderboard(req):
    if validators.is_user(req):
        return render(req, "leaderboard.html")
    else:
        return redirect("/login")

def api_login(req):
    if not all([
        validators.is_post(req),
        validators.is_not_user(req),
        validators.matched_params(req, ["name", "password"])
    ]):
        return HttpResponseBadRequest()
    
    try:
        query = models.User.objects.get(
            name = req.POST["name"],
            password = sha256(req.POST["password"])
        )
        req.session["user"] = query.uid
        return status_response(True)
    except:
        return status_response(False)

def api_register(req):
    if not all([
        validators.is_post(req),
        validators.is_not_user(req),
        validators.matched_params(req, ["name", "password"])
    ]):
        return HttpResponseBadRequest()
    
    try:
        query = models.User.objects.get(name = req.POST["name"])
        return status_response(False)
    except MultipleObjectsReturned:
        return status_response(False)
    except:
        new_user = models.User.objects.create(name = req.POST["name"], profile_name = req.POST["name"], password = sha256(req.POST["password"]))
        req.session["user"] = new_user.uid
        return status_response(True)

def api_capture_condition(score):
    return True #TODO MUST REMOVE
    if score < 0.4:
        return False
    else:
        return random.random() < (25 / 9) * (score - 0.4) ** 2

def api_capture(req):
    if not all([
        validators.is_post(req),
        validators.is_user(req),
        validators.matched_params(req, [], ["lat", "lon"]),
    ]) or "file" not in req.FILES:
        return HttpResponseBadRequest()
    
    if req.FILES["file"].size > MAX_CAPTURE_UPLOAD_BYTES:
        return status_response(False, "File size exceeds 5MB")
    
    with transaction.atomic():
        try:
            binary = req.FILES["file"].read()
            relay_response = relay_photo_id(io.BytesIO(binary), req.POST["lat"] if "lat" in req.POST else None, req.POST["lon"] if "lon" in req.POST else None)
            relay_source_name = relay_response["result"]["classification"]["suggestions"][0]["name"].lower().replace(" ", "")
            relay_score = float(relay_response["result"]["classification"]["suggestions"][0]["probability"])
            query = models.Harvest.objects.get(source_name = relay_source_name)
            try:
                user_query = models.User.objects.get(uid = req.session["user"])
                if query.hid in user_query.ownership_rankings:
                    return JsonResponse({"status": True, "captured": True, "result": "duplicate", "dex": query.hid})
                else:
                    if api_capture_condition(relay_score):
                        user_query.ownership_rankings[query.hid] = {"ranking": query.ranking_top + 1, "timestamp": datetime.datetime.utcnow().timestamp()}
                        user_query.ownership_count += 1
                        user_query.last_activity_capture = datetime.datetime.utcnow()
                        query.ranking_top += 1
                        user_query.save()
                        query.save()
                        return JsonResponse({"status": True, "captured": True, "result": "success", "dex": query.hid, "ranking": user_query.ownership_rankings[query.hid]})
                    else:
                        return JsonResponse({"status": True, "captured": False, "result": "rejected"})
            except:
                return status_response(False, "Database error")
        except UnicodeDecodeError:
            return status_response(False, "File encoding error")
        except models.Harvest.DoesNotExist:
            if api_capture_condition(relay_score):
                with transaction.atomic():
                    try:
                        constant_query = models.IntConstant.objects.get(key = "external_index")
                        user_query = models.User.objects.get(uid = req.session["user"])
                        relay_name = relay_response["result"]["classification"]["suggestions"][0]["name"]
                        hash_dev = hashlib.sha256()
                        hash_dev.update(binary)
                        hash_id = hash_dev.hexdigest()
                        image = Image.open(io.BytesIO(binary))
                        image = image.convert("RGB")
                        if image.width > image.height:
                            side = (image.width - image.height) // 2
                            image = image.crop((side, 0, side + image.height, image.height))
                        else:
                            side = (image.height - image.width) // 2
                            image = image.crop((0, side, image.width, side + image.width))
                        image.thumbnail((500, 500))
                        image.save(os.path.join(os.path.join(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static"), "images"), hash_id + ".jpg"))
                        models.Harvest.objects.create(
                            hid = constant_query.value,
                            name = relay_name,
                            source_name = relay_source_name,
                            detail = "",
                            picture = hash_id,
                            grade = models.Harvest.Grade.EXTERNAL,
                            ranking_top = 1
                        )
                        user_query.ownership_rankings[constant_query.value] = {"ranking": 1, "timestamp": datetime.datetime.utcnow().timestamp()}
                        user_query.ownership_count += 1
                        user_query.last_activity_capture = datetime.datetime.utcnow()
                        user_query.save()
                        response = {"status": True, "captured": True, "result": "success", "dex": constant_query.value, "ranking": 1}
                        constant_query.value += 1
                        constant_query.save()
                        return JsonResponse(response)
                    except:
                        return status_response(False, "Database error")
            else:
                return status_response({"status": True, "captured": False, "result": "rejected/external"})
        except:
            return status_response(False, "Identification failed")

def api_dex(req):
    if not all([
        validators.is_post(req),
        validators.is_user(req),
        validators.matched_params(req, [], ["user"])
    ]):
        return HttpResponseBadRequest()
    
    try:
        query = models.Harvest.objects.all()
        user_query = models.User.objects.get(uid = req.session["user"] if "user" not in req.POST else req.POST["user"])
        user_rankings = user_query.ownership_rankings
        compiled_dex = []
        for each in query:
            if str(each.hid) in user_rankings:
                each_data = {}
                each_data["hid"] = each.hid
                each_data["name"] = each.name
                each_data["description"] = each.detail
                each_data["picture"] = settings.STATIC_URL + "images/" + each.picture + ".jpg"
                each_data["grade"] = each.grade
                each_data["type"] = each.type
                each_data["ranking"] = user_rankings[str(each.hid)]["ranking"]
                each_data["ranking_timestamp"] = user_rankings[str(each.hid)]["timestamp"]
                each_data["total_ranking"] = each.ranking_top
                compiled_dex.append(each_data)
        return JsonResponse({"status": True, "self": "user" not in req.POST, "total": len(query), "dex": compiled_dex})
    except:
        return status_response(False, "Database access error")

def api_user(req):
    if not all([
        validators.is_post(req),
        validators.is_user(req),
        validators.matched_params(req, [], ["user"])
    ]):
        return HttpResponseBadRequest()
    
    try:
        query = models.User.objects.get(uid = req.session["user"] if "user" not in req.POST else req.POST["user"])
        while query.points > 0 and query.points > level_point_threshold(query.level):
            query.points -= level_point_threshold(query.level)
            query.level += 1
        query.save()
        user_data = {}
        user_data["uid"] = query.uid
        user_data["name"] = query.profile_name
        user_data["picture"] = query.picture
        user_data["level"] = query.level
        user_data["points"] = query.points
        return JsonResponse({"status": True, "self": "user" not in req.POST, "profile": user_data})
    except:
        return status_response(False, "Database access error")
    
def api_raids(req):
    if not all([
        validators.is_post(req),
        validators.is_user(req),
        validators.matched_params(req, [])
    ]):
        return HttpResponseBadRequest()
    
    try:
        query = models.Raids.objects.filter(active = True)
        compiled_raids = []
        for raid in query:
            if datetime.datetime.utcnow().timestamp() > raid.start.timestamp() + raid.duration * 60:
                raid.active = False
                raid.save()
            else:
                raid_data = {}
                raid_data["rid"] = raid.rid
                raid_data["start"] = raid.start.timestamp()
                raid_data["end"] = raid.start.timestamp() + raid.duration * 60
                raid_data["duration_minutes"] = raid.duration
                raid_data["completions"] = raid.completions
                objective_data = {}
                objective_data["hid"] = raid_data.objective.hid
                objective_data["name"] = raid_data.objective.name
                objective_data["picture"] = settings.STATIC_URL + "images/" + raid_data.objective.picture + ".jpg"
                objective_data["grade"] = raid_data.objective.grade
                objective_data["type"] = raid_data.objective.type
                raid_data["objective"] = objective_data
                compiled_raids.append(raid_data)
        return JsonResponse({"status": True, "data": compiled_raids})
    except:
        return status_response(False, "Database error")

def api_leaderboard_by_count(req):
    if not all([
        validators.is_post(req),
        validators.is_user(req),
        validators.matched_params(req, [], ["page"])
    ]):
        return HttpResponseBadRequest()
    
    try:
        page = (req.POST["page"] - 1) if "page" in req.POST else 0
        query = models.User.objects.order_by("-ownership_count", "last_activity_capture")
        own_name = None
        own_place = None
        own_count = None
        for i in range(len(query)):
            if query[i].uid == req.session["user"]:
                own_name = query[i].profile_name
                own_place = i + 1
                own_count = query[i].ownership_count
                break
        query_page = query[page * RANKING_PAGE_SIZE:RANKING_PAGE_SIZE]
        ranking_data = []
        for i in range(len(query_page)):
            each_data = {}
            each_data["place"] = page * RANKING_PAGE_SIZE + i + 1
            each_data["user"] = query_page[i].profile_name
            each_data["count"] = query_page[i].ownership_count
            each_data["picture"] = query_page[i].picture
            ranking_data.append(each_data)
        return JsonResponse({"status": True, "page": page + 1, "size": RANKING_PAGE_SIZE, "self": {"name": own_name, "place": own_place, "count": own_count}, "table": ranking_data})
    except Exception as e:
        print(e)
        return status_response(False, "Database access error")
